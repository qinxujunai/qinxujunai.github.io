// Renders the whole site from src/: home pages (/ and /en/), one page per case study
// (/work/<slug>/ and /en/work/<slug>/), 404.html and sitemap.xml.
// No runtime dependencies: the output is plain HTML that GitHub Pages serves from main.
import fs from 'node:fs';
import path from 'node:path';
import { content, SITE, GITHUB, VIBECODING } from '../src/content.mjs';
import { CASES } from '../src/cases.mjs';

const read = (f) => fs.readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const stats = JSON.parse(read('src/stats.json'));
const media = JSON.parse(read('src/media.json'));

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Chinese lines may only break between words: segment with ICU and mark break points with <wbr>,
// then CSS (word-break: keep-all) forbids breaks anywhere else. Names and fixed phrases stay whole.
const KEEP = [
  '云南妙妙屋', '几分钟读完', '先读读我的方法', '我是秦徐俊', '做 AI 产品', '内容和运营', '人为什么会用它', '先立边界', '约 18 分钟读完', '读完就能动手', '做 AI 产品', '为什么会用', '一个东西', '剪贴板没核对过', '不算送达', '完整录音', '链接由代码回填', '写不出假链接', '不用显卡', '人台照', '模特图', '也会用 AI 做画面', '开场片', '信息流广告', '涨粉', '人台照', 'AI 模特图', '上身图',
  'AI 进化得越快', '我们越需要慢下来',
  '秦徐俊', '比智科技', '一念智能', '专致网络', '抖音数字学堂', '云南民族大学', '微众银行', '方正证券', '工商银行',
  '阿里巴巴', '影刀 RPA', '万象成文', '小宇宙', '小红书', '公众号', '飞书', '能用的 AI', '用 AI 解决真实的问题', 'AI 问数', 'AI 赋能课程',
  '智能体', '上下文', '自然语言', '许愿池', '爆款案例', '信息流', '回款率', '采购评估', '招投标', '剪贴板', '终稿', '离线',
  '受监督', '子进程', '原生绘制', '浏览器验收', '构建自愈', '原子修改', '计划闸门', '上下文装载', '访谈对话', '想用 AI',
  '我用 AI 做东西', '也把做法分享出来', '都能直接用', '到能用的 AI', '光标处', '每天在用', '再让 AI 动手', '第一行代码', '创造者', '无需登录', '不声明完成', '都跑', '一个字都不丢', '逐字回读', '再把概率压成确定性', '终极浪漫', '数据智能', '数据平台', '智能分析', '金融控股集团', '乡村英才计划', '未来星计划', '冒烟测试', '代码签名', '安全提示',
];
const segmenter = new Intl.Segmenter('zh', { granularity: 'word' });
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const KEEP_RE = KEEP.map((k) => [new RegExp([...k].map(reEsc).join('(?:<wbr>)?'), 'g'), k.replace(/ /g, '\u00a0')]);
function zhText(s) {
  let out = [...segmenter.segment(String(s))].map((x) => esc(x.segment)).join('<wbr>');
  for (const [re, k] of KEEP_RE) out = out.replace(re, k);
  return out
    .replace(/(\d[\d.,]*[%+]?)<wbr> <wbr>(?=[一-鿿A-Za-z])/g, '$1 ') // "3 小时", "10.5 万元"
    .replace(/(\d)<wbr>([–\-./:→])/g, '$1$2').replace(/([–\-./:])<wbr>(\d)/g, '$1$2') // "2026-10-19", "0–10"
    .replace(/<wbr>([，。、；：！？）」』”])/g, '$1')
    .replace(/([（「『“])<wbr>/g, '$1')
    .replace(/<wbr>\s<wbr>/g, ' ');
}
const T = (c, s) => (c.lang === 'zh-CN' ? zhText(s) : esc(s));
// Keep a date such as 2026-10-19 on one line.
const dates = (html) => html.replace(/\d{4}-\d{2}-\d{2}/g, '<span class="nw">$&</span>');

// ---------- Signature ----------
// One page holds the real paths (inside <g id="sig-paths">); every other signature on it is a <use>.
const signatureSvg = read('src/signature.svg').trim();
const sigViewBox = /viewBox="([^"]+)"/.exec(signatureSvg)[1];
const signature = (cls) =>
  signatureSvg
    .replace('<svg xmlns="http://www.w3.org/2000/svg"', `<svg class="${cls}" aria-hidden="true" focusable="false"`)
    .replace('<path', '<g id="sig-paths"><path')
    .replace('<path class="seal"', '</g><g id="sig-seal"><path class="seal"')
    .replace('</svg>', '</g></svg>');
// Small signatures leave the seal out: below ~20px it reads as a red dot.
const signatureRef = (cls, { seal = true } = {}) => `<svg class="${cls}" viewBox="${sigViewBox}" aria-hidden="true" focusable="false"><use href="#sig-paths"/>${seal ? '<use href="#sig-seal"/>' : ''}</svg>`;

const ext = 'rel="noopener"';
const chevron = '<span class="chev" aria-hidden="true">›</span>';

// The stylesheet is inlined so the first screen needs no extra round trip on slow networks.
const css = read('assets/site.css')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,>])\s*/g, '$1')
  .replace(/;}/g, '}')
  .trim();

// Responsive image from src/media.json: smallest as src, every size in srcset.
function img(key, alt, { sizes = '(min-width: 1024px) 560px, 100vw', eager = false, cls = '', mobile = '', priority = '' } = {}) {
  const set = Object.values(media[key]).sort((a, b) => a.w - b.w);
  const base = set[0];
  const tag = `<img${cls ? ` class="${cls}"` : ''} src="${base.src}" srcset="${set.map((s) => `${s.src} ${s.w}w`).join(', ')}" sizes="${sizes}" width="${base.w}" height="${base.h}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : priority ? ` fetchpriority="${priority}"` : ' loading="lazy"'} decoding="async">`;
  if (!mobile) return tag;
  // Phones get a closer crop so interface text stays readable.
  const m = Object.values(media[mobile])[0];
  return `<picture><source media="(max-width: 733px)" srcset="${m.src}" width="${m.w}" height="${m.h}">${tag}</picture>`;
}

// Runs before first paint so the theme never flashes.
const themeScript =
  "<script>(function(){var t=null;try{t=localStorage.getItem('qxj.theme')}catch(e){}" +
  "if(t!=='light'&&t!=='dark'){t=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}" +
  "document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name=theme-color]');" +
  "if(m)m.setAttribute('content',t==='dark'?'#000000':'#ffffff');" +
  "var r=document.documentElement,s=null;r.classList.add('js');" +
  // Scroll-linked motion only when the reader has not asked for less motion.
  "if(!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))r.classList.add('motion');" +
  // If site.js never arrives, show everything instead of leaving faded tiles invisible.
  "setTimeout(function(){if(!window.qxjReady){r.classList.remove('js');r.classList.remove('motion')}},2500);" +
  // Hide the signature before first paint only when it is about to be written; never leave it hidden.
  "try{s=sessionStorage.getItem('qxj.signed')}catch(e){}" +
  "if(s!=='1'&&document.location.pathname.indexOf('/work/')<0&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){r.classList.add('sig-pending');" +
  "setTimeout(function(){r.classList.remove('sig-pending')},3000)}})()</script>";

// Starts the signature right after it is parsed, so it never waits for site.js on a slow network.
// Ink spreads across the name from left to right, out of a soft blur; then the seal is pressed.
const sigStart =
  "(function(){var r=document.documentElement;if(!r.classList.contains('sig-pending'))return;" +
  "document.querySelector('.hero .sig').classList.add('ink');r.classList.remove('sig-pending');" +
  "try{sessionStorage.setItem('qxj.signed','1')}catch(e){}})()";

const icons = {
  sunMoon: `<svg class="theme-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg><svg class="theme-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></svg>`,
};

// ---------- Paths ----------
const home = (c) => c.path;
const other = (c) => content[c.lang === 'zh-CN' ? 'en' : 'zh'];
const casePath = (c, slug) => `${c.path}work/${slug}/`;
const caseOf = (slug) => CASES.find((x) => x.slug === slug);

function head(c, { url, alt, title, description = c.description, noindex = false }) {
  const zhUrl = alt?.zh;
  const enUrl = alt?.en;
  return `<!doctype html>
<html lang="${c.lang}" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#ffffff">
${themeScript}
<style>${css}</style>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${SITE}${url}">
<link rel="alternate" hreflang="zh-CN" href="${SITE}${zhUrl}">
<link rel="alternate" hreflang="en" href="${SITE}${enUrl}">
<link rel="alternate" hreflang="x-default" href="${SITE}${zhUrl}">`}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${SITE}${url}">
<meta property="og:image" content="${SITE}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta itemprop="image" content="${SITE}/share.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="author" content="${esc(c.name)}">
<script src="/assets/site.js" defer></script>
</head>`;
}

const SECTIONS = ['work', 'share', 'path', 'photos', 'contact'];

// Apple-style local nav: signature on the left, sections in the middle, one blue action on the right.
// On the home page the signature here is a reference to the hero's; case pages hold the paths here.
function nav(c, { switchHref, onHome }) {
  const base = onHome ? '' : home(c);
  return `<header class="nav">
<div class="nav-inner">
<a class="nav-sig" href="${onHome ? '#top' : home(c)}" aria-label="${esc(c.name)} · ${esc(c.home)}">${onHome ? signatureRef('sig-mini', { seal: false }) : signature('sig-mini')}</a>
<nav class="nav-links" aria-label="${esc(c.navLabel)}">
${SECTIONS.map((id) => `<a href="${base}#${id}" data-nav="${id}">${c.nav[id]}</a>`).join('\n')}
</nav>
<div class="nav-tools">
<a href="${switchHref}" hreflang="${c.switchLang}" lang="${c.switchLang}">${c.switchLabel}</a>
<button type="button" data-theme-toggle aria-label="${esc(c.themeLabel)}">${icons.sunMoon}</button>
<a class="pill" href="${base}#contact">${c.navWechat}</a>
</div>
</div>
</header>`;
}

function footer(c) {
  return `<footer class="foot">
<div class="foot-inner">
<span>© ${new Date().getFullYear()} ${esc(c.name)}</span>
<span class="colophon">${T(c, c.colophon)}</span>
</div>
</footer>`;
}

// ---------- Home ----------

function hero(c) {
  return `<section class="tile hero" id="top" aria-labelledby="hero-title">
<div class="sig-line">${signature('sig')}</div>
<script>${sigStart}</script>
<h1 id="hero-title" class="rise" style="--d:.7s">${T(c, c.lede)}</h1>
<p class="sub rise" style="--d:.85s">${T(c, c.now)}</p>
<p class="cta rise" style="--d:1s"><a class="pill pill-lg" href="#contact">${c.addWechat}</a><a class="more-link" href="#work">${c.seeWork}${chevron}</a></p>
<p class="hook rise" style="--d:1.1s"><a href="${VIBECODING}" ${ext}>${T(c, c.hook)}${chevron}</a></p>
</section>`;
}

// Splits a line into spans so it can light up as it scrolls by.
// Chinese phrases (split after ，and 、) never break inside, so lines break only at punctuation.
function statement(c, text) {
  if (c.lang !== 'zh-CN') return text.split(/(\s+)/).map((p) => (/^\s+$/.test(p) ? p : `<span>${esc(p)}</span>`)).join('');
  return text.split(/(?<=[，、])/).map((clause) => `<span class="clause">${[...clause].map((ch) => (ch === ' ' ? ' ' : `<span>${esc(ch)}</span>`)).join('')}</span>`).join('');
}

const statValue = (k) => stats.voiceflow[k];
const statText = (v) => esc(typeof v === 'number' ? v.toLocaleString('en-US') : v);
const hostPath = (url) => url.replace(/^https?:\/\//, '').replace(/\?.*$/, '').replace(/\/$/, '');

// A project's own website inside a browser window (a phone on small screens). As the section scrolls
// past, the page inside scrolls from top to bottom, as if someone were leafing through it for you.
// The whole window is a link to the live site.
// Narrow windows (AI Signal) show a page that is itself narrow, like an email.
function frame(c, { key, mobile, alt, url, name }) {
  return `<a class="frame${key === 'site-ai-signal' ? ' narrow' : ''}" href="${url}" ${ext}>
<span class="visually-hidden">${esc(c.openSite(name))}</span>
<span class="frame-bar" aria-hidden="true"><i></i><i></i><i></i><span class="frame-url">${esc(hostPath(url))}</span></span>
<span class="frame-view">${img(key, alt, { sizes: '(max-width: 733px) 250px, 1040px', mobile, cls: 'frame-img' })}</span>
</a>`;
}

// One project, Apple product-page style: name, one line, two links, then its website in a window.
// With motion allowed, the stage pins while the page inside the window scrolls.
// Only the flagship pins (data-show); the others leaf through their page as they pass (data-scrollshot).
function showcase(c, { id, tone, name, line, note, site, siteLabel, caseUrl, image, alt, extra = '', pin = false }) {
  return `<article class="show ${tone}" id="${id}" aria-labelledby="${id}-title">
<div class="show-track" ${pin ? 'data-show' : 'data-scrollshot'}>
<div class="show-stage">
<div class="show-head">
<h3 id="${id}-title" class="show-name">${esc(name)}</h3>
${line ? `<p class="show-line">${T(c, line)}</p>` : ''}
${note ? `<p class="show-note">${T(c, note)}</p>` : ''}
<p class="cta"><a class="more-link" href="${site}" ${ext}>${esc(siteLabel)}${chevron}<span class="visually-hidden"> ${esc(name)}</span></a>${caseUrl ? `<a class="more-link" href="${caseUrl}">${c.readCase}${chevron}<span class="visually-hidden"> ${esc(name)}</span></a>` : ''}</p>
</div>
${frame(c, { key: image.key, mobile: image.mobile, alt, url: site, name })}
</div>
</div>
${extra}
</article>`;
}

// VoiceFlow's extra: the capsule types real lines at the product's own rhythm, and live GitHub numbers.
function voiceflowExtra(c) {
  const f = c.flagship;
  return `<div class="show-extra">
<div class="demo" aria-hidden="true">
<kbd>${esc(f.key)}</kbd>
<div class="capsule"><span class="bars"><i></i><i></i><i></i></span><span class="typed" data-lines="${esc(JSON.stringify(f.lines))}">${esc(f.lines[0])}</span><span class="caret"></span></div>
<p class="hint">${esc(f.hint)}</p>
</div>
<dl class="facts reveal">
${['stars', 'downloads', 'forks', 'version'].map((k) => {
  const v = statValue(k);
  return `<div><dt>${T(c, f.facts[k])}</dt><dd${typeof v === 'number' ? ` data-count="${v}"` : ''}>${statText(v)}</dd></div>`;
}).join('\n')}
</dl>
<p class="footnote">${dates(T(c, f.factsNote(stats.voiceflow.updated)))}</p>
</div>`;
}

const TONES = { voiceflow: 'dark flagship', 'ai-signal': 'soft', wanxiang: 'plain' };

function projectShow(c, cs) {
  const t = cs[c.lang === 'zh-CN' ? 'zh' : 'en'];
  return showcase(c, {
    id: cs.slug,
    tone: TONES[cs.slug],
    name: t.name,
    line: t.title,
    note: t.note,
    site: t.links[0][1],
    siteLabel: cs.slug === 'ai-signal' ? t.links[0][0] : c.visit,
    caseUrl: casePath(c, cs.slug),
    image: cs.image,
    alt: t.imageAlt,
    extra: cs.slug === 'voiceflow' ? voiceflowExtra(c) : '',
    pin: cs.slug === 'voiceflow',
  });
}

function work(c) {
  return `<section id="work" class="works" aria-labelledby="work-title">
<h2 id="work-title" class="visually-hidden">${c.workTitle}</h2>
${CASES.map((cs) => projectShow(c, cs)).join('\n')}
</section>`;
}

// Sharing: his own words light up as you scroll, what you get from ai.vibecoding, and the site itself.
function share(c) {
  const s = c.share;
  return `<section id="share" class="share" aria-labelledby="share-title">
<div class="tile dark statement" data-statement>
<p class="eyebrow">${s.title}</p>
<h2 class="pull" id="share-title">${statement(c, s.quote)}</h2>
<p class="share-intro reveal">${T(c, s.intro)}</p>
<ul class="principles reveal">
${s.principles.map((p) => `<li><h3>${T(c, p.title)}</h3><p>${T(c, p.body)}</p></li>`).join('\n')}
</ul>
</div>
${showcase(c, {
  id: 'vibecoding', tone: 'dark', name: s.name, line: '', note: s.note,
  site: VIBECODING, siteLabel: s.link, caseUrl: '',
  image: { key: 'site-vibecoding', mobile: 'site-vibecoding-m' },
  alt: c.lang === 'zh-CN' ? 'ai.vibecoding 网站：用自然语言，创造可运行的作品' : 'The ai.vibecoding website (in Chinese): use natural language to create working products',
})}
</section>`;
}

function journey(c) {
  return `<section class="tile soft" id="path" aria-labelledby="path-title">
<div class="reveal">
<p class="eyebrow">${c.pathTitle}</p>
<h2 id="path-title">${T(c, c.pathHeadline)}</h2>
</div>
<ol class="path reveal">
${c.journey.map((p) => `<li${p.light ? ' class="light"' : ''}><span class="when">${esc(p.when)}</span><div><h3>${T(c, p.role)}</h3><p class="org">${T(c, p.org)}</p>${p.desc ? `<p class="what">${T(c, p.desc)}</p>` : ''}</div></li>`).join('\n')}
</ol>
</section>`;
}

// Photos load early and at low priority: inside a horizontal scroller, lazy images could stay blank in WeChat.
function photos(c) {
  return `<section class="tile plain" id="photos" aria-labelledby="photos-title">
<div class="reveal">
<p class="eyebrow">${c.photosTitle}</p>
<h2 id="photos-title">${T(c, c.photosHeadline)}</h2>
<p class="sub">${T(c, c.photosIntro)}</p>
</div>
<ul class="gallery" data-gallery tabindex="0" aria-label="${esc(c.photosTitle)}">
${c.photos.map((p) => `<li${p.tall ? ' class="tall"' : ''}><figure>${img(p.key, p.alt, { sizes: '(min-width: 734px) 860px, 540px', priority: 'low' })}${p.caption ? `<figcaption>${T(c, p.caption)}</figcaption>` : ''}</figure></li>`).join('\n')}
</ul>
<p class="paddles"><button type="button" data-prev aria-label="${esc(c.prev)}"><span aria-hidden="true">‹</span></button><button type="button" data-next aria-label="${esc(c.next)}"><span aria-hidden="true">›</span></button></p>
</section>`;
}

// The ending: a thank-you, one action, and his own last line. The QR code is a real image WeChat can
// long-press; "Save" downloads the same card as a PNG (built by scripts/icons.mjs).
function contact(c) {
  const lang = c.lang === 'zh-CN' ? 'zh' : 'en';
  return `<section class="tile soft ending" id="contact" aria-labelledby="contact-title">
<div class="reveal">
<h2 id="contact-title">${T(c, c.contactHeadline)}</h2>
<p class="sub">${T(c, c.contactLead)}</p>
</div>
<div class="namecard-stage">
<div class="namecard" role="group" aria-label="${esc(c.cardLabel)}" data-tilt>
<div class="nc-top">${signatureRef('nc-sig')}${img('avatar', '', { sizes: '56px', cls: 'nc-avatar' })}</div>
<div class="nc-bottom">
<div class="nc-id"><p class="nc-name">${esc(c.name)}</p><p class="nc-role">${T(c, c.role)}</p><p class="nc-org">${T(c, c.org)}</p></div>
<div class="nc-qr"><img class="qr" src="/assets/wechat-qr.png" width="232" height="232" alt="${esc(c.qrAlt)}" decoding="async"></div>
</div>
</div>
</div>
<p class="qr-hint" data-qr-hint data-hint-wechat="${esc(c.hint.wechat)}" data-hint-phone="${esc(c.hint.phone)}" data-hint-desktop="${esc(c.hint.desktop)}">${esc(c.hint.default)}</p>
<p class="cta"><a class="more-link" href="/assets/card-${lang}.png" download="qin-xujun-card.png" data-qr-save>${c.save}${chevron}</a></p>
<p class="closing-line reveal"><span class="closing-lead">${T(c, c.closing[0])}</span>${T(c, c.closing[1])}</p>
</section>`;
}

// Used on project pages for "other work".
function caseCard(c, cs) {
  const t = cs[c.lang === 'zh-CN' ? 'zh' : 'en'];
  return `<article class="card-tile product-card reveal">
<p class="eyebrow">${esc(t.name)}</p>
<h3><a href="${casePath(c, cs.slug)}">${T(c, t.title)}</a></h3>
<p class="card-line">${T(c, t.note)}</p>
<p class="card-more" aria-hidden="true">${c.readCase}${chevron}</p>
</article>`;
}

function homePage(c) {
  const o = other(c);
  return `${head(c, { url: c.path, alt: { zh: '/', en: '/en/' }, title: c.title })}
<body class="home">
<a class="skip" href="#main">${c.skip}</a>
${nav(c, { switchHref: o.path, onHome: true })}
<main id="main">
${hero(c)}
${work(c)}
${share(c)}
${journey(c)}
${photos(c)}
${contact(c)}
</main>
${footer(c)}
</body>
</html>
`;
}

// ---------- Case pages ----------

function flow(c, stages) {
  return `<ol class="flow">
${stages.map((s, i) => `<li class="reveal"><p class="flow-t"><span class="flow-i" aria-hidden="true">${i + 1}</span>${T(c, s.t)}</p><ul>${s.n.map((n) => `<li>${T(c, n)}</li>`).join('')}</ul></li>`).join('\n')}
</ol>`;
}

function block(c, s, i) {
  const L = c.caseLabels;
  const parts = [];
  for (const p of s.p ?? []) parts.push(`<p>${T(c, p)}</p>`);
  if (s.metrics) parts.push(`<ul class="metrics">${s.metrics.map((m) => `<li><span class="m-v">${esc(m.v)}</span><span class="m-l">${T(c, m.l)}</span><span class="m-g">${T(c, m.g)}</span></li>`).join('')}</ul>`);
  if (s.flow) parts.push(flow(c, s.flow));
  if (s.scope) parts.push(`<div class="scope"><div><h3>${L.doLabel}</h3><ul class="yes">${s.scope.do.map((x) => `<li>${T(c, x)}</li>`).join('')}</ul></div><div><h3>${L.dontLabel}</h3><ul class="no">${s.scope.dont.map((x) => `<li>${T(c, x)}</li>`).join('')}</ul></div></div>`);
  if (s.table) {
    const [, why, gave] = s.table.head;
    parts.push(`<ul class="choices">${s.table.rows.map(([d, w, g]) => `<li><h3>${T(c, d)}</h3><p><span class="k">${T(c, why)}</span>${T(c, w)}</p><p><span class="k">${T(c, gave)}</span>${T(c, g)}</p></li>`).join('')}</ul>`);
  }
  if (s.list) parts.push(`<ul class="bullets">${s.list.map((x) => `<li>${T(c, x)}</li>`).join('')}</ul>`);
  if (s.timeline) parts.push(`<ol class="timeline">${s.timeline.map(([w, x]) => `<li><span class="when">${esc(w)}</span><span>${T(c, x)}</span></li>`).join('')}</ol>`);
  for (const p of s.after ?? []) parts.push(`<p>${T(c, p)}</p>`);
  return `<section class="case-sec" id="s${i + 1}" aria-labelledby="s${i + 1}-title">
<h2 id="s${i + 1}-title">${T(c, s.h)}</h2>
${parts.join('\n')}
</section>`;
}

function casePage(c, cs) {
  const lang = c.lang === 'zh-CN' ? 'zh' : 'en';
  const t = cs[lang];
  const L = c.caseLabels;
  const o = other(c);
  const url = casePath(c, cs.slug);
  const live = t.results.some((r) => r.stat);
  const related = CASES.filter((x) => x.slug !== cs.slug);
  return `${head(c, {
    url,
    alt: { zh: casePath(content.zh, cs.slug), en: casePath(content.en, cs.slug) },
    title: `${t.name}：${t.title.replace(/[。.]$/, '')} · ${c.name}`.replace('：', lang === 'en' ? ': ' : '：'),
    description: t.sub,
  })}
<body class="case-page">
<a class="skip" href="#main">${c.skip}</a>
${nav(c, { switchHref: casePath(o, cs.slug), onHome: false })}
<main id="main">
<article class="case" aria-labelledby="case-title">
<header class="tile plain case-head">
<nav class="crumb" aria-label="${esc(L.crumb)}"><a href="${home(c)}#work">${L.crumb}</a>${chevron}<span aria-current="page">${esc(t.name)}</span></nav>
${t.kind ? `<p class="eyebrow">${T(c, t.kind)}</p>` : ''}
<h1 id="case-title">${T(c, t.title)}</h1>
<p class="sub">${T(c, t.sub)}</p>
${t.links ? `<p class="cta">${t.links.map(([label, href]) => `<a class="more-link" href="${href}" ${ext}>${esc(label)}${chevron}<span class="visually-hidden"> ${esc(t.name)}</span></a>`).join('')}</p>` : ''}
${cs.image ? `<div class="case-frame" data-scrollshot>${frame(c, { key: cs.image.key, mobile: cs.image.mobile, alt: t.imageAlt, url: t.links[0][1], name: t.name })}</div>` : ''}
</header>
<section class="tile dark results" aria-labelledby="results-title">
<h2 class="visually-hidden" id="results-title">${L.results}</h2>
<dl class="facts">
${t.results.map((r) => {
  const v = r.stat ? statValue(r.stat) : r.v;
  return `<div><dt>${T(c, r.l)}</dt><dd${typeof v === 'number' ? ` data-count="${v}"` : ''}>${statText(v)}</dd></div>`;
}).join('\n')}
</dl>
${live ? `<p class="footnote">${dates(T(c, L.liveNote(stats.voiceflow.updated)))}</p>` : ''}
</section>
<div class="case-body">
<aside class="case-facts" aria-labelledby="facts-title">
<h2 id="facts-title">${L.facts}</h2>
<dl>
${t.facts.map(([k, v]) => `<div><dt>${T(c, k)}</dt><dd>${T(c, v)}</dd></div>`).join('\n')}
</dl>
</aside>
<div class="case-main">
${t.sections.map((s, i) => block(c, s, i)).join('\n')}
</div>
</div>
</article>
<section class="tile soft more-cases" aria-labelledby="more-title">
<h2 id="more-title">${L.more}</h2>
<div class="card-grid two">
${related.map((x) => caseCard(c, x)).join('\n')}
</div>
</section>
<section class="tile dark case-cta" aria-labelledby="cta-title">
<h2 id="cta-title">${T(c, L.contactHeadline)}</h2>
${L.contactBody ? `<p class="sub">${T(c, L.contactBody)}</p>` : ''}
<p class="cta"><a class="pill pill-lg" href="${home(c)}#contact">${c.addWechat}</a></p>
</section>
</main>
${footer(c)}
</body>
</html>
`;
}

function notFound() {
  const zh = content.zh;
  const en = content.en;
  return `${head(zh, { url: '/404.html', title: `${zh.notFound.title} · ${zh.name}`, noindex: true })}
<body>
<main class="tile hero lost" id="main">
<h1>${zh.notFound.title}</h1>
<p class="sub">${zh.notFound.body}</p>
<p class="sub" lang="en">${en.notFound.title}. ${en.notFound.body}</p>
<p class="cta"><a class="pill pill-lg" href="/">${zh.notFound.back}</a><a class="more-link" href="/en/" lang="en">${en.notFound.back}${chevron}</a></p>
</main>
</body>
</html>
`;
}

// ---------- Write ----------
const pages = [];
const write = (file, html) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  pages.push(file);
};
write('index.html', homePage(content.zh));
write('en/index.html', homePage(content.en));
for (const cs of CASES) {
  write(`work/${cs.slug}/index.html`, casePage(content.zh, cs));
  write(`en/work/${cs.slug}/index.html`, casePage(content.en, cs));
}
write('404.html', notFound());

const pairs = [['/', '/en/'], ...CASES.map((cs) => [casePath(content.zh, cs.slug), casePath(content.en, cs.slug)])];
fs.writeFileSync(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pairs.map(([z, e]) => `<url><loc>${SITE}${z}</loc><xhtml:link rel="alternate" hreflang="en" href="${SITE}${e}"/></url>
<url><loc>${SITE}${e}</loc><xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE}${z}"/></url>`).join('\n')}
</urlset>
`,
);
for (const f of pages) console.log(f, `${(fs.statSync(f).size / 1024).toFixed(1)}KB`);
