# qinxujunai.github.io

秦徐俊的个人网站：https://qinxujunai.github.io/ （English: https://qinxujunai.github.io/en/）

一页，中英双语，深浅色，零框架，零外部请求，视觉对标 apple.com：首屏是他写下的一句话和签名；产品磁贴陈列 VoiceFlow（GitHub 数据每天自动更新）、万象成文与 ai.vibecoding；之后是他在意的事、经历、他拍的照片，最后可以长按二维码加微信。

## 修改
- 文字：`src/content.mjs`，然后 `npm run build`。
- 样式：`assets/site.css`；脚本：`assets/site.js`。
- 图片：`npm run media -- <源目录>`（见 `scripts/media.mjs` 顶部说明）。
- 签名、图标与分享图：`scripts/signature.mjs`、`npm run icons`。

协作规则与验收命令见 [AGENTS.md](AGENTS.md)。

## 致谢
签名字形来自 [Liu Jian Mao Cao](https://github.com/googlefonts/liujianmaocao)（SIL Open Font License 1.1），在构建时转为路径，网页不加载字体文件。产品画面来自 [VoiceFlow](https://github.com/qinxujunai/VoiceFlow)、[万象成文](https://github.com/qinxujunai/Audio2Text)、[ai.vibecoding](https://github.com/qinxujunai/qinxujun-ai-vibecoding)。照片均为本人拍摄。
