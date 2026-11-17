(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  /* sundial hour rings on every section */
  $$('.ring').forEach(function (el) {
    var h = parseFloat(el.getAttribute('data-h')), ang = Math.max(-100, Math.min(120, (h - 12) * 15));
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 60 60'); svg.setAttribute('aria-hidden', 'true');
    var html = '<circle class="rc" cx="30" cy="30" r="27"/>';
    for (var i = 0; i < 12; i++) { var a = i * 30 * Math.PI / 180; html += '<line class="rt" x1="' + (30 + 22 * Math.sin(a)).toFixed(1) + '" y1="' + (30 - 22 * Math.cos(a)).toFixed(1) + '" x2="' + (30 + 27 * Math.sin(a)).toFixed(1) + '" y2="' + (30 - 27 * Math.cos(a)).toFixed(1) + '"/>'; }
    html += '<line class="rg" x1="30" y1="30" x2="30" y2="9" style="transform:rotate(-90deg)"/><circle class="rd" cx="30" cy="30" r="4"/>';
    svg.innerHTML = html; el.insertBefore(svg, el.firstChild);
    var t = document.createElement('span'); t.textContent = el.getAttribute('data-label'); el.appendChild(t);
    var g = svg.querySelector('.rg');
    var set = function () { g.style.transform = 'rotate(' + ang + 'deg)'; };
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { set(); io.disconnect(); } }); }, { threshold: .6 });
      io.observe(el);
    } else set();
  });

  /* the sun travels the arc as you scroll; the sky strip follows the day */
  var stops = [
    [0, [47, 143, 139], [127, 199, 195]], [.3, [251, 247, 238], [207, 233, 240]], [.55, [242, 177, 52], [248, 217, 141]],
    [.8, [217, 105, 43], [242, 163, 102]], [1, [29, 59, 87], [53, 91, 128]]
  ];
  function mix(a, b, t) { return [0, 1, 2].map(function (i) { return Math.round(a[i] + (b[i] - a[i]) * t); }); }
  var sun = $('.sunb'), sky = $('.skyb'), root = document.documentElement;
  function day() {
    var h = document.documentElement.scrollHeight - innerHeight, p = h > 0 ? Math.min(1, Math.max(0, scrollY / h)) : 0, i = 1;
    while (i < stops.length - 1 && p > stops[i][0]) i++;
    var a = stops[i - 1], b = stops[i], t = (p - a[0]) / (b[0] - a[0]);
    var c1 = mix(a[1], b[1], t), c2 = mix(a[2], b[2], t);
    root.style.setProperty('--sky-1', 'rgb(' + c1 + ')'); root.style.setProperty('--sky-2', 'rgb(' + c2 + ')');
    var H = sky.offsetHeight, k = 1 - Math.pow(2 * p - 1, 2);
    sun.style.left = (3 + 94 * p) + '%'; sun.style.top = (H * .82 - (H * .63) * k) + 'px';
  }
  addEventListener('scroll', function () { requestAnimationFrame(day); }, { passive: true }); addEventListener('resize', day); day();

  /* replace / repair */
  var tabs = $$('.switch [role=tab]');
  function pick(b) {
    tabs.forEach(function (t) {
      var on = t === b; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls')); p.hidden = !on; p.classList.toggle('on', on);
      if (on) $$('[data-reveal]', p).forEach(function (e) { e.classList.add('kit-in'); });
    });
  }
  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { pick(b); });
    b.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = tabs[(i + 1) % tabs.length]; n.focus(); pick(n); } });
  });

  /* attic heat check */
  var T = [
    { n: 'Morning', sun: [860, 250], east: 1, west: 0, sh: -1, shw: 250, base: 1.2, skyA: '#9ccfd0', skyB: '#fbf7ee', on: 'The east slope',
      s: 'The low sun comes from the east, so the east slope is lit first while the west slope is still in shade.', a: 'The attic is still holding the night\'s cool air and starts to warm slowly.' },
    { n: 'Noon', sun: [600, 64], east: .55, west: .55, sh: 0, shw: 40, base: 2.6, skyA: '#8fcbe8', skyB: '#fffdf6', on: 'Both slopes and the ridge',
      s: 'The sun is nearly overhead, so both slopes and the ridge take its full force.', a: 'Heat builds from the roof deck down into the attic and keeps climbing.' },
    { n: 'Late afternoon', sun: [340, 250], east: 0, west: 1, sh: 1, shw: 260, base: 4, skyA: '#f4c77a', skyB: '#fbe6b8', on: 'The west slope',
      s: 'The sun has swung to the west, so the west slope now takes the strongest light.', a: 'After hours of heat soaking in, the attic is usually at its warmest around now.' },
    { n: 'Dusk', sun: [330, 400], east: 0, west: .35, sh: 1, shw: 480, base: 3.2, skyA: '#3f5f86', skyB: '#e08a55', on: 'The west slope, fading',
      s: 'The sun is low and its light is weak. The roof starts to give its heat back to the air.', a: 'Trapped heat can linger and radiate down into the rooms below for hours.' }
  ];
  var words = ['Cool', 'Mild', 'Warming', 'Warm', 'Hot', 'Very hot'];
  var st = { t: 0, v: 0, c: 0 };
  var ventTxt = ['Without a way out, hot air sits under the roof deck and builds.', 'Cool air comes in at the eaves and hot air leaves at the ridge, so the attic does not trap as much heat.'];
  var colTxt = ['Darker shingles soak up more of the sun\'s heat.', 'Lighter shingles reflect more of the sun, so less heat reaches the roof deck.'];
  function lerp(a, b, t) { return a + (b - a) * t; }
  function hex(h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
  function heatCol(h) {
    var s = [[143, 208, 203], [242, 177, 52], [217, 105, 43], [181, 56, 26]], x = h / 5 * 3, i = Math.min(2, Math.floor(x)), t = x - i;
    return 'rgb(' + [0, 1, 2].map(function (k) { return Math.round(lerp(s[i][k], s[i + 1][k], t)); }) + ')';
  }
  function render() {
    var d = T[st.t], h = Math.max(0, Math.min(5, d.base + (st.v ? -1.3 : 0) + (st.c ? -.8 : .3)));
    $('#sun').setAttribute('transform', 'translate(' + d.sun[0] + ' ' + d.sun[1] + ')');
    $('#sky-a').setAttribute('stop-color', d.skyA); $('#sky-b').setAttribute('stop-color', d.skyB);
    $('#slope-lit-e').style.opacity = d.east; $('#slope-lit-w').style.opacity = d.west;
    var sh = $('#shadow-house rect');
    if (!sh) { sh = document.createElementNS(NS, 'rect'); sh.setAttribute('y', 470); sh.setAttribute('height', 26); sh.setAttribute('fill', 'rgba(29,59,87,.35)'); $('#shadow-house').innerHTML = ''; $('#shadow-house').appendChild(sh); }
    var w = d.shw, x = d.sh < 0 ? 360 - w : d.sh > 0 ? 840 : 360;
    if (d.sh === 0) { x = 360; w = 480; sh.setAttribute('height', 10); } else sh.setAttribute('height', 26);
    sh.setAttribute('x', x); sh.setAttribute('width', w);
    var at = $('#attic'); at.setAttribute('fill', heatCol(h)); at.setAttribute('fill-opacity', (.35 + h * .1).toFixed(2));
    $('#heat-lines').style.opacity = h > 2.4 ? Math.min(1, (h - 2) / 2) : 0;
    $('#air').style.opacity = st.v ? 1 : 0;
    $('#ro-sun').textContent = d.on; $('#ro-attic').textContent = words[Math.round(h)];
    $('#ro-bar').style.width = Math.max(8, h / 5 * 100) + '%';
    $('#in-h').textContent = d.n; $('#in-sun').textContent = d.s; $('#in-attic').textContent = d.a;
    $('#in-vent').textContent = ventTxt[st.v]; $('#in-col').textContent = colTxt[st.c];
    var sl = ['#slope-w', '#slope-e']; sl.forEach(function (s) { $(s).setAttribute('fill', st.c ? '#aeb7c0' : '#33414f'); });
  }
  function group(sel, attr, key) {
    var bs = $$(sel);
    bs.forEach(function (b) { b.addEventListener('click', function () { st[key] = parseInt(b.getAttribute(attr), 10); bs.forEach(function (o) { o.setAttribute('aria-pressed', o === b); }); render(); }); });
  }
  group('.times button', 'data-t', 't'); group('[data-v]', 'data-v', 'v'); group('[data-c]', 'data-c', 'c');
  render();

  /* sun signs on the dial */
  var signs = [
    ['Curling or cracked shingles', 'Shingles that curl at the corners or show cracks are drying out in the sun. You can often spot them from the ground, or from a window.', 'shingles-red.jpg', 'Weathered reddish shingles in tight rows'],
    ['Bald patches', 'Spots where the gritty surface has worn away show that the sun and rain have taken the shingle\'s protective top layer.', 'shingles-brown.jpg', 'Close view of brown asphalt shingles with a gritty surface'],
    ['Granules in the gutters', 'Gritty bits collecting in a gutter or at the bottom of a downspout have come off shingles as they age.', 'gutter.jpg', 'Copper gutter and white downspout under a blue sky'],
    ['A very hot upstairs', 'Upstairs rooms that feel much hotter than the rest of the house can point to a hot attic and a roof that is struggling.', 'upstairs.jpg', 'Open upstairs hallway and living space with a ceiling fan'],
    ['Faded or brittle vents', 'Plastic and rubber around roof vents fade, crack and turn brittle in strong sun, and the gaps they leave let water in.', 'gable.jpg', 'Shingled roof with a small triangular gable trimmed in green']
  ];
  var marks = $$('.marks button'), ang = [-80, -40, 0, 40, 80];
  function sign(i, focus) {
    marks.forEach(function (m, j) { m.setAttribute('aria-selected', j === i); m.tabIndex = j === i ? 0 : -1; });
    $('#gnomon').style.transform = 'rotate(' + ang[i] + 'deg)';
    $('#sign-no').textContent = (i + 1) + ' of 5'; $('#sign-h').textContent = signs[i][0]; $('#sign-p').textContent = signs[i][1];
    var im = $('#sign-img'); im.src = 'images/' + signs[i][2]; im.alt = signs[i][3];
    if (focus) marks[i].focus({ preventScroll: true });
  }
  marks.forEach(function (m, i) {
    m.addEventListener('click', function () { sign(i); });
    m.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); sign((i + (e.key === 'ArrowRight' ? 1 : 4)) % 5, true); } });
  });
  sign(0);
})();
