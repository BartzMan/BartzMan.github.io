/* Mandarina Electrical / CITRUS CURRENT */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return [].slice.call((c || d).querySelectorAll(s)); }

  var rvs = $$('[data-rv]'), once = [];
  function onView(el, fn, at) { once.push({ el: el, fn: fn, at: at || 0.9 }); }
  function sweep() {
    var h = window.innerHeight;
    rvs = rvs.filter(function (el) {
      if (el.getBoundingClientRect().top < h * 0.92) { el.classList.add('rv-on'); return false; }
      return true;
    });
    once = once.filter(function (o) {
      var r = o.el.getBoundingClientRect();
      if (r.top < h * o.at && r.bottom > 0) { o.fn(); return false; }
      return true;
    });
  }

  /* ---------- EN / ES: every string carries its Spanish in data-es ---------- */
  var ATTRS = [['data-es-alt', 'alt'], ['data-es-ph', 'placeholder'], ['data-es-aria', 'aria-label']];
  function setLang(lang, save) {
    var es = lang === 'es';
    root.setAttribute('lang', es ? 'es' : 'en');
    $$('[data-es]').forEach(function (el) {
      if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.textContent);
      el.textContent = es ? el.getAttribute('data-es') : el.getAttribute('data-en');
    });
    ATTRS.forEach(function (pair) {
      $$('[' + pair[0] + ']').forEach(function (el) {
        var keep = 'data-en-' + pair[1];
        if (!el.hasAttribute(keep)) el.setAttribute(keep, el.getAttribute(pair[1]) || '');
        el.setAttribute(pair[1], es ? el.getAttribute(pair[0]) : el.getAttribute(keep));
      });
    });
    $$('[data-lang-set]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang-set') === lang ? 'true' : 'false'); });
    if (save) { try { sessionStorage.setItem('mandarina-lang', lang); } catch (e) { /* storage blocked */ } }
  }
  $$('[data-lang-set]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang-set'), true); });
  });
  try { if (sessionStorage.getItem('mandarina-lang') === 'es') setLang('es', false); } catch (e) { /* storage blocked */ }

  /* 1. hero: the slice segments fan in, the charger bar fills, the percent counts */
  var hero = $('.cx-hero'), pct = $('.cx-charge-n');
  if (hero) requestAnimationFrame(function () { hero.classList.add('is-on'); });
  if (pct && !still) {
    pct.textContent = '0%';
    var t0 = null;
    setTimeout(function () {
      requestAnimationFrame(function step(ts) {
        if (!t0) t0 = ts;
        var k = Math.min(1, (ts - t0) / 2400), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        pct.textContent = Math.round(100 * e) + '%';
        if (k < 1) requestAnimationFrame(step);
      });
    }, 800);
  }

  /* 2. segment wheel: buttons and the wheel's own segments pick a service */
  var tabs = $$('.cx-seg-btns [role=tab]'), panels = $$('.cx-seg-p'), segs = $$('.cx-wheel-svg path'), cores = $$('.cx-core-img');
  function pick(i, focus) {
    tabs.forEach(function (t, j) { t.setAttribute('aria-selected', j === i ? 'true' : 'false'); t.tabIndex = j === i ? 0 : -1; });
    panels.forEach(function (p, j) {
      var was = p.hidden; p.hidden = j !== i;
      if (j === i && was && !still) { p.classList.remove('is-in'); void p.offsetWidth; p.classList.add('is-in'); }
    });
    segs.forEach(function (s, j) { s.classList.toggle('on', j === i); });
    cores.forEach(function (c, j) { c.classList.toggle('is-on', j === i); });
    if (focus) tabs[i].focus();
  }
  if (tabs.length) {
    pick(0);
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(i); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); pick(n, true); }
      });
    });
    segs.forEach(function (s, i) { s.addEventListener('click', function () { pick(i); }); });
  }

  /* 3. day / night switch */
  var dn = $('.cx-dn'), sw = $('.cx-dn-sw'), lbl = $('.cx-dn-lbl');
  if (dn && sw) sw.addEventListener('click', function () {
    var night = sw.getAttribute('aria-checked') !== 'true';
    sw.setAttribute('aria-checked', night ? 'true' : 'false');
    dn.classList.toggle('is-night', night);
    lbl.setAttribute('data-en', night ? 'Show day' : 'Show night');
    lbl.setAttribute('data-es', night ? 'Ver de día' : 'Ver de noche');
    lbl.textContent = root.getAttribute('lang') === 'es' ? lbl.getAttribute('data-es') : lbl.getAttribute('data-en');
  });

  /* 4. Miami: the street rises in its half-sun as the section scrolls up */
  var sun = $('.cx-sunrise');
  function rise() {
    if (!sun || still) return;
    var r = sun.getBoundingClientRect(), h = window.innerHeight;
    var k = Math.max(0, Math.min(1, (h - r.top) / (h + r.height * 0.4)));
    sun.style.setProperty('--rise', (-15 * k).toFixed(2) + '%');
  }

  /* 5. rating slice: five segments light one after another */
  var rate = $('.cx-rate');
  if (rate) onView(rate, function () { rate.classList.add('is-on'); }, 0.95);

  /* phone sheet */
  var burger = $('.cx-burger'), sheet = $('#cx-sheet');
  if (burger && sheet) {
    var setSheet = function (open) {
      sheet.hidden = !open;
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      $('use', burger).setAttribute('href', open ? '#i-close' : '#i-menu');
      root.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () { setSheet(burger.getAttribute('aria-expanded') !== 'true'); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setSheet(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) { setSheet(false); burger.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 1060 && !sheet.hidden) setSheet(false); });
  }

  /* request form: the publishing step wires delivery */
  var form = $('#quote');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });

  function tick() { sweep(); rise(); }
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick, { passive: true });
  window.addEventListener('load', tick);
  tick();
})();
