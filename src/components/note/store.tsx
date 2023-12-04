"use client";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface StateEvent {
  type: string;
  time: number;
  text: string;
}

export interface Run {
  id: string;
  status:
    | "queued"
    | "in_progress"
    | "requires_action"
    | "cancelling"
    | "cancelled"
    | "failed"
    | "completed"
    | "expired";
  message?: string;
}

export interface NoteState {
  events: StateEvent[];
  assistant: {
    run: Run | null;
    messages: string[];
  };
  page: {
    tone?: string;
    style?: string;
    rating?: number;
    suggestions: string[];
    showDebugger: boolean;
  };
  editor: {
    html: string;
    text: string;
    words: number;
  };
}

export const useNoteStore = create(
  subscribeWithSelector(
    immer<NoteState>(() => ({
      events: [],
      assistant: {
        run: null,
        messages: [],
      },
      page: {
        suggestions: [],
        showDebugger: false,
      },
      editor: {
        html: ``,
        text: ``,
        words: 0,
      },
    }))
  )
);
