# 「‹ 返回」：从个人网站去他的其他网站，再回来（v27.10，2026-10-24）

## 为什么
他的网站都在同一个地址 `qinxujunai.github.io` 下，但其实是六个独立的网站（每个仓库一个）：个人网站在根目录，VoiceFlow 在 `/VoiceFlow/`，万象成文在 `/Audio2Text/`，AI Signal 在 `/ai-signal/`，ai.vibecoding 在 `/qinxujun-ai-vibecoding/`，影片在 `/too-late-to-love-you/`。

个人网站里的作品页（`/work/…`）有「‹ 作品」可以回去；但点「打开 VoiceFlow ↗」「这部片子怎么拍的 ↗」进入的是别的网站，以前左上角没有返回。普通访客分不清这是两个网站，只觉得「回不去了」。

他的另一条要求：单独把影片（或任何产品）的链接发给别人时，对方不能看到回到他个人主页的入口。

## 规则
- 只有从个人网站点过去的人，左上角才显示「‹ 返回」（英文页 `‹ Back`），点了回到个人网站刚才的位置。
- 别人直接打开链接（转发、收藏、搜索）：什么都不显示，页面里也没有指向个人网站的链接。

## 做法（约定）
1. 个人网站 `assets/site.js`：点任何指向本域名其他网站的链接（`href` 以 `https://qinxujunai.github.io/` 开头）时，在 `sessionStorage` 里写 `qxj.back` = 当前页地址 + 最近的带 id 的区块（例如 `https://qinxujunai.github.io/#work`）。
   - `sessionStorage` 只属于当前这个浏览器标签页，网址里不加任何参数，所以转发出去的链接不带它；微信里每次打开链接都是新页面，也不带。
   - 六个网站同一个域名（同源），所以都读得到。
2. 每个网站在左上角放一个默认隐藏的链接，带 `data-qxj-back`；页面脚本读到 `qxj.back`（并且以本域名开头）才把它显示出来，`href` 设成那个地址。HTML 里不写个人网站的地址（影片网站的检查要求页面里没有指向个人网站的链接）。
3. 点击时：如果上一页就是那个地址（`document.referrer` 去掉 `#` 后相同），用 `history.back()`，回到原来的滚动位置；否则跳到 `qxj.back`（在产品网站里又点了别的页面，比如 AI Signal 的往期）。

## 各网站的位置
| 网站 | 文件 |
| --- | --- |
| 个人网站（写入） | `assets/site.js` |
| VoiceFlow | `site/index.html`（`.qxj-back`）、`site/app.js`（文案 `back`）、`site/styles.css` |
| 万象成文 | `site/index.html`（`.header-start` 里）、`site/app.js`、`site/styles.css` |
| AI Signal | `scripts/back.js`（脚本），`scripts/site.js`（产品主页顶栏），`scripts/render.js`（`latest/`、`archive/` 网页版顶栏；邮件里没有） |
| ai.vibecoding | `src/components/layout/Navbar.tsx`（`useBackLink`）、`src/content/site.tsx`（`nav.back`） |
| 影片网站 | `scripts/build.mjs`（`.bar-back`，只在中英文首页）、`assets/site.js` |

## 验证（2026-10-24）
用 Playwright 把 `https://qinxujunai.github.io/**` 指到六个仓库的本地文件，手机和电脑各跑一遍：从首页点五个出站链接，左上角都出现「‹ 返回」，点了回到首页原来的位置；新开一个浏览器直接打开这五个网站，都没有返回。

## 以后新增一个网站
照上表加一个默认隐藏的 `data-qxj-back` 链接和同样的几行脚本。个人网站这边不用改：只要链接以 `https://qinxujunai.github.io/` 开头就会写入。
