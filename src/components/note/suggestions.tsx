"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@raight/ui/button";
import { ScrollArea } from "@raight/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@raight/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@raight/ui/form";
import { Checkbox } from "@raight/ui/checkbox";
import { useNoteStore } from "./store";
import { useEffect } from "react";

const schema = z.object({
  suggestions: z
    .array(
      z.object({
        suggestion: z.string(),
        value: z.boolean(),
      })
    )
    .min(1),
});

type Values = z.infer<typeof schema>;

export function NoteSuggestions() {
  const suggestions = useNoteStore((state) => state.page.suggestions);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      suggestions: suggestions.map((suggestion) => ({
        suggestion,
        value: false,
      })),
    },
    mode: "onSubmit",
  });

  const { fields, replace } = useFieldArray({
    name: "suggestions",
    control: form.control,
  });

  useEffect(() => {
    replace(
      suggestions.map((suggestion) => ({
        suggestion,
        value: false,
      }))
    );
  }, [suggestions, replace]);

  function onSubmit(data: Values) {
    console.log(data);
  }

  if (!suggestions.length) {
    return (
      <div className="w-full h-full grid items-center justify-center text-center">
        <p className="text-muted-foreground">No suggestions</p>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full h-full">
      <Card className="py-0 border-0 bg-transparent shadow-none">
        <CardHeader>
          <CardTitle>Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`suggestions.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start justify-between space-x-4 text-muted-foreground">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <p className="text-sm leading-none">
                            {suggestions[index]}
                          </p>
                        </div>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <div className="flex flex-nowrap w-full justify-end">
                <Button type="submit">Apply</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </ScrollArea>
  );
}
