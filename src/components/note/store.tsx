"use client";
import { JSONContent } from "@tiptap/react";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface StateEvent {
  type: string;
  time: number;
  text: string;
}

export interface NoteState {
  events: StateEvent[];
  status: {
    isEvaluating: boolean;
  };
  page: {
    tone?: string;
    style?: string;
    rating?: number;
    suggestions: string[];
    panelContent?: "suggestions" | "debugger";
  };
  editor: {
    html: string;
    text: string;
    words: number;
    json: JSONContent;
  };
}

export const useNoteStore = create(
  subscribeWithSelector(
    immer<NoteState>(() => ({
      events: [],
      status: {
        isEvaluating: false,
      },
      page: {
        suggestions: [],
      },
      editor: {
        html: ``,
        text: ``,
        json: {},
        words: 0,
      },
    }))
  )
);
