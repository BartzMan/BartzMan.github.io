(function () {
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  /* menu */
  var burger = d.querySelector('.burger'), menu = d.getElementById('menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.querySelector('.sr').textContent = open ? 'Close menu' : 'Open menu';
    menu.hidden = !open;
    d.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth >= 960 && !menu.hidden) setMenu(false); });
  }

  /* cross-section: shingle courses + siding laps drawn once */
  var sh = d.getElementById('shingles');
  if (sh) {
    for (var x = 0, i = 0; x < 652; x += 30, i++) {
      var p = d.createElementNS(NS, 'path');
      p.setAttribute('d', 'M' + x + ' -4 L' + (x + 64) + ' -11 L' + (x + 64) + ' -7 L' + (x + 4) + ' -4 Z');
      p.setAttribute('fill', i % 2 ? '#6b6862' : '#57544f');
      sh.appendChild(p);
    }
  }
  var sd = d.getElementById('siding');
  if (sd) {
    for (var y = 391; y < 658; y += 26) {
      var q = d.createElementNS(NS, 'path');
      q.setAttribute('d', 'M426 ' + y + ' L419 ' + y + ' L404 ' + (y + 26) + ' L426 ' + (y + 26) + ' Z');
      q.setAttribute('fill', '#a9a397');
      var s = d.createElementNS(NS, 'path');
      s.setAttribute('d', 'M404 ' + (y + 26) + ' L426 ' + (y + 26));
      s.setAttribute('stroke', '#5f5a51'); s.setAttribute('stroke-width', '2');
      sd.appendChild(q); sd.appendChild(s);
    }
  }

  var svg = d.querySelector('.xs');
  var steps = [].slice.call(d.querySelectorAll('.steps li'));
  function show(n) {
    if (!svg) return;
    [].forEach.call(svg.querySelectorAll('.ly,.pin'), function (el) {
      var s = +el.getAttribute('data-s');
      el.classList.toggle('on', s <= n);
      if (el.classList.contains('pin')) el.classList.toggle('cur', s === n);
    });
    steps.forEach(function (li) {
      var s = +li.getAttribute('data-s');
      li.classList.toggle('on', s <= n); li.classList.toggle('cur', s === n);
    });
  }
  var built = 0;
  if (svg) {
    if (reduce || !('IntersectionObserver' in window)) { show(8); }
    else if (window.matchMedia('(min-width: 960px)').matches) {
      /* desktop: the section builds as each step scrolls past the middle of the screen */
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { var s = +e.target.getAttribute('data-s'); if (s > built) { built = s; show(s); } }
        });
      }, { rootMargin: '-40% 0px -45% 0px' });
      steps.forEach(function (li) { io.observe(li); });
    } else {
      /* phone: one-shot build, layer by layer, once the drawing is on screen */
      var io2 = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) {
          io2.disconnect();
          var n = 0, t = setInterval(function () { n++; show(n); if (n >= 8) clearInterval(t); }, 420);
        }
      }, { threshold: .45 });
      io2.observe(svg);
    }
  }

  /* one-shot reveals */
  var rv = d.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) { [].forEach.call(rv, function (el) { el.classList.add('in'); }); }
  else {
    var io3 = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io3.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    [].forEach.call(rv, function (el) { io3.observe(el); });
  }

  /* quote form */
  var f = d.getElementById('quote-form');
  if (f) f.addEventListener('submit', function (e) { e.preventDefault(); });
})();
