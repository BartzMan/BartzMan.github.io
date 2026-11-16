(function () {
  var root = document.documentElement;
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* ---- EN / ES ---- */
  function setLang(l) {
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', l);
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-l') === l)); });
    $$('[data-alt-es]').forEach(function (i) {
      if (!i.hasAttribute('data-alt-en')) i.setAttribute('data-alt-en', i.getAttribute('alt') || '');
      i.setAttribute('alt', l === 'es' ? i.getAttribute('data-alt-es') : i.getAttribute('data-alt-en'));
    });
    $$('[data-ph-es]').forEach(function (i) {
      if (!i.hasAttribute('data-ph-en')) i.setAttribute('data-ph-en', i.getAttribute('placeholder') || '');
      i.setAttribute('placeholder', l === 'es' ? i.getAttribute('data-ph-es') : i.getAttribute('data-ph-en'));
    });
    $$('[data-cap-es]').forEach(function (f) { f.setAttribute('aria-label', l === 'es' ? f.getAttribute('data-cap-es') : f.getAttribute('data-cap-en')); });
    try { localStorage.setItem('cm-lang', l); } catch (e) {}
  }
  var start = 'en';
  try { start = localStorage.getItem('cm-lang') || 'en'; } catch (e) {}
  if (start !== 'es') start = 'en';
  $$('.lang button').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-l')); }); });
  setLang(start);

  /* ---- el menu de techos ---- */
  var rows = $$('.row-btn');
  function openRow(btn, scroll) {
    rows.forEach(function (b) {
      var on = b === btn;
      b.setAttribute('aria-expanded', String(on));
      var p = document.getElementById(b.getAttribute('aria-controls'));
      if (p) p.classList.toggle('on', on);
    });
    if (scroll && window.matchMedia('(max-width:900px)').matches) {
      setTimeout(function () { btn.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 30);
    }
  }
  rows.forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.getAttribute('aria-expanded') === 'true' && window.matchMedia('(max-width:900px)').matches) {
        b.setAttribute('aria-expanded', 'false');
        document.getElementById(b.getAttribute('aria-controls')).classList.remove('on');
        return;
      }
      openRow(b, true);
    });
    b.addEventListener('keydown', function (e) {
      var i = rows.indexOf(b);
      if (e.key === 'ArrowDown' && rows[i + 1]) { e.preventDefault(); rows[i + 1].focus(); }
      if (e.key === 'ArrowUp' && rows[i - 1]) { e.preventDefault(); rows[i - 1].focus(); }
    });
  });
  if (rows[0]) {
    var first = rows[3] || rows[0];
    openRow(first, false);
  }

  /* ---- hurricane checklist ---- */
  var card = document.querySelector('.card');
  if (card) {
    var checks = $$('.check', card);
    var msg = card.querySelector('.done-msg');
    var cnt = card.querySelector('[data-count]');
    function upd() {
      var n = checks.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; }).length;
      card.style.setProperty('--done', n);
      if (cnt) cnt.textContent = n;
      if (msg) msg.classList.toggle('full', n === checks.length);
      card.setAttribute('data-full', n === checks.length ? '1' : '0');
    }
    checks.forEach(function (c) {
      c.addEventListener('click', function () {
        c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true'));
        upd();
      });
    });
    upd();
  }

  /* ---- vitrina filter ---- */
  var chips = $$('.chip');
  chips.forEach(function (ch) {
    ch.addEventListener('click', function () {
      var f = ch.getAttribute('data-f');
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === ch)); });
      $$('.case figure').forEach(function (fig) {
        fig.hidden = !(f === 'all' || fig.getAttribute('data-cat') === f);
      });
    });
  });
})();
