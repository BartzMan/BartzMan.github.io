(function () {
  var d = document;
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

  /* one-shot reveals: valves turn open once, the brass pipe fills once */
  var targets = d.querySelectorAll('.reveal, .giant, .pipe-steps, .steps');
  function show(el) { var c = el.classList; c.add(c.contains('pipe-steps') ? 'flow' : c.contains('steps') ? 'turned' : 'in'); }
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(show);
  }

  /* quote form (demo: stays on the page) */
  var form = d.getElementById('quote-form');
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
      msg.textContent = 'Thanks, ' + name.split(' ')[0] + '. Your request is in. For anything urgent, call (513) 451-9361.';
      form.reset();
    });
  }
})();
