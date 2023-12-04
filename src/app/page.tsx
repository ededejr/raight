import { Logo } from "@raight/components/logo";

export default function Home() {
  return (
    <main className="relative flex h-full w-full flex-col items-center justify-center">
      <Logo className="h-12 w-12 text-primary" />
      <p className="rounded-full">Create a new note to get started</p>
    </main>
  );
}
