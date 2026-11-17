/* Demo-site base kit (factory/kit, 30 Oct 2026): the tested plumbing every demo shares, so builders spend their effort on design.
   Nothing here is visual: each site styles every part itself. Hook elements up with data attributes:
     [data-kit-menu]            button that opens/closes the phone menu sheet (aria-controls = sheet id, else the first [data-kit-sheet])
     [data-kit-sheet]           the full-screen phone menu; links inside close it
     [data-kit-bar]             sticky Call/Text bar on phones; data-kit-bar-hide="#contact" hides it while that element is on screen
     [data-kit-lightbox]        gallery container: its images (or links to images) open in a lightbox with prev/next, keys and swipe;
                                an img's data-kit-lb-src picks the file shown there (e.g. a crop that hides something)
     [data-reveal]              reveal on scroll ("up" default, "fade", "left", "right", "zoom"); [data-reveal-stagger] staggers children
     [data-kit-nav]             nav whose #links get aria-current="true" while their section is on screen
     [data-kit-year]            filled with the current year
     form[data-kit-form]        quote form: submit shows the preview note (fix_forms.py swaps in sc-form.js at publish)
   Also sets on <html>: .kit-js, .kit-scrolled (past 40px), --kit-scroll (0..1 page progress), --kit-bar-h. */
(function () {
  var root = document.documentElement;
  root.classList.add('kit-js');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  function menu() {
    $$('[data-kit-menu]').forEach(function (btn) {
      var id = btn.getAttribute('aria-controls');
      var sheet = (id && document.getElementById(id)) || document.querySelector('[data-kit-sheet]');
      if (!sheet) return;
      btn.setAttribute('aria-expanded', 'false');
      sheet.setAttribute('aria-hidden', 'true');
      sheet.inert = true;
      function set(open) {
        root.classList.toggle('kit-menu-open', open);
        btn.setAttribute('aria-expanded', String(open));
        sheet.setAttribute('aria-hidden', String(!open));
        sheet.inert = !open;
        if (open) { var f = sheet.querySelector('a, button'); if (f) f.focus(); } else btn.focus({ preventScroll: true });
      }
      btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
      sheet.addEventListener('click', function (e) {
        if (e.target.closest('a') || e.target.closest('[data-kit-close]')) set(false);
      });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('kit-menu-open')) set(false); });
      window.matchMedia('(min-width: 901px)').addEventListener('change', function (m) { if (m.matches && root.classList.contains('kit-menu-open')) set(false); });
    });
  }

  function bar() {
    var b = document.querySelector('[data-kit-bar]');
    if (!b) return;
    var size = function () { root.style.setProperty('--kit-bar-h', b.offsetHeight + 'px'); };
    size(); window.addEventListener('resize', size);
    var sel = b.getAttribute('data-kit-bar-hide');
    var hideAt = sel && $$(sel);
    if (hideAt && hideAt.length && 'IntersectionObserver' in window) {
      var seen = new Set();
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.isIntersecting ? seen.add(e.target) : seen.delete(e.target); });
        b.classList.toggle('kit-bar-hidden', seen.size > 0);
      }, { threshold: 0.15 });
      hideAt.forEach(function (el) { io.observe(el); });
    }
  }

  function lightbox() {
    var groups = $$('[data-kit-lightbox]');
    if (!groups.length) return;
    var box = document.createElement('dialog');
    box.className = 'kit-lb';
    box.setAttribute('aria-label', 'Photo viewer');
    box.innerHTML = '<figure class="kit-lb-fig"><img alt=""><figcaption></figcaption></figure>' +
      '<button type="button" class="kit-lb-btn kit-lb-prev" aria-label="Previous photo">&#8249;</button>' +
      '<button type="button" class="kit-lb-btn kit-lb-next" aria-label="Next photo">&#8250;</button>' +
      '<button type="button" class="kit-lb-btn kit-lb-x" aria-label="Close">&#215;</button>';
    document.body.appendChild(box);
    var img = box.querySelector('img'), cap = box.querySelector('figcaption'), list = [], at = 0;
    function item(el) {
      var a = el.closest('a'), im = el.tagName === 'IMG' ? el : el.querySelector('img');
      var fig = el.closest('figure'), fc = fig && fig.querySelector('figcaption');
      return { src: (im && im.getAttribute('data-kit-lb-src')) || (a && /\.(jpe?g|png|webp|avif)(\?|$)/i.test(a.getAttribute('href') || '') ? a.href : (im && (im.currentSrc || im.src))),
               alt: im ? im.alt : '', cap: fc ? fc.textContent.trim() : (im ? im.alt : '') };
    }
    function show(i) { at = (i + list.length) % list.length; img.src = list[at].src; img.alt = list[at].alt; cap.textContent = list[at].cap; }
    groups.forEach(function (g) {
      var els = $$('img', g);
      els.forEach(function (im, i) {
        var hit = im.closest('a') || im;
        if (hit === im) { im.tabIndex = 0; im.setAttribute('role', 'button'); im.style.cursor = 'zoom-in'; }
        function open(e) { e.preventDefault(); list = els.map(item); show(i); box.showModal(); }
        hit.addEventListener('click', open);
        hit.addEventListener('keydown', function (e) { if (hit === im && (e.key === 'Enter' || e.key === ' ')) open(e); });
      });
    });
    box.querySelector('.kit-lb-prev').onclick = function () { show(at - 1); };
    box.querySelector('.kit-lb-next').onclick = function () { show(at + 1); };
    box.querySelector('.kit-lb-x').onclick = function () { box.close(); };
    box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
    box.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(at - 1); if (e.key === 'ArrowRight') show(at + 1); });
    var x0 = null;
    box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) show(at + (dx < 0 ? 1 : -1));
    });
  }

  function reveal() {
    $$('[data-reveal-stagger]').forEach(function (p) {
      Array.prototype.forEach.call(p.children, function (c, i) {
        if (!c.hasAttribute('data-reveal')) c.setAttribute('data-reveal', p.getAttribute('data-reveal-stagger') || 'up');
        c.style.setProperty('--kit-i', i);
      });
    });
    var els = $$('[data-reveal]');
    if (still || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('kit-in'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('kit-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
    // anything already above the fold or skipped by a fast jump still shows
    window.addEventListener('load', function () { setTimeout(function () {
      els.forEach(function (e) { if (e.getBoundingClientRect().top < innerHeight) e.classList.add('kit-in'); });
    }, 60); });
  }

  function scrollState() {
    var ticking = false;
    function upd() {
      ticking = false;
      var y = window.scrollY, h = root.scrollHeight - innerHeight;
      root.classList.toggle('kit-scrolled', y > 40);
      root.style.setProperty('--kit-scroll', h > 0 ? Math.min(1, y / h).toFixed(4) : '0');
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  function nav() {
    var links = $$('[data-kit-nav] a[href^="#"]').filter(function (a) { return a.getAttribute('href').length > 1; });
    if (!links.length || !('IntersectionObserver' in window)) return;
    var by = {};
    links.forEach(function (a) { var s = document.getElementById(a.getAttribute('href').slice(1)); if (s) (by[s.id] = by[s.id] || []).push(a); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        (by[e.target.id] || []).forEach(function (a) { a.setAttribute('aria-current', 'true'); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(by).forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  function forms() {
    $$('form[data-kit-form]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!f.reportValidity()) return;
        var m = f.querySelector('.sc-form-msg');
        if (!m) { m = document.createElement('p'); m.className = 'sc-form-msg'; m.setAttribute('role', 'status'); f.appendChild(m); }
        m.textContent = 'Preview: on your live website, this request would be sent straight to your email.';
      });
    });
  }

  function ready() {
    $$('[data-kit-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });
    menu(); bar(); lightbox(); reveal(); scrollState(); nav(); forms();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();
