# AGENTS.md

秦徐俊的个人网站。它只做一件事：让一个在手机或微信里点开链接的人，30 秒内知道他是谁、看到他做的东西、能加上微信，并记住一句话。它是个人网站，不是求职材料。

## 事实
- 纯静态。`index.html`、`en/index.html`、`404.html`、`sitemap.xml` 由 `scripts/build.mjs` 生成，不要手改。
- 全站文字（中英）只在 `src/content.mjs`。改文字 → `npm run build` → 提交生成的页面。
- 样式只在 `assets/site.css`（颜色都在 `:root` 变量里，深色在 `[data-theme='dark']`）；脚本只在 `assets/site.js`。
- GitHub Pages 直接从 `main` 根目录发布，没有 Actions；`.nojekyll` 必须保留。
- 签名 `src/signature.svg` 由 `scripts/signature.mjs` 从 OFL 字体 Liu Jian Mao Cao 转成路径。拿到本人手写签名后，用描摹出的 SVG 替换它，保留每个字一个 `<path>`（动画按 path 逐个书写）。
- 作品区：VoiceFlow 是主打（胶囊用 HTML/CSS 按产品设计重画，不用截图），其余作品是文字条目。图标与分享图由 `scripts/icons.mjs` 生成。

## 红线
- **真实**：不编造成就、数字、客户、logo、推荐语。新增事实必须来自本人的话、他的仓库或他的回答。
- **隐私**：不出现手机号、邮箱、薪资、年龄，不提交简历。联系方式只用微信二维码（`assets/wechat-qr.png`，换图后必须能被解码）。
- **零外部请求**：不加外部字体、统计、CDN、嵌入。中文用系统字体。
- **克制**：全站只有一个编排好的动效（签名从左到右写出）。不加逐节淡入、卡片墙、渐变、全大写标签、等宽小标签、「A · B · C」串、带箭头的按钮、01/02 编号。
- 不要把它改回求职页：不放业绩数字、回款、客户名、来源标签。

## 完成的定义
```bash
npm install            # 仅开发工具
npm run build
npm run check          # 页面最新、中英结构一致、隐私扫描、同源资源、体积预算
npm run serve &        # http://127.0.0.1:4173
npm run qa             # 中/英 × 深/浅 × 三种视口：0 报错、0 跨域请求、axe AA 0 违规、弱网、无 JS、减少动效、二维码解码
CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npx lighthouse http://127.0.0.1:4173/   # 移动端四项 ≥ 95
```
推送后对 https://qinxujunai.github.io/ 再跑一次 `npm run qa -- https://qinxujunai.github.io`。
