(function () {
  var d = document, root = d.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* full-screen menu */
  var btn = d.querySelector('.menu-btn'), menu = d.getElementById('menu');
  function setMenu(open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.querySelector('.sr').textContent = open ? 'Close menu' : 'Open menu';
    if (open) { menu.hidden = false; requestAnimationFrame(function () { menu.classList.add('open'); }); }
    else { menu.classList.remove('open'); menu.hidden = true; }
    d.body.style.overflow = open ? 'hidden' : '';
  }
  if (btn && menu) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); btn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 1180 && !menu.hidden) setMenu(false); });
  }

  /* one-shot reveals: each block is "dug" open once */
  var targets = d.querySelectorAll('.dig, .xs, .cut-type');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
  }

  /* depth gauge: reads how far down the page you are, in feet, and which layer you are in */
  var gv = d.querySelector('.g-v'), gs = d.querySelector('.g-s');
  var layers = Array.prototype.slice.call(d.querySelectorAll('[data-stratum]'));
  var ticking = false;
  function gauge() {
    ticking = false;
    var max = Math.max(1, d.documentElement.scrollHeight - window.innerHeight);
    var inches = Math.round(Math.min(1, window.scrollY / max) * 96);
    var ft = Math.floor(inches / 12), inch = inches % 12;
    gv.textContent = ft + "'-" + (inch < 10 ? '0' : '') + inch + '"';
    var mid = window.innerHeight * 0.4, name = layers.length ? layers[0].getAttribute('data-stratum') : '';
    for (var i = 0; i < layers.length; i++) { if (layers[i].getBoundingClientRect().top < mid) name = layers[i].getAttribute('data-stratum'); }
    gs.textContent = name;
  }
  if (gv && gs) {
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(gauge); } }, { passive: true });
    gauge();
  }

  /* quote form (demo: stays on the page) */
  var form = d.getElementById('quote-form');
  var tno = d.getElementById('tno');
  if (tno) tno.textContent = String(1000 + Math.floor(Math.random() * 8999));
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.form-msg');
      var name = form.elements.name.value.trim(), phone = form.elements.phone.value.trim();
      if (!name || !phone) {
        msg.textContent = 'Please add your name and a phone number so they can reach you.';
        (name ? form.elements.phone : form.elements.name).focus();
        return;
      }
      msg.textContent = 'Thanks, ' + name.split(' ')[0] + '. Your request is marked out. For anything urgent, call (513) 904-3730.';
    });
  }
})();
