/* Tuxedo Mechanical & Plumbing: menu, one-shot reveals, request form (demo). */
(function () {
  var html = document.documentElement;

  /* full-screen menu */
  var btn = document.querySelector('.menu-btn'), menu = document.getElementById('menu');
  if (btn && menu) {
    var set = function (open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.querySelector('.sr').textContent = open ? 'Close menu' : 'Menu';
      menu.hidden = !open;
      html.classList.toggle('menu-open', open);
      if (open) { var f = menu.querySelector('a'); if (f) f.focus(); }
    };
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { set(false); btn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 1100 && !menu.hidden) set(false); });
  }

  /* one-shot reveals: each element animates in once, then the observer lets go */
  var items = document.querySelectorAll('[data-reveal]');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || still) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* "Ask about ..." links pre-fill the request */
  var form = document.getElementById('quote-form');
  if (!form) return;
  var details = form.elements.details, status = form.querySelector('.form-status');
  document.querySelectorAll('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () {
      var tag = a.getAttribute('data-service') + ': ';
      if (details.value.indexOf(tag) !== 0) details.value = tag + details.value;
      setTimeout(function () { details.focus({ preventScroll: true }); details.setSelectionRange(details.value.length, details.value.length); }, 600);
    });
  });

  /* demo form: the live site wires this to the owner's inbox */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';
    var bad = [].filter.call(form.querySelectorAll('[required]'), function (f) { return !f.value.trim(); });
    var email = form.elements.email;
    if (email.value && !email.checkValidity()) bad.push(email);
    if (bad.length) { var names = { name: 'your name', phone: 'a phone number', email: 'a valid email', details: 'a few words about the job' };
      status.textContent = 'Please add ' + bad.map(function (f) { return names[f.name]; }).join(', ') + '.'; bad[0].focus(); return; }
    var m = form.querySelector('.sc-form-msg');
    if (!m) { m = document.createElement('p'); m.className = 'sc-form-msg'; m.setAttribute('role', 'status'); form.appendChild(m); }
    m.textContent = 'Preview: on your live website, this request would be sent straight to your email.';
  });
})();
