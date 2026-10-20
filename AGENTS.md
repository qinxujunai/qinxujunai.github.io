# AGENTS.md

秦徐俊的个人网站，同时是他的 AI 解决方案作品集。一个在手机或微信里点开链接的人，30 秒内要能做到四件事：知道他是谁，看到他做过的东西，加上他的微信，记住一句话「从一句话，到能用的 AI」。

网站要展示他怎么思考、做了什么；每个项目都展开讲清楚：为什么做、难在哪、架构、取舍、证据。视觉对标 apple.com，案例页结构参考 Anthropic 和 Stripe 的客户案例。

项目的来龙去脉、他的原话、历次决策，都记在 [CLAUDE.md](CLAUDE.md)。文案平台见 [docs/copy.md](docs/copy.md)。

## 事实
- **纯静态**：页面由 `scripts/build.mjs` 生成，不要手改。生成的文件有：
  - `index.html`、`en/index.html`
  - `work/<slug>/index.html`、`en/work/<slug>/index.html`
  - `404.html`、`sitemap.xml`
- **文字的位置**：
  - 首页文字在 `src/content.mjs`；
  - 六个案例在 `src/cases.mjs`，每个数字旁边都注明出处；
  - 图片清单在 `src/media.json`，由 `scripts/media.mjs` 生成。
  - 改完文字，运行 `npm run build`，再提交生成的页面。
- **样式与脚本**：
  - 样式只写在 `assets/site.css`，构建时内联进页面。颜色都是 `:root` 变量；深色主题在 `[data-theme='dark']`；黑色磁贴用 `.dark` 局部覆盖变量。
  - 脚本只写在 `assets/site.js`。
- **发布**：GitHub Pages 直接从 `main` 的根目录发布，不经过构建 Action。`.nojekyll` 必须保留。
- **首页结构**：
  1. 本地导航：签名、案例 / 思考 / 方法 / 经历 / 联系、加微信。
  2. 首屏。
  3. 案例：VoiceFlow 黑色旗舰磁贴；AI Signal 和万象成文两张产品卡；三张方案卡（比智、一念、微众）。
  4. 思考：滚动点亮的标题、他的原话、三种能力。
  5. 方法：他写的六步管线。
  6. 经历。
  7. 影像。
  8. 联系：名片，含二维码和「保存名片」。
- **案例页结构**：
  1. 面包屑。
  2. 结论式标题。
  3. 产品截图。
  4. 黑色关键结果条。
  5. 左侧项目信息（桌面端吸顶）。
  6. 分节正文。区块类型有：`p`、`metrics`、`flow`（架构或流程）、`scope`（做 / 不做）、`table`（决定 / 原因 / 放弃的方案）、`list`、`timeline`、`after`。
  7. 更多案例。
  8. 加微信。
- **VoiceFlow 数据**：star、下载、fork、最新版本来自 `src/stats.json`。`.github/workflows/stats.yml` 每 6 小时运行一次 `scripts/stats.mjs`，重建页面，只在数字有变化时提交。不要手改这些数字。
- **签名**：
  - `src/signature.svg` 由 `scripts/signature.mjs` 生成：把 OFL 字体 Ma Shan Zheng（马善政楷书）的字形转成路径，按落款排布（「秦」略大；布局 `kai`）。
  - 末尾有一方红底白字的「徐俊」印（白字下垫纸色底），用 Noto Serif SC 切出，边缘做了残破处理，带 `class="seal"`。
  - 每页只有一处保留真实路径，放在 `<g id="sig-paths">` 里；其余位置用 `<use href="#sig-paths">` 引用。
  - 拿到本人手写签名后可以替换，但要保持每个字一个 `<path>`，印章单独一个 `path.seal`。
- **图片**：
  - 运行 `npm run media -- <源目录> [名字…]` 生成 `assets/media/*.webp`。带名字时只重建这几张，并合并进 `src/media.json`。
  - 源图不进仓库，见 `scripts/media.mjs` 顶部说明。
- **图标、分享图、名片 PNG**：`npm run icons` 生成。名片里嵌的是 `assets/wechat-qr.png`，换二维码后必须重新生成。

## 红线
- **真实**：
  - 不编造成就、数字、客户、logo、推荐语。
  - 新增事实必须来自本人的话、他的仓库、简历或他的回答，并在 `src/cases.mjs` 注释里写明出处。
  - 引用「他的原话」时，只能用他本人提交的原文（ai.vibecoding 2026-05 的提交，清单见 CLAUDE.md）。2026-10 由 Claude 改写的内容不算他的话。
  - VoiceFlow 不写简历里的「识别成功率 98%+」：仓库规定，语料不够时不宣称准确率。
- **客户名**：
  - 可以写简历里出现过的客户名和项目金额：微众银行、工商银行、方正证券、阿里巴巴、影刀 RPA。
  - 简历没写名字的客户，只写「金融控股集团」「通信与政企客户」。
  - 不放客户 logo 图形。
- **隐私**：
  - 不出现手机号、邮箱、薪资、年龄、毕业年份；不提交简历。
  - 联系方式只用微信二维码 `assets/wechat-qr.png`，换图后必须还能被解码（`npm run qa` 会检查）。
  - 摄影只用风景、建筑、静物，不放他人正脸，不放品牌 logo。
- **零外部请求**：不加外部字体、统计、CDN、嵌入。字体只用系统字体：PingFang / SF / 各平台黑体。
- **Apple 式的克制**：
  - 居中的磁贴，大而紧的半粗标题，蓝色文字链接配 ›。
  - 只有一种蓝色主按钮，就是「加我微信」。
  - 允许的动效只有这些，并且全部遵守「减少动效」设置：签名逐字书写与落印、VoiceFlow 胶囊打字、数字计数、标题随滚动逐字点亮、磁贴首次进入时的轻微浮现、画廊翻页、桌面端名片轻微倾斜。
  - 不加新的渐变、全大写标签、等宽小标签。
- **口吻**（详见 docs/copy.md）：
  - 冷静、具体，用数字代替形容词。
  - 不用「赋能、打造、极致、顶级、助力、颠覆」，引用他的原文时除外。
  - 每个案例都要写「还差什么」。

## 完成的定义
```bash
npm install            # 仅开发工具
npm run build
npm run check          # 15 个页面最新、中英结构一致、隐私扫描、同源资源、站内链接可达、体积预算
npm run serve &        # http://127.0.0.1:4173
npm run qa             # 首页：中/英 × 深/浅 × 三种视口；案例页：中/英 × 手机浅色、桌面深色
                       # 检查 0 报错、0 跨域请求、axe AA 0 违规、无横向溢出、磁贴可见、
                       # 弱网 LCP < 2.5s、无 JS、减少动效、二维码与名片可解码
CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npx lighthouse http://127.0.0.1:4173/   # 移动端四项 ≥ 95（本地 SEO 因 canonical 指向线上会略低）
```
推送后，对线上再跑一次：`npm run qa -- https://qinxujunai.github.io`。
