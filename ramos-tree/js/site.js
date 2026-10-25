(function () {
  var d = document, b = d.body, root = d.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* menu sheet */
  var burger = d.querySelector('.burger'), sheet = d.getElementById('sheet');
  function closeSheet() { if (!sheet) return; sheet.hidden = true; burger.setAttribute('aria-expanded', 'false'); b.style.overflow = ''; }
  if (burger && sheet) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      if (open) { closeSheet(); } else { sheet.hidden = false; burger.setAttribute('aria-expanded', 'true'); b.style.overflow = 'hidden'; }
    });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) closeSheet(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
  }

  /* reveal on scroll */
  var rev = d.querySelectorAll('[data-reveal], .cleared, .storm');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    rev.forEach(function (el, i) { el.style.transitionDelay = (el.hasAttribute('data-reveal') ? (i % 4) * 90 : 0) + 'ms'; io.observe(el); });
  } else { rev.forEach(function (el) { el.classList.add('in'); }); }

  /* the site plan clears as you scroll */
  var plat = d.querySelector('.plat'), fig = d.querySelector('.plat-fig');
  var trees = plat ? plat.querySelectorAll('.tr') : [];
  var total = trees.length;
  var countEl = d.querySelector('.counter-n'), statusEl = d.querySelector('.status-v');
  var hero = d.querySelector('.hero'), htrees = hero ? hero.querySelectorAll('.tr') : [];
  var chain = d.querySelector('.chain'), sta = d.querySelector('.chain-sta b');

  function setPlat(p) {
    var left = 0;
    for (var i = 0; i < total; i++) {
      var gone = p >= parseFloat(trees[i].getAttribute('data-t'));
      trees[i].classList.toggle('gone', gone);
      if (!gone) left++;
    }
    if (countEl) countEl.textContent = left < 10 ? '0' + left : String(left);
    if (statusEl) statusEl.textContent = left === total ? 'Wooded' : (left === 0 ? 'Cleared, ready for the build' : 'Clearing');
    plat.classList.toggle('done', left === 0);
  }

  function tick() {
    var vh = window.innerHeight, y = window.scrollY || root.scrollTop;
    var max = root.scrollHeight - vh;
    var p = max > 0 ? Math.min(1, y / max) : 0;
    if (chain) chain.style.setProperty('--p', p.toFixed(4));
    if (sta) { var ft = Math.round(p * 2640); sta.textContent = Math.floor(ft / 100) + '+' + ('0' + ft % 100).slice(-2); }
    b.classList.toggle('scrolled', y > 40);
    if (plat && fig && !reduce) {
      var r = fig.getBoundingClientRect();
      /* 0 while the drawing's top is in the lower part of the screen, 1 once it has scrolled a little past the top */
      var prog = (vh * 0.85 - r.top) / (vh * 0.85 + r.height * 0.25);
      setPlat(Math.max(0, Math.min(1, prog)));
    }
    if (hero && !reduce) {
      var hp = Math.max(0, Math.min(1, y / (hero.offsetHeight * 0.8)));
      htrees.forEach(function (t) { t.classList.toggle('gone', hp >= parseFloat(t.getAttribute('data-t'))); });
    }
  }
  var queued = false;
  function onScroll() { if (!queued) { queued = true; requestAnimationFrame(function () { queued = false; tick(); }); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  if (reduce && plat) { setPlat(1); }
  tick();

  /* legend swipe dots on phones */
  var bento = d.querySelector('.bento'), dots = d.querySelectorAll('.legend-swipe i');
  if (bento && dots.length) {
    bento.addEventListener('scroll', function () {
      var w = bento.scrollWidth - bento.clientWidth, k = w > 0 ? Math.round(bento.scrollLeft / w * (dots.length - 1)) : 0;
      dots.forEach(function (x, i) { x.style.background = i === k ? '#1F2124' : ''; });
    }, { passive: true });
  }

  /* job ticket opens the visitor's email app */
  var form = d.getElementById('jobticket');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, err = form.querySelector('.jt-err');
      if (!f.name.value.trim() || !f.reach.value.trim()) { err.hidden = false; (f.name.value.trim() ? f.reach : f.name).focus(); return; }
      err.hidden = true;
      var body = 'Name: ' + f.name.value + '\nPhone or email: ' + f.reach.value + '\nJob: ' + f.job.value +
        '\nLot address or area: ' + f.where.value + '\n\nNotes:\n' + f.notes.value + '\n\n(Photos attached if any.)';
      window.location.href = 'mailto:ramostreeservice@gmail.com?subject=' + encodeURIComponent('Job ticket: ' + f.job.value) + '&body=' + encodeURIComponent(body);
    });
  }
})();
