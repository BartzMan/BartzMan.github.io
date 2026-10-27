(function () {
  var d = document;
  // full-screen menu
  var menu = d.getElementById('menu'), btn = d.querySelector('.menu-btn');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    d.body.style.overflow = open ? 'hidden' : '';
    if (open) menu.querySelector('.close').focus(); else btn.focus({ preventScroll: true });
  }
  if (menu && btn) {
    btn.addEventListener('click', function () { setMenu(true); });
    menu.querySelector('.close').addEventListener('click', function () { setMenu(false); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });
  }

  // oversized words: fit the line to the width of its block
  function fit() {
    d.querySelectorAll('[data-fit]').forEach(function (el) {
      var min = +(el.getAttribute('data-fit-min') || 0);
      el.style.fontSize = '';
      if (window.innerWidth < min) return;
      var box = el.parentElement, cs = getComputedStyle(box);
      var avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      el.style.display = 'inline-block'; el.style.whiteSpace = 'nowrap';
      var base = parseFloat(getComputedStyle(el).fontSize), w = el.getBoundingClientRect().width;
      if (w > 0) el.style.fontSize = (base * avail * (+el.getAttribute('data-fit') || 1) / w).toFixed(2) + 'px';
    });
  }
  fit();
  window.addEventListener('resize', fit);
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(fit);

  // sheet-metal section: the trunk tees into the big duct
  function sizeTee() {
    var sm = d.getElementById('sheet-metal'); if (!sm) return;
    var duct = sm.querySelector('.bigduct');
    sm.style.setProperty('--th', (duct.offsetTop + 4) + 'px');
  }
  sizeTee();
  window.addEventListener('resize', sizeTee);
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(sizeTee);

  // one-shot reveals: the duct gets run as you scroll
  var els = d.querySelectorAll('[data-io],[data-reveal]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  // quote form: stays on the page
  var f = d.getElementById('quote-form');
  if (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = f.elements.name, phone = f.elements.phone;
      if (!name.value.trim()) { name.focus(); return; }
      if (!phone.value.trim()) { phone.focus(); return; }
      f.closest('.wo').classList.add('sent');
    });
  }
  var y = d.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
})();
