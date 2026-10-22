import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { dayKey } from "./format";
import { sanitizeHtml } from "./html";

/**
 * 网站内容全部来自仓库里的 posts/ 文件夹，在构建时读取：
 *   posts/shows.json          节目列表
 *   posts/<节目>/<文件>.html   每一集上传的 HTML
 * 文件名可以用 2026-10-20-xxx.html 指定发布日期；没写就用文件第一次提交到仓库的时间。
 */

export type Show = {
  slug: string;
  name: string;
  host: string;
  category: string;
  description: string;
  videoUrl: string;
};

export type EpisodeSummary = {
  slug: string;
  showSlug: string;
  showName: string;
  title: string;
  date: string;
};

export type Episode = EpisodeSummary & {
  html: string;
  /** 带 id 的段落，用来做全文搜索和跳转。 */
  sections: { id: string; text: string }[];
};

export type ShowWithEpisodes = Show & { episodes: EpisodeSummary[] };

const POSTS = path.join(process.cwd(), "posts");
const DATE_PREFIX = /^(\d{4}-\d{2}-\d{2})[-_ ]?/;

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, "&");
}

function plainText(html: string) {
  return decodeEntities(html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64)
    .replace(/-+$/g, "");
}

function pickTitle(raw: string, fileName: string) {
  for (const pattern of [/<h1\b[^>]*>([\s\S]*?)<\/h1>/i, /<title\b[^>]*>([\s\S]*?)<\/title>/i]) {
    const found = raw.match(pattern)?.[1];
    const text = found ? plainText(found) : "";
    if (text) return text;
  }
  return fileName.replace(/\.[^.]+$/, "").replace(DATE_PREFIX, "").replace(/[-_]+/g, " ").trim() || fileName;
}

/** 文件名里的日期 → 第一次提交到仓库的时间 → 文件修改时间。 */
async function pickDate(file: string, fileName: string) {
  const prefix = fileName.match(DATE_PREFIX)?.[1];
  if (prefix && !Number.isNaN(Date.parse(prefix))) return `${prefix}T12:00:00.000Z`;
  try {
    const added = execFileSync("git", ["log", "--diff-filter=A", "--format=%cI", "--", file], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .trim()
      .split("\n")
      .filter(Boolean)
      .pop();
    if (added) return new Date(added).toISOString();
  } catch {
    // 没有 git 时退回到文件时间
  }
  return (await stat(file)).mtime.toISOString();
}

function collectSections(html: string) {
  const sections: { id: string; text: string }[] = [];
  const pattern = /<(p|h[1-6]|li)\b[^>]*\bid\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/\1>/gi;
  for (const match of html.matchAll(pattern)) {
    const text = plainText(match[3]);
    if (text) sections.push({ id: match[2], text });
  }
  return sections;
}

export const loadSite = cache(async () => {
  const shows = JSON.parse(await readFile(path.join(POSTS, "shows.json"), "utf8")) as Show[];
  const episodes: Episode[] = [];
  const used = new Set<string>();

  for (const show of shows) {
    const dir = path.join(POSTS, show.slug);
    const names = await readdir(dir).catch(() => [] as string[]);
    for (const fileName of names.filter((name) => /\.html?$/i.test(name)).sort()) {
      const file = path.join(dir, fileName);
      const raw = (await readFile(file, "utf8")).replace(/^﻿/, "");
      const html = sanitizeHtml(raw);
      const base = slugify(fileName.replace(/\.[^.]+$/, "").replace(DATE_PREFIX, ""));
      const hash = createHash("sha1").update(`${show.slug}/${fileName}`).digest("hex").slice(0, 8);
      let slug = `${show.slug}-${base || hash}`;
      if (used.has(slug)) slug = `${slug}-${hash}`;
      used.add(slug);
      const title = pickTitle(raw, fileName);
      episodes.push({
        slug,
        showSlug: show.slug,
        showName: show.name,
        title,
        date: await pickDate(file, fileName),
        html,
        // 标题本身已经显示在搜索结果的卡片上，不再当作正文段落重复列出
        sections: collectSections(html).filter((section) => section.text !== title),
      });
    }
  }

  episodes.sort((a, b) => b.date.localeCompare(a.date));
  const summaries = (list: Episode[]): EpisodeSummary[] =>
    list.map(({ slug, showSlug, showName, title, date }) => ({ slug, showSlug, showName, title, date }));
  const withEpisodes: ShowWithEpisodes[] = shows.map((show) => ({
    ...show,
    episodes: summaries(episodes.filter((episode) => episode.showSlug === show.slug)),
  }));

  // 首页时间轴：按北京时间的日期分组，最新的一天在最前
  const days: { day: string; episodes: (EpisodeSummary & { category: string })[] }[] = [];
  const categoryOf = new Map(shows.map((show) => [show.slug, show.category]));
  for (const episode of summaries(episodes)) {
    const day = dayKey(episode.date);
    let group = days.at(-1);
    if (!group || group.day !== day) {
      group = { day, episodes: [] };
      days.push(group);
    }
    group.episodes.push({ ...episode, category: categoryOf.get(episode.showSlug) ?? "" });
  }

  return { shows: withEpisodes, episodes, days };
});

export async function getShow(slug: string) {
  const site = await loadSite();
  return site.shows.find((show) => show.slug === slug) ?? null;
}

export async function getEpisode(slug: string) {
  const site = await loadSite();
  return site.episodes.find((episode) => episode.slug === slug) ?? null;
}

/** 浏览器端搜索用的索引：单集列表 + [单集序号, 段落 id, 段落文本]。 */
export type SearchIndex = {
  episodes: { slug: string; title: string; showSlug: string; showName: string; date: string }[];
  items: [number, string, string][];
};

export async function buildSearchIndex(): Promise<SearchIndex> {
  const site = await loadSite();
  return {
    episodes: site.episodes.map(({ slug, title, showSlug, showName, date }) => ({ slug, title, showSlug, showName, date })),
    items: site.episodes.flatMap((episode, index) =>
      episode.sections.map((section): [number, string, string] => [index, section.id, section.text]),
    ),
  };
}
