"use client";

import { PropsWithChildren, useState } from "react";
import { ChevronLeft, MoreVertical } from "lucide-react";
import { cn } from "@raight/utils";
import { Button } from "@raight/ui/button";

export function SideBarContainer({ children }: PropsWithChildren) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const Icon = isSideBarOpen ? ChevronLeft : MoreVertical;

  return (
    <aside
      className={cn(
        "hidden border-r relative",
        "h-full min-h-full flex-col flex-nowrap gap-2 md:flex",
        "transition-all pt-4 bg-secondary shrink-0",
        isSideBarOpen ? "w-60 px-2" : "w-0 px-0 -translate-x-60"
      )}
    >
      {children}
      <Button
        className={cn(
          "absolute top-[50%] transition-all",
          isSideBarOpen ? "right-0" : "-right-[17rem]"
        )}
        variant="ghost"
        size="icon"
        onClick={() => setIsSideBarOpen((isOpen) => !isOpen)}
      >
        <Icon className="h-4 w-4 text-primary opacity-25" />
      </Button>
    </aside>
  );
}
