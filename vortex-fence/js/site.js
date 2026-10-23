/* Vortex Fence: fence switcher, plank boards, reveals, scroll pickets, menu, cursor, mailto form */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    /* ---- reveal on scroll, staggered by --d ---- */
    var rv = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || reduce) {
      rv.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      rv.forEach(function (el) { io.observe(el); });
    }

    /* ---- hero: choose your fence ---- */
    var frame = document.querySelector('.hero-frame');
    var chips = document.querySelectorAll('.chip');
    var imgs = document.querySelectorAll('.hero-img');
    var capNo = document.querySelector('.cap-no');
    var capT = document.querySelector('.cap-t');
    var caps = {
      wood: ['Fig. 04', 'Their photo · a wood privacy fence round a backyard, live oak and palms kept'],
      aluminum: ['Fig. 01', 'Their photo · black aluminum round a pool deck, white arched house behind'],
      vinyl: ['Fig. 02', 'Their photo · white vinyl pickets along a waterfront yard, the bay behind']
    };
    var busy = false;
    function show(style) {
      imgs.forEach(function (im) { im.classList.toggle('is-on', im.getAttribute('data-style') === style); });
      frame.setAttribute('data-profile', style);
      if (capNo && caps[style]) { capNo.textContent = caps[style][0]; capT.textContent = caps[style][1]; }
    }
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var style = chip.getAttribute('data-style');
        if (busy || chip.classList.contains('is-on')) return;
        chips.forEach(function (c) { var on = c === chip; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        if (reduce || !frame) { show(style); return; }
        busy = true;
        frame.classList.remove('opening');
        frame.classList.add('closing');
        setTimeout(function () {
          show(style);
          frame.classList.remove('closing');
          frame.classList.add('opening');
          setTimeout(function () { frame.classList.remove('opening'); busy = false; }, 650);
        }, 560);
      });
    });

    /* ---- service planks ---- */
    var planks = document.querySelectorAll('.plank');
    planks.forEach(function (pl) {
      var btn = pl.querySelector('.plank-btn');
      btn.addEventListener('click', function () {
        planks.forEach(function (p) {
          var on = p === pl;
          p.classList.toggle('is-open', on);
          p.querySelector('.plank-btn').setAttribute('aria-expanded', on ? 'true' : 'false');
        });
      });
    });

    /* ---- scroll progress pickets ---- */
    var bar = document.querySelector('.progress i');
    var dock = document.querySelector('.dock');
    var ticking = false;
    function prog() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (dock) dock.classList.toggle('show', window.scrollY > 520);
      if (bar) bar.style.setProperty('--p', h > 0 ? Math.min(1, window.scrollY / h).toFixed(4) : 0);
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(prog); } }, { passive: true });
    prog();

    /* ---- phone menu sheet ---- */
    var burger = document.querySelector('.burger');
    var sheet = document.getElementById('sheet');
    function setMenu(open) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      sheet.hidden = !open;
      document.body.style.overflow = open ? 'hidden' : '';
    }
    if (burger && sheet) {
      burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
      sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) { setMenu(false); burger.focus(); } });
    }

    /* ---- custom cursor with hover badge ---- */
    var cur = document.querySelector('.cursor');
    if (cur && !reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      root.classList.add('has-cursor');
      var label = cur.querySelector('span');
      window.addEventListener('mousemove', function (e) {
        cur.style.setProperty('--x', e.clientX + 'px');
        cur.style.setProperty('--y', e.clientY + 'px');
        cur.classList.add('live');
        var t = e.target.closest ? e.target.closest('[data-cursor]') : null;
        if (t) { label.textContent = t.getAttribute('data-cursor'); cur.classList.add('lbl'); }
        else { cur.classList.remove('lbl'); }
      }, { passive: true });
      document.addEventListener('mouseleave', function () { cur.classList.remove('live'); });
    }

    /* ---- job ticket form: opens the visitor's own email app ---- */
    var form = document.getElementById('quote');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var f = form.elements;
        var style = (form.querySelector('input[name="style"]:checked') || {}).value || '';
        var name = f.name.value.trim();
        var reach = f.reach.value.trim();
        if (!name || !reach) {
          (name ? f.reach : f.name).focus();
          return;
        }
        var body = 'Hi Vortex Fence,\n\n' +
          'What I need: ' + style + '\n' +
          'Rough length: ' + (f.length.value.trim() || 'not sure yet') + '\n' +
          'Name: ' + name + '\n' +
          'Best way to reach me: ' + reach + '\n\n' +
          (f.notes.value.trim() ? f.notes.value.trim() + '\n\n' : '') +
          'I can text photos of the yard to (914) 474-4754.';
        window.location.href = 'mailto:vortexfence@gmail.com?subject=' + encodeURIComponent('Fence enquiry: ' + style) + '&body=' + encodeURIComponent(body);
      });
    }

    var yr = document.querySelector('.yr');
    if (yr) yr.textContent = new Date().getFullYear();
  });
})();
