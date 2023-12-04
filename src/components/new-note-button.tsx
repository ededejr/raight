"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Edit2 } from "lucide-react";
import { Button } from "@raight/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@raight/ui/dialog";
import { cn } from "@raight/utils";
import { useSideBarItemStyles } from "./side-bar-item";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@raight/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@raight/ui/form";
import { useAppContext } from "./context";

const titleFormSchema = z.object({
  title: z
    .string({
      required_error: "Please input a valid title.",
    })
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(50, {
      message: "Title must not be longer than 50 characters.",
    }),
});

type TitleFormValues = z.infer<typeof titleFormSchema>;

export function NewNoteButton() {
  const router = useRouter();
  const { storage } = useAppContext();
  const [open, setOpen] = useState(false);

  const form = useForm<TitleFormValues>({
    resolver: zodResolver(titleFormSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(data: TitleFormValues) {
    if (!data.title) return;
    setOpen(false);
    const { path } = await storage.createNote(data.title);
    router.push(`/app/note/${path}`);
    router.refresh();
  }

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
