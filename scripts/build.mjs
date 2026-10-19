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
  '秦徐俊', '奥普智能', '比智科技', '一念智能', '专致网络', '抖音数字学堂', '云南民族大学', '微众银行', '方正证券', '工商银行',
  '阿里巴巴', '影刀 RPA', '万象成文', '小宇宙', '小红书', '公众号', '飞书', 'AI 项目经理', '能用的 AI', 'AI 问数', 'AI 赋能课程',
  '智能体', '上下文', '自然语言', '许愿池', '爆款案例', '信息流', '回款率', '采购评估', '招投标', '剪贴板', '终稿', '离线',
  '受监督', '子进程', '原生绘制', '浏览器验收', '构建自愈', '原子修改', '计划闸门', '上下文装载', '访谈对话', '想用 AI',
  '到能用的 AI', '再让 AI 动手', '第一行代码', '创造者', '无需登录', '不声明完成', '都跑', '一个字都不丢', '逐字回读', '再把概率压成确定性', '终极浪漫', '数据智能', '数据平台', '智能分析', '金融控股集团', '乡村英才计划', '未来星计划', '冒烟测试', '代码签名', '安全提示',
];
const segmenter = new Intl.Segmenter('zh', { granularity: 'word' });
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const KEEP_RE = KEEP.map((k) => [new RegExp([...k].map(reEsc).join('(?:<wbr>)?'), 'g'), k.replace(/ /g, ' ')]);
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
function img(key, alt, { sizes = '(min-width: 1024px) 560px, 100vw', eager = false, cls = '', mobile = '' } = {}) {
  const set = Object.values(media[key]).sort((a, b) => a.w - b.w);
  const base = set[0];
  const tag = `<img${cls ? ` class="${cls}"` : ''} src="${base.src}" srcset="${set.map((s) => `${s.src} ${s.w}w`).join(', ')}" sizes="${sizes}" width="${base.w}" height="${base.h}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
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
  // If site.js never arrives, show everything instead of leaving faded tiles invisible.
  "setTimeout(function(){if(!window.qxjReady)r.classList.remove('js')},2500);" +
  // Hide the signature before first paint only when it is about to be written; never leave it hidden.
  "try{s=sessionStorage.getItem('qxj.signed')}catch(e){}" +
  "if(s!=='1'&&document.location.pathname.indexOf('/work/')<0&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){r.classList.add('sig-pending');" +
  "setTimeout(function(){r.classList.remove('sig-pending')},3000)}})()</script>";

// Starts the signature right after it is parsed, so it never waits for site.js on a slow network.
// Characters are written one after another; then the seal is pressed.
const sigStart =
  "(function(){var r=document.documentElement;if(!r.classList.contains('sig-pending'))return;" +
  "var g=document.querySelector('.hero .sig'),p=g.querySelectorAll('path'),i;" +
  "for(i=0;i<p.length;i++)p[i].style.setProperty('--at',0.15+i*0.45+(p[i].classList.contains('seal')?0.2:0)+'s');" +
  "g.classList.add('write');r.classList.remove('sig-pending');" +
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

const SECTIONS = ['work', 'thinking', 'method', 'path', 'contact'];

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
<a href="${GITHUB}/qinxujunai.github.io" ${ext}>${c.footerSource}</a>
</div>
</footer>`;
}

// ---------- Home ----------

function hero(c) {
  return `<section class="tile hero" id="top" aria-labelledby="hero-title">
${img('avatar', c.portraitAlt, { sizes: '72px', eager: true, cls: 'avatar' })}
<div class="sig-line">${signature('sig')}</div>
<script>${sigStart}</script>
<p class="eyebrow">${T(c, c.eyebrow)}</p>
<h1 id="hero-title">${T(c, c.lede)}</h1>
<p class="sub">${T(c, c.now)}</p>
<p class="cta"><a class="pill pill-lg" href="#contact">${c.addWechat}</a><a class="more-link" href="#work">${c.seeWork}${chevron}</a></p>
</section>`;
}

// Splits a line into spans so it can light up as it scrolls by.
function statement(c, text) {
  const parts = c.lang === 'zh-CN' ? [...text] : text.split(/(\s+)/);
  return parts.map((p) => (/^\s+$/.test(p) ? p : `<span>${esc(p)}</span>`)).join('');
}

const statValue = (k) => stats.voiceflow[k];
const statText = (v) => esc(typeof v === 'number' ? v.toLocaleString('en-US') : v);

// VoiceFlow on black: the capsule types real lines over the real app window, with live GitHub numbers.
function flagship(c) {
  const cs = caseOf('voiceflow');
  const t = cs[c.lang === 'zh-CN' ? 'zh' : 'en'];
  const f = c.flagship;
  return `<article class="tile dark product flagship" id="voiceflow" aria-labelledby="voiceflow-title">
<div class="reveal">
<p class="eyebrow">${T(c, t.kind)}</p>
<h3 id="voiceflow-title" class="tile-title">${esc(t.name)}</h3>
<p class="sub">${T(c, t.title)}</p>
<p class="cta"><a class="more-link" href="${casePath(c, 'voiceflow')}">${c.readCase}${chevron}</a><a class="more-link" href="${t.links[0][1]}" ${ext}>${c.siteLabel}${chevron}<span class="visually-hidden"> VoiceFlow</span></a></p>
</div>
<figure class="device">
${img(cs.image.key, t.imageAlt, { sizes: '(min-width: 1068px) 860px, 92vw', cls: 'app', mobile: cs.image.mobile })}
<div class="demo" aria-hidden="true">
<kbd>${esc(f.key)}</kbd>
<div class="capsule"><span class="bars"><i></i><i></i><i></i></span><span class="typed" data-lines="${esc(JSON.stringify(f.lines))}">${esc(f.lines[0])}</span><span class="caret"></span></div>
<p class="hint">${esc(f.hint)}</p>
</div>
</figure>
<div class="reveal">
<p class="body">${T(c, f.body)}</p>
<dl class="facts">
${['stars', 'downloads', 'forks', 'version'].map((k) => {
  const v = statValue(k);
  return `<div><dt>${T(c, f.facts[k])}</dt><dd${typeof v === 'number' ? ` data-count="${v}"` : ''}>${statText(v)}</dd></div>`;
}).join('\n')}
</dl>
<p class="footnote">${T(c, f.factsNote(stats.voiceflow.updated))}</p>
</div>
</article>`;
}

// A card that links to a case. The title holds the link; the whole card is clickable through it.
function caseCard(c, cs, { image = true, level = 3 } = {}) {
  const t = cs[c.lang === 'zh-CN' ? 'zh' : 'en'];
  const h = `h${level}`;
  if (cs.kind === 'product') {
    return `<article class="card-tile product-card reveal">
<p class="eyebrow">${esc(t.name)}</p>
<${h}><a href="${casePath(c, cs.slug)}">${T(c, t.title)}</a></${h}>
<p class="card-line">${T(c, t.card)}</p>
<p class="card-more" aria-hidden="true">${c.readCase}${chevron}</p>
${image ? `<figure class="card-shot">${img(cs.image.key, t.imageAlt, { sizes: '(min-width: 1068px) 480px, 90vw', mobile: cs.image.mobile })}</figure>` : ''}
</article>`;
  }
  return `<article class="card-tile solution-card reveal">
<p class="eyebrow">${T(c, t.kind)}</p>
<p class="big">${esc(cs.big[c.lang === 'zh-CN' ? 'zh' : 'en'])}</p>
<p class="big-label">${T(c, t.bigLabel)}</p>
<${h}><a href="${casePath(c, cs.slug)}">${T(c, t.title)}</a></${h}>
<p class="card-more" aria-hidden="true">${c.readCase}${chevron}</p>
</article>`;
}

function work(c) {
  const products = CASES.filter((x) => x.kind === 'product' && x.slug !== 'voiceflow');
  const solutions = CASES.filter((x) => x.kind === 'solution');
  return `<section id="work" class="works" aria-labelledby="work-title">
<div class="tile plain intro">
<div>
<p class="eyebrow">${c.workTitle}</p>
<h2 id="work-title">${T(c, c.workHeadline)}</h2>
<p class="sub">${T(c, c.workIntro)}</p>
</div>
</div>
<h3 class="visually-hidden">${esc(c.productsLabel)}</h3>
${flagship(c)}
<div class="card-grid two">
${products.map((x) => caseCard(c, x)).join('\n')}
</div>
<div class="tile soft solutions">
<p class="eyebrow reveal">${esc(c.solutionsLabel)}</p>
<div class="card-grid three">
${solutions.map((x) => caseCard(c, x)).join('\n')}
</div>
</div>
</section>`;
}

function thinking(c) {
  const [s1, s2, s3 = ''] = c.thinkingSource;
  return `<section id="thinking" class="values" aria-labelledby="thinking-title">
<div class="tile dark statement" data-statement>
<p class="eyebrow">${c.thinkingTitle}</p>
<h2 class="pull" id="thinking-title">${statement(c, c.thinkingHeadline)}</h2>
<blockquote class="said"><p>${c.lang === 'zh-CN' ? `「${T(c, c.thinkingQuote)}」` : `“${esc(c.thinkingQuote)}”`}</p></blockquote>
<p class="source">${esc(s1)}<a href="${VIBECODING}" ${ext}>${s2}${chevron}</a>${esc(s3)}</p>
</div>
<div class="tile soft">
<h2 class="reveal">${T(c, c.abilitiesHeadline)}</h2>
<ul class="value-grid">
${c.abilities.map((a, i) => `<li class="value reveal"><span class="value-num" aria-hidden="true">${i + 1}</span><p class="value-name">${T(c, a.label)}</p><h3>${T(c, a.title)}</h3><p>${T(c, a.body)}</p><p class="proof"><a href="${casePath(c, a.proof.case)}">${T(c, a.proof.text)}${chevron}</a></p></li>`).join('\n')}
</ul>
</div>
</section>`;
}

function method(c) {
  return `<section class="tile plain" id="method" aria-labelledby="method-title">
<div class="reveal">
<p class="eyebrow">${c.methodTitle}</p>
<h2 id="method-title">${T(c, c.methodHeadline)}</h2>
<p class="sub">${T(c, c.methodIntro)}</p>
</div>
<ol class="steps">
${c.steps.map((s, i) => `<li class="reveal"><span class="step-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h3>${T(c, s.name)}${s.en ? ` <span class="step-en" lang="en">${esc(s.en)}</span>` : ''}</h3><p>${T(c, s.body)}</p></li>`).join('\n')}
</ol>
<figure class="shot reveal">${img('vibecoding', c.vibecodingAlt, { sizes: '(min-width: 1068px) 860px, 92vw', mobile: 'vibecoding-m' })}</figure>
<p class="body closing reveal">${T(c, c.methodClosing)}</p>
<p class="cta reveal"><a class="more-link" href="${VIBECODING}" ${ext}>${c.methodLink}${chevron}</a></p>
</section>`;
}

function journey(c) {
  return `<section class="tile soft" id="path" aria-labelledby="path-title">
<div class="reveal">
<p class="eyebrow">${c.pathTitle}</p>
<h2 id="path-title">${T(c, c.pathHeadline)}</h2>
</div>
<ol class="path reveal">
${c.journey.map((p) => `<li><span class="when">${esc(p.when)}</span><div><h3>${T(c, p.role)}</h3><p class="org">${T(c, p.org)}</p>${p.desc ? `<p class="what">${T(c, p.desc)}</p>` : ''}${p.case ? `<p class="what"><a href="${casePath(c, p.case)}">${c.readCase}${chevron}<span class="visually-hidden"> · ${esc(p.org)}</span></a></p>` : ''}</div></li>`).join('\n')}
</ol>
</section>`;
}

function photos(c) {
  return `<section class="tile plain" id="photos" aria-labelledby="photos-title">
<div class="reveal">
<p class="eyebrow">${c.photosTitle}</p>
<h2 id="photos-title">${T(c, c.photosHeadline)}</h2>
<p class="sub">${T(c, c.photosIntro)}</p>
</div>
<ul class="gallery" data-gallery tabindex="0" aria-label="${esc(c.photosTitle)}">
${c.photos.map((p) => `<li${p.tall ? ' class="tall"' : ''}>${img(p.key, p.alt, { sizes: '(min-width: 734px) 860px, 540px' })}</li>`).join('\n')}
</ul>
<p class="paddles"><button type="button" data-prev aria-label="${esc(c.prev)}"><span aria-hidden="true">‹</span></button><button type="button" data-next aria-label="${esc(c.next)}"><span aria-hidden="true">›</span></button></p>
</section>`;
}

// The contact is a name card: signature and seal, portrait, title, and the QR code as a real image
// that WeChat can long-press. "Save" downloads the same card as a PNG (built by scripts/icons.mjs).
function contact(c) {
  const lang = c.lang === 'zh-CN' ? 'zh' : 'en';
  return `<section class="tile soft" id="contact" aria-labelledby="contact-title">
<div class="reveal">
<p class="eyebrow">${c.contactTitle}</p>
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
<p class="cta"><a class="more-link" href="/assets/card-${lang}.png" download="qin-xujun-card.png" data-qr-save>${c.save}${chevron}</a><a class="more-link" href="${GITHUB}" ${ext}>${c.github}${chevron}</a></p>
<p class="closing-line reveal">${T(c, c.closing)}</p>
</section>`;
}

function homePage(c) {
  const o = other(c);
  return `${head(c, { url: c.path, alt: { zh: '/', en: '/en/' }, title: c.title })}
<body>
<a class="skip" href="#main">${c.skip}</a>
${nav(c, { switchHref: o.path, onHome: true })}
<main id="main">
${hero(c)}
${work(c)}
${thinking(c)}
${method(c)}
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
  // Related: the other cases of the same kind first, then the rest; three in all.
  const related = [...CASES.filter((x) => x.slug !== cs.slug && x.kind === cs.kind), ...CASES.filter((x) => x.kind !== cs.kind)].slice(0, 3);
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
<p class="eyebrow">${T(c, t.kind)}</p>
<h1 id="case-title">${T(c, t.title)}</h1>
<p class="sub">${T(c, t.sub)}</p>
${t.links ? `<p class="cta">${t.links.map(([label, href]) => `<a class="more-link" href="${href}" ${ext}>${esc(label)}${chevron}<span class="visually-hidden"> ${esc(t.name)}</span></a>`).join('')}</p>` : ''}
${cs.image ? `<figure class="shot">${img(cs.image.key, t.imageAlt, { sizes: '(min-width: 1068px) 860px, 92vw', mobile: cs.image.mobile, eager: true })}</figure>` : ''}
</header>
<section class="tile dark results" aria-labelledby="results-title">
<h2 class="visually-hidden" id="results-title">${L.results}</h2>
<dl class="facts">
${t.results.map((r) => {
  const v = r.stat ? statValue(r.stat) : r.v;
  return `<div><dt>${T(c, r.l)}</dt><dd${typeof v === 'number' ? ` data-count="${v}"` : ''}>${statText(v)}</dd></div>`;
}).join('\n')}
</dl>
${live ? `<p class="footnote">${T(c, L.liveNote(stats.voiceflow.updated))}</p>` : ''}
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
<div class="card-grid three">
${related.map((x) => caseCard(c, x, { image: false })).join('\n')}
</div>
</section>
<section class="tile dark case-cta" aria-labelledby="cta-title">
<h2 id="cta-title">${T(c, L.contactHeadline)}</h2>
<p class="sub">${T(c, L.contactBody)}</p>
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
