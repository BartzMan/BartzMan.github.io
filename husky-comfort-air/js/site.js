(function () {
  // phone menu
  var btn = document.querySelector('.mast-menu');
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

  // form -> visitor's own email app
  var form = document.getElementById('ac-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var err = document.getElementById('fld-err');
      if (!v('name')) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      var body = ['Name: ' + v('name'), 'Phone: ' + (v('phone') || '-'), 'City: ' + v('city'), 'Need: ' + v('job'), '', v('message')].join('\n');
      window.location.href = 'mailto:huskycomfortair@gmail.com?subject=' + encodeURIComponent(v('job') + ' in ' + v('city')) + '&body=' + encodeURIComponent(body);
    });
  }
})();
