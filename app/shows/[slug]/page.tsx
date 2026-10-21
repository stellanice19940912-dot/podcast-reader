import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EpisodeList } from "@/components/EpisodeList";
import { Crumbs, EmptyState, Pill } from "@/components/ui";
import { getShow, loadSite } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  const site = await loadSite();
  return site.shows.map((show) => ({ slug: show.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shows/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const show = await getShow(slug);
  if (!show) return { title: "未找到节目" };
  return { title: show.name, description: show.description || undefined };
}

export default async function ShowPage({ params }: PageProps<"/shows/[slug]">) {
  const { slug } = await params;
  const show = await getShow(slug);
  if (!show) notFound();
  const video = show.videoUrl.startsWith("http") ? show.videoUrl : "";

  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:pt-10">
      <Crumbs items={[{ href: "/", label: "全部节目" }, { label: show.name }]} />
      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          {show.category ? <Pill tone="accent">{show.category}</Pill> : null}
          {show.host ? <span className="text-sm text-muted">{show.host}</span> : null}
        </div>
        <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">{show.name}</h1>
        {show.description ? <p className="mt-4 leading-8 text-soft">{show.description}</p> : null}
        {video ? (
          <a
            href={video}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm text-accent hover:underline"
          >
            节目官网 ↗
          </a>
        ) : null}
      </header>
      <div className="mt-10">
        {show.episodes.length === 0 ? (
          <EmptyState title="这个节目还没有文字稿">整理好后会出现在这里。</EmptyState>
        ) : (
          <EpisodeList episodes={show.episodes} />
        )}
      </div>
    </main>
  );
}
