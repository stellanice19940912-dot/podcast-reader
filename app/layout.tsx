import type { Metadata, Viewport } from "next";
import { Fraunces, Literata, Noto_Serif_SC } from "next/font/google";
import { SiteHeader } from "@/components/SiteChrome";
import "./globals.css";

// 正文：为长篇阅读设计的 Literata。
const literata = Literata({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-literata",
});

// 标题：带 SOFT 轴的 Fraunces，调软一些更有温度。
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  axes: ["SOFT", "opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

// 中文标题：思源宋体。字库大，按需分片加载，不预加载。
const notoSerifSC = Noto_Serif_SC({
  weight: ["500", "700"],
  display: "swap",
  preload: false,
  variable: "--font-noto-serif-sc",
});

export const metadata: Metadata = {
  title: {
    default: "播客字幕",
    template: "%s · 播客字幕",
  },
  description: "按节目阅读播客英文文字稿，也能搜索全部正文。",
};

export const viewport: Viewport = {
  themeColor: "#f5f8fc",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${literata.variable} ${fraunces.variable} ${notoSerifSC.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-accent px-4 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
        >
          跳到正文
        </a>
        <SiteHeader />
        <div id="main" className="flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}
