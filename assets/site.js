// Theme, contact hint, the VoiceFlow capsule, tile reveals, the name card and nav tracking.
// The signature is started by a tiny inline script in the hero (see scripts/build.mjs).
(function () {
  window.qxjReady = true;
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
  if (target && text !== null) { target.textContent = text; target.hidden = !text; } // phones: no hint until a tap
  var save = document.querySelector('[data-qr-save]');
  if (save && where !== 'phone') save.hidden = true;
  // Outside WeChat on a phone: one tap copies his WeChat ID and opens WeChat (no app can add a personal
  // contact from a browser). Shown only when the ID is set in src/content.mjs.
  // On a computer the same control only copies the ID, as a quiet text link.
  var copy = document.querySelector('[data-wechat-id]');
  if (copy && where !== 'wechat') {
    copy.hidden = false;
    copy.textContent = copy.getAttribute('data-label-' + where);
    if (where === 'desktop') copy.className = 'more-link';
    copy.addEventListener('click', function () {
      var id = copy.getAttribute('data-wechat-id');
      var done = function () { if (target) { target.textContent = copy.getAttribute('data-copied'); target.hidden = false; } if (where === 'phone') window.location.href = 'weixin://'; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(id).then(done, done);
      else done();
    });
  }

  // Leaving for one of his own sites on this origin (a product, ai.vibecoding, the film): remember where the visitor was,
  // for this tab only. Those sites show 「‹ 返回」 only when this is set, so a link someone was sent directly has none
  // (v27.10; the contract is in docs/back-link.md).
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="' + location.origin + '/"]');
    if (!a || a.target) return;
    var spot = a.closest('[id]:not(#film)');
    try { sessionStorage.setItem('qxj.back', location.origin + location.pathname + (spot ? '#' + spot.id : '')); } catch (err) {}
  });

  // Name card: a slight tilt toward the pointer on desktop.
  var card = document.querySelector('[data-tilt]');
  if (card && !still && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
      card.style.setProperty('--rx', (-y * 10).toFixed(2) + 'deg');
    });
    card.addEventListener('pointerleave', function () {
      card.style.removeProperty('--ry');
      card.style.removeProperty('--rx');
    });
  }

  // A creator card is one link: a tap anywhere on it goes to their Douyin, unless the reader is selecting text.
  document.querySelectorAll('.person').forEach(function (card) {
    var link = card.querySelector('.person-go a');
    if (!link) return;
    card.addEventListener('click', function (e) {
      if (e.target.closest('a') || String(window.getSelection && window.getSelection())) return;
      link.click();
    });
  });

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
        typed.classList.toggle('long', typed.scrollLeft > 0);
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

  var reveals = document.querySelectorAll('.reveal');
  if (!canObserve) {
    root.classList.remove('motion');
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

  // Numbers count up once when they come into view. The real value is already in the HTML.
  var counters = document.querySelectorAll('[data-count]');
  if (!still) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countObserver.unobserve(entry.target);
        var el = entry.target;
        var to = Number(el.getAttribute('data-count'));
        var start = null;
        var tick = function (t) {
          if (start === null) start = t;
          var p = Math.min(1, (t - start) / 1400);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(to * eased).toLocaleString('en-US');
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    for (var n = 0; n < counters.length; n++) countObserver.observe(counters[n]);
  }

  // The statement lights up, character by character, as it scrolls through the middle of the screen.
  var statement = document.querySelector('[data-statement]');
  if (statement) {
    var chars = statement.querySelectorAll('.pull span:not(.clause)');
    var lit = -1;
    var paint = function () {
      var r = statement.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.85 - r.top) / (vh * 0.55);
      var count = still ? chars.length : Math.max(0, Math.min(chars.length, Math.round(p * chars.length)));
      if (count === lit) return;
      lit = count;
      for (var i = 0; i < chars.length; i++) chars[i].classList.toggle('lit', i < count);
    };
    var queued = false;
    window.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; paint(); });
    }, { passive: true });
    window.addEventListener('resize', paint);
    paint();
  }

  // Home: once the big signature scrolls away, the small one in the nav fades in.
  var heroSig = document.querySelector('.home .hero .sig');
  if (heroSig) {
    new IntersectionObserver(function (entries) {
      root.classList.toggle('sig-docked', !entries[0].isIntersecting);
    }, { rootMargin: '-52px 0px 0px 0px' }).observe(heroSig);
  }

  // The nav turns dark while a black tile is under it.
  // At the contact section the card is the way to add him; the nav button would be a second one.
  var contactEl = document.getElementById('contact');
  if (contactEl && canObserve) {
    new IntersectionObserver(function (entries) {
      root.classList.toggle('at-contact', entries[0].isIntersecting);
    }, { rootMargin: '0px 0px -30% 0px' }).observe(contactEl);
  }

  var darks = [].slice.call(document.querySelectorAll('main .dark'));
  if (canObserve) {
    var darkWatch = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.under = e.isIntersecting; });
      root.classList.toggle('nav-dark', darks.some(function (d) { return d.under; }));
    }, { rootMargin: '0px 0px -94% 0px' });
    darks.forEach(function (el) { darkWatch.observe(el); });
  }

  // His film in the first screen: the cover shows until Play. One file, his 4K web version, on two hosts.
  var film = document.getElementById('film');
  var filmCover = document.querySelector('[data-film-play]');
  if (film && filmCover) {
    filmCover.hidden = false;
    var hideCover = function () { filmCover.hidden = true; };
    film.addEventListener('play', hideCover);
    // The active host is on src (WeChat's player reads only src, v27.18), the other follows it in data-sources
    // (src/film-hosts.json). The other is used only when the active one cannot be reached at all: an error, or nothing
    // at all (not even the file's header) within 10 s of Play. A slow host is never switched away from (his rule,
    // 2026-10-25). The switch resumes from the same second. scripts/test-player.cjs checks each case.
    var sources = (film.getAttribute('data-sources') || '').split(' ').filter(Boolean);
    var at = 0, guard = 0;
    var last = function () { return at >= sources.length - 1; };
    // Armed by every 'play' (the cover, the native controls) while nothing has arrived; cleared as soon as any bytes
    // arrive ('progress': a slow host is not a dead one), by the file's header and by a pause.
    var arrived = false;
    var arm = function () {
      if (film.readyState > 0 || arrived || last()) return;
      clearTimeout(guard);
      guard = setTimeout(function () { if (film.readyState === 0 && !arrived) next(); }, 10000);
    };
    var next = function () {
      clearTimeout(guard);
      if (last()) return;
      var t = film.currentTime || 0;
      arrived = false;
      film.src = sources[++at];
      film.load();
      if (t) film.addEventListener('loadedmetadata', function () { film.currentTime = t; }, { once: true });
      start();
    };
    var start = function () {
      var p = film.play();
      if (p && p.catch) p.catch(function () {});
    };
    film.addEventListener('play', arm);
    film.addEventListener('error', next);
    film.addEventListener('progress', function () { arrived = true; clearTimeout(guard); });
    film.addEventListener('loadedmetadata', function () { clearTimeout(guard); });
    film.addEventListener('pause', function () { clearTimeout(guard); });
    filmCover.addEventListener('click', function () {
      hideCover();
      start();
    });
  }

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
  // Home: the nav's sections. Case pages: the sections in the product bar.
  var tracked = ['top', 'work', 'share', 'books', 'path', 'contact'];
  for (var n = 0; n < navLinks.length; n++) tracked.push(navLinks[n].getAttribute('data-nav'));
  tracked.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  // 书架: the covers are tabs; one book open at a time. Arrow keys move between covers (WAI-ARIA tabs).
  var shelf = document.querySelector('[data-shelf]');
  if (shelf) {
    var covers = shelf.querySelectorAll('[role="tab"]');
    var openBook = function (i, focus, animate) {
      for (var b = 0; b < covers.length; b++) {
        var on = b === i;
        covers[b].setAttribute('aria-selected', on ? 'true' : 'false');
        covers[b].tabIndex = on ? 0 : -1;
        var panel = document.getElementById(covers[b].getAttribute('aria-controls'));
        panel.hidden = !on;
        panel.classList.remove('opening');
        if (on && animate) {
          void panel.offsetWidth; // restart the cover animation
          panel.classList.add('opening');
        }
      }
      if (focus) { covers[i].focus(); if (covers[i].scrollIntoView) covers[i].scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    };
    for (var bk = 0; bk < covers.length; bk++) {
      (function (i) {
        covers[i].addEventListener('click', function () {
          openBook(i, false, true);
          var still = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
          // Keep the tapped cover in the shelf's view (phones scroll the shelf sideways).
          shelf.scrollTo({ left: covers[i].offsetLeft - (shelf.clientWidth - covers[i].offsetWidth) / 2, behavior: still });
        });
        covers[i].addEventListener('keydown', function (ev) {
          var d = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0;
          if (ev.key === 'Home') { ev.preventDefault(); openBook(0, true, true); }
          else if (ev.key === 'End') { ev.preventDefault(); openBook(covers.length - 1, true, true); }
          else if (d) { ev.preventDefault(); openBook((i + d + covers.length) % covers.length, true, true); }
        });
      })(bk);
    }
    openBook(0, false);
  }
})();
