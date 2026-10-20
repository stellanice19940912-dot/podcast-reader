import type { NextConfig } from "next";

// 整站在构建时导出成静态文件（out/），由 GitHub Pages 托管。
// 部署到 用户名.github.io/仓库名 时，构建流程会把 NEXT_PUBLIC_BASE_PATH 设成 /仓库名；
// 绑定自定义域名后留空即可。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
