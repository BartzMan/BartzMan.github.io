(function () {
  'use strict';
  var d = document;
  // phone menu: full-screen sheet
  var burger = d.querySelector('.burger'), sheet = d.getElementById('sheet');
  if (burger && sheet) {
    var close = sheet.querySelector('.sheet-close');
    var openSheet = function () { sheet.hidden = false; burger.setAttribute('aria-expanded', 'true'); d.body.classList.add('locked'); (close || sheet).focus(); };
    var shut = function (back) { sheet.hidden = true; burger.setAttribute('aria-expanded', 'false'); d.body.classList.remove('locked'); if (back) burger.focus(); };
    burger.addEventListener('click', openSheet);
    if (close) close.addEventListener('click', function () { shut(true); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) shut(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) shut(true); });
  }
  // before / after slider (keyboard via the range input, pointer drag on the photo)
  var ba = d.querySelector('.ba');
  if (ba) {
    var range = ba.querySelector('.ba-range');
    var set = function (v) { v = Math.max(0, Math.min(100, v)); ba.style.setProperty('--pos', v + '%'); range.value = Math.round(v); range.setAttribute('aria-valuetext', Math.round(v) + '% before'); };
    range.addEventListener('input', function () { ba.classList.add('touched'); set(+range.value); });
    var dragging = false;
    var at = function (e) { var r = ba.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 100); };
    ba.addEventListener('pointerdown', function (e) { dragging = true; ba.classList.add('touched'); ba.setPointerCapture(e.pointerId); at(e); range.focus({ preventScroll: true }); });
    ba.addEventListener('pointermove', function (e) { if (dragging) at(e); });
    ba.addEventListener('pointerup', function () { dragging = false; });
    ba.addEventListener('pointercancel', function () { dragging = false; });
    set(50);
  }
  // text form: opens the visitor's own messaging app
  var form = d.getElementById('text-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var lines = ['Hi KJ Electric,'];
      if (f.msg.value.trim()) lines.push(f.msg.value.trim());
      lines.push('Job: ' + f.job.value);
      if (f.area.value.trim()) lines.push('Area: ' + f.area.value.trim());
      if (f.name.value.trim()) lines.push('Name: ' + f.name.value.trim());
      window.location.href = 'sms:+12107366155?&body=' + encodeURIComponent(lines.join('\n'));
    });
  }
})();
