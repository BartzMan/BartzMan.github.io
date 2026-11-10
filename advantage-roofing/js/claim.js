(function () {
  'use strict';
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* stamps: stamp in when they scroll into view */
  function stampIn(el, delay) { setTimeout(function () { el.classList.add('in'); }, delay || 0); }
  var seen = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { stampIn(e.target, 250); seen.unobserve(e.target); } });
  }, { threshold: 0.55 }) : null;
  $$('.cf-stamp').forEach(function (s) {
    if (s.hasAttribute('data-log-stamp')) return;
    if (seen) seen.observe(s); else s.classList.add('in');
  });

  /* tab sets: claim timeline + agents */
  function tabs(root, btnSel) {
    var btns = $$(btnSel, root);
    function open(b) {
      btns.forEach(function (x) {
        var on = x === b;
        x.setAttribute('aria-selected', on ? 'true' : 'false');
        x.tabIndex = on ? 0 : -1;
        var p = document.getElementById(x.getAttribute('aria-controls'));
        if (!p) return;
        p.hidden = !on;
        if (on) { $$('.cf-stamp', p).forEach(function (s) { s.classList.remove('in'); void s.offsetWidth; stampIn(s, 180); }); }
      });
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { open(b); });
      b.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
        if (n === null) return;
        n = (n + btns.length) % btns.length; btns[n].focus(); open(btns[n]); e.preventDefault();
      });
    });
  }
  $$('[data-timeline]').forEach(function (r) { tabs(r, '.cf-stage'); });
  $$('[data-agents]').forEach(function (r) { tabs(r, '[role="tab"]'); });

  /* photo log checklist */
  $$('[data-log]').forEach(function (log) {
    var btns = $$('button', log), n = log.querySelector('[data-log-n]'), msg = log.querySelector('[data-log-msg]'), st = log.querySelector('[data-log-stamp]');
    function update() {
      var c = btns.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).length;
      n.textContent = c;
      if (c === btns.length) { msg.textContent = 'All six photographed and dated. That is a solid start to a file. Now call a roofer.'; st.classList.remove('in'); void st.offsetWidth; st.classList.add('in'); }
      else { msg.textContent = c ? (btns.length - c) + ' to go. Stay on the ground.' : 'Tick the photos as you take them.'; st.classList.remove('in'); }
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); update(); }); });
  });

  /* exhibit filter */
  $$('.cf-filter').forEach(function (f) {
    var btns = $$('button', f), figs = $$('.cf-ex');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-f');
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        document.querySelector('.cf-gallery').classList.toggle('is-f', k !== 'all');
        figs.forEach(function (fg) { fg.hidden = !(k === 'all' || fg.getAttribute('data-cat') === k); });
      });
    });
  });
})();

