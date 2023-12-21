"use client";
import { useRouter } from "next/navigation";
import { useAppContext } from "@raight/components/context";
import { NoteBehaviours } from "@raight/components/note/behaviours";
import { NoteEditor } from "@raight/components/note/editor";
import { NoteFooter } from "@raight/components/note/footer";
import { NoteHeaderButtons } from "@raight/components/note/header-buttons";
import { NotePanel } from "@raight/components/note/panel";
import { ScrollArea } from "@raight/ui/scroll-area";
import { cn } from "@raight/utils";
import { ClientOnly } from "@raight/components/client-only";

interface Props {
  id: string;
}

export function NotePageContainer({ id }: Props) {
  return (
    <ClientOnly>
      <NotePageContainerInner id={id} />
    </ClientOnly>
  );
}

function NotePageContainerInner({ id }: Props) {
  const router = useRouter();
  const { storage } = useAppContext();
  const note = storage.getNoteById(id);

  if (!note) {
    router.replace("/404");
    return null;
  }

  return (
    <div className="flex flex-col flex-nowrap h-full">
      <header className="shrink-0 flex items-center justify-between px-6 pb-4">
        <h1 className="text-lg font-semibold line-clamp-1">{note.title}</h1>
        <NoteHeaderButtons note={note} />
      </header>
      <div className="grow flex flex-nowrap flex-row overflow-hidden pb-2 px-2">
        <div
          className={cn(
            "grow rounded-md h-full",
            note.type !== "thread" && "border bg-background shadow-sm"
          )}
        >
          <ScrollArea className="h-full pt-2 px-4">
            <NoteEditor id={note.id} />
          </ScrollArea>
        </div>
        <NotePanel className="rounded-md overflow-hidden" />
      </div>
      <div className="shrink-0 px-4 py-1">
        <NoteFooter />
      </div>
      <NoteBehaviours id={id} />
    </div>
  );
}
