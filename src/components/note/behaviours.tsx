"use client";
import debounce from "debounce";
import { memo, useEffect, useRef } from "react";
import { Logger } from "@raight/lib/logger";
import { StateEvent, useNoteStore } from "./store";
import { useAppContext } from "../context";

interface Props {
  id: string;
}

export const NoteBehaviours = memo(function Behaviours({ id }: Props) {
  useDocumentSync(id);
  useStorageSync(id);
  useEvaluation(id);
  return null;
});

function useDocumentSync(id: string) {
  const { storage } = useAppContext();
  const locals = useRef({
    title: document.title,
  });

  useEffect(() => {
    const title = locals.current.title;
    const note = storage.getNoteById(id);
    if (!note) return;
    document.title = `${note.title} / ${title}`;
    return () => {
      document.title = title;
    };
  }, [id, storage]);
}

function useStorageSync(id: string) {
  const { storage } = useAppContext();
  const logger = useLogger("useStorageSync");

  useEffect(() => {
    const note = storage.getNoteById(id);

    if (note) {
      logger.debug(`found note in storage`);
      useNoteStore.setState((state) => {
        state.page = note.page;
        state.editor = note.editor;
        state.events = note.events;
      });
    }

    const unsubscribe = useNoteStore.subscribe((state) => {
      logger.debug(`syncing to storage`);
      storage.updateNote(id, {
        page: state.page,
        editor: state.editor,
        events: state.events,
      });
    });

    return () => unsubscribe();
  }, [id, logger, storage]);
}

function useEvaluation(id: string) {
  const { storage } = useAppContext();
  const logger = useLogger("useEvaluation");

  useEffect(() => {
    const unsubscribe = useNoteStore.subscribe(
      (state) => state.editor.text,
      debounce(async (text: string) => {
        if (!text) return;
        if (text.length < 10) return;
        if (useNoteStore.getState().status.isEvaluating) return;

        const note = storage.getNoteById(id);
        if (!note) return;

        const latestEvent = note.events.at(-1);
        if (latestEvent && latestEvent.type === "create") return;

        let payload;

        try {
          useNoteStore.setState((state) => {
            state.status.isEvaluating = true;
          });
          const res = await fetch("/api/evaluate", {
            method: "POST",
            body: JSON.stringify({
              id,
              content: text,
              model: note.model,
              type: note.type,
            }),
          });
          payload = await res.json();
          logger.debug(`retrieved suggestions`);
        } catch (error: any) {
          logger.error(`failed retrieving suggestions. ${error}`);
        }

        if (payload) {
          let events: StateEvent[] = [
            {
              type: "response",
              text: JSON.stringify(payload),
              time: Date.now(),
            },
          ];

          if (
            "rating" in payload &&
            "tone" in payload &&
            "style" in payload &&
            "suggestions" in payload &&
            Array.isArray(payload.suggestions)
          ) {
            events.push(
              ...[
                {
                  type: "rating",
                  text: `${payload.rating}/5`,
                  time: Date.now(),
                },
                {
                  type: "tone",
                  text: `${payload.tone}`,
                  time: Date.now(),
                },
                {
                  type: "style",
                  text: `${payload.style}`,
                  time: Date.now(),
                },
                ...payload.suggestions.map((suggestion: string) => ({
                  type: "suggestion",
                  text: `${suggestion}`,
                  time: Date.now(),
                })),
              ]
            );

            const { rating, tone, style, suggestions } = payload;

            useNoteStore.setState((state) => {
              state.page.rating = rating;
              state.page.tone = tone;
              state.page.style = style;
              state.page.suggestions = suggestions;
            });
          }

          useNoteStore.setState((state) => {
            state.events.push(...events);
          });
        }

        useNoteStore.setState((state) => {
          state.status.isEvaluating = false;
        });
      }, 1000)
    );

    return () => unsubscribe();
  }, [id, logger, storage]);
}

function useLogger(namespace: string) {
  return useRef(Logger.create(namespace)).current;
}
