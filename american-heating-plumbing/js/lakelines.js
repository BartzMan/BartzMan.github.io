/* American Heating and Plumbing: Grand Lake Lines (the kit does menu, bar, lightbox, reveals, form). */
(function () {
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var NS = 'http://www.w3.org/2000/svg';

  /* 1. the pipe run: a hand-drawn hot and cold pair that wanders down the left shore of the page and draws as you scroll */
  var main = $('#main'), run = $('.run');
  var lenH = 0, lenC = 0, best = 0;
  function build() {
    if (!run || getComputedStyle(run).display === 'none') return;
    var H = main.scrollHeight;
    run.setAttribute('height', H); run.style.height = H + 'px'; run.setAttribute('viewBox', '0 0 96 ' + H);
    var seed = 7, rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    var ptsH = [], ptsC = [], y = 90, step = 160;
    while (y < H - 40) {
      var x = 34 + Math.sin(y / 420) * 16 + (rnd() - 0.5) * 8;
      ptsH.push([x, y]); ptsC.push([x + 13 + (rnd() - 0.5) * 2, y + 6]); y += step;
    }
    var path = function (p) {
      var d = 'M' + p[0][0].toFixed(1) + ' ' + p[0][1].toFixed(1);
      for (var i = 1; i < p.length; i++) {
        var a = p[i - 1], b = p[i], my = (a[1] + b[1]) / 2;
        d += ' C' + a[0].toFixed(1) + ' ' + my.toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + my.toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1);
      }
      return d;
    };
    var ph = $('.run-h'), pc = $('.run-c');
    ph.setAttribute('d', path(ptsH)); pc.setAttribute('d', path(ptsC));
    lenH = ph.getTotalLength(); lenC = pc.getTotalLength();
    ph.style.strokeDasharray = lenH; pc.style.strokeDasharray = lenC;
    var g = $('.run-nodes');
    while (g.firstChild) g.removeChild(g.firstChild);
    var top0 = main.getBoundingClientRect().top + window.scrollY;
    $$('[data-junction]').forEach(function (s) {
      var yy = s.getBoundingClientRect().top + window.scrollY - top0 + 70;
      var i = Math.min(ptsH.length - 1, Math.max(0, Math.round((yy - 90) / step)));
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', (ptsH[i][0] + 6.5).toFixed(1)); c.setAttribute('cy', (ptsH[i][1] + 3).toFixed(1)); c.setAttribute('r', 11); c.setAttribute('data-f', (ptsH[i][1] / H).toFixed(4));
      g.appendChild(c);
    });
    draw();
  }
  function draw() {
    if (!lenH) return;
    var H = main.scrollHeight, p = still ? 1 : Math.min(1, (window.scrollY + innerHeight * 0.75) / H);
    p = best = Math.max(best, p);  /* the line stays drawn once it has run */
    $$('.run-nodes circle').forEach(function (n) { n.classList.toggle('on', +n.getAttribute('data-f') <= p); });
    $('.run-h').style.strokeDashoffset = (lenH * (1 - p)).toFixed(1);
    $('.run-c').style.strokeDashoffset = (lenC * (1 - Math.max(0, p - 0.02))).toFixed(1);
  }
  var tBuild = null, queued = false;
  window.addEventListener('load', build);
  window.addEventListener('resize', function () { clearTimeout(tBuild); tBuild = setTimeout(build, 200); });
  window.addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(function () { queued = false; draw(); }); } }, { passive: true });

  /* 2. which line is it? routes to the right service card */
  $$('.pick-b').forEach(function (b) {
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () {
      $$('.pick-b').forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      $('.pick-say').textContent = b.getAttribute('data-say');
      var card = document.getElementById(b.getAttribute('data-to'));
      $$('.line-card').forEach(function (c) { c.classList.toggle('lit', c === card); });
      if (card) card.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'center' });
    });
  });

  /* 3. find your five shut-offs */
  var valves = [
    ['Main shut-off', 'Where the water line enters the house, often in the basement or a utility room near the meter. Closing it stops water to the whole house.'],
    ['Water heater inlet', 'On the cold line going into the top of the water heater. It stops water feeding the tank if the tank or its fittings leak.'],
    ['Under-sink stops', 'Two small handles under each sink, one hot and one cold. Close them to work on a faucet without shutting off the house.'],
    ['Toilet supply valve', 'On the wall or floor behind the toilet. Turn it clockwise to stop a running or overflowing toilet.'],
    ['Washer valves', 'Behind the washing machine, one hot and one cold. Many people close them before going away, since washer hoses can burst.']
  ];
  $$('.vbtn').forEach(function (b) {
    b.addEventListener('click', function () {
      var i = +b.getAttribute('data-v');
      $$('.vbtn').forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      $('.vc-n').textContent = 'Valve ' + (i + 1) + ' of 5';
      $('.vc-t').textContent = valves[i][0];
      $('.vc-b').textContent = valves[i][1];
    });
  });

  /* 4. the lake band: hot and cold lines run along the shore to Celina */
  var cel = $('.celina');
  if (cel && 'IntersectionObserver' in window && !still) {
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { cel.classList.add('on'); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(cel);
  } else if (cel) cel.classList.add('on');
})();
