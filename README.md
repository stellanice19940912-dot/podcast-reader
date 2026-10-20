# 播客字幕

中文界面的播客文字稿阅读站。整站在构建时导出成静态网页，托管在 GitHub Pages 上，没有后台和数据库。

## 更新内容

内容全部在 [`posts/`](posts/) 文件夹里：`posts/shows.json` 是节目列表，`posts/<节目>/` 里放每一集的 HTML。在 GitHub 网页上上传文件即可，具体步骤见 [posts/README.md](posts/README.md)。推送到 `main` 后，[发布流程](.github/workflows/deploy.yml) 会自动构建并发布。

## 本地预览

```bash
npm install
npm run dev
```

打开 http://localhost:3000 。

## 绑定自定义域名

1. 在仓库 **Settings → Pages → Custom domain** 填域名，并勾选 **Enforce HTTPS**。
2. 在域名服务商处添加 CNAME 记录，指向 `用户名.github.io`。

发布流程会自动识别：绑定域名后网址不再带 `/仓库名` 前缀，不需要改代码。
