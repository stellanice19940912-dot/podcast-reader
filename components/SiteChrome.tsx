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
          <span className="hidden text-base font-semibold tracking-tight min-[400px]:inline">播客字幕</span>
        </Link>
        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2">
          <Suspense fallback={<div className="h-9 w-full max-w-xs" />}>
            <HeaderSearch />
          </Suspense>
          <Link
            href="/channels"
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line bg-card px-3 text-sm text-soft transition hover:border-accent hover:text-accent"
          >
            <GridIcon />
            <span className="sm:hidden">频道</span>
            <span className="hidden sm:inline">全部频道</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="3" width="5.5" height="5.5" rx="1.2" />
      <rect x="11.5" y="3" width="5.5" height="5.5" rx="1.2" />
      <rect x="3" y="11.5" width="5.5" height="5.5" rx="1.2" />
      <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1.2" />
    </svg>
  );
}
