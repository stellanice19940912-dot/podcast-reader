import Link from "next/link";
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

/** 按分类依次列出有文字稿的节目；顶部分类标签跳到页面里对应的分类。 */
export function ShowBrowser({ groups: allGroups }: { groups: Group[] }) {
  const groups = allGroups
    .map((group) => ({
      category: group.category,
      shows: group.shows.filter((show) => show.count > 0).sort((a, b) => b.latest.localeCompare(a.latest)),
    }))
    .filter((group) => group.shows.length > 0);

  if (groups.length === 0) {
    return <p className="mt-6 text-sm text-muted">文字稿正在整理中，第一批内容很快上线。</p>;
  }

  return (
    <div>
      <nav
        aria-label="节目分类"
        className="sticky top-14 z-10 -mx-4 mt-4 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur"
      >
        <ul className="scrollbar-none flex gap-2 overflow-x-auto">
          {groups.map((group) => (
            <li key={group.category} className="shrink-0">
              <a
                href={`#${group.category}`}
                className="inline-block rounded-full border border-line bg-card px-4 py-1.5 text-sm text-soft transition hover:border-accent hover:text-accent"
              >
                {group.category}
                <span className="ml-1.5 text-xs text-muted">{group.shows.length}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 space-y-12">
        {groups.map((group) => (
          <section key={group.category} id={group.category} aria-label={group.category} className="scroll-mt-32">
            <h3 className="text-sm font-medium text-muted">
              {group.category}
              <span className="ml-1.5 text-xs">{group.shows.length}</span>
            </h3>
            <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.shows.map((show) => (
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
                      <span className="text-accent">{show.count} 集文字稿</span>
                      {show.latest ? <span>更新于 {formatDate(show.latest)}</span> : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
