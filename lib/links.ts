/** 部署在 GitHub Pages 子路径（用户名.github.io/仓库名）时的前缀；绑定自定义域名后为空。 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** 给普通 <a>、<form>、fetch 用的地址；next/link 会自动加前缀，不需要它。 */
export function withBase(pathname: string) {
  return `${BASE_PATH}${pathname}`;
}

/** 每一集都是上传的 HTML 文件，直接打开它。 */
export function episodeHref(slug: string, anchor?: string) {
  return withBase(`/read/${slug}.html${anchor ? `#${anchor}` : ""}`);
}
