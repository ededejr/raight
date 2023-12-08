import { useNoteStore } from "./store";
import { NoteDebugger } from "./debugger";
import { NoteSuggestions } from "./suggestions";
import { cn } from "@raight/utils";

interface Props {
  className?: string;
}

export function NotePanel({ className }: Props) {
  const panelContent = useNoteStore((state) => state.page.panelContent);

  let content = null;

  if (panelContent === "debugger") {
    content = <NoteDebugger />;
  } else if (panelContent === "suggestions") {
    content = <NoteSuggestions />;
  }

  return (
    <div
      className={cn(
        "transition-all h-full shrink-0",
        content ? "w-2/5 translate-x-0 mx-2" : "w-0 translate-x-[40%]",
        className
      )}
    >
      {content}
    </div>
  );
}
