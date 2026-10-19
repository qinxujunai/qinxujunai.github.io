# AGENTS.md

秦徐俊的个人网站。让一个在手机或微信里点开链接的人，30 秒内知道他是谁、看到他做的东西、能加上微信，并记住一句话。它是个人网站，不是求职材料。视觉对标 apple.com。

## 事实
- 纯静态。`index.html`、`en/index.html`、`404.html`、`sitemap.xml` 由 `scripts/build.mjs` 生成，不要手改。
- 全站文字（中英）只在 `src/content.mjs`；图片清单在 `src/media.json`（由 `scripts/media.mjs` 生成）。改文字 → `npm run build` → 提交生成的页面。
- 样式只在 `assets/site.css`（颜色都是 `:root` 变量，深色在 `[data-theme='dark']`，黑色磁贴用 `.dark` 局部覆盖变量）；脚本只在 `assets/site.js`。
- GitHub Pages 直接从 `main` 根目录发布，没有 Actions；`.nojekyll` 必须保留。
- 页面结构：本地导航（签名、章节、加微信）→ 首屏 → VoiceFlow（黑色旗舰磁贴）/ 万象成文 / ai.vibecoding → 在意（滚动点亮的黑色宣言 + 隐私、诚实、克制三张价值卡）→ 经历 → 影像（横向画廊）→ 联系。
- VoiceFlow 的 star、下载、fork、最新版本来自 `src/stats.json`，由 `.github/workflows/stats.yml` 每 6 小时运行 `scripts/stats.mjs` 拉取 GitHub 数据并重建页面，有变化才提交。不要手改这些数字。
- 签名 `src/signature.svg` 由 `scripts/signature.mjs` 从 OFL 字体 Liu Jian Mao Cao 转成路径；首屏保留真实路径（逐字显现动效），导航和结尾用 `<use href="#sig-paths">` 复用。拿到本人手写签名后替换，保持每个字一个 `<path>`。
- 图片：`npm run media -- <源目录>` 生成 `assets/media/*.webp`（1x/2x）。源目录放头像、VoiceFlow 界面图、万象成文结果页和本人摄影原图（不进仓库）；ai.vibecoding 终端和 AI Work Method 面板从线上截取。
- 图标与分享图由 `scripts/icons.mjs` 生成。

## 红线
- **真实**：不编造成就、数字、客户、logo、推荐语。新增事实必须来自本人的话、他的仓库、简历或他的回答。引用他的文字时，只用他本人提交过的原文（ai.vibecoding 里 2026-05 由他提交的内容）。
- **隐私**：不出现手机号、邮箱、薪资、年龄、毕业年份，不提交简历。联系方式只用微信二维码（`assets/wechat-qr.png`，换图后必须能被解码）。摄影只用风景、建筑、静物，不用他人正脸或品牌 logo。
- **零外部请求**：不加外部字体、统计、CDN、嵌入。字体用系统字体（PingFang / SF / 各平台黑体）。
- **Apple 式的克制**：居中的磁贴、大而紧的半粗标题、蓝色文字链接配 ›、只有一个蓝色主按钮（加微信）。动效只有：签名书写、VoiceFlow 胶囊打字、数字计数、宣言随滚动逐字点亮、磁贴首次进入时的轻微浮现、画廊翻页；全部遵守减少动效。不加渐变、卡片墙、全大写标签、等宽小标签。
- 不要把它改回求职页：不放回款、客户名、来源标签。

## 完成的定义
```bash
npm install            # 仅开发工具
npm run build
npm run check          # 页面最新、中英结构一致、隐私扫描、同源资源、体积预算
npm run serve &        # http://127.0.0.1:4173
npm run qa             # 中/英 × 深/浅 × 三种视口：0 报错、0 跨域请求、axe AA 0 违规、无横向溢出、磁贴可见、弱网、无 JS、减少动效、二维码解码
CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npx lighthouse http://127.0.0.1:4173/   # 移动端四项 ≥ 95（本地 SEO 因 canonical 指向线上会略低）
```
推送后对 https://qinxujunai.github.io/ 再跑一次 `npm run qa -- https://qinxujunai.github.io`。
