"use client";
import { SideBarItem } from "./side-bar-item";
import { groupBy } from "@raight/utils/group-by";
import { Edit3, MessageSquare } from "lucide-react";
import { useAppContext } from "./context";

export function SideBarContent() {
  const { storage } = useAppContext();
  const notes = storage.getNotes();

  const groups = groupBy(
    notes.sort((a, b) => +b.createdAt - +a.createdAt),
    (e) =>
      e.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        weekday: "short",
      })
  );

  return (
    <>
      {Object.keys(groups).map((group) => (
        <section key={group} className="w-full">
          <h3 className="h-9 pb-2 pt-3 px-2 text-xs font-medium text-ellipsis overflow-hidden break-all">
            {group}
          </h3>
          <ul>
            {groups[group].map((note) => {
              return (
                <li key={note.id}>
                  <SideBarItem key={note.id} href={`/app/note/${note.id}`}>
                    <Edit3 className="h-4 w-4" />
                    <span className="line-clamp-1">{note.title}</span>
                  </SideBarItem>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
