"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * 「返回」按钮：从本站页面进来时退回上一页（保留原来的滚动位置）；
 * 直接打开链接进来、没有上一页时，去 fallback 指定的页面。
 */
export function BackLink({ fallback = "/", label = "返回" }: { fallback?: string; label?: string }) {
  const router = useRouter();
  return (
    <Link
      href={fallback}
      onClick={(event) => {
        let fromThisSite = false;
        try {
          fromThisSite = Boolean(document.referrer) && new URL(document.referrer).origin === window.location.origin;
        } catch {}
        if (fromThisSite && window.history.length > 1) {
          event.preventDefault();
          router.back();
        }
      }}
      className="inline-flex items-center gap-1 rounded-full py-1 pr-2 text-sm text-muted transition hover:text-accent"
    >
      <span aria-hidden>←</span>
      {label}
    </Link>
  );
}
