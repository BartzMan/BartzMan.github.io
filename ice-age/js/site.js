(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero dial: the indoor reading eases from a hot 91°F down to 72°F
  var arc = document.getElementById('arc');
  var temp = document.getElementById('temp');
  function len(t) { return ((t - 50) / 50) * 75; }
  function mix(a, b, k) { return Math.round(a + (b - a) * k); }
  function paint(t) {
    var k = (91 - t) / 19; // 0 = hot, 1 = target
    arc.setAttribute('stroke-dasharray', len(t).toFixed(2) + ' 100');
    arc.style.stroke = 'rgb(' + mix(200, 47, k) + ',' + mix(54, 128, k) + ',' + mix(31, 192, k) + ')';
    temp.textContent = Math.round(t);
  }
  if (arc && temp && !reduce) {
    var start = null, dur = 1800;
    paint(91);
    setTimeout(function () {
      requestAnimationFrame(function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);
        paint(91 - 19 * e);
        if (p < 1) requestAnimationFrame(step);
      });
    }, 350);
  }

  // Reveal on scroll
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

  // Estimate form: opens the visitor's own email app, nothing is stored
  var form = document.getElementById('quote');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var status = document.getElementById('status');
      var f = function (id) { return document.getElementById(id); };
      var name = f('f-name').value.trim(), phone = f('f-phone').value.trim();
      if (!name || !phone) {
        status.textContent = 'Please add your name and phone number.';
        (name ? f('f-phone') : f('f-name')).focus();
        return;
      }
      var body = 'Hi Ice Age Mechanical,\n\nName: ' + name + '\nPhone: ' + phone +
        '\nSystem: ' + f('f-sys').value + '\n\nWhat it is doing:\n' + f('f-msg').value.trim() + '\n';
      status.textContent = 'Opening your email app with the details filled in.';
      window.location.href = 'mailto:info@iceagemechanical.net?subject=' +
        encodeURIComponent('Heating or cooling request: ' + name) + '&body=' + encodeURIComponent(body);
    });
  }
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
