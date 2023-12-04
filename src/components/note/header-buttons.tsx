"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Edit, Terminal, Trash } from "lucide-react";
import { Button } from "@raight/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@raight/ui/dialog";
import { Input } from "@raight/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@raight/ui/form";
import { useState } from "react";
import { useNoteStore } from "./store";
import { useAppContext } from "../context";
import { Note } from "@raight/lib/storage";

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
        variant="ghost"
        onClick={() => {
          useNoteStore.setState((state) => ({
            ...state,
            page: {
              ...state.page,
              showDebugger: !state.page.showDebugger,
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

const editNoteSchema = z.object({
  title: z
    .string({
      required_error: "Please enter a title",
    })
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, {
      message: "Name must not be longer than 50 characters.",
    }),
});

type EditNoteFormValues = z.infer<typeof editNoteSchema>;

export function EditNote({ note: editor }: Props) {
  const router = useRouter();
  const { storage } = useAppContext();
  const [open, setOpen] = useState(false);
  const form = useForm<EditNoteFormValues>({
    resolver: zodResolver(editNoteSchema),
    defaultValues: {
      title: editor.title,
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: EditNoteFormValues) => {
    storage.updateNote(editor.id, { title: data.title });
    router.refresh();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input id="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
