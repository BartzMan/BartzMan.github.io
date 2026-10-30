(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- scroll reveal + pencil draw ---- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }) : null;
  $$(".rv, .dim, .draw").forEach(function (el) { if (io) io.observe(el); else el.classList.add("in"); });
  // safety: anything already above the fold or if observer fails
  setTimeout(function () { $$(".rv").forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add("in"); }); }, 600);

  /* ---- masthead + scroll tape ---- */
  var mast = $(".mast"), prog = $(".tape-prog"), num = $(".tape-num");
  function onScroll() {
    var y = window.scrollY || 0, h = document.documentElement.scrollHeight - innerHeight;
    var p = h > 0 ? Math.min(1, y / h) : 0;
    prog.style.setProperty("--p", p.toFixed(4));
    if (num) num.textContent = Math.round(y / 96) + " in";
    mast.classList.toggle("is-stuck", y > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---- phone menu ---- */
  var burger = $(".burger"), menu = $("#menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
    mast.style.zIndex = open ? 101 : "";
  }
  burger.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); burger.focus(); } });
  window.addEventListener("resize", function () { if (innerWidth >= 1100) setMenu(false); });

  /* ---- THE TAPE: drag the hook to pull out the next sheet ---- */
  var pull = $("#pull"), hook = $("#hook"), blade = $("#blade"), panels = $("#panels"), nums = $("#nums");
  var mq = window.matchMedia("(max-width: 800px)");
  var val = parseFloat(pull.dataset.pull) || 0.36, used = false;
  (function buildNums() { var s = ""; for (var i = 1; i <= 64; i++) s += '<b style="left:' + (i * 32 - 8) + 'px">' + i + "</b>"; nums.innerHTML = s; })();
  function stage() { return $(".pull-stage", pull).getBoundingClientRect(); }
  function setPull(v, instant) {
    v = Math.max(0.12, Math.min(1, v)); val = v;
    pull.style.setProperty("--pull", v.toFixed(4));
    hook.setAttribute("aria-valuenow", Math.round(v * 100));
    if (mq.matches) {
      // phone: the hook scrubs the swipe row
      pull.style.setProperty("--pull", v.toFixed(4));
    }
  }
  function markUsed() { if (!used) { used = true; pull.classList.add("used"); } }
  function applyMode() {
    if (mq.matches) { pull.style.setProperty("--pull", "1"); syncFromScroll(); }
    else { setPull(val || 0.36); }
  }
  function syncFromScroll() {
    var max = panels.scrollWidth - panels.clientWidth; if (max <= 0) return;
    var p = panels.scrollLeft / max;
    // on phones the blade length follows the swipe position
    pull.style.setProperty("--pull", (0.18 + p * 0.82).toFixed(4));
  }
  var dragging = false;
  function fromPointer(x) {
    var r = stage();
    if (mq.matches) {
      var inner = r.width - 96 - 46, p = (x - r.left - 96 - 23) / inner; p = Math.max(0, Math.min(1, p));
      panels.scrollLeft = p * (panels.scrollWidth - panels.clientWidth);
    } else {
      setPull((x - r.left - 150) / (r.width - 150));
    }
  }
  function startDrag(e) {
    dragging = true; markUsed(); pull.classList.add("drag");
    try { e.target.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    e.preventDefault();
  }
  hook.addEventListener("pointerdown", startDrag);
  blade.addEventListener("pointerdown", function (e) { startDrag(e); fromPointer(e.clientX); });
  [hook, blade].forEach(function (el) {
    el.addEventListener("pointermove", function (e) { if (dragging) fromPointer(e.clientX); });
    el.addEventListener("pointerup", function () { dragging = false; pull.classList.remove("drag"); });
    el.addEventListener("pointercancel", function () { dragging = false; pull.classList.remove("drag"); });
  });
  hook.addEventListener("keydown", function (e) {
    var k = e.key, step = 0.1;
    if (k === "ArrowRight" || k === "ArrowUp") { markUsed(); mq.matches ? panels.scrollBy({ left: 200, behavior: "smooth" }) : setPull(val + step); e.preventDefault(); }
    else if (k === "ArrowLeft" || k === "ArrowDown") { markUsed(); mq.matches ? panels.scrollBy({ left: -200, behavior: "smooth" }) : setPull(val - step); e.preventDefault(); }
    else if (k === "Home") { markUsed(); setPull(0.12); e.preventDefault(); }
    else if (k === "End") { markUsed(); setPull(1); e.preventDefault(); }
  });
  hook.addEventListener("click", function () { if (!used) { markUsed(); if (!mq.matches) setPull(Math.min(1, val + 0.25)); else panels.scrollBy({ left: 260, behavior: "smooth" }); } });
  $$(".ghost").forEach(function (g) { g.addEventListener("click", function () { markUsed(); setPull(parseFloat(g.dataset.goto)); }); });
  panels.addEventListener("scroll", function () { if (mq.matches) syncFromScroll(); }, { passive: true });
  mq.addEventListener ? mq.addEventListener("change", applyMode) : mq.addListener(applyMode);
  // reduced motion / no hover: show everything
  if (reduce) { val = 1; }
  applyMode();
  // when the section scrolls in, ease the tape out a little
  if (io && !reduce && !mq.matches) {
    var once = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !used) { setTimeout(function () { if (!used) setPull(0.78); }, 700); once.disconnect(); }
      });
    }, { threshold: 0.45 });
    once.observe(pull);
  }

  /* ---- ice dam step-through ---- */
  var tabs = $$('.ice-steps [role=tab]'), xs = $("#xs");
  function pick(i) {
    tabs.forEach(function (t, k) {
      var on = k === i; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1;
      var p = $("#" + t.getAttribute("aria-controls")); if (p) p.hidden = !on;
    });
    xs.setAttribute("data-step", i + 1);
    cam(i);
  }
  /* on phones the drawing zooms to the part each step talks about */
  var views = [[40, 20, 700, 470], [150, 240, 660, 360], [0, 200, 560, 410], [0, 290, 600, 320]], curV = [0, 0, 900, 620], camT = 0;
  function cam(i) {
    var target = mq.matches ? views[i] : [0, 0, 900, 620], from = curV.slice(), t0 = null;
    cancelAnimationFrame(camT);
    function f(ts) {
      if (t0 === null) t0 = ts; var k = reduce ? 1 : Math.min(1, (ts - t0) / 600), e = 1 - Math.pow(1 - k, 3);
      curV = from.map(function (v, n) { return v + (target[n] - v) * e; });
      xs.setAttribute("viewBox", curV.map(function (v) { return v.toFixed(1); }).join(" "));
      if (k < 1) camT = requestAnimationFrame(f);
    }
    camT = requestAnimationFrame(f);
  }
  mq.addEventListener ? mq.addEventListener("change", function () { cam(+xs.getAttribute("data-step") - 1); }) : 0;
  cam(0);
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { pick(i); });
    t.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowRight") n = (i + 1) % tabs.length; else if (e.key === "ArrowLeft") n = (i + tabs.length - 1) % tabs.length;
      if (n !== null) { pick(n); tabs[n].focus(); e.preventDefault(); }
    });
  });

  /* ---- pitch reader ---- */
  var rise = $("#rise"), riseOut = $("#rise-out"), roof = $("#pt-roof"), riseL = $("#pt-rise"), riseT = $("#pt-rise-t"), ridge = $("#pt-ridge"), deg = $("#pt-deg"), arc = $("#pt-arc"), read = $("#pr-read");
  var notes = [
    [2, "Flat to very low slope", "Water drains slowly, so these roofs are built and sealed differently from a typical shingle roof."],
    [4, "Low slope", "Water sheds slowly, so sealing and flashing details matter more."],
    [8, "Common pitch", "Water and snow shed well, and standard shingle details apply."],
    [12, "Steep", "Water and snow slide off fast, and the work takes more safety planning."]
  ];
  function drawPitch() {
    var r = +rise.value, px = r * 40, y = 540 - px;
    roof.setAttribute("d", "M110 540L590 " + y + "V540Z");
    riseL.setAttribute("d", "M650 540V" + y + "M640 540H660M640 " + y + "H660");
    riseT.setAttribute("y", Math.max(60, 540 - px / 2 + 8)); riseT.textContent = r + " IN RISE";
    ridge.setAttribute("y", Math.max(40, y - 16)); ridge.setAttribute("x", 500);
    var a = Math.atan(r / 12), ang = a * 180 / Math.PI;
    deg.textContent = Math.round(ang) + "°";
    var rr = 92, ex = 110 + rr * Math.cos(a), ey = 540 - rr * Math.sin(a);
    arc.setAttribute("d", "M" + (110 + rr) + " 540A" + rr + " " + rr + " 0 0 0 " + ex.toFixed(1) + " " + ey.toFixed(1));
    riseOut.textContent = r + "/12";
    var n = notes.filter(function (x) { return r <= x[0]; })[0] || notes[3];
    read.innerHTML = "<b>" + n[1] + "</b>" + n[2];
  }
  rise.addEventListener("input", drawPitch); drawPitch();

  /* ---- lightbox ---- */
  var lb = $("#lb"), lbImg = $("#lb-img"), lbCap = $("#lb-cap"), items = $$(".fn"), cur = 0;
  function show(i) {
    cur = (i + items.length) % items.length; var b = items[cur];
    lbImg.src = b.dataset.full; lbImg.alt = b.dataset.alt || ""; lbCap.textContent = b.dataset.cap || "";
  }
  items.forEach(function (b, i) { b.addEventListener("click", function () { show(i); if (lb.showModal) lb.showModal(); else lb.setAttribute("open", ""); }); });
  $("#lb-close").addEventListener("click", function () { lb.close(); });
  $("#lb-prev").addEventListener("click", function () { show(cur - 1); });
  $("#lb-next").addEventListener("click", function () { show(cur + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") show(cur + 1); if (e.key === "ArrowLeft") show(cur - 1); });

  /* ---- form ---- */
  var form = $("#quote"), status = $("#form-status");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = $$("[required]", form).filter(function (f) { return !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value)); });
    status.textContent = bad.length ? "Please fill in your name, phone and email." : "Preview only: the form goes live with the finished site.";
    if (bad.length) bad[0].focus();
  });
})();
