"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Sparkles, Terminal, Trash } from "lucide-react";
import { Button } from "@raight/ui/button";
import { Note } from "@raight/lib/storage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@raight/ui/dialog";
import { useNoteStore } from "./store";
import { useAppContext } from "../context";
import { NoteForm } from "./form";

interface Props {
  note: Note;
}

export function NoteHeaderButtons({ note }: Props) {
  const { storage } = useAppContext();
  const router = useRouter();

  return (
    <div className="flex flex-row flex-nowrap gap-1">
      <Button
        size="icon"
        variant={
          useNoteStore((state) => state.page.panelContent) === "suggestions"
            ? "default"
            : "ghost"
        }
        onClick={() => {
          useNoteStore.setState((state) => ({
            ...state,
            page: {
              ...state.page,
              panelContent:
                state.page.panelContent === "suggestions"
                  ? null
                  : "suggestions",
            },
          }));
        }}
      >
        <Sparkles className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant={
          useNoteStore((state) => state.page.panelContent) === "debugger"
            ? "default"
            : "ghost"
        }
        onClick={() => {
          useNoteStore.setState((state) => ({
            ...state,
            page: {
              ...state.page,
              panelContent:
                state.page.panelContent === "debugger" ? null : "debugger",
            },
          }));
        }}
      >
        <Terminal className="h-4 w-4" />
      </Button>
      <EditNote note={note} />
      <Button
        size="icon"
        variant="ghost"
        onClick={async () => {
          await storage.deleteNote(note.id);
          router.replace("/");
          router.refresh();
        }}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function EditNote({ note }: Props) {
  const router = useRouter();
  const { storage } = useAppContext();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
          <DialogDescription>
            Make changes to the note here. Click save when {`you're`} done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <NoteForm
            defaultValues={note}
            onSubmit={async (data) => {
              storage.updateNote(note.id, {
                title: data.title,
                model: data.model,
                type: data.type,
              });
              router.refresh();
              setOpen(false);
            }}
            submitText="Save Changes"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
