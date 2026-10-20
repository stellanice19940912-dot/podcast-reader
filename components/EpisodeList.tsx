"use client";

import { useState } from "react";
import { EpisodeLink } from "@/components/EpisodeLink";
import type { EpisodeSummary } from "@/lib/content";
import { formatDate } from "@/lib/format";

export function EpisodeList({ episodes }: { episodes: EpisodeSummary[] }) {
  const [query, setQuery] = useState("");
  const [oldestFirst, setOldestFirst] = useState(false);
  const needle = query.trim().toLowerCase();
  const list = episodes
    .filter((episode) => !needle || episode.title.toLowerCase().includes(needle))
    .sort((a, b) => (oldestFirst ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {episodes.length > 5 ? (
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="按标题筛选"
            aria-label="按标题筛选"
            className="h-9 min-w-0 flex-1 rounded-full border border-line bg-card px-4 text-sm outline-none placeholder:text-muted focus:border-accent sm:max-w-xs"
          />
        ) : null}
        <span className="text-sm text-muted">
          {needle ? `${list.length} / ${episodes.length} 集` : `共 ${episodes.length} 集`}
        </span>
        {episodes.length > 1 ? (
          <button
            type="button"
            onClick={() => setOldestFirst((value) => !value)}
            className="ml-auto rounded-full px-3 py-1.5 text-sm text-soft hover:bg-sunk"
          >
            {oldestFirst ? "最早在前" : "最新在前"} ⇅
          </button>
        ) : null}
      </div>

      {list.length === 0 ? (
        <p className="mt-6 text-sm text-muted">没有标题包含「{query}」的单集。</p>
      ) : (
        <ol className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
          {list.map((episode) => {
            return (
              <li key={episode.slug}>
                <EpisodeLink
                  slug={episode.slug}
                  className="group flex flex-col gap-1 px-5 py-4 transition hover:bg-sunk sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <span className="flex-1 font-medium leading-snug text-ink group-hover:text-accent">{episode.title}</span>
                  <span className="shrink-0 text-sm text-muted tabular-nums">{formatDate(episode.date)}</span>
                </EpisodeLink>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
