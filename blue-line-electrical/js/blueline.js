/* Blue Line Electrical - the blue line. Vanilla JS. */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var NS = "http://www.w3.org/2000/svg";

  /* ---------- the blue line: one wire from the horizon down the page ---------- */
  var svg = $("#wire"), under = $("#wireUnder"), main = $("#wireMain"), spur = $("#wireSpur"), nodesG = $("#wireNodes"), head = $("#wireHead");
  var total = 0, nodes = [], spurAt = 0, introLen = 0, introT = reduce ? 1 : 0, intro0 = 0, firstLen = 0;
  function docY(el) { return el.getBoundingClientRect().top + window.scrollY; }
  function docX(el) { return el.getBoundingClientRect().left + window.scrollX; }
  function rounded(pts, r) {
    var d = "M" + pts[0][0] + " " + pts[0][1], i, p0, p1, p2, v1, v2, l1, l2, rr, a, b;
    for (i = 1; i < pts.length - 1; i++) {
      p0 = pts[i - 1]; p1 = pts[i]; p2 = pts[i + 1];
      l1 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]); l2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      rr = Math.min(r, l1 / 2, l2 / 2);
      a = [p1[0] - (p1[0] - p0[0]) / l1 * rr, p1[1] - (p1[1] - p0[1]) / l1 * rr];
      b = [p1[0] + (p2[0] - p1[0]) / l2 * rr, p1[1] + (p2[1] - p1[1]) / l2 * rr];
      d += " L" + a[0].toFixed(1) + " " + a[1].toFixed(1) + " Q" + p1[0] + " " + p1[1] + " " + b[0].toFixed(1) + " " + b[1].toFixed(1);
    }
    p2 = pts[pts.length - 1];
    return d + " L" + p2[0] + " " + p2[1];
  }
  function nearestLen(x, y) {
    var best = 0, bd = 1e12, step = 10, L, p, dd;
    for (L = 0; L <= total; L += step) {
      p = main.getPointAtLength(L); dd = (p.x - x) * (p.x - x) + (p.y - y) * (p.y - y);
      if (dd < bd) { bd = dd; best = L; }
    }
    return best;
  }
  function layout() {
    svg.style.height = "0px";
    var W = document.documentElement.clientWidth, H = document.documentElement.scrollHeight;
    svg.setAttribute("width", W); svg.setAttribute("height", H); svg.style.height = H + "px";
    var hero = $(".hero"), sky = $(".hero__sky");
    var gx = parseFloat(getComputedStyle(sky).paddingLeft) || 24;
    var XL = Math.max(11, gx - 34), XR = W - XL;
    var hy = docY(hero) + hero.offsetHeight * 0.473;
    var a1 = docY($("#house")) + 2, a2 = docY($("#coast")) + 2, a3 = docY($("#work")) + 2, a4 = docY($("#contact")) + 2;
    var plug = $(".quote__plug"), px = docX(plug) + plug.offsetWidth / 2, py = docY(plug);
    var pts = [[-4, hy], [XR, hy], [XR, a1], [XL, a1], [XL, a2], [XR, a2], [XR, a3], [XL, a3], [XL, a4], [px, a4], [px, py]];
    var d = rounded(pts, 18);
    under.setAttribute("d", d); main.setAttribute("d", d);
    total = main.getTotalLength();
    main.style.strokeDasharray = total; under.style.strokeDasharray = total;
    firstLen = Math.abs(XR - -4);
    // spur into the service panel
    var pn = $("#panelNode"), pr = pn.getBoundingClientRect(), pnx = pr.left + window.scrollX + pr.width / 2, pny = pr.top + window.scrollY + pr.height / 2;
    spur.setAttribute("d", "M" + XL + " " + pny + " L" + pnx + " " + pny);
    spurAt = nearestLen(XL, pny);
    // junction nodes at the corners and the ends
    nodesG.innerHTML = nodes_html(pts, pnx, pny, XL);
    nodes = $$(".wnode", nodesG).map(function (g) { return { el: g, L: nearestLen(parseFloat(g.getAttribute("data-x")), parseFloat(g.getAttribute("data-y"))) }; });
    draw();
  }
  function nodes_html(pts, pnx, pny, XL) {
    var out = "", i, list = pts.slice(1, pts.length - 1);
    list.forEach(function (p) { out += node(p[0], p[1]); });
    out += node(pnx, pny);
    out += node(pts[pts.length - 1][0], pts[pts.length - 1][1]);
    return out;
  }
  function node(x, y) { return '<g class="wnode" data-x="' + x + '" data-y="' + y + '" transform="translate(' + (x - 10) + " " + (y - 10) + ')"><rect width="20" height="20"/><circle cx="10" cy="10" r="4"/></g>'; }
  function drawnLength() {
    var target = window.scrollY + window.innerHeight * 0.64, lo = 0, hi = total, mid, p, i;
    for (i = 0; i < 22; i++) { mid = (lo + hi) / 2; p = main.getPointAtLength(mid); if (p.y <= target) lo = mid; else hi = mid; }
    return Math.max(lo, firstLen * Math.min(1, introT));
  }
  function draw() {
    var L = drawnLength();
    main.style.strokeDashoffset = total - L; under.style.strokeDashoffset = total - L;
    var p = main.getPointAtLength(Math.max(0.1, L));
    head.setAttribute("cx", p.x); head.setAttribute("cy", p.y);
    head.style.opacity = (L >= total - 2 || L < 2) ? 0 : 1;
    nodes.forEach(function (n) { n.el.classList.toggle("lit", L >= n.L - 2); });
    spur.classList.toggle("lit", L >= spurAt - 2);
  }
  var t0 = 0;
  function intro(ts) {
    if (!t0) t0 = ts;
    introT = Math.min(1, (ts - t0) / 1500); draw();
    if (introT < 1) requestAnimationFrame(intro);
  }
  var ticking = false;
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { draw(); parallax(); ticking = false; }); } }, { passive: true });
  var rl;
  function relayout() { clearTimeout(rl); rl = setTimeout(layout, 120); }
  window.addEventListener("resize", relayout);
  window.addEventListener("load", relayout);
  if ("ResizeObserver" in window) new ResizeObserver(relayout).observe(document.body);
  layout();
  if (!reduce) requestAnimationFrame(intro); else { introT = 1; draw(); }

  /* ---------- coast photo parallax ---------- */
  var coastImg = $(".coast__img img"), coast = $(".coast");
  function parallax() {
    if (reduce || !coastImg) return;
    var r = coast.getBoundingClientRect(), mid = Math.max(-1, Math.min(1, (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight));
    coastImg.style.setProperty("--py", (mid * -40).toFixed(1) + "px");
  }
  parallax();

  /* ---------- reveal ---------- */
  var rv = $$(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add("in"); }); }

  /* ---------- menu ---------- */
  var burger = $(".burger"), sheet = $("#sheet");
  function setMenu(open) {
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    sheet.hidden = !open; document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () { setMenu(sheet.hidden); });
  $$("a", sheet).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sheet.hidden) { setMenu(false); burger.focus(); } });
  window.addEventListener("resize", function () { if (window.innerWidth > 900 && !sheet.hidden) setMenu(false); });

  /* ---------- click-to-light house ---------- */
  var ROOMS = {
    panel: { tag: "CKT 01 · SERVICE PANEL", title: "Panel upgrades", text: "Where the line comes in. Breakers, labelling and capacity for what your home runs today.", img: "stock-breaker-panel", w: 720, h: 479, alt: "Hand pointing a pen at breakers and colour-coded wires inside an open electrical panel", cap: "Stock photo · panel", lit: [], wires: [], bulbs: [] },
    bed: { tag: "CKT 02 · UPSTAIRS", title: "Repairs", text: "A flicker, a dead switch, a breaker that keeps tripping. Trace it with a meter, fix the cause.", img: "stock-multimeter-test", w: 720, h: 720, alt: "Gloved hands holding multimeter probes against wires", cap: "Stock photo · testing a circuit", lit: ["r-bed"], wires: ["w-bed"], bulbs: ["b-bed"] },
    living: { tag: "CKT 03 · LIVING ROOM", title: "Outlets & switches", text: "New outlets, replacement switches and dimmers, set neatly and tested.", img: "stock-outlet", w: 720, h: 900, alt: "A white outlet on a teal painted wall", cap: "Stock photo · outlet", lit: ["r-living"], wires: ["w-living"], bulbs: ["b-living"] },
    kitchen: { tag: "CKT 04 · KITCHEN", title: "Lighting", text: "Recessed, pendant and under-cabinet lighting that makes the room.", img: "stock-recessed-ceiling", w: 720, h: 549, alt: "Rows of warm recessed ceiling lights in a coffered ceiling", cap: "Stock photo · recessed lights", lit: ["r-kitchen"], wires: ["w-kitchen"], bulbs: ["b-kitchen"] },
    garage: { tag: "CKT 05 · GARAGE", title: "New circuits & installs", text: "Dedicated circuits and new equipment, run clean from the panel.", img: "stock-junction-box", w: 720, h: 540, alt: "Open junction box full of wires and copper cable in a wooden wall frame", cap: "Stock photo · junction box", lit: ["r-garage"], wires: ["w-garage"], bulbs: ["b-garage"] },
    out: { tag: "CKT 06 · OUTSIDE", title: "Outdoor lighting", text: "Porch, path and yard lights for the walk from the car to the door.", img: "stock-house-night", w: 720, h: 540, alt: "A house with glowing yellow windows under a starry night sky", cap: "Stock photo · house at night", lit: [], wires: ["w-out", "w-post"], bulbs: ["b-out", "b-post"], glow: ["g-out"] }
  };
  var hots = $$(".hot"), allBtn = $("#allBtn"), cut = $("#cut"), allOn = false, current = "panel";
  var infoImg = $("#infoImg"), infoCap = $("#infoCap"), infoTag = $("#infoTag"), infoTitle = $("#infoTitle"), infoText = $("#infoText");
  function el(id) { return document.getElementById(id); }
  function clearAll() {
    $$(".room", cut).forEach(function (r) { r.classList.remove("on"); });
    $$(".bulb", cut).forEach(function (b) { b.classList.remove("on"); });
    $$(".bw", cut).forEach(function (w) { w.classList.remove("on"); });
    $$(".rg", cut).forEach(function (g) { g.classList.remove("on"); });
  }
  function lightRoom(key) {
    var r = ROOMS[key];
    r.lit.forEach(function (id) { el(id).classList.add("on"); });
    r.wires.forEach(function (id) { el(id).classList.add("on"); });
    r.bulbs.forEach(function (id) { el(id).classList.add("on"); });
    (r.glow || []).forEach(function (id) { el(id).classList.add("on"); });
  }
  function show(key) {
    current = key; var r = ROOMS[key];
    infoTag.textContent = r.tag; infoTitle.textContent = r.title; infoText.textContent = r.text;
    infoImg.src = "images/" + r.img + "-720.jpg"; infoImg.width = r.w; infoImg.height = r.h; infoImg.alt = r.alt; infoCap.textContent = r.cap;
    hots.forEach(function (h) { h.setAttribute("aria-pressed", h.getAttribute("data-room") === key ? "true" : "false"); });
  }
  hots.forEach(function (h) {
    h.addEventListener("click", function () {
      var key = h.getAttribute("data-room");
      if (!allOn) clearAll();
      lightRoom(key); show(key);
    });
  });
  allBtn.addEventListener("click", function () {
    allOn = !allOn; allBtn.setAttribute("aria-pressed", allOn ? "true" : "false");
    $(".all__t", allBtn).textContent = allOn ? "Lights off" : "Light the whole house";
    clearAll();
    if (allOn) {
      Object.keys(ROOMS).forEach(lightRoom);
      ["r-landing"].forEach(function (id) { el(id).classList.add("on"); });
      ["b-landing"].forEach(function (id) { el(id).classList.add("on"); });
      ["w-landing"].forEach(function (id) { el(id).classList.add("on"); });
    } else { lightRoom(current); }
  });
  // start with the panel selected; tease the kitchen once when the house scrolls into view
  show("panel");
  var touched = false;
  hots.forEach(function (h) { h.addEventListener("click", function () { touched = true; }); });
  if ("IntersectionObserver" in window && !reduce) {
    var teaser = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { teaser.disconnect(); setTimeout(function () { if (!touched) { clearAll(); lightRoom("kitchen"); show("kitchen"); } }, 900); } });
    }, { threshold: 0.5 });
    teaser.observe(cut);
  }

  /* ---------- gallery filters ---------- */
  var chips = $$(".chip"), pics = $$(".pic");
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      var f = c.getAttribute("data-f");
      chips.forEach(function (x) { var on = x === c; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", on ? "true" : "false"); });
      pics.forEach(function (p) { p.classList.toggle("off", f !== "all" && p.getAttribute("data-k") !== f); });
    });
  });

  /* ---------- rating gauge counts up once ---------- */
  var gauge = $("#gauge"), gfg = $("#gaugeFg"), gnum = $("#gaugeNum");
  function setGauge(v) { gnum.textContent = v.toFixed(1); gfg.style.strokeDashoffset = (100 - (v / 5) * 100).toFixed(2); }
  setGauge(4.9);
  if ("IntersectionObserver" in window && !reduce) {
    var go = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; go.disconnect();
        var s = null; setGauge(0);
        (function step(ts) { if (!s) s = ts; var t = Math.min(1, (ts - s) / 1400), v = 4.9 * (1 - Math.pow(1 - t, 3)); setGauge(v); if (t < 1) requestAnimationFrame(step); else setGauge(4.9); })(performance.now());
      });
    }, { threshold: 0.6 });
    go.observe(gauge);
  }

  /* ---------- form (preview) ---------- */
  var form = $("#quote"), note = $("#quoteNote");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = $$("input[required]", form).filter(function (i) { return !i.value.trim(); });
    if (bad.length) { bad[0].focus(); note.textContent = "Please fill in your name, phone and email so we know who to reply to."; return; }
    note.textContent = "Thanks. This website is a preview, so the request form is switched off for now. To reach the business today, call (917) 939-3049 or message on WhatsApp.";
  });
})();
