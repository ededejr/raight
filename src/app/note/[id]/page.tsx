import { Metadata } from "next";
import { redirect } from "next/navigation";
import { NotePageContainer } from "./container";

export const metadata: Metadata = {
  title: "Note",
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  if (!idRgx.test(id)) {
    return redirect("/404");
  }

  return <NotePageContainer id={params.id} />;
}

const idRgx = /^[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/;
