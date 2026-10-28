/* Pipe Mystic Plumbing — site behavior
   constellation re-trace, four card turns, the exchange form */
(function () {
  "use strict";
  var d = document, w = window;

  d.documentElement.classList.add("js");

  /* ---------- strip felt darkens on scroll ---------- */
  var strip = d.querySelector(".pm-strip");
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      if (strip) strip.classList.toggle("scrolled", (w.scrollY || d.documentElement.scrollTop || 0) > 10);
      ticking = false;
    });
  }
  w.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- re-trace the lines (restart the chart) ---------- */
  var redraw = d.getElementById("pmRedraw");
  if (redraw) {
    redraw.addEventListener("click", function () {
      if (redraw.disabled) return;
      redraw.disabled = true;
      redraw.setAttribute("aria-busy", "true");
      var lines = d.querySelectorAll(".pm-chart .ch-line");
      Array.prototype.forEach.call(lines, function (p) {
        p.style.animation = "none";
        void p.getBoundingClientRect();
        p.style.animation = "";
      });
      setTimeout(function () {
        redraw.disabled = false;
        redraw.removeAttribute("aria-busy");
      }, 2800);
    });
  }

  /* ---------- the four cards (turn) ---------- */
  Array.prototype.forEach.call(d.querySelectorAll(".pm-ctl"), function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".pm-card");
      if (!card) return;
      var open = card.classList.toggle("flipped");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---------- the exchange ---------- */
  var form = d.getElementById("pmForm");
  var done = d.getElementById("pmDone");
  var fields = ["pm-name", "pm-phone", "pm-msg"];

  function setBad(f, bad) { if (f) f.classList.toggle("is-bad", bad); }

  if (form && done) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var firstBad = null;
      fields.forEach(function (id) {
        var f = d.getElementById(id);
        if (!f) return;
        var ok = f.value.trim().length > 1;
        setBad(f, !ok);
        if (!ok && !firstBad) firstBad = f;
      });
      if (firstBad) { firstBad.focus(); return; }
      form.hidden = true;
      done.hidden = false;
      done.focus();
    });
    fields.forEach(function (id) {
      var f = d.getElementById(id);
      if (f) f.addEventListener("input", function () { setBad(f, false); });
    });
  }
})();
