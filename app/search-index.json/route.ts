import { buildSearchIndex } from "@/lib/content";

// 构建时生成 /search-index.json，搜索页在浏览器里读取它。
export const dynamic = "force-static";

export async function GET() {
  return Response.json(await buildSearchIndex());
}
