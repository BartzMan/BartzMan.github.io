(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.rise');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  // Form: opens the visitor's own messages app with the details filled in; nothing is stored
  var form = document.getElementById('quote');
  if (!form) return;
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var status = document.getElementById('status');
    var name = document.getElementById('f-name').value.trim();
    if (!name) { status.textContent = 'Please add your name.'; document.getElementById('f-name').focus(); return; }
    var body = 'Hi Yard Guys, this is ' + name + '. I need: ' + document.getElementById('f-job').value +
      '. ' + document.getElementById('f-msg').value.trim() + ' (I will attach a photo of the yard.)';
    status.textContent = 'Opening your messages app with the details filled in.';
    window.location.href = 'sms:+16024237788?&body=' + encodeURIComponent(body);
  });
})();

/* polish pass 1: mobile menu + header shadow */
(function () {
  var b = document.querySelector('.menu-btn'), m = document.getElementById('mnav'), top = document.querySelector('.top');
  if (b && m) {
    var set = function (o) {
      if (o && top) document.documentElement.style.setProperty('--hdr', top.getBoundingClientRect().bottom + 'px');
      b.setAttribute('aria-expanded', o ? 'true' : 'false'); m.hidden = !o;
      document.documentElement.classList.toggle('menu-open', o);
      if (o) { var f = m.querySelector('a'); if (f) f.focus(); }
    };
    b.addEventListener('click', function () { set(b.getAttribute('aria-expanded') !== 'true'); });
    m.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !m.hidden) { set(false); b.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 900 && !m.hidden) set(false); });
  }
  if (top) { var on = function () { top.classList.toggle('scrolled', window.scrollY > 8); }; on(); window.addEventListener('scroll', on, { passive: true }); }
})();
