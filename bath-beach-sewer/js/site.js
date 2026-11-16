(function () {
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  /* the row house */
  var hots = $$('.hot');
  hots.forEach(function (h) {
    h.addEventListener('click', function () {
      hots.forEach(function (x) {
        var on = x === h;
        x.setAttribute('aria-pressed', String(on));
        document.getElementById(x.getAttribute('aria-controls')).classList.toggle('on', on);
      });
      if (window.matchMedia('(max-width:1180px)').matches) {
        var p = document.querySelector('.panel');
        var r = p.getBoundingClientRect();
        if (r.top > window.innerHeight - 140 || r.bottom < 0) p.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
  /* slow drain or main line? */
  var opts = $$('.opt');
  var idle = document.querySelector('.verdict .idle');
  opts.forEach(function (o) {
    o.addEventListener('click', function () {
      opts.forEach(function (x) { x.setAttribute('aria-pressed', String(x === o)); });
      $$('.verdict .v').forEach(function (v) { v.classList.toggle('on', v.id === 'v-' + o.getAttribute('data-v')); });
      if (idle) idle.style.display = 'none';
    });
  });
})();
