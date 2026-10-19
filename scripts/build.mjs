// Renders index.html, en/index.html, 404.html and sitemap.xml from src/content.mjs and src/media.json.
// No runtime dependencies: the output is plain HTML that GitHub Pages serves from main.
import fs from 'node:fs';
import { content, SITE, GITHUB } from '../src/content.mjs';

const media = JSON.parse(fs.readFileSync(new URL('../src/media.json', import.meta.url), 'utf8'));

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Chinese lines may only break between words: segment with ICU and mark break points with <wbr>,
// then CSS (word-break: keep-all) forbids breaks anywhere else. Names are kept whole.
const KEEP = [
  '做云 AI 项目经理', '秦徐俊', '奥普智能', '万象成文', '云 AI 项目经理', '可运行的作品', '播客', '能用', '视频', '离线', '在线识别',
  '智能体', '内容生产', '自然语言', '上下文', '老本行', '爆款案例', '信息流', '数据平台', '智能分析', '公益项目',
  '创造可运行的作品', '不联网', '迭代至今',
];
const segmenter = new Intl.Segmenter('zh', { granularity: 'word' });
function zhText(s) {
  let out = [...segmenter.segment(String(s))].map((x) => esc(x.segment)).join('<wbr>');
  for (const k of KEEP) out = out.replace(new RegExp([...k].map((ch) => ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('(?:<wbr>)?'), 'g'), k.replace(/ /g, ' '));
  return out.replace(/<wbr>([，。、；：！？）」』])/g, '$1').replace(/<wbr>\s<wbr>/g, ' ');
}
const T = (c, s) => (c.lang === 'zh-CN' ? zhText(s) : esc(s));

const signatureSvg = fs.readFileSync(new URL('../src/signature.svg', import.meta.url), 'utf8').trim();
const signature = (cls) => signatureSvg.replace('<svg xmlns="http://www.w3.org/2000/svg"', `<svg class="${cls}" aria-hidden="true" focusable="false"`);
const sigViewBox = /viewBox="([^"]+)"/.exec(signatureSvg)[1];
// The hero holds the real paths (they animate); the nav and the closing reuse them by reference.
const signatureRef = (cls) => `<svg class="${cls}" viewBox="${sigViewBox}" aria-hidden="true" focusable="false"><use href="#sig-paths"/></svg>`;

const ext = 'rel="noopener"';

// The stylesheet is inlined so the first screen needs no extra round trip on slow networks.
const css = fs
  .readFileSync(new URL('../assets/site.css', import.meta.url), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,>])\s*/g, '$1')
  .replace(/;}/g, '}')
  .trim();

// Responsive image from src/media.json: 1x as src, every size in srcset.
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
  // Hide the signature before first paint only when it is about to be written; never leave it hidden.
  "var r=document.documentElement,s=null;r.classList.add('js');" +
  // If site.js never arrives, show everything instead of leaving faded tiles invisible.
  "setTimeout(function(){if(!window.qxjReady)r.classList.remove('js')},2500);" +
  "try{s=sessionStorage.getItem('qxj.signed')}catch(e){}" +
  "if(s!=='1'&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){r.classList.add('sig-pending');" +
  "setTimeout(function(){r.classList.remove('sig-pending')},3000)}})()</script>";

// Starts the signature right after it is parsed, so it never waits for site.js on a slow network.
const sigStart =
  "(function(){var r=document.documentElement;if(!r.classList.contains('sig-pending'))return;" +
  "var p=document.querySelectorAll('.hero .sig path');for(var i=0;i<p.length;i++)p[i].style.setProperty('--at',0.15+i*0.45+'s');" +
  "document.querySelector('.hero .sig').classList.add('write');r.classList.remove('sig-pending');" +
  "try{sessionStorage.setItem('qxj.signed','1')}catch(e){}})()";

const icons = {
  sunMoon: `<svg class="theme-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg><svg class="theme-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>`,
};

function head(c, { canonical, title = c.title, noindex = false }) {
  return `<!doctype html>
<html lang="${c.lang}" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(c.description)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#ffffff">
${themeScript}
<style>${css}</style>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${SITE}${canonical}">
<link rel="alternate" hreflang="zh-CN" href="${SITE}/">
<link rel="alternate" hreflang="en" href="${SITE}/en/">
<link rel="alternate" hreflang="x-default" href="${SITE}/">`}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(c.description)}">
<meta property="og:url" content="${SITE}${canonical}">
<meta property="og:image" content="${SITE}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta itemprop="image" content="${SITE}/share.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="author" content="${esc(c.name)}">
<script src="/assets/site.js" defer></script>
</head>`;
}

const SECTIONS = ['work', 'path', 'thinking', 'photos', 'contact'];
const chevron = '<span class="chev" aria-hidden="true">›</span>';

// Apple-style local nav: signature on the left, sections in the middle, one blue action on the right.
function nav(c) {
  return `<header class="nav">
<div class="nav-inner">
<a class="nav-sig" href="#top" aria-label="${esc(c.name)}">${signatureRef('sig-mini')}</a>
<nav class="nav-links" aria-label="${esc(c.navLabel)}">
${SECTIONS.map((id) => `<a href="#${id}" data-nav="${id}">${c.nav[id]}</a>`).join('\n')}
</nav>
<div class="nav-tools">
<a href="${c.switchHref}" hreflang="${c.switchLang}" lang="${c.switchLang}">${c.switchLabel}</a>
<button type="button" data-theme-toggle aria-label="${esc(c.themeLabel)}">${icons.sunMoon}</button>
<a class="pill" href="#contact">${c.addWechat}</a>
</div>
</div>
</header>`;
}

function hero(c) {
  return `<section class="tile hero" id="top" aria-labelledby="hero-title">
${img('avatar', c.portraitAlt, { sizes: '72px', eager: true, cls: 'avatar' })}
<p class="eyebrow sig-line"><span class="visually-hidden">${esc(c.name)}</span>${signature('sig').replace('<path', '<g id="sig-paths"><path').replace('</svg>', '</g></svg>')}</p>
<script>${sigStart}</script>
<h1 id="hero-title">${T(c, c.lede)}</h1>
<p class="sub">${T(c, c.now)}</p>
<p class="cta"><a class="pill pill-lg" href="#contact">${c.addWechat}</a><a class="more-link" href="#work">${c.seeWork}${chevron}</a></p>
</section>`;
}

function tileLinks(c, item) {
  return `<p class="cta"><a class="more-link" href="${item.site}" ${ext}>${c.siteLabel}${chevron}<span class="visually-hidden"> ${esc(item.name)}</span></a><a class="more-link" href="${item.repo}" ${ext}>${c.repoLabel}${chevron}<span class="visually-hidden"> ${esc(item.name)}</span></a></p>`;
}

// VoiceFlow: the capsule types real lines from the product's own demo, over its real app window.
function voiceflow(c) {
  const f = c.feature;
  return `<article class="tile soft product" id="${f.id}" aria-labelledby="${f.id}-title">
<div class="reveal">
<h2 id="${f.id}-title">${esc(f.name)}</h2>
<p class="sub">${T(c, f.tagline)}</p>
${tileLinks(c, f)}
</div>
<figure class="device">
${img(f.image.key, f.image.alt, { sizes: '(min-width: 1068px) 860px, 92vw', cls: 'app', mobile: f.image.mobile, eager: true })}
<div class="demo" aria-hidden="true">
<kbd>${esc(f.key)}</kbd>
<div class="capsule"><span class="bars"><i></i><i></i><i></i></span><span class="typed" data-lines="${esc(JSON.stringify(f.lines))}">${esc(f.lines[0])}</span><span class="caret"></span></div>
<p class="hint">${esc(f.hint)}</p>
</div>
</figure>
<div class="reveal">
<p class="body">${T(c, f.desc)}</p>
<dl class="facts">
${f.facts.map(([v, k]) => `<div><dt>${T(c, k)}</dt><dd>${esc(v)}</dd></div>`).join('\n')}
</dl>
${f.facts.filter((x) => x[2]).map((x) => `<p class="footnote">${T(c, x[2])}</p>`).join('')}
<p class="body decision">${T(c, f.decision)} <a href="${f.decisionLink.href}" ${ext}>${esc(f.decisionLink.label)}</a></p>
</div>
</article>`;
}

function product(c, item, tone) {
  return `<article class="tile ${tone} product" id="${item.id}" aria-labelledby="${item.id}-title">
<div class="reveal">
<h2 id="${item.id}-title">${esc(item.name)}</h2>
<p class="sub">${T(c, item.tagline)}</p>
${tileLinks(c, item)}
</div>
<figure class="shot">${img(item.image.key, item.image.alt, { sizes: '(min-width: 1068px) 860px, 92vw', mobile: item.image.mobile })}</figure>
<p class="body reveal">${T(c, item.desc)}</p>
</article>`;
}

function page(c) {
  const [s1, s2, s3] = c.thinkingSource;
  const [wanxiang, vibe, method] = c.work;
  return `${head(c, { canonical: c.path })}
<body>
<a class="skip" href="#main">${c.skip}</a>
${nav(c)}
<main id="main">
${hero(c)}

<div id="work" class="works">
<h2 class="visually-hidden">${c.workTitle}</h2>
${voiceflow(c)}
${product(c, wanxiang, 'plain')}
<div class="pair">
${product(c, vibe, 'dark')}
${product(c, method, 'soft')}
</div>
</div>

<section class="tile soft" id="path" aria-labelledby="path-title">
<div class="reveal">
<p class="eyebrow">${c.pathTitle}</p>
<h2 id="path-title">${T(c, c.pathHeadline)}</h2>
</div>
<ol class="path reveal">
${c.journey.map((p) => `<li><span class="when">${esc(p.when)}</span><div><h3>${T(c, p.role)}</h3><p class="org">${T(c, p.org)}</p>${p.desc ? `<p class="what">${T(c, p.desc)}</p>` : ''}</div></li>`).join('\n')}
</ol>
</section>

<section class="tile dark" id="thinking" aria-labelledby="thinking-title">
<figure class="thought reveal">
<p class="eyebrow">${c.thinkingTitle}</p>
<blockquote>
<h2 id="thinking-title" class="pull">${T(c, c.thinkingQuote)}</h2>
${c.thinking.map((p) => `<p>${T(c, p)}</p>`).join('\n')}
</blockquote>
<figcaption>${esc(s1)}<a href="${vibe.site}" ${ext}>${s2}</a>${esc(s3)}</figcaption>
</figure>
</section>

<section class="tile plain" id="photos" aria-labelledby="photos-title">
<div class="reveal">
<p class="eyebrow">${c.photosTitle}</p>
<h2 id="photos-title">${T(c, c.photosHeadline)}</h2>
<p class="sub">${T(c, c.photosIntro)}</p>
</div>
<ul class="gallery" data-gallery tabindex="0" aria-label="${esc(c.photosTitle)}">
${c.photos.map((p) => `<li${p.tall ? ' class="tall"' : ''}>${img(p.key, p.alt, { sizes: '(min-width: 734px) 860px, 540px' })}</li>`).join('\n')}
</ul>
<p class="paddles"><button type="button" data-prev aria-label="${esc(c.prev)}"><span aria-hidden="true">‹</span></button><button type="button" data-next aria-label="${esc(c.next)}"><span aria-hidden="true">›</span></button></p>
</section>

<section class="tile soft" id="contact" aria-labelledby="contact-title">
<div class="reveal">
<p class="eyebrow">${c.contactTitle}</p>
<h2 id="contact-title">${T(c, c.contactHeadline)}</h2>
<p class="sub">${T(c, c.contactLead)}</p>
</div>
<div class="card">
<img class="qr" src="/assets/wechat-qr.png" width="232" height="232" alt="${esc(c.qrAlt)}" decoding="async">
<p class="qr-hint" data-qr-hint data-hint-wechat="${esc(c.hint.wechat)}" data-hint-phone="${esc(c.hint.phone)}" data-hint-desktop="${esc(c.hint.desktop)}">${esc(c.hint.default)}</p>
<p class="cta"><a class="pill" href="/assets/wechat-qr.png" download="qin-xujun-wechat.png" data-qr-save>${c.save}</a><a class="more-link" href="${GITHUB}" ${ext}>${c.github}${chevron}</a></p>
</div>
${signatureRef('sig sig-end')}
</section>
</main>

<footer class="foot">
<div class="foot-inner">
<span>© ${new Date().getFullYear()} ${esc(c.name)}</span>
<a href="${GITHUB}/qinxujunai.github.io" ${ext}>${c.footerSource}</a>
</div>
</footer>
</body>
</html>
`;
}

function notFound() {
  const zh = content.zh;
  const en = content.en;
  return `${head(zh, { canonical: '/404.html', title: `${zh.notFound.title} · ${zh.name}`, noindex: true })}
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

fs.mkdirSync('en', { recursive: true });
fs.writeFileSync('index.html', page(content.zh));
fs.writeFileSync('en/index.html', page(content.en));
fs.writeFileSync('404.html', notFound());
fs.writeFileSync(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
<url><loc>${SITE}/</loc><xhtml:link rel="alternate" hreflang="en" href="${SITE}/en/"/></url>
<url><loc>${SITE}/en/</loc><xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE}/"/></url>
</urlset>
`,
);
for (const f of ['index.html', 'en/index.html', '404.html']) {
  console.log(f, `${(fs.statSync(f).size / 1024).toFixed(1)}KB`);
}
