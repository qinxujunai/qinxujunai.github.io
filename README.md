# qinxujunai.github.io

秦徐俊的个人网站。

- 中文：https://qinxujunai.github.io/
- English：https://qinxujunai.github.io/en/

**我用 AI 做东西，也把想法分享出来。** 首页把他做的每个作品，直接放成可以点开的网站窗口；每个作品还有一页，讲为什么做、难在哪、怎么搭的、还没做好的。

## 页面
| 页面 | 地址 |
|---|---|
| 首页：首屏 · 作品 · 分享 · 经历 · 照片 · 联系 | `/`、`/en/` |
| VoiceFlow：离线语音输入 | `/work/voiceflow/` |
| AI Signal：每天早上的 AI 简报 | `/work/ai-signal/` |
| 万象成文：贴一个链接，拿回一篇文字 | `/work/wanxiang/` |

所有页面都有中英两版，支持深色和浅色，不依赖框架，不发任何外部请求。

## 目录
```
src/content.mjs        首页的全部文字（中英）
src/cases.mjs          三个作品页的全部文字、数字和出处
src/stats.json         VoiceFlow 的 GitHub 数据（自动更新）
src/media.json         图片清单（scripts/media.mjs 生成）
src/signature.svg      签名与印章（scripts/signature.mjs 生成）
assets/site.css        样式（构建时内联）
assets/site.js         交互：主题、签名收进导航、作品窗口滚动、胶囊打字、计数、逐字点亮、画廊、名片
assets/media/          WebP 图片
assets/card-*.png      可保存的名片（scripts/icons.mjs 生成）
scripts/build.mjs      生成全部页面和 sitemap
scripts/capture-sites.cjs  截取四个作品网站的整页图
scripts/check.mjs      静态检查
scripts/qa.mjs         浏览器验收
docs/copy.md           文案平台与出处
CLAUDE.md              项目记忆：他是谁、他的原话、决策记录
AGENTS.md              协作规则与完成的定义
```

## 怎么修改
- **改文字**：编辑 `src/content.mjs` 或 `src/cases.mjs`，然后运行 `npm run build`，再提交生成的 HTML。
  - 加一个案例：在 `src/cases.mjs` 的 `CASES` 里加一项，中英两份都要有，构建时会自动生成页面、加进首页和 sitemap。
- **改样式**：编辑 `assets/site.css`。
- **换图片**：运行 `npm run media -- <源目录> [名字…]`，源文件说明见 `scripts/media.mjs` 顶部。作品网站改版后，先用 `node scripts/capture-sites.cjs <源目录>` 重截。
- **改签名、图标、名片**：运行 `node scripts/signature.mjs <字体目录> <NotoSerifSC-Bold.otf> final`，然后运行 `npm run icons`。
- **换微信二维码**：替换 `assets/wechat-qr.png`，然后运行 `npm run icons` 重新生成名片，再运行 `npm run qa`，确认二维码能被解码。

## 构建与检查
```bash
npm install
npm run build
npm run check
npm run serve &   # http://127.0.0.1:4173
npm run qa
```
GitHub Pages 直接从 `main` 的根目录发布。

`.github/workflows/stats.yml` 每 6 小时做一次这些事：拉取 VoiceFlow 的 star、下载、fork 和最新版本，重建页面；只在有变化时提交，然后触发 Pages 重新构建。

## 致谢
- 签名字形来自 [Ma Shan Zheng](https://github.com/googlefonts/mashanzheng)，印章字形来自 [Noto Serif SC](https://github.com/notofonts/noto-cjk)，两者都是 SIL Open Font License 1.1。构建时把字形转成路径，网页不加载字体文件。
- 作品窗口里的画面截自各项目的网站： [VoiceFlow](https://github.com/qinxujunai/VoiceFlow)、[万象成文](https://github.com/qinxujunai/Audio2Text)、[AI Signal](https://github.com/qinxujunai/ai-signal)、[ai.vibecoding](https://github.com/qinxujunai/qinxujun-ai-vibecoding)。
- 照片都是他本人拍的。
