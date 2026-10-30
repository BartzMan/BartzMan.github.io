/* Edwin Roofing: chalk line snaps, hail check, layers slider. Vanilla JS. */
(function () {
  'use strict';
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* header: solid after scroll + shingle-course progress */
  var top = $('#top'), ticking = false;
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
    top.classList.toggle('solid', y > 30);
    top.style.setProperty('--p', h > 0 ? Math.min(1, y / h).toFixed(4) : 0);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* phone menu */
  var burger = $('.burger'), sheet = $('#sheet');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { sheet.hidden = false; requestAnimationFrame(function () { sheet.classList.add('open'); }); }
    else { sheet.classList.remove('open'); setTimeout(function () { if (!sheet.classList.contains('open')) sheet.hidden = true; }, 320); }
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('a', sheet).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 1180 && burger.getAttribute('aria-expanded') === 'true') setMenu(false); });

  /* reveal on scroll, staggered by sibling index */
  var rv = $$('[data-reveal]');
  rv.forEach(function (el) {
    var sibs = $$('[data-reveal]', el.parentElement).filter(function (s) { return s.parentElement === el.parentElement; });
    el.style.setProperty('--d', Math.max(0, sibs.indexOf(el)));
  });
  if ('IntersectionObserver' in window && !RM) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* chalk line snap */
  function dustAt(parent, x, y, n) {
    if (RM) return;
    for (var i = 0; i < n; i++) {
      var d = document.createElement('span');
      d.className = 'dust';
      d.style.left = (x + (Math.random() - .5) * 60) + 'px';
      d.style.top = (y + (Math.random() - .5) * 6) + 'px';
      d.style.setProperty('--dx', ((Math.random() - .5) * 60) + 'px');
      d.style.setProperty('--dy', (20 + Math.random() * 60) + 'px');
      d.style.opacity = (.5 + Math.random() * .5).toFixed(2);
      parent.appendChild(d);
      (function (n2) { setTimeout(function () { n2.remove(); }, 1100); })(d);
    }
  }
  function lineBox(svg) {
    var r = svg.getBoundingClientRect();
    return { W: Math.max(1, Math.round(r.width)), H: Math.max(1, Math.round(r.height)) };
  }
  function rest(svg) {
    var b = lineBox(svg), y = b.H / 2;
    svg.setAttribute('viewBox', '0 0 ' + b.W + ' ' + b.H);
    $$('path', svg).forEach(function (p) { p.setAttribute('d', 'M0 ' + y + 'L' + b.W + ' ' + y); });
  }
  function snap(svg, amp, dustN, px) {
    var b = lineBox(svg), y = b.H / 2, paths = $$('path', svg), t0 = null, dur = 1250;
    svg.setAttribute('viewBox', '0 0 ' + b.W + ' ' + b.H);
    var parent = svg.parentElement;
    var pr = parent.getBoundingClientRect(), sr = svg.getBoundingClientRect();
    if (RM) { rest(svg); return; }
    function frame(t) {
      if (t0 === null) t0 = t;
      var k = (t - t0) / dur;
      if (k >= 1) { rest(svg); return; }
      var a = amp * Math.exp(-4.6 * k) * Math.cos(k * 30);
      var cx = b.W * .5;
      var d = 'M0 ' + y + 'Q' + cx + ' ' + (y + a * 2) + ' ' + b.W + ' ' + y;
      paths.forEach(function (p) { p.setAttribute('d', d); });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    var cx0 = typeof px === 'number' ? px - pr.left : (sr.left - pr.left) + b.W * (.25 + Math.random() * .5);
    dustAt(parent, cx0, sr.top - pr.top + y, dustN || 16);
  }

  var hero = $('#heroLine'), heroSection = $('#hero');
  if (hero) {
    rest(hero);
    hero.style.opacity = 0;
    var firstDone = false;
    var heroSnap = function (px) { hero.style.opacity = 1; snap(hero, 46, 22, px); firstDone = true; };
    setTimeout(function () { heroSnap(); }, 900);
    $('#snapBtn').addEventListener('click', function (e) { var r = this.getBoundingClientRect(); heroSnap(r.left + r.width / 2); });
    hero.querySelector('.hit').addEventListener('click', function (e) { heroSnap(e.clientX); });
    hero.querySelector('.hit').addEventListener('pointerenter', function () { hero.style.cursor = 'pointer'; });
    // the line is clickable only through the button (the svg must never sit over text), but plain clicks on the roof also snap
    heroSection.addEventListener('click', function (e) {
      if (e.target.closest('a,button')) return;
      var r = hero.getBoundingClientRect();
      if (e.clientY > r.top - 20 && e.clientY < r.bottom + 20) heroSnap(e.clientX);
    });
  }
  var lines = $$('[data-snap]');
  lines.forEach(function (el) { rest($('svg', el)); });
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); snap($('svg', e.target), 26, 10); io2.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    lines.forEach(function (el) { io2.observe(el); });
  } else { lines.forEach(function (el) { el.classList.add('in'); }); }
  var rzT;
  window.addEventListener('resize', function () {
    clearTimeout(rzT);
    rzT = setTimeout(function () { if (hero) rest(hero); lines.forEach(function (el) { rest($('svg', el)); }); }, 150);
  });

  /* HAIL CHECK */
  var SPOTS = [
    { t: 'Gutters', p: 'Run your eye along the gutters. Fresh dents or dings in the soft metal show that hail was hitting hard.' },
    { t: 'Downspouts', p: 'Look at the ground where downspouts drain. A pile of loose, gritty granules can mean the shingles are shedding.' },
    { t: 'Chimney and vents', p: 'Metal caps, vents and chimney trim dent easily. Look for dings, bent edges or gaps. Binoculars from the yard help.' },
    { t: 'Shingles from the yard', p: 'From the lawn, look for missing pieces, cracked spots or patches that look darker or bare. Do not climb up for a closer look.' },
    { t: 'Outdoor A/C unit', p: 'Check the fins and the top of the outdoor unit. Bent fins and dents show that hail reached that side of the house.' },
    { t: 'Screens and siding', p: 'Torn window screens and chipped or cracked siding show which side of the house took the storm.' }
  ];
  var state = SPOTS.map(function () { return null; }), cur = -1;
  var hs = $$('.hs'), hl = $$('#hlist button'), meter = $$('#hmeter i');
  var tipN = $('#tipN'), tipT = $('#tipT'), tipP = $('#tipP'), tipB = $('#tipBtns'), hsum = $('#hsum'), hcall = $('#hcall');
  function paintHail() {
    var seen = 0, off = 0;
    state.forEach(function (s, i) {
      if (s) seen++; if (s === 'off') off++;
      [hs[i], hl[i].parentElement.firstElementChild].forEach(function (el) {
        el.classList.toggle('fine', s === 'fine'); el.classList.toggle('off', s === 'off'); el.classList.toggle('cur', i === cur);
      });
      meter[i].className = s ? (s === 'off' ? 'on off' : 'on') : '';
      hs[i].setAttribute('aria-label', 'Spot ' + (i + 1) + ': ' + SPOTS[i].t + (s ? (s === 'fine' ? ', looks fine' : ', looks off') : ''));
    });
    if (seen === 0) hsum.textContent = 'Tap a numbered spot to begin.';
    else if (seen < 6) hsum.textContent = seen + ' of 6 spots checked' + (off ? ', ' + off + ' flagged.' : '.');
    else if (off === 0) hsum.textContent = 'Nothing flagged from the ground. Damage can still hide up top, so a roofer looking up close is worth asking for.';
    else hsum.textContent = off + (off === 1 ? ' spot' : ' spots') + ' flagged. Take dated photos from the ground, then have a roofer look at it up close.';
    hcall.hidden = !(seen === 6 || off > 0);
  }
  function selectSpot(i) {
    cur = i;
    tipN.textContent = 'Spot ' + (i + 1) + ' of 6';
    tipT.textContent = SPOTS[i].t;
    tipP.textContent = SPOTS[i].p;
    tipB.hidden = false;
    paintHail();
  }
  function markSpot(v) {
    if (cur < 0) return;
    state[cur] = v;
    var nxt = -1;
    for (var k = 1; k <= 6; k++) { var j = (cur + k) % 6; if (!state[j]) { nxt = j; break; } }
    if (nxt >= 0) selectSpot(nxt);
    else { paintHail(); tipN.textContent = 'All six checked'; tipT.textContent = state.indexOf('off') >= 0 ? 'Worth a closer look' : 'Looks quiet from here'; tipP.textContent = 'You can tap any number again to change your answer.'; }
  }
  hs.forEach(function (b) { b.addEventListener('click', function () { selectSpot(+b.dataset.i); }); });
  hl.forEach(function (b) { b.addEventListener('click', function () { selectSpot(+b.dataset.i); }); });
  $$('#tipBtns button').forEach(function (b) { b.addEventListener('click', function () { markSpot(b.dataset.v); }); });
  paintHail();

  /* LAYERS */
  var LAY = [
    { t: 'Rafters', p: 'The frame. Everything else is built on top of it.' },
    { t: 'Decking', p: 'Sheets of wood fastened across the rafters. A flat, solid base for everything above.' },
    { t: 'Underlayment', p: 'A water-resistant layer rolled over the decking, a second line of defence behind the shingles.' },
    { t: 'Metal edges', p: 'Metal along the edges, and around chimneys and vents, steers water onto the roof and into the gutter.' },
    { t: 'Shingles', p: 'Laid from the bottom up, each row overlapping the one below like fish scales, so water runs down and over.' },
    { t: 'Ridge cap', p: 'The peak is capped last, covering the top edge of both slopes.' }
  ];
  var range = $('#layRange'), sh = $('#shingles'), ticks = $$('#layTicks button');
  if (range && sh) {
    var NS = 'http://www.w3.org/2000/svg', cols = ['#3a424d', '#2f3640', '#454e5b'];
    for (var i = 0; i < 12; i++) {
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('transform', 'translate(' + (24 + i * 40) + ' -22) rotate(3)');
      var r1 = document.createElementNS(NS, 'rect');
      r1.setAttribute('x', 0); r1.setAttribute('y', -8); r1.setAttribute('width', 72); r1.setAttribute('height', 8);
      r1.setAttribute('fill', cols[i % 3]); r1.setAttribute('stroke', '#0d1013'); r1.setAttribute('stroke-width', 1.5);
      r1.style.transitionDelay = (i * 55) + 'ms';
      g.appendChild(r1); sh.appendChild(g);
    }
    for (var j = 0; j < 11; j++) {
      var g2 = document.createElementNS(NS, 'g');
      g2.setAttribute('transform', 'translate(' + (44 + j * 40) + ' -22) rotate(3)');
      var r2 = document.createElementNS(NS, 'rect');
      r2.setAttribute('x', 0); r2.setAttribute('y', -14); r2.setAttribute('width', 56); r2.setAttribute('height', 6);
      r2.setAttribute('fill', cols[(j + 1) % 3]); r2.setAttribute('stroke', '#0d1013'); r2.setAttribute('stroke-width', 1.2);
      r2.style.transitionDelay = (j * 55 + 220) + 'ms';
      g2.appendChild(r2); sh.appendChild(g2);
    }
    var layers = [0, 1, 2, 3, 4, 5].map(function (n) { return $('.ly' + n); });
    var setLayer = function (s) {
      range.value = s;
      layers.forEach(function (el, n) { el.classList.toggle('on', n <= s); el.classList.remove('pulse'); });
      void layers[s].offsetWidth; layers[s].classList.add('pulse');
      $('#layN').textContent = 'Step ' + s + ' of 5';
      $('#layT').textContent = LAY[s].t;
      $('#layP').textContent = LAY[s].p;
      range.setAttribute('aria-valuetext', LAY[s].t);
      ticks.forEach(function (b, n) { b.classList.toggle('on', n === s); });
    };
    range.addEventListener('input', function () { setLayer(+range.value); });
    ticks.forEach(function (b) { b.addEventListener('click', function () { setLayer(+b.dataset.s); }); });
    setLayer(0);
    // the first time the diagram scrolls into view, lay the first two layers so it is not empty
    if ('IntersectionObserver' in window && !RM) {
      var io3 = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { io3.disconnect(); setTimeout(function () { if (+range.value === 0) setLayer(1); }, 700); } });
      }, { threshold: 0.4 });
      io3.observe($('#laySvg'));
    }
  }

  /* quote form: preview only */
  var form = $('#quote'), note = $('#fNote');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    note.classList.add('show');
    note.textContent = 'Preview only: this form goes live with the finished site. For now, call or text (817) 683-6261.';
  });

  /* chalk cursor (fine pointers only) */
  var cur2 = $('#cursor');
  if (cur2 && window.matchMedia('(hover:hover) and (pointer:fine)').matches && !RM) {
    var mx = 0, my = 0, cx = 0, cy = 0, run = false;
    var loop = function () { cx += (mx - cx) * .22; cy += (my - cy) * .22; cur2.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; if (Math.abs(mx - cx) > .3 || Math.abs(my - cy) > .3) requestAnimationFrame(loop); else run = false; };
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY; cur2.classList.add('on');
      if (!run) { run = true; requestAnimationFrame(loop); }
      cur2.classList.toggle('big', !!e.target.closest('a,button,input,textarea,label'));
    });
    document.addEventListener('mouseleave', function () { cur2.classList.remove('on'); });
  }
})();
