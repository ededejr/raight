"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import debounce from "debounce";
import { Logger } from "@raight/lib/logger";
import { Run, StateEvent, useNoteStore } from "./store";
import { useAppContext } from "../context";

interface Props {
  id: string;
}

export const NoteBehaviours = memo(function Behaviours({ id }: Props) {
  useAssistantReporting(id);
  useAssistantRunWatcher(id);
  useStorageSync(id);
  return null;
});

function useStorageSync(id: string) {
  const { storage } = useAppContext();
  const logger = useRef(Logger.create("useStorageSync")).current;

  useEffect(() => {
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

function useAssistantReporting(id: string) {
  const { storage } = useAppContext();
  const logger = useRef(Logger.create("useNoteReporting")).current;
  useEffect(() => {
    const unsubscribe = useNoteStore.subscribe(
      (state) => state.editor.text,
      debounce(async (text: string) => {
        if (!text) return;
        if (useNoteStore.getState().assistant.run) return;

        const note = storage.getNoteById(id);
        if (!note) return;

        try {
          const res = await fetch("/api/assistant/editor", {
            method: "POST",
            body: JSON.stringify({
              id,
              threadId: note.threadId,
              content: text,
            }),
          });
          const run = (await res.json()) as Run;
          logger.debug(`reported to assistant. ${run.id}`);
          useNoteStore.setState((state) => {
            state.assistant.run = run;
            state.events.push({
              type: "sync",
              text,
              time: Date.now(),
            });
          });
        } catch (error: any) {
          logger.error(`failed reporting to assistant. ${error}`);
        }
      }, 2000)
    );

    return () => unsubscribe();
  }, [id, logger, storage]);
}

function useAssistantRunWatcher(id: string) {
  const { storage } = useAppContext();
  const intervalId = useRef<NodeJS.Timeout | undefined>(undefined);
  const logger = useRef(Logger.create("useNoteReporting")).current;
  const fetchRun = useCallback(async () => {
    const runId = useNoteStore.getState().assistant.run?.id;
    if (!runId) return;
    const note = storage.getNoteById(id);
    if (!note) return;

    try {
      const res = await fetch("/api/assistant/run", {
        method: "POST",
        body: JSON.stringify({
          id,
          runId,
          threadId: note.threadId,
        }),
      });
      const run = (await res.json()) as Run;
      logger.debug(`fetched run. ${run.id}`);
      useNoteStore.setState((state) => {
        state.assistant.run = run;
        state.events.push({
          type: "run:poll",
          text: `${run.status}`,
          time: Date.now(),
        });
      });
    } catch (error) {
      logger.error(`failed fetching run. ${error}`);
    }
  }, [id, logger, storage]);

  useEffect(() => {
    const unsubscribe = useNoteStore.subscribe(
      (state) => state.assistant.run,
      async (run) => {
        if (!run) return;

        const { id, status, message } = run;
        logger.debug(`run ${id} is ${status}`);

        if (status === "queued" || status === "in_progress") {
          if (intervalId.current) return;
          intervalId.current = setInterval(async () => {
            await fetchRun();
          }, 5000);
          return;
        }

        if (status === "completed") {
          if (message) {
            let events: StateEvent[] = [
              {
                type: "message",
                text: message,
                time: Date.now(),
              },
            ];

            try {
              const m = JSON.parse(message);
              if (
                "rating" in m &&
                "tone" in m &&
                "style" in m &&
                "suggestions" in m &&
                Array.isArray(m.suggestions)
              ) {
                events.push(
                  ...[
                    {
                      type: "rating",
                      text: `${m.rating}/5`,
                      time: Date.now(),
                    },
                    {
                      type: "tone",
                      text: `${m.tone}`,
                      time: Date.now(),
                    },
                    {
                      type: "style",
                      text: `${m.style}`,
                      time: Date.now(),
                    },
                    ...m.suggestions.map((suggestion: string) => ({
                      type: "suggestion",
                      text: `${suggestion}`,
                      time: Date.now(),
                    })),
                  ]
                );

                const { rating, tone, style, suggestions } = m;
                useNoteStore.setState((state) => {
                  state.page.rating = rating;
                  state.page.tone = tone;
                  state.page.style = style;
                  state.page.suggestions = suggestions;
                });
              }
            } catch (error) {
              // do nothing
            }

            useNoteStore.setState((state) => {
              state.assistant.messages.push(message);
              state.events.push(...events);
            });
          }
        }

        clearInterval(intervalId.current);
        intervalId.current = undefined;

        logger.debug(`resetting run`);
        useNoteStore.setState((state) => {
          state.assistant.run = null;
          state.events.push({
            type: "run:reset",
            text: `${status}`,
            time: Date.now(),
          });
        });
      }
    );

    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
      unsubscribe();
    };
  }, [id, logger, fetchRun]);
}
