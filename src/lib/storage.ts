"use client";

import { NoteState } from "@raight/components/note/store";
import { Constants } from "@raight/utils/constants";

export class AppStorage {
  private storage: Storage;

  constructor() {
    // shim storage for server side
    this.storage =
      typeof window === "undefined"
        ? {
            setItem() {},
            getItem() {
              return null;
            },
            removeItem() {},
            key() {
              return null;
            },
            get length() {
              return 0;
            },
            clear() {},
          }
        : window.localStorage;
  }

  getNoteById(id: string) {
    const note = this.storage.getItem(this.formatId("note", id));
    if (!note) {
      return null;
    }
    const parsedNote = JSON.parse(note) as Note;
    parsedNote.id = id.replace("raight.note.", "");
    parsedNote.createdAt = new Date(parsedNote.createdAt);
    parsedNote.updatedAt = new Date(parsedNote.updatedAt);
    return parsedNote;
  }

  getNotes() {
    const notes: Note[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key?.startsWith("raight.note.")) {
        const note = this.getNoteById(key.replace("raight.note.", ""));
        if (note) {
          notes.push(note);
        }
      }
    }
    return notes;
  }

  async createNote(title: string, model: (typeof Constants.llms)[number]) {
    const id = this.makeId("note");
    const pathCompliantId = id.replace("raight.note.", "");
    const note: Note = {
      id: pathCompliantId,
      events: [],
      page: { suggestions: [] },
      editor: { html: "", text: "", json: {}, words: 0 },
      title,
      model,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.storage.setItem(id, JSON.stringify(note));
    return {
      id,
      path: pathCompliantId,
    };
  }

  updateNote(id: string, note: Partial<Note>) {
    const existing = this.getNoteById(id);
    if (!existing) {
      return;
    }
    note = { ...existing, ...note };
    this.storage.setItem(this.formatId("note", id), JSON.stringify(note));
  }

  async deleteNote(id: string) {
    const note = this.getNoteById(id);
    if (!note) {
      return;
    }
    const formattedId = this.formatId("note", id);
    this.storage.removeItem(formattedId);
  }

  private formatId(entityType: "note", id: string) {
    return `raight.${entityType}.${id}`;
  }

  private makeId(entityType: "note") {
    const segments = Array.from({ length: 4 }, () =>
      Math.random().toString(36).substring(2, 6)
    );
    return this.formatId(entityType, segments.join("-"));
  }
}

export type Note = Pick<NoteState, "events" | "page" | "editor"> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  model: (typeof Constants.llms)[number];
  title: string;
};
