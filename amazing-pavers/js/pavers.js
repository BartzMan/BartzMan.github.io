(function () {
  var root = document.documentElement;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var lang = 'en';
  var STR = {
    mark: { en: 'Mark as decided', es: 'Marcar como decidido' },
    done: { en: 'Decided', es: 'Decidido' },
    msg: { en: 'Preview: on your live website, this request would be sent straight to your email.', es: 'Vista previa: en tu sitio web real, esta solicitud llegaría directo a tu correo.' }
  };
  var both = function (o) { return '<span class="t-en">' + o.en + '</span><span class="t-es" lang="es">' + o.es + '</span>'; };

  /* ---- time of day, tied to scroll ---- */
  var clock = $('[data-clock]');
  function tick() {
    if (!clock) return;
    var h = root.scrollHeight - innerHeight, p = h > 0 ? Math.min(1, scrollY / h) : 0;
    var m = Math.round((16 * 60 + p * 7 * 60) / 5) * 5, hh = Math.floor(m / 60) % 24, mm = m % 60;
    var mins = (mm < 10 ? '0' : '') + mm;
    clock.textContent = lang === 'es' ? hh + ':' + mins : ((hh % 12) || 12) + ':' + mins + ' ' + (hh >= 12 ? 'PM' : 'AM');
  }
  addEventListener('scroll', tick, { passive: true });

  /* ---- EN / ES ---- */
  function setLang(l, save) {
    lang = l;
    root.setAttribute('data-lang', l); root.setAttribute('lang', l);
    $$('[data-lang]').forEach(function (b) { if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === l)); });
    ['alt', 'placeholder', 'aria-label'].forEach(function (a) {
      $$('[data-es-' + a + ']').forEach(function (el) {
        if (!el.hasAttribute('data-en-' + a)) el.setAttribute('data-en-' + a, el.getAttribute(a) || '');
        el.setAttribute(a, l === 'es' ? el.getAttribute('data-es-' + a) : el.getAttribute('data-en-' + a));
      });
    });
    drawZone(); drawMarks(); tick();
    var m = $('.sc-form-msg'); if (m) m.textContent = STR.msg[l];
    if (save) { try { localStorage.setItem('ap-lang', l); } catch (e) {} }
  }
  $$('button[data-lang]').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); }); });

  /* ---- build your backyard ---- */
  var zone = 'fire';
  var yard = $('#yard');
  function drawZone() {
    if (!yard) return;
    $$('.zone-chips button', yard).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-zone') === zone)); });
    $$('#plan-svg .zone').forEach(function (g) { g.classList.toggle('on', g.getAttribute('data-zone') === zone); });
    $$('.zp', yard).forEach(function (z) { if (z.getAttribute('data-zp') === zone) z.setAttribute('data-on', ''); else z.removeAttribute('data-on'); });
    var n = $('[data-n="' + zone + '"]', yard);
    if (!n) return;
    $('[data-zone-title]', yard).innerHTML = both({ en: n.getAttribute('data-t-en'), es: n.getAttribute('data-t-es') });
    $('[data-zone-note]', yard).innerHTML = both({ en: n.getAttribute('data-en'), es: n.getAttribute('data-es') });
  }
  function pick(z, manual) { zone = z; drawZone(); if (manual) $('.plan-card', yard).classList.add('lit'); }
  if (yard) {
    $$('.zone-chips button', yard).forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-zone'), true); }); });
    $$('#plan-svg .zone').forEach(function (g) { g.addEventListener('click', function () { pick(g.getAttribute('data-zone'), true); }); });
  }

  /* ---- 5 things to decide ---- */
  var decided = {};
  function drawMarks() {
    var c = 0;
    $$('.mark').forEach(function (b) {
      var k = b.getAttribute('data-mark'), on = !!decided[k];
      b.setAttribute('aria-pressed', String(on));
      b.innerHTML = both(on ? STR.done : STR.mark);
      if (on) c++;
    });
    $$('.stones button').forEach(function (s) { s.classList.toggle('done', !!decided[s.getAttribute('data-step')]); });
    var d = $('[data-done]'); if (d) d.textContent = c;
  }
  function openStep(k) {
    $$('.stones button').forEach(function (s) { s.setAttribute('aria-expanded', String(s.getAttribute('data-step') === k)); });
    $$('.note').forEach(function (n) { n.hidden = n.getAttribute('data-note') !== k; });
  }
  $$('.stones button').forEach(function (s) { s.addEventListener('click', function () { openStep(s.getAttribute('data-step')); }); });
  $$('.mark').forEach(function (b) { b.addEventListener('click', function () {
    var k = b.getAttribute('data-mark'); decided[k] = !decided[k]; drawMarks();
    if (decided[k]) { var nx = String(Math.min(5, +k + 1)); if (nx !== k && !decided[nx]) openStep(nx); }
  }); });

  /* ---- gallery filter ---- */
  var mosaic = $('.mosaic');
  $$('.chips button').forEach(function (b) { b.addEventListener('click', function () {
    var f = b.getAttribute('data-f');
    $$('.chips button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    $$('.tile', mosaic).forEach(function (t) { t.hidden = !(f === 'all' || t.getAttribute('data-k') === f); });
    mosaic.classList.toggle('filtered', f !== 'all');
  }); });

  /* ---- start ---- */
  var saved = null; try { saved = localStorage.getItem('ap-lang'); } catch (e) {}
  setLang(saved === 'es' ? 'es' : 'en', false);
  drawMarks();
})();
