import { EpisodeLink } from "@/components/EpisodeLink";
import { ShowBrowser, type ShowCard } from "@/components/ShowBrowser";
import { loadSite } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { groupShows } from "@/lib/groups";

export default async function HomePage() {
  const site = await loadSite();
  const groups = groupShows(site.shows).map((group) => ({
    category: group.category,
    shows: group.shows.map(
      (show): ShowCard => ({
        slug: show.slug,
        name: show.name,
        host: show.host,
        description: show.description,
        count: show.episodes.length,
        latest: show.episodes[0]?.date ?? "",
      }),
    ),
  }));

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:pt-10">
      <section className="max-w-2xl">
        <h1 className="font-display text-[1.75rem] leading-tight min-[400px]:text-3xl sm:text-5xl">读播客，而不是听播客</h1>
        <p className="mt-3 text-base leading-7 text-soft sm:mt-4 sm:text-lg sm:leading-8">
          直译海外最优质播客，内容涉及健康、商业、科技、产品等，适合没空听播客的朋友。如果有时间，还是推荐听一听。
        </p>
      </section>

      {site.recent.length > 0 ? (
          <section className="mt-10 sm:mt-12" aria-labelledby="recent">
            <h2 id="recent" className="text-sm font-medium text-muted">
              最近更新
            </h2>
            {/* 手机上左右滑动，平板和电脑上排成网格 */}
            <ul className="scrollbar-none -mx-4 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-1 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
              {site.recent.map((episode) => (
                <li key={episode.slug} className="w-[78%] shrink-0 snap-start sm:w-auto">
                  <EpisodeLink
                    slug={episode.slug}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-card p-4 transition hover:border-accent/50"
                  >
                    <span className="text-xs text-accent">{episode.showName}</span>
                    <span className="mt-1.5 line-clamp-2 font-medium leading-snug text-ink group-hover:text-accent">
                      {episode.title}
                    </span>
                    <span className="mt-auto pt-3 text-xs text-muted">{formatDate(episode.date)}</span>
                  </EpisodeLink>
                </li>
              ))}
            </ul>
          </section>
      ) : null}

      <section id="shows" className="mt-14 scroll-mt-20" aria-labelledby="shows-title">
        <h2 id="shows-title" className="font-display text-2xl">
          全部节目
        </h2>
        <ShowBrowser groups={groups} />
      </section>
    </main>
  );
}
