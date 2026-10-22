import type { Metadata } from "next";
import { BackLink } from "@/components/BackLink";
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
      <BackLink fallback="/" label="返回首页" />
      <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">全部频道</h1>
      <ShowBrowser groups={groups} />
    </main>
  );
}
