import { getEpisode, loadSite } from "@/lib/content";
import { standaloneDocument } from "@/lib/html-page";
import { withBase } from "@/lib/links";

// 构建时为每一集生成 /read/<单集>.html，就是上传的 HTML 本身，不套站点外框。
export const dynamic = "force-static";
export const dynamicParams = false;

// 静态导出要求至少生成一个文件；/read/ 本身放一个回首页的入口，站点还没有内容时也能构建。
const INDEX = "index.html";

export async function generateStaticParams() {
  const site = await loadSite();
  return [{ file: INDEX }, ...site.episodes.map((episode) => ({ file: `${episode.slug}.html` }))];
}

export async function GET(_request: Request, ctx: RouteContext<"/read/[file]">) {
  const { file } = await ctx.params;
  const episode = file === INDEX ? null : await getEpisode(file.replace(/\.html$/, ""));
  const body = episode
    ? standaloneDocument(episode.html, episode.title)
    : standaloneDocument(`<p><a href="${withBase("/")}">回到首页</a></p>`, "文字稿");
  return new Response(body, { headers: { "content-type": "text/html; charset=utf-8" } });
}
