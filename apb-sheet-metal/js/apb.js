(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------- header + panels-laid progress ---------- */
  var head = $(".apb-head"), prog = $("#progFill");
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? clamp(y / max, 0, 1) : 0;
    head.classList.toggle("scrolled", y > 30);
    prog.style.clipPath = "inset(0 " + (100 - p * 100).toFixed(2) + "% 0 0)";
    stripsUpdate();
  }

  /* ---------- phone sheet ---------- */
  var burger = $("#burger"), sheet = $("#sheet");
  function setSheet(open) {
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    sheet.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () { setSheet(burger.getAttribute("aria-expanded") !== "true"); });
  $$("a", sheet).forEach(function (a) { a.addEventListener("click", function () { setSheet(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sheet.hidden) { setSheet(false); burger.focus(); } });

  /* ---------- seams fold up as they enter ---------- */
  var seams = $$(".apb-seam");
  if ("IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); so.unobserve(e.target); } });
    }, { threshold: 0.7 });
    seams.forEach(function (s) { so.observe(s); });
  } else seams.forEach(function (s) { s.classList.add("in"); });

  /* ---------- panels: drag to scroll with a mouse when they scroll ---------- */
  var pan = $("#panels"), drag = null;
  pan.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse" || pan.scrollWidth <= pan.clientWidth + 2) return;
    drag = { x: e.clientX, l: pan.scrollLeft };
    pan.style.cursor = "grabbing"; pan.style.scrollSnapType = "none";
  });
  window.addEventListener("pointermove", function (e) { if (drag) pan.scrollLeft = drag.l - (e.clientX - drag.x); });
  window.addEventListener("pointerup", function () { if (drag) { drag = null; pan.style.cursor = ""; pan.style.scrollSnapType = ""; } });

  /* ---------- copper patina slider (recolours only the copper) ---------- */
  var img = $("#patinaImg"), cv = $("#patinaCanvas"), frame = $(".apb-patina-frame");
  var range = $("#patinaRange"), now = $("#patinaNow"), stages = $$("#stages li"), pSec = $("#copper");
  var W = 900, H = 1200, ctx = null, base = null, cur = null, idx = null, wt = null;
  var notes = [[0.12, "Bright, new copper."], [0.3, "Starting to darken."], [0.5, "Warm, dark brown."], [0.72, "Green creeping in."], [0.9, "Mostly green now."], [1.01, "Verdigris: the classic blue-green."]];
  function mix(a, b, u) { return a + (b - a) * u; }
  function paint(t) {
    if (!ctx || !idx) return;
    var d = cur.data, b = base.data, i, k, o, r, g, bl, L, c0, c1, c2, w, u;
    for (k = 0; k < idx.length; k++) {
      i = idx[k]; o = i * 4; w = wt[k];
      r = b[o]; g = b[o + 1]; bl = b[o + 2];
      L = 0.299 * r + 0.587 * g + 0.114 * bl;
      var br = L * 0.76, bg = L * 0.45, bb = L * 0.31;
      var vr = L * 0.62 + 8, vg = L * 1.12 + 6, vb = L * 0.96 + 4;
      if (t <= 0.5) { u = t / 0.5; c0 = mix(r, br, u); c1 = mix(g, bg, u); c2 = mix(bl, bb, u); }
      else { u = (t - 0.5) / 0.5; u = u * u * (3 - 2 * u); c0 = mix(br, vr, u); c1 = mix(bg, vg, u); c2 = mix(bb, vb, u); }
      d[o] = mix(r, c0, w); d[o + 1] = mix(g, c1, w); d[o + 2] = mix(bl, c2, w);
    }
    ctx.putImageData(cur, 0, 0);
  }
  function labels(t) {
    for (var i = 0; i < notes.length; i++) if (t < notes[i][0]) { now.textContent = notes[i][1]; break; }
    stages.forEach(function (li, j) {
      var on = (j === 0 && t < 0.3) || (j === 1 && t >= 0.3 && t < 0.75) || (j === 2 && t >= 0.75);
      li.classList.toggle("on", on);
    });
    var rr = Math.round(mix(232, 88, t)), gg = Math.round(mix(149, 200, t)), bb = Math.round(mix(90, 170, t));
    pSec.style.setProperty("--cuAccent", "rgb(" + rr + "," + gg + "," + bb + ")");
    pSec.style.setProperty("--cuStroke", "rgba(" + rr + "," + gg + "," + bb + ",.28)");
  }
  var pending = false;
  function onRange() {
    labels(range.value / 100);
    if (!pending) { pending = true; requestAnimationFrame(function () { pending = false; paint(range.value / 100); }); }
  }
  function initPatina() {
    try {
      cv.width = W; cv.height = H;
      ctx = cv.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, W, H);
      base = ctx.getImageData(0, 0, W, H);
      var m = new Image();
      m.onload = function () {
        try {
          var t = document.createElement("canvas"); t.width = W; t.height = H;
          var tc = t.getContext("2d", { willReadFrequently: true });
          tc.drawImage(m, 0, 0, W, H);
          var md = tc.getImageData(0, 0, W, H).data, list = [], ws = [];
          for (var p = 0; p < W * H; p++) { var v = md[p * 4]; if (v > 10) { list.push(p); ws.push(v / 255); } }
          idx = Int32Array.from(list); wt = Float32Array.from(ws);
          cur = new ImageData(new Uint8ClampedArray(base.data), W, H);
          frame.classList.add("ready");
          paint(range.value / 100);
        } catch (e) { ctx = null; }
      };
      m.src = "images/own-copper-mask.png";
    } catch (e) { ctx = null; }
  }
  range.addEventListener("input", onRange);
  labels(0);
  if (img.complete && img.naturalWidth) initPatina(); else img.addEventListener("load", initPatina);

  /* ---------- metal or shingle tabs + checklist ---------- */
  var tabs = $$("#compare [role=tab]"), panels = $$("#compare [role=tabpanel]"), seamBar = $(".apb-tab-seam");
  function placeSeam() {
    var on = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0];
    if (on) { seamBar.style.setProperty("--tx", on.offsetLeft + "px"); seamBar.style.setProperty("--tw", on.offsetWidth + "px"); }
  }
  function pickTab(i, focus) {
    tabs.forEach(function (t, j) {
      var on = j === i;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.classList.toggle("on", on); t.tabIndex = on ? 0 : -1;
      panels[j].hidden = !on;
    });
    placeSeam();
    if (focus) tabs[i].focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { pickTab(i); });
    t.addEventListener("keydown", function (e) {
      var n = tabs.length;
      if (e.key === "ArrowRight") { e.preventDefault(); pickTab((i + 1) % n, true); }
      if (e.key === "ArrowLeft") { e.preventDefault(); pickTab((i + n - 1) % n, true); }
    });
  });
  placeSeam(); window.addEventListener("resize", placeSeam);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeSeam);
  var boxes = $$("#askList input"), fill = $("#askFill"), cnt = $("#askCount");
  boxes.forEach(function (b) {
    b.addEventListener("change", function () {
      var n = boxes.filter(function (x) { return x.checked; }).length;
      fill.style.width = (n / boxes.length * 100) + "%";
      cnt.textContent = n + " of " + boxes.length + " asked";
    });
  });

  /* ---------- Irving: roof panels lift to reveal the skyline ---------- */
  var irv = $("#irving"), strips = [];
  if (!reduce) {
    var host = $("#strips"), n = window.innerWidth <= 760 ? 7 : 14;
    for (var s = 0; s < n; s++) { var sp = document.createElement("span"); host.appendChild(sp); strips.push(sp); }
  }
  function stripsUpdate() {
    if (!strips.length) return;
    var r = irv.getBoundingClientRect(), vh = window.innerHeight;
    var p = r.top > vh * 0.92 ? 1 : clamp((vh * 0.92 - r.top) / (vh * 0.8), 0, 1), n = strips.length;
    for (var i = 0; i < n; i++) {
      var local = clamp((p - (i / n) * 0.45) / 0.55, 0, 1);
      strips[i].style.setProperty("--ty", (-local * 104).toFixed(1) + "%");
    }
  }

  /* ---------- reveal on scroll ---------- */
  var sel = [".apb-work-head > *", ".apb-panel", ".apb-patina-head > *", ".apb-patina-photo", ".apb-patina-slider", ".apb-stages li", ".apb-choose-head > *", ".apb-compare", ".apb-irv-row", ".apb-contact-top > *", ".apb-contact-card", ".apb-form", ".apb-foot-grid > *"];
  var items = [];
  sel.forEach(function (q) { $$(q).forEach(function (el, i) { el.classList.add("rv"); el.style.setProperty("--d", i % 5); items.push(el); }); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else items.forEach(function (el) { el.classList.add("in"); });

  $("#quoteForm").addEventListener("submit", function (e) { e.preventDefault(); });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
