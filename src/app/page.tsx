import { Logo } from "@raight/components/logo";

export default function Home() {
  return (
    <main className="relative flex h-full w-full flex-col items-center justify-center text-muted-foreground gap-4">
      <Logo className="h-10 w-10" />
      <p className="text-sm text-center">Get started by creating a new note</p>
    </main>
  );
}
