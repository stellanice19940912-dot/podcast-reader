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
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-10">
      <section className="max-w-2xl">
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">读播客，而不是听播客</h1>
        <p className="mt-4 text-lg leading-8 text-soft">
          直译海外最优质播客，内容涉及健康、商业、科技、产品等，适合没空听播客的朋友。如果有时间，还是推荐听一听。
        </p>
      </section>

      {site.recent.length > 0 ? (
          <section className="mt-12" aria-labelledby="recent">
            <h2 id="recent" className="text-sm font-medium text-muted">
              最近更新
            </h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {site.recent.map((episode) => (
                <li key={episode.slug}>
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
