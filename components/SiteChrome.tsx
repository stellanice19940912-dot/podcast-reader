import Link from "next/link";
import { Suspense } from "react";
import { HeaderSearch } from "@/components/HeaderSearch";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-ink">
          <span aria-hidden className="grid size-7 place-items-center rounded-lg bg-accent text-sm font-bold text-accent-ink">
            字
          </span>
          <span className="text-base font-semibold tracking-tight">播客字幕</span>
        </Link>
        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2">
          <Suspense fallback={<div className="h-9 w-full max-w-xs" />}>
            <HeaderSearch />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
