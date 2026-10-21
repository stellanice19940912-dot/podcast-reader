"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "@/components/HeaderSearch";
import { EpisodeLink } from "@/components/EpisodeLink";
import { Highlight } from "@/components/Highlight";
import { EmptyState } from "@/components/ui";
import type { SearchIndex } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { withBase } from "@/lib/links";

const LIMIT = 300;
const HITS_PER_EPISODE = 3;

type Hit = { episode: number; anchor: string; text: string; score: number; position: number };

let indexPromise: Promise<SearchIndex> | null = null;

function loadIndex() {
  indexPromise ??= fetch(withBase("/search-index.json")).then((response) => {
    if (!response.ok) throw new Error(String(response.status));
    return response.json() as Promise<SearchIndex>;
  });
  return indexPromise;
}

export function SearchForm({ query }: { query: string }) {
  return (
    <form action={withBase("/search")} role="search" className="relative mt-5">
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
      <input
        key={query}
        name="q"
        type="search"
        defaultValue={query}
        autoFocus={!query}
        placeholder="输入关键词，比如 moat、Jensen、protein folding"
        aria-label="搜索全部文字稿"
        className="h-12 w-full rounded-2xl border border-line bg-card pl-12 pr-24 text-base outline-none placeholder:text-muted focus:border-accent"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-xl bg-accent px-4 text-sm font-medium text-accent-ink"
      >
        搜索
      </button>
    </form>
  );
}

function excerptAround(text: string, term: string) {
  const at = Math.max(0, text.toLowerCase().indexOf(term));
  const start = Math.max(0, at - 70);
  const end = Math.min(text.length, at + term.length + 140);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

function search(index: SearchIndex, query: string): Hit[] {
  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 0)
    .slice(0, 6);
  if (terms.length === 0) return [];
  const hits: Hit[] = [];
  for (const [position, [episode, anchor, text]] of index.items.entries()) {
    const haystack = text.toLowerCase();
    if (!terms.every((term) => haystack.includes(term))) continue;
    const score = terms.reduce((sum, term) => sum + haystack.split(term).length - 1, 0);
    hits.push({ episode, anchor, text: excerptAround(text, terms[0]), score, position });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, LIMIT);
}

export function SearchResults() {
  const params = useSearchParams();
  const query = params.get("q")?.trim() ?? "";
  const showFilter = params.get("show") ?? "";
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    loadIndex().then(
      (data) => alive && setIndex(data),
      () => alive && setFailed(true),
    );
    return () => {
      alive = false;
    };
  }, []);

  const all = useMemo(() => (index && query ? search(index, query) : []), [index, query]);

  if (!query) {
    return (
      <>
        <SearchForm query="" />
        <p className="mt-6 text-sm leading-7 text-muted">在标题和正文里查找，多个词用空格分开，会找同时包含这些词的段落。</p>
      </>
    );
  }

  if (failed) {
    return (
      <>
        <SearchForm query={query} />
        <p className="mt-6 text-sm text-danger">搜索数据加载失败，刷新页面再试一次。</p>
      </>
    );
  }

  if (!index) {
    return (
      <>
        <SearchForm query={query} />
        <p className="mt-6 text-sm text-muted">正在查找…</p>
      </>
    );
  }

  const shows = new Map<string, { label: string; count: number }>();
  for (const hit of all) {
    const meta = index.episodes[hit.episode];
    const entry = shows.get(meta.showSlug) ?? { label: meta.showName, count: 0 };
    entry.count += 1;
    shows.set(meta.showSlug, entry);
  }
  const hits = showFilter ? all.filter((hit) => index.episodes[hit.episode].showSlug === showFilter) : all;
  const groups = new Map<number, Hit[]>();
  for (const hit of hits) groups.set(hit.episode, [...(groups.get(hit.episode) ?? []), hit]);
  const ordered = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  const base = `/search?q=${encodeURIComponent(query)}`;

  return (
    <>
      <SearchForm query={query} />
      <p className="mt-6 text-sm text-muted">
        {all.length === 0
          ? `没有找到「${query}」`
          : `「${query}」出现在 ${ordered.length} 集的 ${hits.length} 个段落里${all.length === LIMIT ? "（只列出最相关的部分）" : ""}`}
      </p>

      {shows.size > 1 ? (
        <div className="scrollbar-none -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
          <FilterChip href={base} active={!showFilter} label="全部频道" count={all.length} />
          {[...shows.entries()]
            .sort((a, b) => b[1].count - a[1].count)
            .map(([slug, show]) => (
              <FilterChip
                key={slug}
                href={`${base}&show=${encodeURIComponent(slug)}`}
                active={showFilter === slug}
                label={show.label}
                count={show.count}
              />
            ))}
        </div>
      ) : null}

      {all.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="没有找到这段文字">换一个词，或少写几个词再试。</EmptyState>
        </div>
      ) : (
        <ol className="mt-6 space-y-4">
          {ordered.map(([episodeIndex, list]) => {
            const meta = index.episodes[episodeIndex];
            // 同一集里按正文顺序列出命中段落
            const sorted = [...list].sort((a, b) => a.position - b.position);
            return (
              <li key={meta.slug} className="rounded-2xl border border-line bg-card">
                <EpisodeLink slug={meta.slug} anchor={sorted[0].anchor} className="group block px-5 pt-4">
                  <p className="text-xs text-muted">
                    <span className="text-accent">{meta.showName}</span> · {formatDate(meta.date)}
                  </p>
                  <h2 className="mt-1 font-medium leading-snug text-ink group-hover:text-accent">
                    <Highlight text={meta.title} query={query} />
                  </h2>
                </EpisodeLink>
                <ul className="mt-2 divide-y divide-line border-t border-line">
                  {sorted.slice(0, HITS_PER_EPISODE).map((hit) => (
                    <li key={hit.anchor}>
                      <EpisodeLink
                        slug={meta.slug}
                        anchor={hit.anchor}
                        className="block px-5 py-3 font-serif text-[0.95rem] leading-7 text-soft transition hover:bg-sunk"
                      >
                        <Highlight text={hit.text} query={query} />
                      </EpisodeLink>
                    </li>
                  ))}
                </ul>
                {sorted.length > HITS_PER_EPISODE ? (
                  <EpisodeLink
                    slug={meta.slug}
                    anchor={sorted[HITS_PER_EPISODE].anchor}
                    className="block border-t border-line px-5 py-2.5 text-sm text-accent hover:bg-sunk"
                  >
                    本集还有 {sorted.length - HITS_PER_EPISODE} 处 →
                  </EpisodeLink>
                ) : null}
              </li>
            );
          })}
        </ol>
      )}
    </>
  );
}

function FilterChip({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={`shrink-0 rounded-full border px-3 py-1 text-sm transition ${
        active ? "border-accent bg-accent text-accent-ink" : "border-line bg-card text-soft hover:border-accent/50"
      }`}
    >
      {label}
      <span className={`ml-1.5 text-xs ${active ? "opacity-80" : "text-muted"}`}>{count}</span>
    </Link>
  );
}
