"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2 } from "lucide-react";
import { Button } from "@raight/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@raight/ui/dialog";
import { cn } from "@raight/utils";
import { useSideBarItemStyles } from "./side-bar-item";
import { useAppContext } from "./context";
import { NoteForm } from "./note-form";

export function NewNoteButton() {
  const router = useRouter();
  const { storage } = useAppContext();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <Button
        variant="ghost"
        className={cn(useSideBarItemStyles(), "justify-start")}
        onClick={() => setOpen(true)}
      >
        <Edit2 className="h-4 w-4" />
        New Note
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
          <DialogDescription>Create a new note.</DialogDescription>
        </DialogHeader>
        <NoteForm
          onSubmit={async function onSubmit(data) {
            if (!data.title || !data.model || !data.type) return;
            setOpen(false);
            const { path } = await storage.createNote(
              data.title,
              data.model,
              data.type
            );
            router.push(`/note/${path}`);
            router.refresh();
          }}
          submitText="Create"
        />
      </DialogContent>
    </Dialog>
  );
}
