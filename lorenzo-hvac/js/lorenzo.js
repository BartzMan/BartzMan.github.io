/* Lorenzo Heating & Cooling: the 24-hour curve, and the repair-or-replace guide. */
(function () {
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- day curve ---- */
  var box = document.querySelector('[data-day]');
  if (box) {
    var tabs = $$('[role=tab]', box), dots = $$('.stop', box);
    var marker = box.querySelector('#marker'), sun = box.querySelector('#mk-sun'), moon = box.querySelector('#mk-moon');
    var hx = function (h) { return 60 + h / 24 * 1080; };
    var hy = function (h) { return 300 - (0.5 + 0.5 * Math.cos((h - 15) * 2 * Math.PI / 24)) * 220; };
    var cur = 15, raf = 0;
    function place(h) {
      marker.setAttribute('transform', 'translate(' + hx(h).toFixed(1) + ' ' + hy(h).toFixed(1) + ')');
      var night = h >= 19.5 || h < 5.5;
      sun.style.display = night ? 'none' : '';
      moon.style.display = night ? '' : 'none';
    }
    function glide(to) {
      cancelAnimationFrame(raf);
      if (still) { cur = to; place(to); return; }
      var from = cur, t0 = null, dur = 750;
      function step(t) {
        if (t0 === null) t0 = t;
        var p = Math.min(1, (t - t0) / dur), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        cur = from + (to - from) * e; place(cur);
        if (p < 1) raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
    }
    function pick(h, focusTab) {
      tabs.forEach(function (t) {
        var on = Number(t.getAttribute('data-h')) === h;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var p = document.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
        if (on && focusTab) t.focus();
      });
      dots.forEach(function (d) { d.setAttribute('aria-pressed', Number(d.getAttribute('data-h')) === h ? 'true' : 'false'); });
      glide(h);
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(Number(t.getAttribute('data-h')), false); });
      t.addEventListener('keydown', function (e) {
        var j = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i + tabs.length - 1) % tabs.length;
        if (j > -1) { e.preventDefault(); pick(Number(tabs[j].getAttribute('data-h')), true); }
      });
    });
    dots.forEach(function (d) {
      var go = function () { pick(Number(d.getAttribute('data-h')), false); };
      d.addEventListener('click', go);
      d.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
    pick(15, false);
  }

  /* ---- repair or replace ---- */
  var dec = document.querySelector('[data-decide]');
  if (dec) {
    var age = dec.querySelector('#age'), n = dec.querySelector('[data-age-n]');
    var chips = $$('.chips button', dec), meter = dec.querySelector('[data-meter]');
    var vt = dec.querySelector('[data-verdict-t]'), vp = dec.querySelector('[data-verdict-p]');
    var out = [
      ['Usually repair', 'A newer system with few problems is often worth repairing. Ask what is actually wrong before you decide anything bigger.'],
      ['Worth weighing up', 'Age plus repeat repairs or comfort problems means it is time to compare repairing with replacing. Ask for both options.'],
      ['Time to look at replacing', 'An older system with several problems tends to cost more to keep patching. A technician can check it and talk through the options.']
    ];
    function update() {
      var a = Number(age.value);
      n.textContent = a >= 25 ? '25+' : a;
      var score = (a >= 16 ? 3 : a >= 12 ? 2 : a >= 8 ? 1 : 0);
      chips.forEach(function (c) { if (c.getAttribute('aria-pressed') === 'true') score++; });
      var k = score <= 1 ? 0 : score <= 3 ? 1 : 2;
      vt.textContent = out[k][0]; vp.textContent = out[k][1];
      meter.style.width = Math.max(8, Math.round(score / 7 * 100)) + '%';
    }
    age.addEventListener('input', update);
    chips.forEach(function (c) {
      c.addEventListener('click', function () { c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); update(); });
    });
    update();
  }
})();
