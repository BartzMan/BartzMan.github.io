(function () {
  var $ = function (s, e) { return (e || document).querySelector(s); };
  var $$ = function (s, e) { return Array.prototype.slice.call((e || document).querySelectorAll(s)); };

  /* colour porch */
  var SCH = [
    { n: 'Warm greige + cream', c: { body: '#CBBFAA', trim: '#F5F0E3', door: '#6B2E28', shutters: '#2E3D35' }, nm: { body: 'Warm greige', trim: 'Cream', door: 'Oxblood', shutters: 'Deep green' },
      h: 'Mid-tone neutrals are forgiving on the Gulf Coast: they hide dust, light chalking and the odd streak, and they stay fairly comfortable in strong sun.' },
    { n: 'Crisp white + charcoal', c: { body: '#ECE9E1', trim: '#FFFFFF', door: '#22385C', shutters: '#2B2B2D' }, nm: { body: 'Soft white', trim: 'Bright white', door: 'Navy', shutters: 'Charcoal' },
      h: 'Light colours reflect the most heat, but in humid air they show mildew, dirt and rust streaks first. Washing and priming matter most here.' },
    { n: 'Sage + white', c: { body: '#A8B59B', trim: '#F4F2EA', door: '#9B3B2E', shutters: '#46574A' }, nm: { body: 'Sage', trim: 'Warm white', door: 'Brick red', shutters: 'Forest' },
      h: 'Soft greens sit well beside lawns and live oaks and hide fade well. Deep accents stay crisp when used on the door and shutters rather than whole walls.' },
    { n: 'Blue-grey + cream', c: { body: '#667B8E', trim: '#EEE9D8', door: '#D9B45A', shutters: '#2B3947' }, nm: { body: 'Blue-grey', trim: 'Cream', door: 'Rice gold', shutters: 'Slate navy' },
      h: 'Darker body colours soak up more heat and show fade sooner, especially on south and west walls. If you love one, a lower sheen and a quality exterior paint help.' }
  ];
  var GLOSS = {
    body: ['Body', 'Satin or low sheen: it hides small wall flaws and wipes clean. Flat finishes show dirt and mildew sooner in humid air.'],
    trim: ['Trim', 'Semi-gloss or gloss: it sheds water and humidity and wipes clean, which suits wood trim and window frames.'],
    door: ['Door', 'Gloss: the hardest-working finish on the house. It takes sun, rain and a lot of hands.'],
    shutters: ['Shutters', 'Satin to semi-gloss: enough sheen to shrug off humidity without looking shiny from the street.']
  };
  var house = $('#house');
  if (house) {
    var st = { p: 'body', s: 0 };
    var map = { body: '--c-body', trim: '--c-trim', door: '--c-door', shutters: '--c-shut' };
    var render = function () {
      var s = SCH[st.s];
      Object.keys(map).forEach(function (k) { house.style.setProperty(map[k], s.c[k]); });
      house.setAttribute('data-part', st.p);
      $('#pc-name').textContent = s.n;
      $('#pc-part').textContent = GLOSS[st.p][0] + ': ' + s.nm[st.p];
      $('#pc-holds').textContent = s.h;
      $('#pc-gloss').textContent = GLOSS[st.p][1];
      $$('.part-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.p === st.p)); b.firstChild.style.setProperty('--sw', s.c[b.dataset.p]); });
      $$('.scheme').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.s === st.s)); });
    };
    $$('.part-btn').forEach(function (b) { b.addEventListener('click', function () { st.p = b.dataset.p; render(); }); });
    $$('.scheme').forEach(function (b) { b.addEventListener('click', function () { st.s = +b.dataset.s; render(); }); });
    $$('.part', house).forEach(function (g) { g.addEventListener('click', function () { st.p = g.dataset.part; render(); }); });
    render();
  }

  /* service tabs */
  var tabs = $$('.tab');
  function pick(t, user) {
    tabs.forEach(function (x) { x.setAttribute('aria-selected', String(x === t)); x.tabIndex = x === t ? 0 : -1; });
    $$('.tpanel').forEach(function (p) {
      var on = p.id === t.getAttribute('aria-controls');
      p.hidden = !on; p.classList.remove('slide');
      if (on && user) { void p.offsetWidth; p.classList.add('slide'); }
    });
  }
  tabs.forEach(function (t, i) {
    t.tabIndex = i === 0 ? 0 : -1;
    t.addEventListener('click', function () { pick(t, true); });
    t.addEventListener('keydown', function (e) {
      var n = -1;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % tabs.length;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      if (n > -1) { e.preventDefault(); tabs[n].focus(); pick(tabs[n], true); }
    });
  });

  /* prep line */
  var stations = $$('.station');
  var out = $('#prep-out');
  stations.forEach(function (s) {
    s.addEventListener('click', function () {
      s.classList.toggle('done'); s.setAttribute('aria-pressed', String(s.classList.contains('done')));
      var n = stations.filter(function (x) { return x.classList.contains('done'); }).length;
      out.textContent = n === 4 ? 'All 4 stations clear. Now the colour goes on.' : n + ' of 4 stations clear';
    });
  });

  /* five signs */
  var bins = $$('.bin');
  var cnt = $('#sg-count'), bar = $('#sg-bar'), vt = $('#sg-t');
  function tally() {
    var n = bins.filter(function (b) { return b.classList.contains('on'); }).length;
    cnt.textContent = n + ' of 5 spotted';
    bar.style.width = (n * 20) + '%';
    vt.textContent = n === 0 ? 'Tap the signs you can see on your own house.' : n === 1 ? 'One sign is worth keeping an eye on.' : 'Two or more signs is a good reason to get a painter to take a closer look.';
  }
  bins.forEach(function (b) {
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') === 'true';
      if (!open) { b.setAttribute('aria-expanded', 'true'); b.classList.add('on'); }
      else if (b.classList.contains('on')) { b.classList.remove('on'); b.setAttribute('aria-expanded', 'false'); }
      else { b.classList.add('on'); }
      tally();
    });
  });
  tally();
})();
