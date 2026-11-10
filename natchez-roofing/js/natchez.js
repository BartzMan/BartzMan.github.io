(function () {
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* 1. lettering tab bar */
  var tabs = $$('[role="tab"]'), panels = $$('[role="tabpanel"]');
  function openTab(id, focus) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-tab') === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on) { if (focus) t.focus({ preventScroll: true }); if (t.scrollIntoView && t.parentNode.scrollWidth > t.parentNode.clientWidth) t.parentNode.scrollTo({ left: t.offsetLeft - 16, behavior: 'smooth' }); }
    });
    panels.forEach(function (p) { p.hidden = p.id !== 'panel-' + id; });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { openTab(t.getAttribute('data-tab')); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (n) { e.preventDefault(); openTab(n.getAttribute('data-tab'), true); }
    });
  });

  /* 2. storm picker */
  var choices = $$('.choice'), page = $('#storm-page');
  var data = {
    roof: { k: 'Page 1 of the storm file', h: 'Water inside, or shingles down', steps: ['Move belongings away from the spot and put a bucket under any drip.', 'From the ground, take dated photos of the roof edges and any shingles in the yard.', 'Stay off the roof. Call a roofer to look at it.'], go: 'roofing', gol: 'See the roofing panel' },
    fence: { k: 'Page 2 of the storm file', h: 'Fence boards down or leaning', steps: ['Stay well clear of anything near power lines.', 'Photograph each section and note which posts have shifted.', 'Stack loose boards out of reach of kids and pets until someone can look.'], go: 'fencing', gol: 'See the fencing panel' },
    siding: { k: 'Page 3 of the storm file', h: 'Siding cracked or lifted', steps: ['Stand back and look along each wall for gaps or panels that have lifted.', 'Photograph them, wide first, then close.', 'Note any spot where rain could run in behind a panel.'], go: 'siding', gol: 'See the siding panel' },
    cover: { k: 'Page 4 of the storm file', h: 'Patio cover or carport hit', steps: ['Keep people and cars out from under it until it has been checked.', 'Photograph the posts, the beams and the roof panels from the side.', 'Do not lean on it or climb it. Call a pro to look.'], go: 'patios', gol: 'See the patio panel' }
  };
  function showChoice(key) {
    var d = data[key]; if (!d || !page) return;
    choices.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-choice') === key ? 'true' : 'false'); });
    page.innerHTML = '<p class="page-k">' + d.k + '</p><h3>' + d.h + '</h3><ol>' +
      d.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>' +
      '<p class="page-note">General home advice only. Stay on the ground, and stay clear of downed power lines.</p>' +
      '<a class="pill pill-dark" href="#services" data-go="' + d.go + '">' + d.gol + '</a>';
    page.classList.remove('flip'); void page.offsetWidth;
    if (page.animate) page.animate([{ transform: 'translateX(24px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.2,.7,.2,1)' });
  }
  choices.forEach(function (c) { c.addEventListener('click', function () { showChoice(c.getAttribute('data-choice')); }); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-go]'); if (!a) return;
    openTab(a.getAttribute('data-go'));
  });

  /* 3. gallery filter */
  var chips = $$('.chip'), tiles = $$('.tile');
  chips.forEach(function (ch) {
    ch.addEventListener('click', function () {
      var f = ch.getAttribute('data-filter');
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c === ch ? 'true' : 'false'); });
      tiles.forEach(function (t) {
        var show = f === 'all' || (t.getAttribute('data-kind') || '').split(' ').indexOf(f) > -1;
        t.hidden = !show;
      });
      var m = $('.mosaic'); if (m) m.scrollTo && m.scrollTo({ left: 0 });
    });
  });
})();
