/** 上传的 HTML 没有自带样式时用的基础版式。 */
const FALLBACK_CSS = `
  body { margin: 0; color: #0f1b2d; background: transparent; font: 17px/1.75 Georgia, "Iowan Old Style", serif; }
  a { color: #1d5fd1; }
  .wrap { max-width: 46rem; }
  .eyebrow { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: .8rem; }
  .pill { display: inline-block; border: 1px solid #dbe4f0; border-radius: 999px; padding: .1rem .65rem; font: 12px/1.5 "Segoe UI", sans-serif; }
  .pill.accent { background: #1d5fd1; color: #fff; border-color: #1d5fd1; }
  h1 { margin: .2rem 0 .6rem; font-size: 1.7rem; line-height: 1.3; }
  .sub { margin: .2rem 0; color: #6b7a90; font-size: .95rem; }
  .meta { margin-top: 1rem; }
  .meta-row { display: grid; grid-template-columns: 4.5rem minmax(0, 1fr); gap: .4rem; margin-top: .35rem; font-size: .92rem; }
  .turn { margin-top: 1.15rem; }
  .label, .badge, .tag { font: 600 13px/1.4 "Segoe UI", sans-serif; color: #1d5fd1; }
  .content { margin-top: .2rem; }
  .note, .asr, .marker-line { color: #6b7a90; font-size: .9rem; }
`;

/** 独立打开时，给没有样式的 HTML 加上页面边距和浅色背景。 */
const STANDALONE_CSS = `
  html { background: #f5f8fc; }
  body { max-width: 62rem; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }
`;

/**
 * 上传的 HTML 自带版式时，把内容区放宽一些，大屏上读起来更舒服。
 * 放在页面最后，覆盖文件里同名的设置；屏幕本身比这个窄时（手机）不受影响。
 */
const WIDEN_CSS = `<style>:root{--max:1000px}</style>`;

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function hasOwnStyle(html: string) {
  return /<style\b/i.test(html);
}

/** 把存下来的 HTML 片段还原成一份完整、可直接打开的网页。 */
export function standaloneDocument(html: string, title: string) {
  const style = hasOwnStyle(html) ? "" : `<style>${FALLBACK_CSS}${STANDALONE_CSS}</style>`;
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta http-equiv="Content-Security-Policy" content="script-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'">
<title>${escapeHtml(title)} · 播客字幕</title>
${style}
</head>
<body>
${html}
${hasOwnStyle(html) ? WIDEN_CSS : ""}
</body>
</html>`;
}
