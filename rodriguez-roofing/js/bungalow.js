/* Rodríguez: the bungalow. EN/ES switch, porch-to-peak picker, Roofing/Remodeling boards, old-house checks. */
(function () {
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var TITLES = { en: document.title, es: 'Rodríguez Techos y Remodelación | San Antonio, TX' };
  var MSG = { en: 'Preview: on your live website, this request would be sent straight to your email.',
              es: 'Vista previa: en su sitio web real, esta solicitud le llegaría directo a su correo.' };
  var lang = 'en';

  function swap(el, attr, val) { if (val != null) el.setAttribute(attr, val); }
  function setLang(l) {
    lang = l === 'es' ? 'es' : 'en';
    $$('[data-es]').forEach(function (el) {
      var svg = el instanceof SVGElement;
      if (el.dataset.en == null) el.dataset.en = svg ? el.textContent : el.innerHTML;
      var v = lang === 'es' ? el.dataset.es : el.dataset.en;
      if (svg) el.textContent = v; else el.innerHTML = v;
    });
    [['data-es-ph', 'placeholder'], ['data-es-aria', 'aria-label'], ['data-es-alt', 'alt']].forEach(function (p) {
      var key = p[0], attr = p[1], store = key + '-en';
      $$('[' + key + ']').forEach(function (el) {
        if (!el.hasAttribute(store)) el.setAttribute(store, el.getAttribute(attr) || '');
        swap(el, attr, lang === 'es' ? el.getAttribute(key) : el.getAttribute(store));
      });
    });
    root.lang = lang;
    document.title = TITLES[lang];
    $$('.bw-lang-btn').forEach(function (a) { if (a.dataset.lang === lang) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    var hint = document.querySelector('.bw-hero-lang'); if (hint) hint.lang = lang === 'es' ? 'en' : 'es';
    $$('.sc-form-msg').forEach(function (m) { m.textContent = MSG[lang]; });
    try { localStorage.setItem('bw-lang', lang); } catch (e) {}
  }
  $$('.bw-lang-btn').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); setLang(a.dataset.lang); });
  });
  var want = (location.search.match(/[?&]lang=(en|es)/) || [])[1];
  if (!want) { try { want = localStorage.getItem('bw-lang'); } catch (e) {} }
  if (want === 'es') setLang('es');
  $$('form[data-kit-form]').forEach(function (f) {
    f.addEventListener('submit', function () { setTimeout(function () { $$('.sc-form-msg', f).forEach(function (m) { m.textContent = MSG[lang]; }); }, 0); });
  });

  /* porch to peak */
  var grid = document.querySelector('.bw-peak-grid');
  if (grid) {
    var pins = $$('.bw-pin', grid);
    pins.forEach(function (p) {
      p.addEventListener('click', function () {
        var part = p.dataset.part;
        grid.dataset.part = part;
        pins.forEach(function (x) { x.setAttribute('aria-pressed', String(x === p)); });
        $$('.bw-panel', grid).forEach(function (pn) { pn.hidden = pn.dataset.panel !== part; });
      });
    });
  }

  /* roofing / remodeling boards */
  var boards = $$('.bw-board');
  function pick(b, focus) {
    boards.forEach(function (x) {
      var on = x === b;
      x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
      var pn = document.getElementById(x.getAttribute('aria-controls')); if (pn) pn.hidden = !on;
    });
    if (focus) b.focus();
  }
  boards.forEach(function (b, i) {
    b.addEventListener('click', function () { pick(b); });
    b.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); pick(boards[(i + 1) % boards.length], true); }
    });
  });

  /* old house, new roof */
  var draw = document.querySelector('.bw-section-draw');
  function show(n) {
    if (draw) draw.dataset.active = n;
    $$('.bw-dot').forEach(function (d) { d.classList.toggle('is-on', d.dataset.x === n); d.setAttribute('aria-pressed', String(d.dataset.x === n)); });
    $$('.bw-check').forEach(function (c) {
      var on = c.dataset.x === n;
      c.setAttribute('aria-expanded', String(on));
      var body = document.getElementById(c.getAttribute('aria-controls')); if (body) body.hidden = !on;
    });
  }
  $$('.bw-dot, .bw-check').forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.x); }); });
  show('1');
})();
