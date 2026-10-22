import type { Metadata } from "next";
import { ShowBrowser, type ShowCard } from "@/components/ShowBrowser";
import { loadSite } from "@/lib/content";
import { groupShows } from "@/lib/groups";

export const metadata: Metadata = {
  title: "全部频道",
  description: "按分类浏览所有已收录文字稿的播客频道。",
};

export default async function ChannelsPage() {
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
      <h1 className="font-display text-3xl leading-tight sm:text-4xl">全部频道</h1>
      <ShowBrowser groups={groups} />
    </main>
  );
}
