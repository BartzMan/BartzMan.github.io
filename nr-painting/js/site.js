(function () {
  var d = document, root = d.documentElement;
  root.classList.add('js');

  /* full-screen phone menu */
  var btn = d.querySelector('.menu-btn'), menu = d.getElementById('menu');
  function setMenu(open) {
    if (!btn || !menu) return;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.hidden = !open;
    d.body.style.overflow = open ? 'hidden' : '';
  }
  if (btn) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1080) setMenu(false); });
  }

  /* one-shot reveals */
  var els = d.querySelectorAll('.reveal, .lot, .cle-word');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  /* colour schemes on the double house */
  var S = {
    lake:     { body: ['Harbour navy', '#1f2d4f'], trim: ['Porch cream', '#f1ead7'], accent: ['Brick red', '#a3322b'], gable: ['Lamplight gold', '#c99a3c'] },
    brooklyn: { body: ['Oxblood', '#7a2c25'], trim: ['Parchment', '#efe3c8'], accent: ['Deep forest', '#2f4a3a'], gable: ['Harvest gold', '#cf9f45'] },
    tremont:  { body: ['Sage', '#6f8a71'], trim: ['Ivory', '#f4efe2'], accent: ['Plum', '#4a2740'], gable: ['Terracotta', '#b0553a'] },
    ohiocity: { body: ['Mustard', '#d3a03a'], trim: ['Chocolate', '#4e2620'], accent: ['Lake teal', '#2b5b63'], gable: ['Lake teal', '#2b5b63'] }
  };
  var wrap = d.querySelector('.double-wrap'), chips = d.querySelectorAll('.chips dd');
  function apply(k) {
    if (!wrap || !S[k]) return;
    wrap.setAttribute('data-scheme', k);
    chips.forEach(function (dd) { var v = S[k][dd.getAttribute('data-k')]; dd.textContent = v[0]; dd.style.setProperty('--sw', v[1]); });
    d.querySelectorAll('.sch').forEach(function (b) { var on = b.getAttribute('data-s') === k; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
  }
  d.querySelectorAll('.sch').forEach(function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-s')); }); });
  apply('lake');

  /* quote form: stays on the page */
  var form = d.getElementById('quote-form');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });
})();
