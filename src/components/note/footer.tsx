import { Badge } from "@raight/ui/badge";
import { useNoteStore } from "./store";
import { PropsWithChildren } from "react";

export function NoteFooter() {
  return (
    <div className="flex flex-row flex-nowrap gap-1 items-center">
      <Tone />
      <Style />
      <Rating />
      <Words />
    </div>
  );
}

function FooterItem({ children }: PropsWithChildren) {
  return (
    <Badge variant="outline">
      <span className="line-clamp-1">{children}</span>
    </Badge>
  );
}

function Tone() {
  const tone = useNoteStore((state) => state.page.tone);
  return tone ? <FooterItem>{tone}</FooterItem> : null;
}

function Style() {
  const style = useNoteStore((state) => state.page.style);
  return style ? <FooterItem>{style}</FooterItem> : null;
}

function Rating() {
  const rating = useNoteStore((state) => state.page.rating);
  return rating != undefined ? <FooterItem>{rating}</FooterItem> : null;
}

function Words() {
  const words = useNoteStore((state) => state.editor.words);
  return <FooterItem>{words} Words</FooterItem>;
}
