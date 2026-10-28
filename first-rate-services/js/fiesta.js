/* First Rate Services - fiesta cool. Vanilla JS. */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var NS = "http://www.w3.org/2000/svg";

  /* ---------- scalloped rims for the star badges ---------- */
  function scallop(cx, cy, r, n) {
    var d = "", chord = 2 * r * Math.sin(Math.PI / n), br = chord / 2, i, a, x, y;
    for (i = 0; i <= n; i++) {
      a = (i / n) * Math.PI * 2 - Math.PI / 2;
      x = cx + r * Math.cos(a); y = cy + r * Math.sin(a);
      d += (i === 0 ? "M" : "A" + br.toFixed(2) + " " + br.toFixed(2) + " 0 0 1 ") + x.toFixed(2) + " " + y.toFixed(2) + " ";
    }
    return d + "Z";
  }
  $$(".badge__rim path, .rosette__rim path").forEach(function (p) {
    p.removeAttribute("transform");
    p.setAttribute("d", scallop(60, 60, 52, 14));
  });

  /* ---------- papel picado garlands ---------- */
  var PATTERNS = [
    "M32 14l8 8-8 8-8-8zM32 40m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0M14 50h8v8h-8zM42 50h8v8h-8z",
    "M32 12l3.6 7.6 8.4 1-6.2 5.8 1.7 8.3-7.5-4.2-7.5 4.2 1.7-8.3-6.2-5.8 8.4-1zM16 50l4-5 4 5-4 5zM40 50l4-5 4 5-4 5z",
    "M32 18m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0M32 40m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0M14 29h8v8h-8zM42 29h8v8h-8z",
    "M20 12h24v8H20zM12 28h8v8h-8zM28 28h8v8h-8zM44 28h8v8h-8zM20 44h8v8h-8zM36 44h8v8h-8z"
  ];
  function flagSVG(pat) {
    var d = "M2 0H62V70", i;
    for (i = 0; i < 7; i++) d += "a4.2 4.2 0 0 1 -8.57 0";
    d += "Z" + PATTERNS[pat];
    return '<svg viewBox="0 0 64 86" aria-hidden="true" focusable="false"><path fill-rule="evenodd" d="' + d + '"/></svg>';
  }
  var COLS = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)"];
  var garlands = $$(".garland");
  function buildGarland(g) {
    var kind = g.getAttribute("data-garland");
    var W = g.clientWidth || window.innerWidth, H = g.clientHeight || 200;
    var small = W < 700;
    var fw = small ? 40 : (W > 1500 ? 66 : 58);
    var rows = kind === "foot" ? 1 : 2;
    var out = '<svg class="gs" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" aria-hidden="true">', flags = "", r, n, i, y0, sag, t, x, y, tx, ty, ang, k = 0, pat;
    var startY = kind === "hero" ? 10 : 4;
    var gap = small ? 78 : 96;
    for (r = 0; r < rows; r++) {
      y0 = startY + r * gap; sag = small ? 30 : 46;
      out += '<path d="M-20 ' + y0 + " Q" + (W / 2) + " " + (y0 + sag * 2) + " " + (W + 20) + " " + y0 + '"/>';
      n = Math.max(6, Math.round(W / (fw + (small ? 8 : 14))));
      for (i = 0; i < n; i++) {
        t = (i + 0.5) / n;
        x = (1 - t) * (1 - t) * -20 + 2 * (1 - t) * t * (W / 2) + t * t * (W + 20);
        y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * (y0 + sag * 2) + t * t * y0;
        tx = 2 * (1 - t) * ((W / 2) + 20) + 2 * t * ((W + 20) - (W / 2));
        ty = 2 * (1 - t) * (sag * 2) + 2 * t * (-sag * 2);
        ang = Math.atan2(ty, tx) * 180 / Math.PI;
        pat = (i + r * 2) % PATTERNS.length;
        flags += '<span class="gf" style="left:' + x.toFixed(1) + "px;top:" + y.toFixed(1) + "px;--fw:" + fw + "px;--r:" + ang.toFixed(1) + "deg;--k:" + (k % 10) + ";--col:" + COLS[(i + r) % 4] + '"><span class="gf__in">' + flagSVG(pat) + "</span></span>";
        k++;
      }
    }
    out += "</svg>";
    g.innerHTML = out + flags;
  }
  var lastW = 0;
  function buildAll() { if (window.innerWidth === lastW) return; lastW = window.innerWidth; garlands.forEach(buildGarland); }
  buildAll();
  var rt;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(buildAll, 160); });

  /* ---------- scroll: thermometer edge bar, flutter, degrees section ---------- */
  var sf = $(".scalefill");
  var flutter = 0, lastY = window.scrollY, ticking = false, decay = 0;
  var degSec = $("#degrees"), merc = $("#merc"), swapB = $("#swapB"), degNum = $("#degNum"), degWord = $("#degWord");
  function stateWord(t) { return t >= 95 ? "Sun-baked" : t >= 88 ? "Hot" : t >= 80 ? "Warm" : t >= 74 ? "Getting cool" : "Just right"; }
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
    if (sf) sf.style.setProperty("--p", p.toFixed(4));
    var dy = window.scrollY - lastY; lastY = window.scrollY;
    if (!reduce) {
      flutter = Math.max(-16, Math.min(16, flutter + dy * 0.35));
      if (!decay) decay = requestAnimationFrame(decayFlutter);
    }
    if (degSec) {
      var r = degSec.getBoundingClientRect();
      var tt = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      var q = Math.min(1, Math.max(0, (tt - 0.28) / 0.42));
      var level = 1 - q;
      var hgt = 40 + 280 * level;
      merc.setAttribute("y", (360 - hgt).toFixed(1)); merc.setAttribute("height", hgt.toFixed(1));
      swapB.style.setProperty("--q", q.toFixed(3));
      var temp = Math.round(72 + 26 * level);
      degNum.textContent = temp + "°"; degWord.textContent = stateWord(temp);
    }
    ticking = false;
  }
  function decayFlutter() {
    flutter *= 0.9;
    if (Math.abs(flutter) < 0.15) flutter = 0;
    root.style.setProperty("--flut", flutter.toFixed(2));
    decay = flutter ? requestAnimationFrame(decayFlutter) : 0;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- reveal ---------- */
  var rv = $$(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add("in"); }); }

  /* ---------- menu ---------- */
  var menu = $(".menu"), sheet = $("#sheet");
  function setMenu(open) {
    menu.setAttribute("aria-expanded", open ? "true" : "false");
    menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    sheet.hidden = !open; document.body.style.overflow = open ? "hidden" : "";
  }
  menu.addEventListener("click", function () { setMenu(sheet.hidden); });
  $$("a", sheet).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sheet.hidden) { setMenu(false); menu.focus(); } });
  window.addEventListener("resize", function () { if (window.innerWidth > 900 && !sheet.hidden) setMenu(false); });

  /* ---------- thermostat dial ---------- */
  var dial = $("#thermo"), svg = $(".dial__svg", dial), ticksG = $(".dial__ticks", dial), arc = $(".dial__arc", dial), knob = $(".dial__knob", dial);
  var range = $("#tempRange"), outTemp = $("#temp"), stateEl = $(".dial__state", dial);
  var MIN = 68, MAX = 100, A0 = -135, A1 = 135, CX = 130, CY = 130;
  function polar(r, a) { var rad = a * Math.PI / 180; return [CX + r * Math.sin(rad), CY - r * Math.cos(rad)]; }
  function tToA(t) { return A0 + (t - MIN) / (MAX - MIN) * (A1 - A0); }
  (function ticks() {
    var t, a, p1, p2, el, long, lab, pl;
    for (t = MIN; t <= MAX; t++) {
      long = (t - MIN) % 4 === 0; a = tToA(t);
      p1 = polar(long ? 82 : 86, a); p2 = polar(92, a);
      el = document.createElementNS(NS, "line");
      el.setAttribute("x1", p1[0]); el.setAttribute("y1", p1[1]); el.setAttribute("x2", p2[0]); el.setAttribute("y2", p2[1]);
      ticksG.appendChild(el);
    }
  })();
  var temp = 98;
  function arcPath(a0, a1) {
    var s = polar(100, a0), e = polar(100, a1), large = (a1 - a0) > 180 ? 1 : 0;
    return "M" + s[0] + " " + s[1] + " A100 100 0 " + large + " 1 " + e[0] + " " + e[1];
  }
  function setTemp(t, fromRange) {
    t = Math.max(MIN, Math.min(MAX, Math.round(t))); temp = t;
    var a = tToA(t), p = polar(100, a);
    arc.setAttribute("d", arcPath(A0, Math.max(A0 + 0.01, a)));
    knob.setAttribute("transform", "translate(" + p[0] + " " + p[1] + ") rotate(" + a + ")");
    outTemp.textContent = t + "°"; stateEl.textContent = stateWord(t);
    if (!fromRange) range.value = t;
    range.setAttribute("aria-valuetext", t + " degrees, " + stateWord(t));
    root.style.setProperty("--h", ((t - MIN) / (MAX - MIN)).toFixed(3));
    root.setAttribute("data-temp", t >= 86 ? "hot" : t >= 77 ? "mild" : "cool");
  }
  function fromPointer(e) {
    var r = svg.getBoundingClientRect(), x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
    var a = Math.atan2(x, -y) * 180 / Math.PI;
    if (a > A1) a = A1; if (a < A0) a = A0;
    setTemp(MIN + (a - A0) / (A1 - A0) * (MAX - MIN));
  }
  var dragging = false;
  svg.addEventListener("pointerdown", function (e) { dragging = true; svg.setPointerCapture(e.pointerId); knob.style.animation = "none"; fromPointer(e); e.preventDefault(); });
  svg.addEventListener("pointermove", function (e) { if (dragging) fromPointer(e); });
  svg.addEventListener("pointerup", function () { dragging = false; });
  svg.addEventListener("pointercancel", function () { dragging = false; });
  $(".dial__step--dn", dial).addEventListener("click", function () { setTemp(temp - 2); });
  $(".dial__step--up", dial).addEventListener("click", function () { setTemp(temp + 2); });
  range.addEventListener("input", function () { setTemp(parseFloat(range.value), true); });
  setTemp(98);

  /* ---------- pennants ---------- */
  var pens = $$(".pennant");
  pens.forEach(function (pn) {
    var b = $(".pennant__btn", pn);
    b.addEventListener("click", function () {
      var open = !pn.classList.contains("is-open");
      pens.forEach(function (x) { x.classList.remove("is-open"); $(".pennant__btn", x).setAttribute("aria-expanded", "false"); });
      if (open) { pn.classList.add("is-open"); b.setAttribute("aria-expanded", "true"); }
    });
  });

  /* ---------- gallery flip ---------- */
  $$(".tl").forEach(function (t) {
    t.addEventListener("click", function () { t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"); });
  });

  /* ---------- form (preview) ---------- */
  var form = $("#quote"), note = $("#quoteNote");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = $$("input[required]", form).filter(function (i) { return !i.value.trim(); });
    if (bad.length) { bad[0].focus(); note.textContent = "Please fill in your name, phone and email so we know who to reply to."; return; }
    note.textContent = "Thanks. This website is a preview, so the request form is switched off for now. To reach the business today, call (830) 480-2106 or message on WhatsApp.";
  });
})();
