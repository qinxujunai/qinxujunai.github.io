# qinxujunai.github.io

秦徐俊的个人网站。

- 中文：https://qinxujunai.github.io/
- English：https://qinxujunai.github.io/en/

**我用 AI 做东西，也把做法分享出来。** 首屏是他导演的 AI 短片《来不及爱你》；下面是三个打开就能用的作品，每个作品还有一页讲怎么做的；然后是做法、三件事（阅读、学技能、健身）、结尾的信和名片。规则、页面结构和每一版为什么这样改，见 [AGENTS.md](AGENTS.md) 和 [CLAUDE.md](CLAUDE.md)。

## 影片

- 影片网站在单独的仓库 [`qinxujunai/too-late-to-love-you`](https://github.com/qinxujunai/too-late-to-love-you)，网址 `https://qinxujunai.github.io/too-late-to-love-you/`。
- 本仓库的 `laibuji-aini/` 只放跳转页：影片仓库原名 `laibuji-aini`，2026-10-23 改名后，旧链接靠它们继续打开。
- 首页首屏播放同一个视频文件。它放在腾讯云上海和 Cloudflare R2 两处，一次用一套（现在是腾讯云），另一套只在当前这套完全打不开时顶上。用哪一套由影片仓库的 `src/hosts.json` 决定，本站的 `src/film-hosts.json` 是它的副本（`scripts/film-hosts.mjs` 抄来，不要手改）。换方案：在影片仓库运行 `npm run host -- cloudflare` 或 `tencent`，两个网站一起换。详见 [docs/film-hosting.md](docs/film-hosting.md)。

## 页面
| 页面 | 地址 |
|---|---|
| 首页：影片 · 作品 · 做法 · 三件事 · 结尾的信 · 名片 | `/`、`/en/` |
| VoiceFlow：离线语音输入 | `/work/voiceflow/` |
| AI Signal：每天十点的 AI 简报 | `/work/ai-signal/` |
| 万象成文：贴一个链接，拿回一篇文字 | `/work/wanxiang/` |
| 找不到页面 | `/404.html` |

所有页面都有中英两版，支持深色和浅色，不依赖框架。外部请求只有一种：点了播放之后，从当前方案（腾讯云或 Cloudflare R2）拿视频。

## 目录
```
src/content.mjs        首页的全部文字（中英）
src/film-hosts.json    影片放在哪（影片网站 hosts.json 的副本，自动更新）
src/cases.mjs          三个作品页的全部文字、数字和出处
src/stats.json         VoiceFlow、万象成文的 GitHub 数据（自动更新）
src/signal.json        当天这期 AI Signal（自动更新）
src/media.json         图片清单（scripts/media.mjs 生成）
src/signature.svg      签名与印章（scripts/signature.mjs 生成）
assets/site.css        样式（构建时内联）
assets/site.js         交互：主题、签名收进导航、影片播放与备用地址、VoiceFlow 示意、书架、计数、逐字点亮、名片
assets/media/          WebP 图片及万象成文演示视频（静音循环，进入视口后加载；处理等待已剪短，播放点击为演示提示）
assets/card-*.png      可保存的名片（scripts/icons.mjs 生成）
copy.lock.json         文案锁定：所有页面看得见的字（npm run lock 生成）
scripts/build.mjs      生成全部页面和 sitemap
scripts/check.mjs      静态检查（含文案锁定、数字解析、推送脚本的测试）
scripts/qa.mjs         浏览器验收
scripts/ship.sh        一条命令上线：同步影片地址、构建、检查、浏览器验收、提交、推送
scripts/film-hosts.mjs 同步影片地址（ship 和每 6 小时的定时任务都会跑）
scripts/test-player.cjs 播放器备用测试
scripts/links.mjs      外链体检（每周一，.github/workflows/links.yml）
scripts/stats.mjs      GitHub 数据（每 6 小时，.github/workflows/stats.yml，同时同步影片地址）
docs/copy.md           文案标准与出处
CLAUDE.md              项目记忆：他是谁、他的原话、决策记录
AGENTS.md              协作规则与完成的定义
```

## 怎么修改
- **改文字**：编辑 `src/content.mjs` 或 `src/cases.mjs`，然后 `npm run build`。文案已经锁定，改动要他同意，同意后运行 `npm run lock` 记下新文案，否则 `npm run check` 不通过。
- **改样式**：编辑 `assets/site.css`。
- **换图片**：`npm run media -- <源目录> [名字…]`，源文件说明见 `scripts/media.mjs` 顶部。作品网站改版后，先用 `node scripts/capture-sites.cjs <源目录>` 重截。
- **改签名、图标、名片**：`node scripts/signature.mjs <字体目录> <NotoSerifSC-Bold.otf> final`，然后 `npm run icons`。
- **换微信二维码**：替换 `assets/wechat-qr.png`，然后 `npm run icons` 重新生成名片，再 `npm run qa` 确认二维码能被解码。

## 构建、检查、上线
```bash
npm install
npm run build
npm run check                 # 静态检查
npm run serve &               # http://127.0.0.1:4173
npm run qa                    # 浏览器验收（中英、深浅、手机电脑）
npm run ship -- "改了什么"     # 上面全部做完，再以他的名义提交并推送；任何一步失败就停下
```
GitHub Pages 直接从 `main` 的根目录发布。

## 致谢
- 签名字形来自 [Ma Shan Zheng](https://github.com/googlefonts/mashanzheng)，印章字形来自 [Noto Serif SC](https://github.com/notofonts/noto-cjk)，两者都是 SIL Open Font License 1.1。构建时把字形转成路径，网页不加载字体文件。
- 作品图截自各项目的网站：[VoiceFlow](https://github.com/qinxujunai/VoiceFlow)、[万象成文](https://github.com/qinxujunai/Audio2Text)、[AI Signal](https://github.com/qinxujunai/ai-signal)；推荐的教程截自 [easy-vibe](https://github.com/datawhalechina/easy-vibe)。
