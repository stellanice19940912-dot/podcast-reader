import type { ComponentProps } from "react";
import { episodeHref } from "@/lib/links";

type Props = Omit<ComponentProps<"a">, "href"> & { slug: string; anchor?: string };

/** 每一集都是独立的 HTML 页面，在新标签页打开。 */
export function EpisodeLink({ slug, anchor, ...props }: Props) {
  return <a href={episodeHref(slug, anchor)} target="_blank" rel="noopener noreferrer" {...props} />;
}
