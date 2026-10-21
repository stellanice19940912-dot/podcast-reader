"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { withBase } from "@/lib/links";

export function HeaderSearch() {
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (pathname === "/search") return null;

  return (
    <form action={withBase("/search")} role="search" className="relative w-full max-w-xs">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
      <input
        ref={inputRef}
        name="q"
        type="search"
        placeholder="搜索全部文字稿"
        aria-label="搜索全部文字稿"
        className="h-9 w-full rounded-full border border-line bg-card pl-9 pr-9 text-sm text-ink outline-none placeholder:text-muted focus:border-accent"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-line px-1.5 text-[11px] text-muted sm:block">
        /
      </kbd>
    </form>
  );
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    // 写死 1em 的宽高：万一样式没加载出来，图标也只有一个字大小，不会撑满整个页面。
    <svg
      viewBox="0 0 20 20"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden
    >
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="m13 13 4 4" strokeLinecap="round" />
    </svg>
  );
}
