export const CATEGORIES = ["健康", "商业", "科技", "产品", "访谈", "体育"];

const PREFERRED = [...CATEGORIES, "其他"];

export function categoryOptions(existing: Array<string | undefined>) {
  const known = new Set(PREFERRED);
  const extras = existing.map((item) => item?.trim()).filter((item): item is string => !!item && !known.has(item));
  const present = new Set(existing.map((item) => item?.trim()).filter(Boolean));
  const listed = present.size > 0 ? PREFERRED.filter((item) => present.has(item)) : CATEGORIES;
  return [...listed, ...extras];
}

export function groupShows<T extends { category?: string }>(shows: T[]) {
  const groups = new Map<string, T[]>();
  for (const show of shows) {
    const category = show.category?.trim() || "其他";
    const list = groups.get(category) ?? [];
    list.push(show);
    groups.set(category, list);
  }
  return [...groups.keys()]
    .sort((a, b) => {
      const ai = PREFERRED.indexOf(a);
      const bi = PREFERRED.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi) || a.localeCompare(b, "zh");
    })
    .map((category) => ({ category, shows: groups.get(category) ?? [] }));
}