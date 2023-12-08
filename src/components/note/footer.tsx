import { Badge } from "@raight/ui/badge";
import { useNoteStore } from "./store";
import { PropsWithChildren, memo, useRef } from "react";
import { Orbit } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@raight/utils";

export function NoteFooter() {
  return (
    <div className="text-xs flex flex-row flex-nowrap justify-between items-center gap-1">
      <div>
        <RunIndicator />
      </div>
      <div className="flex flex-row flex-nowrap gap-1 items-center">
        <Tone />
        <Style />
        <Rating />
        <Words />
      </div>
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

function RunIndicator() {
  const isRunning = useNoteStore((state) => Boolean(state.assistant.run));

  // todo - Use a ref to props to avoid re-rendering the icon
  // while its spinning
  const locals = useRef({
    initial: {
      rotate: 0,
      pathLength: 0,
    },
    animate: {
      rotate: 360,
      pathLength: 1,
    },
    exit: {
      rotate: 0,
      pathLength: 0,
    },
    transition: {
      repeat: Infinity,
      duration: 1,
    },
  });

  return (
    <AnimatePresence>
      {isRunning ? (
        <motion.div
          initial={{
            y: 20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: 20,
            opacity: 0,
          }}
        >
          <RunIndicator.Icon
            className="w-4 h-4 text-muted-foreground"
            {...locals.current}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
RunIndicator.Icon = memo(motion(Orbit));

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
  return rating != undefined ? <FooterItem>{rating}/5</FooterItem> : null;
}

function Words() {
  const words = useNoteStore((state) => state.editor.words);
  return <FooterItem>{words} Words</FooterItem>;
}
