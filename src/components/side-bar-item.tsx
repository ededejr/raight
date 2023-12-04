"use client";

import Link from "next/link";
import { PropsWithChildren } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@raight/utils";

export function SideBarItem({
  href,
  children,
}: PropsWithChildren<{ href: string }>) {
  const pathname = usePathname();
  const isSelected = `${pathname}` === href;

  return (
    <Link className={useSideBarItemStyles(isSelected)} href={href}>
      {children}
    </Link>
  );
}

export function useSideBarItemStyles(isSelected = false) {
  return cn(
    "flex items-center",
    "gap-3 rounded-lg",
    "px-3 py-2 transition-all",
    isSelected ? "bg-primary/10 text-foreground" : "text-foreground/50",
    "hover:text-foreground/90 hover:bg-primary/20"
  );
}
