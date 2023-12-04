"use client";

import { useAppContext } from "@raight/components/context";
import { NoteEditor } from "@raight/components/note/editor";
import { NoteHeaderButtons } from "@raight/components/note/header-buttons";
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
      <header className="sticky top-0 flex items-center justify-between border-b px-6 pb-4">
        <h1 className="text-lg font-semibold line-clamp-1">{note.title}</h1>
        <NoteHeaderButtons note={note} />
      </header>
      <div className="grow overflow-auto">
        <div className="w-full h-full overflow-hidden">
          <NoteEditor id={note.id} />
        </div>
      </div>
    </div>
  );
}
