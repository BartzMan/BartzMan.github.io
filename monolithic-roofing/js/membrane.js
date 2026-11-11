(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 1. cross-section slider */
  var stage = $('#stage'), range = $('#stage-range');
  if (stage && range) {
    var setPos = function (v) {
      v = Math.max(0, Math.min(100, v));
      stage.style.setProperty('--pos', v + '%');
      range.value = v;
    };
    range.addEventListener('input', function () { setPos(parseFloat(range.value)); });
    var fromPointer = function (e) {
      var r = stage.getBoundingClientRect();
      setPos(((e.clientX - r.left) / r.width) * 100);
    };
    var down = false;
    stage.addEventListener('pointerdown', function (e) {
      down = true; fromPointer(e);
      try { stage.setPointerCapture(e.pointerId); } catch (x) {}
    });
    stage.addEventListener('pointermove', function (e) { if (down) fromPointer(e); });
    var up = function () { down = false; };
    stage.addEventListener('pointerup', up);
    stage.addEventListener('pointercancel', up);
    setPos(50);

    var info = {
      1: ['Layer 1', 'Deck', 'The structural base of the roof, such as steel, concrete or wood. Everything else rests on it, so it has to be sound before anything is coated.'],
      2: ['Layer 2', 'Insulation', 'Boards under the roof surface. When water gets in they hold on to it, and wet insulation is the first thing to ask about before deciding to coat a roof.'],
      3: ['Layer 3', 'Existing membrane', 'The old black surface. Sun heats it and weather ages it, and the seams between its sheets are where it tends to open first.'],
      4: ['Layer 4', 'Seam reinforcement', 'A strip of fabric bedded over each seam and joint, so the coating has something strong to grip across the weakest line on the roof.'],
      5: ['Layer 5', 'White coating', 'A liquid-applied white layer that cures into one continuous skin, climbs the parapet and reflects sunlight instead of soaking it up.'],
      6: ['Watch for', 'Ponding', 'Standing water that stays after rain. A coating covers the surface but does not change the slope, so low spots are worth raising early.']
    };
    var btns = $$('.layer-btn');
    btns.forEach(function (b) {
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        var n = b.getAttribute('data-layer');
        var on = b.getAttribute('aria-pressed') === 'true';
        btns.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
        if (on) {
          stage.removeAttribute('data-active');
          $('#lc-kicker').textContent = 'Layer';
          $('#lc-title').textContent = 'Tap a layer';
          $('#lc-text').textContent = 'Pick any layer on the left to light it up in the drawing and read what it does. The drawing is not to scale: the coating is shown thicker than it really is.';
          return;
        }
        b.setAttribute('aria-pressed', 'true');
        stage.setAttribute('data-active', n);
        $('#lc-kicker').textContent = info[n][0];
        $('#lc-title').textContent = info[n][1];
        $('#lc-text').textContent = info[n][2];
        /* move the slider so the chosen layer is visible: ponding and open seam live on the left, coating and fabric on the right */
        if (n === '4' || n === '5') setPos(12);
        if (n === '6') setPos(92);
      });
    });
  }

  /* 2. process stepper */
  var tabs = $$('.step-tab');
  if (tabs.length) {
    var show = function (n, focus) {
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-step') === String(n);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var p = document.getElementById('panel-' + t.getAttribute('data-step'));
        if (p) p.hidden = !on;
        if (on && focus) t.focus();
      });
      var bar = $('.steps-bar b');
      if (bar) bar.style.width = (n * 25) + '%';
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(t.getAttribute('data-step')); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, j = -1;
        if (k === 'ArrowRight' || k === 'ArrowDown') j = (i + 1) % tabs.length;
        if (k === 'ArrowLeft' || k === 'ArrowUp') j = (i + tabs.length - 1) % tabs.length;
        if (j > -1) { e.preventDefault(); show(tabs[j].getAttribute('data-step'), true); }
      });
    });
  }

  /* 3. coat or replace checklist */
  var list = $('#check-list');
  if (list) {
    var boxes = $$('input', list), meter = $$('.v-meter i');
    var msgs = [
      'Nothing here rules a coating out. The next step is a proper look at the roof.',
      'A coating may still be on the table, but that point needs checking first, wet insulation above all.',
      'A coating may still be possible, but both points need checking before anyone decides.',
      'Several flags. Part of this roof may need replacing, so get it assessed before anyone quotes a coating.',
      'Several flags. Replacement is likely part of the conversation, so get the roof assessed before deciding.',
      'Every flag is ticked. Replacement is likely the honest answer, so get the roof assessed before deciding.'
    ];
    var upd = function () {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      meter.forEach(function (m, i) { m.classList.toggle('on', i < n); });
      $('#v-k').textContent = n + ' of 5 ticked';
      $('#v-t').textContent = msgs[n];
    };
    boxes.forEach(function (b) { b.addEventListener('change', upd); });
    upd();
  }
})();
