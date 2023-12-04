import { ScrollArea } from "@raight/ui/scroll-area";
import { useNoteStore } from "./store";

export function NoteDebugger() {
  const showDebugger = useNoteStore((state) => state.page.showDebugger);
  if (!showDebugger) return null;
  return <NoteDebuggerInternal />;
}

function NoteDebuggerInternal() {
  return (
    <div className="h-full bg-black w-[600px] shrink-0">
      <ScrollArea className="transition-all bg-black font-mono text-xs text-gray-400 w-full h-full px-1">
        <ul className="flex flex-col-reverse scroll-smooth">
          {useNoteStore((state) => state.events).map((event, index) => (
            <li key={index}>
              <div>
                <span className="line-clamp-1">
                  {new Date(event.time).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    hour12: false,
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                  : [{event.type}] {event.text}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
