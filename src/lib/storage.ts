"use client";

import { NoteState } from "@raight/components/note/store";
import { createThread, deleteThread } from "./actions";

export class AppStorage {
  private storage = window.localStorage;

  getNoteById(id: string) {
    const note = this.storage.getItem(id);
    if (!note) {
      return null;
    }
    return JSON.parse(note) as Note;
  }

  getNotes() {
    const notes: Note[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key?.startsWith("raight.note.")) {
        const note = this.getNoteById(key);
        if (note) {
          notes.push(note);
        }
      }
    }
    return notes;
  }

  async createNote(title: string) {
    const id = this.makeId("note");
    const thread = await createThread();
    const note: Note = {
      id,
      events: [],
      page: { showDebugger: false, suggestions: [] },
      editor: { html: "", text: "", words: 0 },
      title,
      threadId: thread.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.storage.setItem(id, JSON.stringify(note));
    return {
      id,
      path: id.replace("raight.note.", ""),
    };
  }

  updateNote(id: string, note: Partial<Note>) {
    const existing = this.getNoteById(id);
    if (!existing) {
      return;
    }
    note = { ...existing, ...note };
    this.storage.setItem(id, JSON.stringify(note));
  }

  async deleteNote(id: string) {
    const note = this.getNoteById(id);
    if (!note) {
      return;
    }
    await deleteThread(note.threadId);
    this.storage.removeItem(id);
  }

  private makeId(entityType: "note") {
    const segments = Array.from({ length: 4 }, () =>
      Math.random().toString(36).substring(2, 6)
    );
    return `raight.${entityType}.${segments.join("-")}`;
  }
}

export type Note = Pick<NoteState, "events" | "page" | "editor"> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  threadId: string;
  title: string;
};
