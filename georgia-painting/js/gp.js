(function () {
  'use strict';
  var $ = function (s, e) { return (e || document).querySelector(s); };
  var $$ = function (s, e) { return Array.prototype.slice.call((e || document).querySelectorAll(s)); };

  /* section headers: the stripe is pulled once when it scrolls into view */
  var dds = $$('[data-dd]');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.25 });
    dds.forEach(function (d) { d.classList.add('pre'); io.observe(d); });
  } else { dds.forEach(function (d) { d.classList.add('in'); }); }

  /* services tabs */
  var tabs = $$('[role=tab][aria-controls^=tp-]');
  function openTab(t, focus) {
    tabs.forEach(function (b) {
      var on = b === t;
      b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1;
      var p = document.getElementById(b.getAttribute('aria-controls'));
      p.hidden = !on; p.classList.toggle('on', on);
    });
    if (focus) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { openTab(t); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); openTab(tabs[(i + 1) % tabs.length], true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); openTab(tabs[(i + tabs.length - 1) % tabs.length], true); }
    });
  });

  /* sheen guide */
  var SH = [
    ['Flat', 'Ceilings and low-traffic walls.', 'It hides bumps and uneven patches, but it marks easily and is hard to wipe.'],
    ['Matte', 'Bedrooms, living rooms and quiet walls.', 'Soft and low in glare, forgiving of small flaws, and a little easier to wipe than flat.'],
    ['Eggshell', 'Most walls: halls, living rooms, dining rooms and kitchen walls.', 'A gentle glow that wipes clean without looking shiny.'],
    ['Satin', 'Kids’ rooms, baths, laundry rooms and built-ins.', 'Harder and easier to scrub, which suits humid Atlanta summers.'],
    ['Semi-gloss', 'Trim, doors, window frames and cabinets.', 'The toughest and easiest to wipe, but it shows every bump, so the prep matters.']
  ];
  var scale = $$('.scale button');
  function sheen(i) {
    scale.forEach(function (b, k) { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
    $('#sh-name').textContent = SH[i][0]; $('#sh-where').textContent = SH[i][1]; $('#sh-why').textContent = SH[i][2];
    $('#sh-no').textContent = 'Sheen ' + (i + 1) + ' of 5';
  }
  scale.forEach(function (b, i) { b.addEventListener('click', function () { sheen(i); }); });
  sheen(2);

  /* the drawdown bar */
  var ov = $('#pullov'), lastBtn = null;
  function open(b) {
    lastBtn = b;
    var st = $('#pstripe');
    st.style.setProperty('--pc', b.getAttribute('data-hex'));
    st.style.setProperty('--pi', b.getAttribute('data-ink'));
    $('#p-no').textContent = 'Drawdown No. ' + (b.getAttribute('data-no') || '01');
    $('#p-room').textContent = b.getAttribute('data-room');
    $('#p-cn').textContent = b.getAttribute('data-cn');
    $('#p-sheen').textContent = 'Sheen: ' + b.getAttribute('data-sheen');
    $('#p-note').textContent = b.getAttribute('data-note');
    var im = $('#p-img'), src = b.getAttribute('data-img'), ph = $('.pull-ph');
    if (src) { im.src = src; im.alt = b.getAttribute('data-alt') || ''; $('#p-lbl').textContent = b.getAttribute('data-room'); ph.hidden = false; }
    else { im.removeAttribute('src'); ph.hidden = true; }
    ov.classList.remove('open'); void ov.offsetWidth;
    ov.classList.add('open'); ov.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    $('#pullx').focus();
  }
  function close() {
    ov.classList.remove('open'); ov.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    if (lastBtn) lastBtn.focus({ preventScroll: true });
  }
  $$('[data-pull]').forEach(function (b) { b.addEventListener('click', function () { open(b); }); });
  $('#pullx').addEventListener('click', close);
  ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.classList.contains('open')) close(); });
})();
