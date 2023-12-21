import { PropsWithChildren } from "react";

export function ClientOnly({ children }: PropsWithChildren) {
  const isClient = typeof window !== "undefined";
  return isClient ? <>{children}</> : null;
}
