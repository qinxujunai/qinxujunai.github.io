// Theme, contact hint, signature writing, the VoiceFlow capsule, gallery paddles, tile reveals and nav tracking.
(function () {
  var root = document.documentElement;
  var KEY = 'qxj.theme';
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canObserve = 'IntersectionObserver' in window;

  // Theme
  var toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem(KEY, next); } catch (e) {}
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'dark' ? '#000000' : '#ffffff');
    });
  }
  try {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var follow = function (e) {
      var stored = null;
      try { stored = localStorage.getItem(KEY); } catch (err) {}
      if (!stored) root.dataset.theme = e.matches ? 'dark' : 'light';
    };
    if (mq.addEventListener) mq.addEventListener('change', follow);
  } catch (e) {}

  // Contact: WeChat can long-press the image; other phones save it and scan from the album.
  var ua = navigator.userAgent;
  var where = /MicroMessenger/i.test(ua) ? 'wechat' : /Android|iPhone|iPad|iPod|Mobile/i.test(ua) ? 'phone' : 'desktop';
  var target = document.querySelector('[data-qr-hint]');
  var text = target && target.getAttribute('data-hint-' + where);
  if (text) target.textContent = text;
  var save = document.querySelector('[data-qr-save]');
  if (save && where === 'wechat') save.hidden = true;

  // Signature: reveal each character in turn, once per visit.
  var sig = document.querySelector('.hero .sig');
  var seen = false;
  try { seen = sessionStorage.getItem('qxj.signed') === '1'; } catch (e) {}
  if (!(sig && !still && !seen)) root.classList.remove('sig-pending');
  else {
    var paths = sig.querySelectorAll('path');
    for (var i = 0; i < paths.length; i++) paths[i].style.setProperty('--at', 0.2 + i * 0.5 + 's');
    sig.classList.add('write');
    root.classList.remove('sig-pending');
    try { sessionStorage.setItem('qxj.signed', '1'); } catch (e) {}
  }

  // VoiceFlow capsule: confirmed characters appear at a fixed 48 ms rhythm, as in the product.
  var typed = document.querySelector('.typed');
  if (typed && !still && canObserve) {
    var lines = [];
    try { lines = JSON.parse(typed.getAttribute('data-lines')) || []; } catch (e) {}
    var capsule = typed.parentNode;
    var line = 0, pos = 0, timer = null, running = false;
    var step = function () {
      var chars = Array.from(lines[line]);
      if (pos <= chars.length) {
        typed.textContent = chars.slice(0, pos).join('');
        typed.scrollLeft = typed.scrollWidth;
        capsule.classList.add('listening');
        pos++;
        timer = setTimeout(step, 48);
      } else {
        capsule.classList.remove('listening');
        timer = setTimeout(function () { line = (line + 1) % lines.length; pos = 0; step(); }, 1800);
      }
    };
    new IntersectionObserver(function (entries) {
      var visible = entries[0].isIntersecting;
      if (visible && !running) { running = true; step(); }
      if (!visible && running) { running = false; clearTimeout(timer); }
    }, { threshold: 0.4 }).observe(capsule);
  }

  // Gallery paddles
  var gallery = document.querySelector('[data-gallery]');
  var prev = document.querySelector('[data-prev]');
  var next = document.querySelector('[data-next]');
  if (gallery && prev && next) {
    var page = function (dir) {
      gallery.scrollBy({ left: dir * gallery.clientWidth * 0.8, behavior: still ? 'auto' : 'smooth' });
    };
    var sync = function () {
      prev.disabled = gallery.scrollLeft <= 4;
      next.disabled = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 4;
    };
    prev.addEventListener('click', function () { page(-1); });
    next.addEventListener('click', function () { page(1); });
    gallery.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }

  var reveals = document.querySelectorAll('.reveal');
  if (!canObserve) {
    for (var r = 0; r < reveals.length; r++) reveals[r].classList.add('in');
    return;
  }

  // Tiles settle in once as they enter the viewport.
  var revealObserver = new IntersectionObserver(function (entries) {
    for (var e = 0; e < entries.length; e++) {
      if (entries[e].isIntersecting) {
        entries[e].target.classList.add('in');
        revealObserver.unobserve(entries[e].target);
      }
    }
  }, { rootMargin: '0px 0px -8% 0px' });
  for (var q = 0; q < reveals.length; q++) revealObserver.observe(reveals[q]);

  // Section tracking for the nav.
  var navLinks = document.querySelectorAll('[data-nav]');
  var current = null;
  var setCurrent = function (id) {
    if (id === current) return;
    current = id;
    for (var k = 0; k < navLinks.length; k++) {
      if (navLinks[k].getAttribute('data-nav') === id) navLinks[k].setAttribute('aria-current', 'true');
      else navLinks[k].removeAttribute('aria-current');
    }
  };
  var sectionObserver = new IntersectionObserver(function (entries) {
    for (var e = 0; e < entries.length; e++) if (entries[e].isIntersecting) setCurrent(entries[e].target.id);
  }, { rootMargin: '-40% 0px -55% 0px' });
  ['work', 'path', 'thinking', 'photos', 'contact'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });
})();
