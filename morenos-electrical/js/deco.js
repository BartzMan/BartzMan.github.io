/* Moreno's Electrical Contractor: concept interactions (hero pads, pole-to-panel trace, before-you-call checks) */
(function () {
  "use strict";

  /* 1. Hero Fig. 1: tap a pad on the conduit photo to read what that part does */
  var notes = [
    ["1 · Sweeps", "Long, smooth bends turn a conduit run over the wall and down without kinking the wire inside."],
    ["2 · Standoff brackets", "Brackets hold each run off the stucco at a steady spacing, so the lines stay straight and the wall can be painted behind them."],
    ["3 · Couplings", "Couplings join one length of metal conduit to the next, keeping the run continuous from end to end."],
    ["4 · The box", "The steel box at the bottom is where the runs start: a closed place to pull and connect the wires."]
  ];
  var pads = document.querySelectorAll(".pad-spot");
  var noteH = document.querySelector(".ff-note-h");
  var noteT = document.querySelector(".ff-note-t");
  pads.forEach(function (p) {
    p.addEventListener("click", function (e) {
      e.stopPropagation();
      var i = +p.getAttribute("data-note");
      pads.forEach(function (q) { q.classList.toggle("is-on", q === p); q.setAttribute("aria-pressed", q === p ? "true" : "false"); });
      if (noteH && noteT) { noteH.textContent = notes[i][0]; noteT.textContent = notes[i][1]; }
    });
    p.setAttribute("aria-pressed", "false");
  });

  /* 2. Pole to panel: the neon trace lights up to the chosen stop and the stage shows that part */
  var map = document.querySelector(".pm-board");
  if (map) {
    var stops = map.querySelectorAll(".pm-stop");
    var cards = document.querySelectorAll(".pm-card");
    var reach = [96, 85.5, 67.1, 35.5, 0];
    var cur = 0;
    var show = function (i) {
      cur = (i + stops.length) % stops.length;
      map.style.setProperty("--live", reach[cur]);
      stops.forEach(function (s, k) { s.classList.toggle("is-on", k === cur); s.setAttribute("aria-pressed", k === cur ? "true" : "false"); });
      cards.forEach(function (c, k) { c.hidden = k !== cur; c.classList.toggle("is-on", k === cur); });
    };
    stops.forEach(function (s, k) { s.addEventListener("click", function () { show(k); }); });
    document.querySelectorAll(".pm-arrow").forEach(function (a) {
      a.addEventListener("click", function () { show(cur + (+a.getAttribute("data-step"))); });
    });
    map.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); show(cur + 1); stops[cur].focus(); }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); show(cur - 1); stops[cur].focus(); }
    });
    show(0);
  }

  /* 3. Before you call: tick the checks, the neon trace runs down the list */
  var items = document.querySelectorAll(".ck-item");
  var count = document.querySelector(".ck-n");
  items.forEach(function (b) {
    b.addEventListener("click", function () {
      var on = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.parentNode.classList.toggle("is-done", on);
      if (count) count.textContent = document.querySelectorAll('.ck-item[aria-pressed="true"]').length;
    });
  });
})();
