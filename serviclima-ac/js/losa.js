/* Serviclima A/C · tiles, language switch, menu, reveal */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- tile strips ---------- */
  document.querySelectorAll(".losas").forEach(function (row) {
    var n = parseInt(row.getAttribute("data-n"), 10) || 30;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < n; i++) {
      var t = document.createElement("i");
      t.className = "losa";
      t.style.setProperty("--i", i);
      frag.appendChild(t);
    }
    row.appendChild(frag);
  });

  /* ---------- scroll progress: one small tile per step ---------- */
  var prog = document.querySelector(".progreso");
  var progTiles = [];
  if (prog) {
    for (var p = 0; p < 24; p++) { var c = document.createElement("i"); prog.appendChild(c); progTiles.push(c); }
    var ticking = false;
    var paint = function () {
      ticking = false;
      var max = doc.scrollHeight - window.innerHeight;
      var r = max > 0 ? window.scrollY / max : 0;
      var on = Math.round(r * progTiles.length);
      for (var k = 0; k < progTiles.length; k++) progTiles[k].classList.toggle("on", k < on);
    };
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
    paint();
  }

  /* ---------- reveal + floor laying (runs once per element) ---------- */
  var waiting = document.querySelectorAll(".losas, .piso");
  var drawn = document.querySelectorAll(".aire--draw");
  var reveals = document.querySelectorAll(".rv");
  if (!reduce && "IntersectionObserver" in window) {
    waiting.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.9) el.classList.add("espera");
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.remove("espera");
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    waiting.forEach(function (el) { io.observe(el); });
    reveals.forEach(function (el) { io.observe(el); });
    drawn.forEach(function (el) { io.observe(el); });
  } else {
    doc.classList.add("no-io");
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- language switch: ES (default) <-> EN ---------- */
  var nodes = document.querySelectorAll("[data-en]");
  var attrMap = [["data-en-aria", "aria-label"], ["data-en-alt", "alt"], ["data-en-ph", "placeholder"]];
  nodes.forEach(function (el) { el.setAttribute("data-es", el.innerHTML); });
  attrMap.forEach(function (pair) {
    document.querySelectorAll("[" + pair[0] + "]").forEach(function (el) {
      el.setAttribute(pair[0].replace("-en-", "-es-"), el.getAttribute(pair[1]) || "");
    });
  });
  var meta = {
    es: { title: document.title, desc: (document.querySelector('meta[name="description"]') || {}).content },
    en: { title: "Serviclima A/C · Air conditioning in Hialeah & Miami",
          desc: "AC sales, replacement and installation in Hialeah and Miami: air handlers and condensers. Call Serviclima A/C at (786) 660-2873." }
  };
  var menuLabels = { es: ["Abrir menú", "Cerrar menú"], en: ["Open menu", "Close menu"] };
  var lang = "es";
  function setLang(l) {
    lang = l;
    nodes.forEach(function (el) { el.innerHTML = el.getAttribute(l === "en" ? "data-en" : "data-es"); });
    attrMap.forEach(function (pair) {
      var src = l === "en" ? pair[0] : pair[0].replace("-en-", "-es-");
      document.querySelectorAll("[" + pair[0] + "]").forEach(function (el) { el.setAttribute(pair[1], el.getAttribute(src)); });
    });
    doc.lang = l;
    document.title = meta[l].title;
    var d = document.querySelector('meta[name="description"]');
    if (d && meta[l].desc) d.content = meta[l].desc;
    document.querySelectorAll(".idioma__b").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === l)); });
    var mb = document.querySelector(".menu-btn");
    if (mb) mb.setAttribute("aria-label", menuLabels[l][mb.getAttribute("aria-expanded") === "true" ? 1 : 0]);
    try { localStorage.setItem("serviclima-lang", l); } catch (e) {}
  }
  document.querySelectorAll(".idioma__b").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });
  try { if (localStorage.getItem("serviclima-lang") === "en") setLang("en"); } catch (e) {}

  /* ---------- phone menu ---------- */
  var btn = document.querySelector(".menu-btn");
  var sheet = document.getElementById("hoja");
  function closeMenu() {
    if (!sheet || sheet.hidden) return;
    sheet.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", menuLabels[lang][0]);
    document.body.style.overflow = "";
  }
  if (btn && sheet) {
    btn.addEventListener("click", function () {
      var open = sheet.hidden;
      sheet.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", menuLabels[lang][open ? 1 : 0]);
      document.body.style.overflow = open ? "hidden" : "";
      if (open) { var first = sheet.querySelector("a"); if (first) first.focus(); }
    });
    sheet.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeMenu(); btn.focus(); } });
    window.addEventListener("resize", function () { if (window.innerWidth > 1100) closeMenu(); });
  }

  /* ---------- quote form (no backend in this demo) ---------- */
  var form = document.getElementById("cotizacion");
  if (form) form.addEventListener("submit", function (e) { e.preventDefault(); });
})();
