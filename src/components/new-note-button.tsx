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
  FormLabel,
  FormMessage,
} from "@raight/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@raight/ui/select";
import { Constants } from "@raight/utils/constants";
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
  model: z.enum(Constants.llms),
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
      model: Constants.llms[0],
    },
  });

  async function onSubmit(data: TitleFormValues) {
    if (!data.title || !data.model) return;
    setOpen(false);
    const { path } = await storage.createNote(data.title, data.model);
    router.push(`/note/${path}`);
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
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Constants.llms.map((model, i) => (
                        <SelectItem key={i} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

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
