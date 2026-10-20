import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-display text-6xl text-accent">404</p>
      <h1 className="mt-4 font-display text-3xl">没有这一页</h1>
      <p className="mt-3 text-soft">节目或单集可能已经被删除，或者链接写错了。</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-ink">
          回到首页
        </Link>
        <Link href="/search" className="rounded-full border border-line px-5 py-2 text-sm text-soft hover:border-accent/50">
          搜索文字稿
        </Link>
      </div>
    </main>
  );
}
