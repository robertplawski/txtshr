import { Link } from "@tanstack/react-router";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import { LucideShare2, Share } from "lucide-react";
const TITLE_TEXT = `
 _        _       _          
| |      | |     | |         
| |___  _| |_ ___| |__  _ __ 
| __\\ \\/ / __/ __| '_ \\| '__|
| |_ >  <| |_\\__ \\ | | | |   
 \\__/_/\\_\\\\__|___/_| |_|_|   
               `;

export default function Header() {
  return (
    <div className="flex flex-col relative">
      <div className="absolute top-0 left-0 w-full flex flex-row items-center justify-between p-4">
        <div></div>
        <div className="flex flex-row gap-2 items-center">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
      <div className=" text-center">
        <pre className="overflow-x-auto font-mono text-xs ">{TITLE_TEXT}</pre>
        <p className="text-muted-foreground text-sm">modern text share</p>
      </div>{" "}
    </div>
  );
}
