"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDate } from "@/lib/format";

export type ShowCard = {
  slug: string;
  name: string;
  host: string;
  description: string;
  count: number;
  latest: string;
};

type Group = { category: string; shows: ShowCard[] };

export function ShowBrowser({ groups }: { groups: Group[] }) {
  const [active, setActive] = useState<string>("全部");
  const visible = active === "全部" ? groups : groups.filter((group) => group.category === active);
  // 全部节目都列出来：有文字稿的按最近更新排在前面，还没有的保持原来的顺序排在后面。
  const filled = visible
    .flatMap((group) => group.shows)
    .map((show, order) => ({ show, order }))
    .sort((a, b) => b.show.latest.localeCompare(a.show.latest) || a.order - b.order)
    .map(({ show }) => show);
  const tabs = ["全部", ...groups.map((group) => group.category)];

  return (
    <div className="mt-4">
      <div role="tablist" aria-label="节目分类" className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {tabs.map((tab) => {
          const total =
            tab === "全部"
              ? groups.reduce((sum, group) => sum + group.shows.length, 0)
              : (groups.find((group) => group.category === tab)?.shows.length ?? 0);
          const selected = tab === active;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(tab)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${
                selected ? "border-accent bg-accent text-accent-ink" : "border-line bg-card text-soft hover:border-accent/50"
              }`}
            >
              {tab}
              <span className={`ml-1.5 text-xs ${selected ? "opacity-80" : "text-muted"}`}>{total}</span>
            </button>
          );
        })}
      </div>

      {filled.length > 0 ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filled.map((show) => (
            <li key={show.slug}>
              <Link
                href={`/shows/${show.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-card p-5 transition hover:-translate-y-0.5 hover:border-accent/50"
              >
                {show.host ? <span className="text-xs text-muted">{show.host}</span> : null}
                <span className="mt-1 text-xl font-semibold text-ink group-hover:text-accent">{show.name}</span>
                {show.description ? (
                  <span className="mt-2 line-clamp-3 text-sm leading-6 text-soft">{show.description}</span>
                ) : null}
                <span className="mt-auto flex items-center justify-between pt-4 text-xs text-muted">
                  {show.count > 0 ? (
                    <span className="text-accent">{show.count} 集文字稿</span>
                  ) : (
                    <span>即将上线</span>
                  )}
                  {show.latest ? <span>更新于 {formatDate(show.latest)}</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
