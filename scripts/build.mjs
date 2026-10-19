// Renders index.html, en/index.html and 404.html from src/content.mjs.
// No runtime dependencies: the output is plain HTML that GitHub Pages serves from main.
import fs from 'node:fs';
import { content, SITE, GITHUB } from '../src/content.mjs';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const signature = fs
  .readFileSync(new URL('../src/signature.svg', import.meta.url), 'utf8')
  .trim()
  .replace('<svg xmlns="http://www.w3.org/2000/svg"', '<svg class="sig" aria-hidden="true" focusable="false"');

const ext = 'rel="noopener"';

// Runs before first paint so the theme never flashes.
const themeScript =
  "<script>(function(){var t=null;try{t=localStorage.getItem('qxj.theme')}catch(e){}" +
  "if(t!=='light'&&t!=='dark'){t=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}" +
  "document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name=theme-color]');" +
  "if(m)m.setAttribute('content',t==='dark'?'#121316':'#ffffff');" +
  // Hide the signature before first paint only when it is about to be written; never leave it hidden.
  "var r=document.documentElement,s=null;try{s=sessionStorage.getItem('qxj.signed')}catch(e){}" +
  "if(s!=='1'&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){r.classList.add('sig-pending');" +
  "setTimeout(function(){r.classList.remove('sig-pending')},3000)}})()</script>";

const sunMoon = `<svg class="theme-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg><svg class="theme-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></svg>`;

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
<link rel="stylesheet" href="/assets/site.css">
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

function bar(c) {
  return `<nav class="bar" aria-label="${c.lang === 'en' ? 'Site' : '站点'}">
<a href="${c.switchHref}" hreflang="${c.switchLang}" lang="${c.switchLang}">${c.switchLabel}</a>
<button type="button" data-theme-toggle aria-label="${esc(c.themeLabel)}">${sunMoon}</button>
</nav>`;
}

function voiceStage(item) {
  const v = item.voice;
  return `<div class="stage voice" role="img" aria-label="${esc(`${item.name}: ${v.hint}. ${v.text}`)}">
<kbd aria-hidden="true">${esc(v.key)}</kbd>
<p class="hint" aria-hidden="true">${esc(v.hint)}</p>
<div class="capsule" aria-hidden="true"><span class="bars"><i></i><i></i><i></i></span><span>${esc(v.text)}<span class="caret"></span></span></div>
</div>`;
}

function links(c, item) {
  return `<p class="links"><a href="${item.site}" ${ext}>${c.siteLabel}<span class="visually-hidden">: ${esc(item.name)}</span></a><a href="${item.repo}" ${ext}>${c.repoLabel}<span class="visually-hidden">: ${esc(item.name)}</span></a></p>`;
}

// The featured piece: name first, then the product itself, then one decision behind it.
function featured(c, item) {
  return `<article class="feature" id="${item.id}">
<h3>${esc(item.name)}</h3>
<p class="tagline">${esc(item.tagline)}</p>
${voiceStage(item)}
<p class="desc">${esc(item.desc)}</p>
<p class="decision">${esc(item.decision)} <a href="${item.decisionLink.href}" ${ext}>${esc(item.decisionLink.label)}</a></p>
${links(c, item)}
</article>`;
}

function entry(c, item) {
  return `<li id="${item.id}">
<h3>${esc(item.name)}</h3>
<p class="tagline">${esc(item.tagline)}</p>
<p class="desc">${esc(item.desc)}</p>
${links(c, item)}
</li>`;
}

function page(c) {
  const [m1, m2, m3] = c.more;
  const [first, ...rest] = c.work;
  return `${head(c, { canonical: c.path })}
<body>
<a class="skip" href="#main">${c.skip}</a>
<div class="page">
${bar(c)}
<main id="main">
<header class="intro">
<h1>${signature}<span class="visually-hidden">${esc(c.name)}</span></h1>
<p class="lede">${esc(c.lede)}</p>
<p class="now">${esc(c.now)}</p>
<p class="actions"><a class="button primary" href="#contact">${c.addWechat}</a><a class="button" href="#work">${c.seeWork}</a></p>
</header>

<section id="work" aria-labelledby="work-title">
<h2 id="work-title">${c.workTitle}</h2>
${featured(c, first)}
<ul class="work">
${rest.map((w) => entry(c, w)).join('\n')}
</ul>
<p class="more">${esc(m1)}<a href="${GITHUB}" ${ext}>${m2}</a>${esc(m3)}</p>
</section>

<section id="about" class="about" aria-labelledby="about-title">
<h2 id="about-title">${c.aboutTitle}</h2>
${c.about.map((p) => `<p>${esc(p)}</p>`).join('\n')}
</section>

<section id="contact" class="contact" aria-labelledby="contact-title">
<h2 id="contact-title">${c.contactTitle}</h2>
<p>${esc(c.contactLead)}</p>
<img class="qr" src="/assets/wechat-qr.png" width="232" height="232" alt="${esc(c.qrAlt)}" decoding="async">
<p class="qr-hint" data-qr-hint data-hint-wechat="${esc(c.hint.wechat)}" data-hint-phone="${esc(c.hint.phone)}" data-hint-desktop="${esc(c.hint.desktop)}">${esc(c.hint.default)}</p>
<p class="actions"><a class="button" href="/assets/wechat-qr.png" download="qin-xujun-wechat.png" data-qr-save>${c.save}</a><a class="button" href="${GITHUB}" ${ext}>${c.github}</a></p>
</section>
</main>

<footer>
<span>© ${new Date().getFullYear()} ${esc(c.name)}</span>
<a href="${GITHUB}/qinxujunai.github.io" ${ext}>${c.footerSource}</a>
</footer>
</div>
</body>
</html>
`;
}

function notFound() {
  const zh = content.zh;
  const en = content.en;
  return `${head(zh, { canonical: '/404.html', title: `${zh.notFound.title} · ${zh.name}`, noindex: true })}
<body>
<div class="page">
<main class="intro" id="main">
<h1 class="lede">${zh.notFound.title}</h1>
<p class="now">${zh.notFound.body}</p>
<p class="now" lang="en">${en.notFound.title}. ${en.notFound.body}</p>
<p class="actions"><a class="button primary" href="/">${zh.notFound.back}</a><a class="button" href="/en/" lang="en">${en.notFound.back}</a></p>
</main>
</div>
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
