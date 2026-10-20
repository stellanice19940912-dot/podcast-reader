const BLOCKED =
  /<\s*(script|iframe|object|embed|link|meta|form|input|button|textarea|svg|math)\b[^>]*>[\s\S]*?<\/\s*\1\s*>/gi;
const BLOCKED_VOID =
  /<\s*(script|iframe|object|embed|link|meta|form|input|button|textarea|svg|math)\b[^>]*\/?>/gi;

export function looksLikeHtml(filename: string, raw: string) {
  const name = filename.toLowerCase();
  return name.endsWith(".html") || name.endsWith(".htm") || /<(p|div|h[1-6]|article|section|br|style)\b/i.test(raw);
}

export function sanitizeHtml(raw: string) {
  let html = raw.replace(/^\uFEFF/, "").trim();
  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => cleanCss(match[1]));
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (body) html = body[1];
  html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  html = html.replace(/<!--[\s\S]*?-->/g, "");
  html = html.replace(BLOCKED, "").replace(BLOCKED_VOID, "");
  html = html.replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  html = html.replace(/\s+style\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, (attribute) =>
    /expression\s*\(|javascript\s*:/i.test(attribute) ? "" : attribute,
  );
  html = html.replace(/\s+(href|src)\s*=\s*(["'])\s*(?:javascript:|data:)[\s\S]*?\2/gi, "");
  let index = 0;
  html = html.replace(/<(p|h[1-3]|li)\b([^>]*)>/gi, (match, tag: string, attrs: string) => {
    if (/\sid\s*=/.test(attrs)) return match;
    const id = `p-${index}`;
    index += 1;
    return `<${tag} id="${id}"${attrs}>`;
  });
  const styleTag = styles.filter(Boolean).length ? `<style>${styles.filter(Boolean).join("\n")}</style>` : "";
  return `${styleTag}${html.trim()}`;
}

function cleanCss(css: string) {
  return css
    .replace(/<\/style/gi, "")
    .replace(/expression\s*\(/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/@import\b[^;]*;?/gi, "");
}

export function plainTextToHtml(raw: string) {
  const parts = raw
    .replace(/\r/g, "")
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts
    .map((part, index) => `<p id="p-${index}">${escapeHtml(part).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
