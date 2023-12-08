"use client";

import { createLowlight, all as LowlightGrammars } from "lowlight";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import History from "@tiptap/extension-history";
import CharacterCount from "@tiptap/extension-character-count";
import Heading from "@tiptap/extension-heading";
import { cn } from "@raight/utils";
import { useNoteStore } from "./store";
import { useAppContext } from "../context";

interface Props {
  id: string;
  className?: string;
}

const lowlight = createLowlight(LowlightGrammars);

export function NoteEditor({ id, className }: Props) {
  const { storage } = useAppContext();
  const editor = useEditor({
    content: ``,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        history: false,
        heading: false,
      }),
      Heading,
      Highlight,
      History,
      Typography,
      CharacterCount,
      Markdown.configure({
        html: false,
        transformCopiedText: true,
        transformPastedText: true,
      }),
      Placeholder.configure({
        emptyEditorClass: "is-composer-empty",
        placeholder: "Write anything...",
      }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    onCreate: ({ editor }) => {
      if (editor) {
        const note = storage.getNoteById(id);
        if (!note) {
          return;
        }

        if (note.editor.text) {
          editor.commands.setContent(note.editor.json, false);
        }

        useNoteStore.setState((state) => {
          state.editor.html = editor.getHTML();
          state.editor.text = editor.getText();
          state.editor.words = editor.storage.characterCount.words();
          state.events.push({
            type: "create",
            text: editor.getText(),
            time: Date.now(),
          });
        });
      }
    },
    onUpdate: ({ editor, transaction }) => {
      if (editor) {
        const html = editor.getHTML();
        const text = editor.getText();
        const json = editor.getJSON();

        useNoteStore.setState((state) => {
          state.editor.html = html;
          state.editor.text = text;
          state.editor.json = json;
          state.editor.words = editor.storage.characterCount.words();
          state.events.push({
            type: "update",
            text: text,
            time: transaction.time,
          });
        });
      }
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col flex-nowrap w-full h-full transition-all assistant-editor",
        className
      )}
    >
      <EditorContent className="w-full h-full typography" editor={editor} />
    </div>
  );
}
