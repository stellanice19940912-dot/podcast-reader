# 怎么上传文字稿

网站的全部内容都在这个文件夹里。改完提交后，GitHub 会自动重新发布网站，一般两三分钟后生效（进度在仓库的 **Actions** 页面里看）。

## 上传一集

1. 在 GitHub 网页上打开对应节目的文件夹，比如 `posts/acquired/`。文件夹名和节目的对应关系见 `shows.json` 里的 `slug`。
2. 点右上角 **Add file → Upload files**，把 HTML 文件拖进去，点 **Commit changes**。

就这样。网站会自动：

- **标题**：取 HTML 里的第一个 `<h1>`，没有就取 `<title>`，再没有就用文件名。
- **发布日期**：文件名以日期开头就用它，比如 `2026-10-20-costco.html`；否则用这个文件第一次上传的时间。
- **打开方式**：读者点开这一集，会在新标签页里直接打开这份 HTML。HTML 里的 `<style>` 样式会保留，`<script>` 脚本会被去掉，不会运行。

## 删除或替换一集

- **删除**：在 GitHub 上打开那个文件，点右上角 **⋯ → Delete file**，提交。
- **替换**：用同一个文件名重新上传，会覆盖旧文件。网址不变。

改了文件名，这一集的网址也会跟着变。

## 新增或修改节目

编辑 `shows.json`。每个节目一段：

```json
{
  "slug": "acquired",
  "name": "Acquired",
  "host": "Ben Gilbert 与 David Rosenthal",
  "category": "商业",
  "description": "显示在节目页顶部的一句介绍。",
  "videoUrl": "https://www.acquired.fm"
}
```

- **slug**：只能用小写英文、数字和短横线，同时也是这个节目的文件夹名。新增节目时，要在 `posts/` 下建一个同名文件夹再上传。GitHub 网页上传文件时，在文件名前面写 `新文件夹名/` 就会自动建好。
- **category**：分类。常用的有 健康、商业、科技、产品、访谈、体育。
- 首页只显示已经有文字稿的节目。
