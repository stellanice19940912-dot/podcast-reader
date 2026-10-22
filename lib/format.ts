/** 网站上的日期统一按北京时间显示和分组。 */
const TIME_ZONE = "Asia/Shanghai";

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: TIME_ZONE,
  }).format(date);
}

/** 北京时间的日期，形如 2026-10-22，用来按天分组。 */
export function dayKey(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(date);
}

/** 时间轴上的日期标题：10月22日 和 星期三。 */
export function formatDay(key: string): { date: string; weekday: string; year: string } {
  const date = new Date(`${key}T12:00:00+08:00`);
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("zh-CN", { ...options, timeZone: TIME_ZONE }).format(date);
  return {
    date: part({ month: "long", day: "numeric" }),
    weekday: part({ weekday: "long" }),
    year: part({ year: "numeric" }),
  };
}
