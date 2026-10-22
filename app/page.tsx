import Link from "next/link";
import { EpisodeLink } from "@/components/EpisodeLink";
import { EmptyState, GridIcon } from "@/components/ui";
import { loadSite } from "@/lib/content";
import { formatDay } from "@/lib/format";

export default async function HomePage() {
  const site = await loadSite();
  const latestYear = site.days[0] ? formatDay(site.days[0].day).year : "";

  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:pt-10">
      <section>
        <h1 className="font-display text-[1.75rem] leading-tight min-[400px]:text-3xl sm:text-5xl">读播客，而不是听播客</h1>
        <p className="mt-3 text-base leading-7 text-soft sm:mt-4 sm:text-lg sm:leading-8">
          直译海外最优质播客，内容涉及健康、商业、科技、产品等，适合没空听播客的朋友。
        </p>
      </section>

      <section className="mt-10 sm:mt-14" aria-labelledby="latest">
        <div className="flex items-center justify-between gap-4">
          <h2 id="latest" className="font-display text-2xl">
            最近更新
          </h2>
          <Link
            href="/channels"
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line bg-card px-3.5 text-sm text-soft transition hover:border-accent hover:text-accent"
          >
            <GridIcon />
            全部频道
          </Link>
        </div>

        {site.days.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="文字稿正在整理中">第一批内容很快上线，敬请期待。</EmptyState>
          </div>
        ) : (
          <ol className="mt-6 space-y-10 border-l border-line pl-5 sm:pl-8">
            {site.days.map(({ day, episodes }) => {
              const label = formatDay(day);
              return (
                <li key={day} className="relative">
                  {/* 时间轴上的圆点 */}
                  <span
                    aria-hidden
                    className="absolute top-1.5 -left-[calc(1.25rem+5px)] size-2.5 rounded-full bg-accent ring-4 ring-paper sm:-left-[calc(2rem+5px)]"
                  />
                  <h3 className="flex flex-wrap items-baseline gap-x-2 leading-none">
                    <span className="text-lg font-semibold text-ink">
                      {label.year !== latestYear ? label.year : ""}
                      {label.date}
                    </span>
                    <span className="text-sm text-muted">
                      {label.weekday} · {episodes.length} 集
                    </span>
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {episodes.map((episode) => (
                      <li key={episode.slug}>
                        <EpisodeLink
                          slug={episode.slug}
                          className="group flex items-start gap-4 rounded-2xl border border-line bg-card px-5 py-4 transition hover:border-accent/50 hover:shadow-sm"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                              <span className="font-medium text-accent">{episode.showName}</span>
                              {episode.category ? <span className="text-muted">{episode.category}</span> : null}
                            </span>
                            <span className="mt-1.5 block text-base font-medium leading-snug text-ink group-hover:text-accent sm:text-lg">
                              {episode.title}
                            </span>
                          </span>
                          <span aria-hidden className="mt-0.5 shrink-0 text-muted transition group-hover:text-accent">
                            ↗
                          </span>
                        </EpisodeLink>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </main>
  );
}
