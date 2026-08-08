import Link from "next/link";

import { ModeToggle } from "./mode-toggle";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between">
      <nav className="space-x-6 text-sm font-medium">
        <Link href="/">home</Link>
        <Link href="/about">about</Link>
      </nav>
      <ModeToggle />
    </header>
  );
}
