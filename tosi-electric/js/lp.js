(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* reveal */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }) : null;
  $$(".rv, .stroke").forEach(function (el) { if (io) io.observe(el); else el.classList.add("in"); });
  setTimeout(function () { $$(".rv,.stroke").forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in"); }); }, 600);

  /* dimmer progress + header */
  var top = $(".top"), dim = $(".dimmer"), num = $(".dimmer-num");
  function onScroll() {
    var y = scrollY || 0, h = document.documentElement.scrollHeight - innerHeight, p = h > 0 ? Math.min(1, y / h) : 0;
    dim.style.setProperty("--p", p.toFixed(4));
    if (num) num.textContent = Math.round(p * 100) + "% lit";
    top.classList.toggle("is-stuck", y > 40);
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* menu */
  var burger = $(".burger"), menu = $("#menu");
  function setMenu(o) { menu.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); burger.setAttribute("aria-label", o ? "Close menu" : "Open menu"); document.body.classList.toggle("menu-open", o); top.style.zIndex = o ? 101 : ""; }
  burger.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); burger.focus(); } });
  addEventListener("resize", function () { if (innerWidth >= 1100) setMenu(false); });

  /* ---- light plan: tap a fixture, the room comes on ---- */
  var caps = {
    f1: ["R1", "Recessed lights · ceiling before, in process, after"],
    f2: ["T2", "Track light in a recessed ceiling frame"],
    f3: ["P3", "Track and pendant · dining room"],
    f4: ["C4", "Chandelier over a staircase"],
    f5: ["U5", "Under-cabinet lighting · kitchen"]
  };
  var room = $("#room"), roomImgs = $$("#room img"), cap = $("#room-cap"), cur = null;
  function setFx(id) {
    cur = (cur === id) ? null : id;
    $$("#pb .fx").forEach(function (g) { var on = g.dataset.fx === cur; g.classList.toggle("on", on); g.setAttribute("aria-pressed", on); });
    $$(".plan-legend .chipb").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.fx === cur); });
    var show = cur || (roomImgs.filter(function (i) { return i.classList.contains("cur"); })[0] || {}).dataset.fx || "f3";
    roomImgs.forEach(function (i) { i.classList.toggle("cur", i.dataset.fx === show); });
    room.classList.toggle("lit", !!cur);
    cap.innerHTML = cur ? "<b>" + caps[cur][0] + " on</b> · " + caps[cur][1] : "<b>Off</b> · tap R1 to U5";
  }
  $$("#pb .fx").forEach(function (g) {
    g.addEventListener("click", function () { setFx(g.dataset.fx); });
    g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFx(g.dataset.fx); } });
  });
  $$(".plan-legend .chipb").forEach(function (b) { b.addEventListener("click", function () { setFx(b.dataset.fx); }); });

  /* ---- schedule ---- */
  var rows = $$(".sch-row"), figs = $$(".sch figure");
  function openRow(i) {
    rows.forEach(function (r, k) { r.setAttribute("aria-expanded", k === i); });
    figs.forEach(function (f, k) { f.classList.toggle("on", k === i); });
  }
  rows.forEach(function (r, i) { r.addEventListener("click", function () { openRow(i); }); });

  /* ---- light colour ---- */
  var kel = $("#kel"), kout = $("#kel-out"), rsvg = $("#room-svg"), kread = $("#kel-read");
  var stops = [
    { k: 2700, kc: [255, 169, 77], wall: [233, 196, 143], floor: [141, 106, 70], sofa: [107, 79, 58] },
    { k: 3000, kc: [255, 191, 117], wall: [238, 212, 168], floor: [150, 118, 84], sofa: [102, 80, 62] },
    { k: 4000, kc: [255, 242, 222], wall: [232, 231, 222], floor: [158, 152, 140], sofa: [92, 82, 74] }
  ];
  function lerp(a, b, t) { return a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }); }
  function rgb(a) { return "rgb(" + a.join(",") + ")"; }
  function setK(k) {
    k = +k; kel.value = k; kout.textContent = k + "K";
    var a = stops[0], b = stops[1], t;
    if (k <= 3000) { a = stops[0]; b = stops[1]; t = (k - 2700) / 300; } else { a = stops[1]; b = stops[2]; t = (k - 3000) / 1000; }
    ["kc", "wall", "floor", "sofa"].forEach(function (n) { var c = rgb(lerp(a[n], b[n], t)); rsvg.style.setProperty("--" + n, c); if (n === "kc") kout.style.setProperty("--kc", c); });
    var h = k <= 2900 ? ["Warm", "Golden, like a classic bulb. Cosy in living rooms and bedrooms. Keep one colour per room so the lights match."]
      : k <= 3400 ? ["Soft white", "A friendly middle. Often chosen for kitchens and bathrooms, where you want warm but clear light."]
      : k <= 3700 ? ["In between", "Cleaner than soft white, still gentle. Look at it in the room, in the evening, before you commit."]
      : ["Neutral white", "Crisp and bright. Often chosen for workspaces, garages and utility rooms."];
    kread.innerHTML = "<b>" + h[0] + "</b>" + h[1];
    $$(".kv-presets .chipb").forEach(function (p) { p.setAttribute("aria-pressed", +p.dataset.k === k); });
  }
  kel.addEventListener("input", function () { setK(kel.value); });
  $$(".kv-presets .chipb").forEach(function (p) { p.addEventListener("click", function () { setK(p.dataset.k); }); });
  setK(2700);

  /* ---- gallery filters ---- */
  var fb = $$(".gal-filters .chipb"), gi = $$(".gi");
  fb.forEach(function (b) {
    b.addEventListener("click", function () {
      fb.forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      gi.forEach(function (g) { g.hidden = !(b.dataset.f === "all" || g.dataset.c === b.dataset.f || g.dataset.c === "cta"); });
    });
  });

  /* ---- form ---- */
  var form = $("#quote"), status = $("#form-status");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = $$("[required]", form).filter(function (f) { return !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value)); });
    status.textContent = bad.length ? "Please fill in your name, phone and email." : "Preview only: the form goes live with the finished site.";
    if (bad.length) bad[0].focus();
  });
})();
