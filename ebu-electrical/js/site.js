(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- header: stuck state + scroll progress (the bus bar fills) ---- */
  var hdr = $("#hdr"), prog = $("#prog");
  function onScroll() {
    var y = window.scrollY || 0;
    if (hdr) hdr.classList.toggle("is-stuck", y > 40);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (prog) prog.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- phone menu sheet ---- */
  var sheet = $("#sheet"), burger = $("#burger"), bx = $("#burger-x");
  function sheetSet(open) {
    if (!sheet) return;
    sheet.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
    if (open && bx) bx.focus(); else if (burger) burger.focus({ preventScroll: true });
  }
  if (burger) burger.addEventListener("click", function () { sheetSet(true); });
  if (bx) bx.addEventListener("click", function () { sheetSet(false); });
  $$("#sheet a").forEach(function (a) { a.addEventListener("click", function () { sheetSet(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && sheet && sheet.classList.contains("open")) sheetSet(false); });

  /* ---- hero: the steel door ---- */
  var hero = $("#top.hero"), door = $("#door");
  if (hero && door) {
    var opened = false, timer = null;
    var openDoor = function () {
      if (opened) return; opened = true;
      clearTimeout(timer);
      hero.classList.add("is-open");
      if (reduce) { hero.classList.add("nomove", "is-gone"); door.setAttribute("inert", ""); return; }
      setTimeout(function () { hero.classList.add("is-gone"); door.setAttribute("inert", ""); }, 1750);
    };
    var closeDoor = function () {
      opened = false;
      hero.classList.remove("is-gone", "nomove");
      door.removeAttribute("inert");
      void hero.offsetWidth;
      hero.classList.remove("is-open");
    };
    $("#door-open").addEventListener("click", openDoor);
    door.addEventListener("click", function (e) { if (e.target === door || e.target.closest(".door-in") === null) openDoor(); });
    $("#door-close").addEventListener("click", closeDoor);
    timer = setTimeout(openDoor, reduce ? 0 : 1700);
    window.addEventListener("scroll", function () { if (window.scrollY > 120) openDoor(); }, { passive: true });
  }

  /* ---- scroll reveal, staggered ---- */
  var rv = $$(".rv");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add("in"); }); }

  /* ---- scroll-spy: the panel schedule LED follows the section in view ---- */
  var cells = $$(".sch-nav a");
  var secs = cells.map(function (a) { return $(a.getAttribute("href").replace(/^.*#/, "#")); });
  if (cells.length && "IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = secs.indexOf(en.target);
        cells.forEach(function (c, j) { c.classList.toggle("on", i === j); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secs.forEach(function (s) { if (s) so.observe(s); });
  }

  /* ---- services: breakers ---- */
  var brks = $$(".brk");
  function setBrk(b, on) {
    var sw = $(".sw", b);
    b.classList.toggle("is-on", on);
    sw.setAttribute("aria-checked", on ? "true" : "false");
    $(".brk-state", b).textContent = on ? "ON" : "OFF";
  }
  function syncMain() {
    var all = brks.every(function (b) { return b.classList.contains("is-on"); });
    var m = $("#main-sw");
    if (m) { m.setAttribute("aria-pressed", all ? "true" : "false"); $("#main-lbl").textContent = all ? "Main: all ON" : "Main: flip all ON"; }
  }
  brks.forEach(function (b) {
    $(".sw", b).addEventListener("click", function () { setBrk(b, !b.classList.contains("is-on")); syncMain(); });
  });
  var mainSw = $("#main-sw");
  if (mainSw) mainSw.addEventListener("click", function () {
    var all = brks.every(function (b) { return b.classList.contains("is-on"); });
    brks.forEach(function (b, i) { setTimeout(function () { setBrk(b, !all); syncMain(); }, reduce ? 0 : i * 140); });
  });

  /* ---- tripping: three steps ---- */
  var mini = $("#mini"), flag = $("#mini-flag");
  var tabs = $$(".trip-tabs [role=tab]"), panels = $$(".trip-panel");
  var flags = { trip: "TRIPPED", off: "OFF", call: "CALL A PRO" };
  function goStep(i) {
    tabs.forEach(function (t, j) { t.setAttribute("aria-selected", j === i ? "true" : "false"); t.tabIndex = j === i ? 0 : -1; });
    panels.forEach(function (p, j) { p.hidden = j !== i; });
    var st = tabs[i].getAttribute("data-state");
    if (st === "off" && !reduce) {
      mini.setAttribute("data-state", "off"); flag.textContent = "OFF";
      setTimeout(function () { if (tabs[1].getAttribute("aria-selected") === "true") { mini.setAttribute("data-state", "on"); flag.textContent = "HOLDS?"; } }, 900);
    } else {
      mini.setAttribute("data-state", st === "off" ? "on" : st); flag.textContent = st === "off" ? "HOLDS?" : flags[st];
    }
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { goStep(i); });
    t.addEventListener("keydown", function (e) {
      var n = e.key === "ArrowRight" ? (i + 1) % 3 : e.key === "ArrowLeft" ? (i + 2) % 3 : -1;
      if (n > -1) { e.preventDefault(); goStep(n); tabs[n].focus(); }
    });
  });
  $$("[data-go]").forEach(function (b) { b.addEventListener("click", function () { goStep(+b.getAttribute("data-go")); }); });

  /* ---- anatomy: hotspots <-> list ---- */
  var hs = $$(".hs"), items = $$("#anat-list button");
  function pick(i) {
    hs.forEach(function (h) { h.setAttribute("aria-pressed", h.getAttribute("data-i") === i ? "true" : "false"); });
    items.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-i") === i ? "true" : "false"); });
  }
  hs.concat(items).forEach(function (b) { b.addEventListener("click", function () { pick(b.getAttribute("data-i")); }); });

  /* ---- gallery lightbox ---- */
  var dlg = document.createElement("dialog");
  dlg.className = "lb"; dlg.setAttribute("aria-label", "Photo viewer");
  dlg.innerHTML = '<div class="lb-in"><button type="button" aria-label="Close photo"><svg class="ic" aria-hidden="true"><use href="#i-close"/></svg></button><img alt=""><p></p></div>';
  document.body.appendChild(dlg);
  var lbi = $("img", dlg), lbp = $("p", dlg);
  $$(".gal-t").forEach(function (t) {
    t.addEventListener("click", function () {
      var im = $("img", t);
      lbi.src = t.getAttribute("data-full"); lbi.alt = im.alt; lbp.textContent = t.getAttribute("data-cap");
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    });
  });
  $("button", dlg).addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

  /* ---- Bronx: light the block ---- */
  var fl = $("#flip"), bx2 = $("#bronx");
  if (fl) fl.addEventListener("click", function () {
    var on = !bx2.classList.contains("lit");
    bx2.classList.toggle("lit", on);
    fl.setAttribute("aria-pressed", on ? "true" : "false");
    $("#flip-lbl").textContent = on ? "Block is lit" : "Lights on the block";
  });

  /* ---- form: preview only ---- */
  var f = $("#quote");
  if (f) f.addEventListener("submit", function (e) { e.preventDefault(); });
})();
