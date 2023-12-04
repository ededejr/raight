"use client";

import { createContext, useContext } from "react";
import { AppStorage } from "@raight/lib/storage";

interface AppContext {
  storage: AppStorage;
}

const context = createContext<AppContext | null>(null);

export function useAppContext() {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return ctx;
}

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storage = new AppStorage();
  return <context.Provider value={{ storage }}>{children}</context.Provider>;
}
