"use client";

import { useAppContext } from "@raight/components/context";
import { NoteEditor } from "@raight/components/note/editor";
import { NoteFooter } from "@raight/components/note/footer";
import { NoteHeaderButtons } from "@raight/components/note/header-buttons";
import { NotePanel } from "@raight/components/note/panel";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

export function NotePageContainer({ id }: Props) {
  const router = useRouter();
  const { storage } = useAppContext();
  const note = storage.getNoteById(id);

  if (!note) {
    router.replace("/404");
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 flex items-center justify-between px-6 pb-4">
        <h1 className="text-lg font-semibold line-clamp-1">{note.title}</h1>
        <NoteHeaderButtons note={note} />
      </header>
      <div className="grow flex flex-nowrap flex-row mx-2">
        <div className="flex flex-col flex-nowrap w-full h-full">
          <div className="grow overflow-auto border rounded-md shadow-lg bg-background">
            <NoteEditor id={note.id} />
          </div>
          <div className="px-4 py-2 mt-2 text-xs flex flex-row flex-nowrap justify-end items-center gap-1">
            <NoteFooter />
          </div>
        </div>
        <NotePanel className="rounded-md overflow-hidden" />
      </div>
    </div>
  );
}
