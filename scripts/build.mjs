// Renders the whole site from src/: home pages (/ and /en/), one page per case study
// (/work/<slug>/ and /en/work/<slug>/), 404.html and sitemap.xml.
// No runtime dependencies: the output is plain HTML that GitHub Pages serves from main.
import fs from 'node:fs';
// The script URL carries a hash of its content, so a page never runs with a stale cached script (2026-10-24).
const JS_VERSION = (await import('node:crypto')).createHash('sha256').update(fs.readFileSync('assets/site.js')).digest('hex').slice(0, 10);
import path from 'node:path';
import { content, SITE, GITHUB, VIBECODING } from '../src/content.mjs';
import { CASES } from '../src/cases.mjs';

const read = (f) => fs.readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const stats = JSON.parse(read('src/stats.json'));
// Today's AI Signal issue, refreshed every morning by scripts/signal.mjs (the home page card).
const signal = JSON.parse(read('src/signal.json'));
const media = JSON.parse(read('src/media.json'));

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Chinese lines may only break between words: segment with ICU and mark break points with <wbr>,
// then CSS (word-break: keep-all) forbids breaks anywhere else. Names and fixed phrases stay whole.
const KEEP = [
  '按 F2 说话，文字直接打在光标处', '最后 4 张是实拍', 'AI 视频工具',
  '文章链接', '写成了一个网站', '零基础也能读', '值得看的', '一页读完', '里面的文字', '文字直接打在光标处',
  '让 AI 负责拆解、生成与验证', '让人守住目标、边界与品味', '用自然语言', '创造可运行的作品',
  '云南妙妙屋', '几分钟读完', '先读读我的方法', '我是秦徐俊', '做 AI 产品', '内容和运营', '人为什么会用它', '先立边界', '约 18 分钟读完', '读完就能动手', '做 AI 产品', '为什么会用', '一个东西', '剪贴板没核对过', '不算送达', '完整录音', '链接由代码回填', '写不出假链接', '不用显卡', '人台照', '模特图', '也会用 AI 做画面', '开场片', '信息流广告', '涨粉', '人台照', 'AI 模特图', '上身图',
  'AI 进化得越快', '我们越需要慢下来',
  'easy-vibe', 'ai.vibecoding', '凯圣王', '谭成义', '三分化', '杰克叔叔', '鲁大魔', '天行健', '日拱一卒', '功不唐捐', 'ChatGPT', '能量边界', '学技能', '内容运营',
  '秦徐俊', '比智科技', '一念智能', '专致网络', '抖音数字学堂', '云南民族大学', '微众银行', '方正证券', '工商银行',
  '阿里巴巴', '影刀 RPA', '万象成文', '小宇宙', '小红书', '公众号', '飞书', '能用的 AI', '用 AI 解决真实的问题', 'AI 问数', 'AI 赋能课程',
  '智能体', '上下文', '自然语言', '许愿池', '爆款案例', '信息流', '回款率', '采购评估', '招投标', '剪贴板', '终稿', '离线',
  '受监督', '子进程', '原生绘制', '浏览器验收', '构建自愈', '原子修改', '计划闸门', '上下文装载', '访谈对话', '想用 AI',
  '我用 AI 做东西', '也把想法分享出来', '都能直接用', '到能用的 AI', '光标处', '每天在用', '再让 AI 动手', '第一行代码', '创造者', '无需登录', '不声明完成', '都跑', '一个字都不丢', '逐字回读', '再把概率压成确定性', '终极浪漫', '数据智能', '数据平台', '智能分析', '金融控股集团', '乡村英才计划', '未来星计划', '冒烟测试', '代码签名', '安全提示',
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
    .replace(/<wbr>(\s)<wbr>/g, '$1');
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
// Links that leave this site end in ↗; links that stay end in ›. Images only ever lead to pages on this site.
const outward = '<span class="chev out" aria-hidden="true">↗</span>';

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

function head(c, { url, alt, title, description = c.description, noindex = false, preload = [] }) {
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
${preload.map((k) => `<link rel="preload" as="image" href="${Object.values(media[k])[0].src}" media="(max-width: 733px)" fetchpriority="high">`).join('\n')}
${url === c.path ? `<link rel="preload" as="image" href="/assets/media/film-key-960.webp" imagesrcset="/assets/media/film-key-960.webp 960w, /assets/media/film-key-2560.webp 2560w" imagesizes="(min-width: 1100px) 980px, calc(100vw - 40px)" fetchpriority="high">` : ''}
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
<script src="/assets/site.js?v=${JS_VERSION}" defer></script>
</head>`;
}

const SECTIONS = ['work', 'share', 'three', 'contact'];

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

// Case pages: an apple.com-style product bar instead of the site nav. Back to the work on the home page,
// the project's name (to the top), the main sections on wide screens, and the project's website one tap away.
function caseNav(c, cs, t, switchHref) {
  const L = c.caseLabels;
  // Shortcuts: the story chapters and 「还差什么」, by their short `nav` names; the details stay out of the bar.
  const picks = t.sections.map((s, i) => ({ h: s.nav, id: `s${i + 1}` })).filter((s) => s.h);
  return `<header class="nav subnav">
<div class="nav-inner">
<a class="sub-back" href="${home(c)}#${cs.slug}"><span aria-hidden="true">‹</span><span class="sub-back-label">${L.crumb}</span><span class="visually-hidden"> · ${esc(c.name)}</span></a>
<a class="sub-name" href="#top">${esc(t.name)}</a>
<nav class="sub-links" aria-label="${esc(L.onPage)}">
${picks.map((p) => `<a href="#${p.id}" data-nav="${p.id}">${T(c, p.h)}</a>`).join('\n')}
</nav>
<div class="nav-tools">
<a class="sub-lang" href="${switchHref}" hreflang="${c.switchLang}" lang="${c.switchLang}">${c.switchLabel}</a>
<button type="button" class="sub-theme" data-theme-toggle aria-label="${esc(c.themeLabel)}">${icons.sunMoon}</button>
<a class="pill" href="${t.links[0][1]}" ${ext}>${esc(c.open(t.name))} ↗</a>
</div>
</div>
</header>`;
}

function footer(c) {
  return `<footer class="foot">
<div class="foot-inner">
<span>© ${new Date().getFullYear()}</span>
</div>
</footer>`;
}

// ---------- Home ----------

// The title is his: two clauses, one per line. In Chinese the comma between them goes (his note,
// v20: with the comma the two lines look lopsided); English keeps its comma.
// A Chinese headline in two lines, split where its comma was (he found the comma lopsided, v20).
function lines(c, text) {
  if (c.lang !== 'zh-CN') return T(c, text);
  return text.split('，').map((part) => `<span class="line">${T(c, part)}</span>`).join('');
}
const heroTitle = (c) => lines(c, bare(c.lede));

// A Chinese line that may wrap only after its punctuation, never inside a phrase.
// v26.11: in centred lines the comma at a clause end goes (his rule: punctuation at a line end spoils centred text);
// clauses are joined by a plain space, a small gap on one line that vanishes where the line wraps.
// Centred lines (plain = true) drop the comma or 、 at a clause end; left-aligned sentences on case pages keep theirs.
const clauses = (c, text, plain = false) => {
  if (c.lang !== 'zh-CN') return T(c, text);
  if (!plain) return text.split(/(?<=[，：；])/).map((x) => `<span class="clause">${T(c, x)}</span>`).join('');
  // plain === 'list' keeps 、 (sentences that list things); otherwise a short centred line also drops a closing 、.
  const at = plain === 'list' ? /(?<=[，：；])/ : /(?<=[，：；、])/;
  return text.split(at).map((x) => `<span class="clause">${T(c, x.replace(/[，、]$/, ''))}</span>`).join(' ');
};

function hero(c) {
  return `<section class="tile hero" id="top" aria-labelledby="hero-title">
${img('avatar', c.portraitAlt, { sizes: '72px', eager: true, cls: 'avatar rise' })}
<div class="sig-line">${signature('sig')}</div>
<script>${sigStart}</script>
<p class="visually-hidden">${esc(c.name)}</p>
<h1 id="hero-title" class="rise" style="--d:.5s">${heroTitle(c)}</h1>
<p class="sub rise" style="--d:.65s">${clauses(c, bare(c.now), 'list')}</p>
<p class="cta rise" style="--d:.8s"><a class="pill pill-lg" href="#contact">${c.addWechat}</a><a class="more-link" href="#work">${c.seeWork}${chevron}</a></p>
${heroFilm(c)}
</section>`;
}

// His film, playable right in the first screen (v23). The file lives once, in the film's own repository on this
// same origin (/too-late-to-love-you/), so the page still makes no third-party request. Nothing downloads until Play:
// every screen plays his 4K web version (about 7 Mbps); the 14 Mbps original stalled on desktop over slow links.
const FILM = '/too-late-to-love-you/media/';
function heroFilm(c) {
  const f = c.film;
  return `<figure class="hero-film">
<div class="film-screen" id="film-watch"><video id="film" controls playsinline preload="none" poster="/assets/media/film-key-960.webp" width="960" height="540" aria-label="${esc(f.name)}" src="${FILM}film-mobile.mp4"></video>
<button class="film-cover" type="button" data-film-play hidden aria-label="${esc(f.play)}"><img src="/assets/media/film-key-960.webp" srcset="/assets/media/film-key-960.webp 960w, /assets/media/film-key-2560.webp 2560w" sizes="(min-width: 1100px) 980px, calc(100vw - 40px)" width="960" height="540" alt="${esc(f.alt)}" fetchpriority="high" decoding="async"><span class="film-disc" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M6 3.5v13l10.5-6.5Z" fill="currentColor"/></svg></span></button></div>
<figcaption><span class="film-name">${esc(f.name)}</span><span class="film-meta">${T(c, f.meta)}</span><a class="more-link" href="${esc(f.url)}" ${ext}>${esc(f.link)}${outward}</a></figcaption>
</figure>`;
}

// Splits a line into spans so it can light up as it scrolls by.
// Chinese phrases (split after ，and 、) never break inside, so lines break only at punctuation.
function statement(c, text) {
  if (c.lang !== 'zh-CN') return text.split(/(\s+)/).map((p) => (/^\s+$/.test(p) ? p : `<span>${esc(p)}</span>`)).join('');
  return text.split(/(?<=[，、])/).map((clause) => `<span class="clause">${[...clause.replace(/，$/, '')].map((ch) => (ch === ' ' ? ' ' : `<span>${esc(ch)}</span>`)).join('')}</span>`).join(' ');
}

const statValue = (slug, k) => stats[slug][k];
const statText = (v) => esc(typeof v === 'number' ? v.toLocaleString('en-US') : v);
const hostPath = (url) => url.replace(/^https?:\/\//, '').replace(/\?.*$/, '').replace(/\/$/, '');

// Headlines and one-line copy carry no closing full stop (his rule: fewer marks, easier on the eye).
const bare = (s) => String(s).replace(/[。.]\s*$/, '');
// In a list like 「A · B · C」 a line may break after a dot, never before it, and never inside an item.
const dots = (c, s) => bare(s).split(' · ').map((x) => `<span class="clause">${T(c, x)}</span>`).join('\u00a0· ');

// A still picture: a project's website at its first screen, or the product at work. No browser chrome
// (a fake window inside this site read as "another site in the site"). Phones get their own crop.
// With href, the picture is a link to the project's page on this site; it never leads off the site.
function frame(c, { key, alt, href, label, first = false, whole = false }) {
  const tag = href ? 'a' : 'div';
  // A product at work is shown a little smaller than a whole website, so it fits one screen with its name.
  return `<${tag} class="frame${key.startsWith('site-prod-') ? ' prod' : ''}"${href ? ` href="${href}"` : ''}>
${href ? `<span class="visually-hidden">${esc(label)}</span>` : ''}
<span class="frame-view">${img(key, alt, { sizes: '1040px', mobile: whole ? '' : `${key}-card`, cls: 'frame-img', eager: first })}</span>
</${tag}>`;
}

// One project, two levels of text above the picture (name, one plain line), the rest below it
// (his reason, what makes it dependable, plain facts and links).
// VoiceFlow's picture on the home page is the product itself: the capsule writing as you speak.
function capsuleLink(c, href, name) {
  return `<a class="demo-link" href="${href}"><span class="visually-hidden">${esc(`${c.readCase} ${name}`)}</span>${voiceflowDemo(c)}</a>`;
}

// AI Signal at work: today's issue as live text, not a screenshot, so it is never out of date (v24).
// The issue is in Chinese on both language versions, so the card is marked lang="zh-CN".
function signalCard(c, href, name) {
  const s = signal;
  const zh = { lang: 'zh-CN' };
  return `<a class="signal-card" href="${href}" lang="zh-CN"><span class="visually-hidden" lang="${c.lang}">${esc(`${c.readCase} ${name}`)}</span>
<span class="sc-when">第 ${s.number} 期 · ${esc(s.dateLabel)}</span>
<span class="sc-head">${T(zh, s.headline)}</span>
${s.intro ? `<span class="sc-intro">${T(zh, s.intro)}</span>` : ''}
<span class="sc-meta">从 ${s.scanned} 条新内容里选了 ${s.picked} 条 · 约 ${s.minutes} 分钟读完</span>
${s.tldr.length ? `<span class="sc-tldr"><span class="sc-tldr-label">30 秒读完</span>${s.tldr.map((t, i) => `<span class="sc-item"><span class="sc-n">${i + 1}</span><span>${T(zh, t)}</span></span>`).join('')}</span>` : ''}
</a>`;
}

function showcase(c, { id, tone, name, line, story, note, site, siteLabel, caseUrl, shot, alt, first = false }) {
  return `<article class="show ${tone}" id="${id}" aria-labelledby="${id}-title">
<div class="show-stage">
<div class="show-head">
<h3 id="${id}-title" class="show-name">${esc(name)}</h3>
${line ? `<p class="show-line">${clauses(c, bare(line), true)}</p>` : ''}
</div>
${shot === 'capsule' ? capsuleLink(c, caseUrl, name) : shot === 'signal' ? signalCard(c, caseUrl, name) : frame(c, { key: shot, alt, href: caseUrl, label: `${c.readCase} ${name}`, first, whole: shot.startsWith('site-prod-') })}
${story ? `<blockquote class="story"><p class="story-label">${esc(c.whyLabel)}</p><p>${T(c, story)}</p></blockquote>` : ''}
<div class="show-foot">
${note ? `<p class="show-note">${dots(c, note)}</p>` : ''}
<p class="cta">${caseUrl ? `<a class="more-link" href="${caseUrl}">${c.readCase}${chevron}<span class="visually-hidden"> ${esc(name)}</span></a>` : ''}<a class="more-link" href="${site}" ${ext}>${esc(siteLabel)}${outward}<span class="visually-hidden"> ${esc(name)}</span></a></p>
</div>
</div>
</article>`;
}

// VoiceFlow's demo, on its project page: the capsule types real lines at the product's own rhythm.
function voiceflowDemo(c) {
  const f = c.flagship;
  return `<div class="demo case-demo" aria-hidden="true">
<kbd>${esc(f.key)}</kbd>
<div class="capsule"><span class="bars"><i></i><i></i><i></i></span><span class="typed" data-lines="${esc(JSON.stringify(f.lines))}">${esc(f.lines[0])}</span><span class="caret"></span></div>
<p class="hint">${esc(f.hint)}</p>
</div>`;
}

// Backgrounds alternate down the page: dark, soft, plain; after the path (plain) the gallery sits on soft.
const TONES = { voiceflow: 'dark flagship', 'ai-signal': 'soft', wanxiang: 'plain' };

function projectShow(c, cs) {
  const t = cs[c.lang === 'zh-CN' ? 'zh' : 'en'];
  return showcase(c, {
    id: cs.slug,
    tone: TONES[cs.slug],
    name: t.name,
    line: t.line,
    story: t.story,
    note: t.note,
    site: t.links[0][1],
    siteLabel: c.open(t.name),
    caseUrl: casePath(c, cs.slug),
    // The home page shows the product at work (cs.shot); the case page shows its website (cs.image).
    shot: cs.shot,
    alt: t.shotAlt || t.imageAlt,
    // Pictures load lazily: on phones the first screen is the hero, and an early download of a
    // picture below it slows the hero on weak networks (QA: slow 3G LCP).
    first: false,
  });
}

function work(c) {
  return `<section id="work" class="works" aria-labelledby="work-title">
<header class="tile plain works-head">
<p class="eyebrow">${c.workTitle}</p>
<h2 id="work-title">${lines(c, bare(c.workHeadline))}</h2>
<p class="sub">${clauses(c, bare(c.workLine), true)}</p>
</header>
${CASES.map((cs) => projectShow(c, cs)).join('\n')}
</section>`;
}

// 做法: what he believes (his words, lit as they scroll by) and three principles. v27: ai.vibecoding moved to 学技能.
function share(c) {
  const s = c.share;
  return `<section id="share" class="tile dark share" aria-labelledby="share-title">
<div class="statement" data-statement>
<p class="eyebrow">${s.title}</p>
<h2 class="pull" id="share-title">${statement(c, bare(s.view))}</h2>
${s.viewNote ? `<p class="said">${clauses(c, bare(s.viewNote), true)}</p>` : ''}
</div>
<ol class="principles">
${s.principles.map(([k, h, q]) => `<li class="reveal"><p class="pr-k">${T(c, k)}</p><h3>${T(c, h)}</h3><p class="pr-q">“${T(c, q)}”</p></li>`).join('\n')}
</ol>
</section>`;
}

// 书架 (v26): the six books that changed him. Tap a cover and it opens: his line first (what it changed for
// him), then what the book itself says. Covers are the real mainland editions (v26.2). v26.4: the book opens like a
// book (pattern: Codrops' 3D Book Showcase, Apple Books): its cover swings open to the left over a two-page spread,
// title page on the left, his words on the right. Without JS
// every book shows in full; with JS the covers become tabs and one book is open at a time.
// Cover heights at 300px wide (assets/media/book-1…6.webp), so each keeps its own proportions.
const BOOK_H = [433, 440, 435, 445, 440, 406];
function books(c) {
  const b = c.books;
  const id = (i) => `book-${i + 1}`;
  return `<section id="books" class="tile soft books" aria-labelledby="books-title">
<div class="reveal">
<p class="eyebrow">${esc(b.title)}</p>
<h2 id="books-title">${lines(c, bare(b.headline))}</h2>
<p class="sub">${clauses(c, bare(b.line), true)}</p>
</div>
<div class="shelf" role="tablist" aria-label="${esc(b.headline)}" data-shelf>
${b.list.map((k, i) => `<button type="button" class="cover" role="tab" id="${id(i)}-tab" aria-controls="${id(i)}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><img src="/assets/media/book-${i + 1}.webp" width="300" height="${BOOK_H[i]}" alt="" loading="lazy" decoding="async"><span class="visually-hidden">${T(c, k.t)}</span></button>`).join('\n')}
</div>
<div class="book-panels">
${b.list.map((k, i) => `<div class="book" role="tabpanel" id="${id(i)}" aria-labelledby="${id(i)}-tab" tabindex="0"><div class="spread"><div class="page page-l"><img class="pl-cover" src="/assets/media/book-${i + 1}.webp" width="300" height="${BOOK_H[i]}" alt="" loading="lazy" decoding="async"><h3>${T(c, k.t)}<span class="book-a">${T(c, k.a)}</span><span class="book-ed">${T(c, k.ed)}</span></h3></div><div class="page page-r"><p class="book-k">${esc(b.mine)}</p><p class="book-mine">“${T(c, k.mine)}”</p><p class="book-k">${esc(b.core)}</p><p class="book-core">${T(c, k.core)}</p></div><div class="flap" aria-hidden="true"><img src="/assets/media/book-${i + 1}.webp" width="300" height="${BOOK_H[i]}" alt="" loading="lazy" decoding="async"></div></div></div>`).join('\n')}
</div>
<div class="listen" id="follow">
<h3 class="listen-title">${clauses(c, bare(c.follow.headline), true)}</h3>
<p class="sub">${clauses(c, bare(c.follow.line), true)}</p>
<ul class="people">
${c.follow.list.map((k, i) => person(c, k, i)).join('\n')}
</ul>
</div>
</section>`;
}

// v27 (2026-10-24): 三件事: the headline, then the three things themselves (v27.1, his words: 「那哪三件事情呢？直接放出来啊」),
// each a tile that jumps to its part: 阅读 (the shelf), 学技能 (easy-vibe first, ai.vibecoding small under it), 健身 (one coach,
// one course). v27.2: the three Douyin creators sit together inside 阅读, under the books (his words: 「推荐的人是获取知识的一种」).
function person(c, k, i) {
  const f = c.follow;
  return `<li class="person reveal"><img class="avatar" src="/assets/media/follow-${i + 1}.webp" width="240" height="240" alt="" loading="lazy" decoding="async"><h3>${T(c, k.name)}</h3><p class="handle">${T(c, k.handle)}</p><p class="value">${T(c, k.value)}</p><p class="who">${T(c, k.who)}</p><p class="book-k">${esc(f.why)}</p><p class="person-why">“${T(c, k.why)}”</p><p class="person-go"><a href="${k.url}" ${ext}>${esc(f.go)}${outward}<span class="visually-hidden"> ${esc(k.name)}</span></a></p></li>`;
}

// v27.4: a small drawn icon on each of the three tiles (his words: 「不要光是一整块。你最好有点小的贴图」).
// Line icons on a 24 grid, drawn here so the page makes no extra request: an open book, a sparkle (AI), a dumbbell.
const THING_ICONS = {
  book: '<path d="M12 6.5C10 5 7 4.6 3.5 5.4v12.4c3.5-.8 6.5-.4 8.5 1.1 2-1.5 5-1.9 8.5-1.1V5.4C17 4.6 14 5 12 6.5Z"/><path d="M12 6.5V19"/>',
  spark: '<path d="M11 3.5l1.6 4.8 4.9 1.7-4.9 1.7L11 16.5l-1.6-4.8L4.5 10l4.9-1.7Z"/><path d="M18 14.5l.7 2 2 .8-2 .7-.7 2.1-.7-2.1-2-.7 2-.8Z"/>',
  weight: '<path d="M6.5 12h11"/><rect x="3.5" y="8" width="3" height="8" rx="1"/><rect x="17.5" y="8" width="3" height="8" rx="1"/><path d="M2 10.5v3M22 10.5v3"/>',
};
const thingIcon = (k) => `<svg class="thing-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${THING_ICONS[k]}</svg>`;

function three(c) {
  const t = c.three;
  return `<section id="three" class="tile plain three" aria-labelledby="three-title">
<div class="reveal">
<p class="eyebrow">${esc(t.title)}</p>
<h2 id="three-title">${lines(c, bare(t.headline))}</h2>
<p class="sub">${clauses(c, bare(t.line), true)}</p>
</div>
<ol class="things reveal">
${t.items.map((k) => `<li><a href="#${k.id}">${thingIcon(k.icon)}<span class="thing-name">${T(c, k.name)}</span><span class="thing-line">${k.line.split(' · ').map((x) => `<span>${T(c, x)}</span>`).join('')}</span></a></li>`).join('\n')}
</ol>
</section>`;
}

function skill(c) {
  const s = c.three.skill;
  const r = c.recommend;
  return `<section id="skill" class="tile plain skill" aria-labelledby="skill-title">
<div class="reveal">
<p class="eyebrow">${esc(s.title)}</p>
<h2 id="skill-title">${lines(c, bare(s.headline))}</h2>
<p class="sub">${clauses(c, bare(r.line), true)}</p>
</div>
${frame(c, { key: 'site-easyvibe', alt: r.alt })}
<div class="show-foot">
<p class="show-note">${dots(c, r.note)}</p>
<p class="cta"><a class="more-link" href="${r.url}" ${ext}>${esc(r.link)}${outward}<span class="visually-hidden"> easy-vibe</span></a></p>
</div>
<div class="also reveal">
<p class="also-name">ai.vibecoding</p>
<p class="also-line">${clauses(c, bare(s.vibecoding))}</p>
<p class="also-meta">${dots(c, s.vibeNote)}</p>
<p class="also-go"><a class="more-link" href="${VIBECODING}" ${ext}>${esc(s.vibeLink)}${outward}<span class="visually-hidden"> ai.vibecoding</span></a></p>
</div>
</section>`;
}

// 健身: his words 「他的一个头像，下面是他的系列课程，打开定位的是他的第一集」. The course cover stands like a small book.
function fitness(c) {
  const t = c.three.fitness;
  return `<section id="fitness" class="tile soft fitness" aria-labelledby="fitness-title">
<div class="reveal">
<p class="eyebrow">${esc(t.title)}</p>
<h2 id="fitness-title">${lines(c, bare(t.headline))}</h2>
<p class="sub">${clauses(c, bare(t.line), true)}</p>
</div>
<article class="course reveal" aria-labelledby="course-title">
<div class="person-id"><img class="avatar" src="/assets/media/follow-4.webp" width="240" height="240" alt="" loading="lazy" decoding="async"><div><p class="coach">${T(c, t.coach)}</p><p class="handle">${T(c, t.handle)}</p><p class="handle">${T(c, t.who)}</p></div></div>
<div class="course-body">
<a class="course-cover" href="${t.url}" ${ext} tabindex="-1" aria-hidden="true"><img src="/assets/media/fit-course.webp" width="540" height="720" alt="" loading="lazy" decoding="async"></a>
<div class="course-text">
<p class="handle">${dots(c, t.meta)}</p>
<h3 id="course-title">${T(c, t.course)}</h3>
<p class="course-ep">${dots(c, t.ep)}</p>
<p class="who">${T(c, t.desc)}</p>
<p class="book-k">${esc(t.whyLabel)}</p>
<p class="person-why">${T(c, t.why)}</p>
<p class="person-go"><a href="${t.url}" ${ext}>${esc(t.go)}${outward}<span class="visually-hidden"> ${esc(t.course)}</span></a></p>
</div>
</div>
</article>
</section>`;
}

function journey(c) {
  return `<section class="tile soft" id="path" aria-labelledby="path-title">
<div class="reveal">
<p class="eyebrow">${c.pathTitle}</p>
<h2 id="path-title">${lines(c, bare(c.pathHeadline))}</h2>
<p class="sub">${clauses(c, bare(c.pathLine), true)}</p>
</div>
<ol class="path reveal">
${c.journey.map((p) => `<li${p.light ? ' class="light"' : ''}><span class="when">${esc(p.when)}</span><div><h3>${T(c, p.role)}</h3>${p.org ? `<p class="org">${T(c, p.org)}</p>` : ''}${p.desc ? `<p class="what">${T(c, p.desc)}</p>` : ''}</div></li>`).join('\n')}
</ol>
</section>`;
}

// The ending: a thank-you, one action, and his own last line. The card carries his name once (the
// signature), one line, and the QR code as a real image WeChat can long-press; it is not wrapped in a link.
// Outside WeChat, phones get "copy my WeChat ID and open WeChat" when the ID is set, else "save the card".
function contact(c) {
  const lang = c.lang === 'zh-CN' ? 'zh' : 'en';
  const l = c.letter;
  return `<section class="tile soft ending" id="contact" aria-labelledby="contact-title">
<article class="letter reveal" aria-labelledby="letter-title">
<h2 id="letter-title">${lines(c, bare(l.title))}</h2>
${l.body.map((p) => `<p>${T(c, p)}</p>`).join('\n')}
</article>
<div class="reveal">
<h2 id="contact-title">${T(c, bare(c.contactHeadline))}</h2>
<p class="sub">${clauses(c, bare(c.contactLead), true)}</p>
</div>
<div class="namecard-stage">
<div class="namecard" role="group" aria-label="${esc(c.cardLabel)}" data-tilt>
<div class="nc-card-row">
<div class="nc-left">${signatureRef('nc-sig')}<div class="nc-id"><p class="nc-role">${T(c, bare(c.role))}</p><p class="nc-wx">${esc(c.wechatLabel)} ${esc(c.wechatId)}</p></div></div>
<div class="nc-qr"><img class="qr" src="/assets/wechat-qr.png" width="232" height="232" alt="${esc(c.qrAlt)}" decoding="async"><span class="nc-scan">${esc(c.scanLabel)}</span></div>
</div>
</div>
</div>
<p class="qr-hint" data-qr-hint data-hint-wechat="${esc(bare(c.hint.wechat))}" data-hint-phone="${esc(bare(c.hint.phone))}" data-hint-desktop="${esc(bare(c.hint.desktop))}">${esc(bare(c.hint.default))}</p>
<p class="cta contact-cta">${c.wechatId ? `<button type="button" class="pill" data-wechat-id="${esc(c.wechatId)}" data-copied="${esc(bare(c.copied))}" data-label-phone="${esc(c.copyWechat)}" data-label-desktop="${esc(c.copyOnly)}" hidden>${esc(c.copyWechat)}</button>` : ''}<a class="more-link" href="/assets/card-${lang}.png" download="qin-xujun-card.png" data-qr-save>${c.save}${chevron}</a></p>
</section>`;
}

// Used on project pages for "other work".
function caseCard(c, cs) {
  const t = cs[c.lang === 'zh-CN' ? 'zh' : 'en'];
  return `<article class="card-tile product-card reveal">
<p class="eyebrow">${esc(t.name)}</p>
<h3><a href="${casePath(c, cs.slug)}">${clauses(c, bare(t.line), true)}</a></h3>
<p class="card-line">${dots(c, t.note)}</p>
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
${three(c)}
${books(c)}
${skill(c)}
${fitness(c)}
${journey(c)}
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

// A case page reads like a story (v21): chapters whose headlines are conclusions, then the engineering
// (scope, build, trade-offs, evidence, timeline) folded under one 「技术细节」, then what is still missing.
function caseSections(c, sections) {
  const out = [];
  let tech = [];
  // Inside the fold nothing fades in: a closed <details> is never on screen, so it would stay hidden.
  const flush = () => {
    if (!tech.length) return;
    out.push(`<details class="tech">
<summary><span>${esc(c.caseLabels.techTitle)}</span><span class="tech-what">${esc(c.caseLabels.techWhat(tech.map(([s]) => s.h)))}</span></summary>
${tech.map(([s, i]) => block(c, s, i)).join('\n').replace(/<li class="reveal">/g, '<li>')}
</details>`);
    tech = [];
  };
  sections.forEach((s, i) => {
    if (s.tech) return tech.push([s, i]);
    flush();
    out.push(block(c, s, i));
  });
  flush();
  return out.join('\n');
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
  // v26.9: a section picture is the whole screen on phones too; a phone crop of one card read as a broken fragment.
  if (s.shot) parts.push(`<div class="sec-shot">${frame(c, { key: s.shot, alt: s.shotAlt, whole: true })}</div>`);
  return `<section class="case-sec" id="s${i + 1}" aria-labelledby="s${i + 1}-title">
<h2 id="s${i + 1}-title">${clauses(c, s.h)}</h2>
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
${caseNav(c, cs, t, casePath(o, cs.slug))}
<main id="main">
<article class="case" aria-labelledby="case-title">
<header class="tile plain case-head" id="top">
<p class="eyebrow">${esc(L.howMade(t.name))}</p>
<h1 id="case-title">${clauses(c, bare(t.title), true)}</h1>
<p class="sub">${clauses(c, bare(t.sub), 'list')}</p>
${t.links.length > 1 ? `<p class="cta">${t.links.slice(1).map(([label, href]) => `<a class="more-link" href="${href}" ${ext}>${esc(label)}${outward}<span class="visually-hidden"> ${esc(t.name)}</span></a>`).join('')}</p>` : ''}
${cs.image ? `<div class="case-frame">${frame(c, { key: cs.image.key, alt: t.imageAlt })}</div>` : ''}
${cs.slug === 'voiceflow' ? voiceflowDemo(c) : ''}
</header>
<section class="tile dark results" aria-labelledby="results-title">
<h2 class="visually-hidden" id="results-title">${L.results}</h2>
<dl class="facts">
${t.results.map((r) => {
  const v = r.stat ? statValue(cs.slug, r.stat) : r.v;
  return `<div><dt>${T(c, r.l)}</dt><dd${typeof v === 'number' ? ` data-count="${v}"` : ''}>${statText(v)}</dd></div>`;
}).join('\n')}
</dl>
${live ? `<p class="footnote">${dates(T(c, L.liveNote(stats[cs.slug].updated)))}</p>` : ''}
</section>
<div class="case-body">
<aside class="case-facts" aria-labelledby="facts-title">
<h2 id="facts-title">${L.facts}</h2>
<dl>
${t.facts.map(([k, v]) => `<div><dt>${T(c, k)}</dt><dd>${T(c, v)}</dd></div>`).join('\n')}
</dl>
</aside>
<div class="case-main">
${caseSections(c, t.sections)}
</div>
</div>
</article>
<section class="tile plain try" id="try" aria-labelledby="try-title">
<h2 id="try-title">${esc(L.tryIt(t.name))}</h2>
<p class="sub">${dots(c, t.note)}</p>
<p class="cta">${t.links.map(([label, href]) => `<a class="more-link" href="${href}" ${ext}>${esc(label)}${outward}<span class="visually-hidden"> ${esc(t.name)}</span></a>`).join('')}</p>
</section>
<section class="tile soft more-cases" aria-labelledby="more-title">
<h2 id="more-title">${L.more}</h2>
<div class="card-grid two">
${related.map((x) => caseCard(c, x)).join('\n')}
</div>
</section>
<section class="tile dark case-cta" id="contact" aria-labelledby="cta-title">
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
