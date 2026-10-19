// Theme toggle, contact hint for the current app, and the signature's one-time writing.
(function () {
  var root = document.documentElement;
  var KEY = 'qxj.theme';

  var toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem(KEY, next); } catch (e) {}
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'dark' ? '#121316' : '#ffffff');
    });
  }

  // Follow the system until the visitor chooses.
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
  var sig = document.querySelector('.sig');
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seen = false;
  try { seen = sessionStorage.getItem('qxj.signed') === '1'; } catch (e) {}
  if (!(sig && !still && !seen && sig.querySelectorAll)) root.classList.remove('sig-pending');
  else {
    var paths = sig.querySelectorAll('path');
    for (var i = 0; i < paths.length; i++) paths[i].style.setProperty('--at', 0.2 + i * 0.5 + 's');
    sig.classList.add('write');
    root.classList.remove('sig-pending');
    try { sessionStorage.setItem('qxj.signed', '1'); } catch (e) {}
  }
})();
