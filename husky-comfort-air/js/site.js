(function () {
  // phone menu
  var btn = document.querySelector('.hdr-menu');
  var drop = document.getElementById('drop');
  if (btn && drop) {
    var hide = function (back) {
      drop.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
      if (back) btn.focus();
    };
    btn.addEventListener('click', function () {
      drop.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
      drop.querySelector('.drop-links a').focus();
    });
    drop.querySelector('.drop-close').addEventListener('click', function () { hide(true); });
    drop.addEventListener('click', function (e) { if (e.target.closest('a')) hide(false); });
    document.addEventListener('keydown', function (e) {
      if (drop.hidden) return;
      if (e.key === 'Escape') hide(true);
      if (e.key === 'Tab') {
        var f = drop.querySelectorAll('a, button'), a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1100 && !drop.hidden) hide(false); });
  }

  // services dropdown in the header
  document.querySelectorAll('.nav-dd').forEach(function (dd) {
    var b = dd.querySelector('.dd-btn');
    var set = function (open) { dd.classList.toggle('open', open); dd.classList.toggle('shut', !open); b.setAttribute('aria-expanded', open ? 'true' : 'false'); };
    b.addEventListener('click', function () { set(!dd.classList.contains('open')); });
    dd.addEventListener('keydown', function (e) { if (e.key === 'Escape') { set(false); b.focus(); } });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target) && dd.classList.contains('open')) { set(false); dd.classList.remove('shut'); } });
    dd.addEventListener('focusout', function (e) { if (!dd.contains(e.relatedTarget)) { set(false); dd.classList.remove('shut'); } });
    dd.addEventListener('mouseleave', function () { if (!dd.classList.contains('open')) dd.classList.remove('shut'); });
    dd.addEventListener('focusin', function (e) { if (e.target !== b && !dd.classList.contains('open')) dd.classList.remove('shut'); });
  });

  // quote form -> n8n "Client Quote Forms" (bot checks + routing; demo submissions go to Sanket, live ones to the client)
  document.querySelectorAll('form[data-quote]').forEach(function (form) {
    var t0 = Date.now();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { var el = form.elements[n]; return el ? (el.value || '').trim() : ''; };
      var err = form.querySelector('.fld-err');
      var okMail = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(v('email')), okPhone = v('phone').replace(/\D/g, '').length >= 10;
      if (!v('name') || !okPhone || !okMail) {
        err.textContent = 'Add your name, phone number and a valid email so we can reply.';
        err.hidden = false;
        (!v('name') ? form.elements.name : !okPhone ? form.elements.phone : form.elements.email).focus();
        return;
      }
      err.hidden = true;
      var btn = form.querySelector('button[type=submit]'), label = btn.innerHTML;
      btn.disabled = true; btn.textContent = 'Sending...';
      var d = new URLSearchParams({ s: form.getAttribute('data-quote'), t: String(Date.now() - t0),
        tz: (Intl.DateTimeFormat().resolvedOptions().timeZone || '') });
      ['name', 'email', 'phone', 'reply_by', 'city', 'property', 'service', 'details', 'company_site'].forEach(function (n) { d.append(n, v(n)); });
      fetch('https://n8n.thevoxfitness.com/webhook/quote-form-9d3b7e15', { method: 'POST', body: d })
        .then(function (r) {
          if (!r.ok) throw 0;
          form.classList.add('sent');
          form.querySelector('.q-done').hidden = false;
          form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        .catch(function () {
          btn.disabled = false; btn.innerHTML = label;
          err.textContent = 'Something went wrong. Please call or text (832) 455-1055.'; err.hidden = false;
        });
    });
  });
})();
