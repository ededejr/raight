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
import { NoteBehaviours } from "./behaviours";
import { NoteDebugger } from "./debugger";
import { useNoteStore } from "./store";
import { NoteFooter } from "./footer";
import { ScrollArea } from "@radix-ui/react-scroll-area";
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
          editor.commands.setContent(note.editor.text);
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

        useNoteStore.setState((state) => {
          state.editor.html = html;
          state.editor.text = text;
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
        "flex flex-col flex-nowrap w-full h-full transition-all",
        className
      )}
    >
      <div className="w-full h-full flex flex-nowrap flex-row">
        <div className="w-full h-full flex flex-col flex-nowrap grow">
          <div className="grow container overflow-auto scroll-smooth">
            <ScrollArea className="assistant-editor w-full h-full pt-4">
              <EditorContent
                className="w-full h-full typography"
                editor={editor}
              />
            </ScrollArea>
          </div>
          <div className="sticky bottom-0 px-4 py-1 text-xs border-t flex flex-row flex-nowrap justify-end bg-background items-center gap-1">
            <NoteFooter />
          </div>
        </div>
        <NoteDebugger />
      </div>
      <NoteBehaviours id={id} />
    </div>
  );
}
