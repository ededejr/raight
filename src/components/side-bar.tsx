import Link from "next/link";
import { SideBarContent } from "./side-bar-content";
import { Logo } from "./logo";
import { SideBarContainer } from "./side-bar-container";
import { NewNoteButton } from "./new-note-button";

export function SideBar() {
  return (
    <SideBarContainer>
      <div className="h-full flex flex-col gap-1">
        <div className="flex items-center px-6 my-4 text-primary">
          <Link className="flex items-center gap-2" href="/">
            <Logo className="h-6 w-6 text-primary" />
          </Link>
        </div>
        <div className="flex-1 grow">
          <nav className="flex flex-col w-full h-full px-4 text-sm font-medium">
            <div className="grow" suppressHydrationWarning>
              <SideBarContent />
            </div>
            <div className="grid items-start pb-4">
              <div className="grid space-y-2">
                <NewNoteButton />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </SideBarContainer>
  );
}
