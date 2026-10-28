/* yansolution-painting: site behaviors
   1. Pattern book: pick a pattern + colourway -> a roller sweeps the drawn room and re-covers the wall
   2. Headings roll in, drops unroll, frames hang (scroll reveals)
   3. Request form: standard success pattern
*/
(function () {
  "use strict";
  var d = document;
  var qs = function (s, r) { return (r || d).querySelector(s); };
  var qsa = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };

  /* ---------- 1. pattern book ---------- */
  var COLOURS = {
    emerald:  { name: "Emerald",  bg: "#0F5C4D", fg: "#E6C877", paint: "#0B4438" },
    sapphire: { name: "Sapphire", bg: "#1F3F93", fg: "#CFE0FF", paint: "#172F70" },
    garnet:   { name: "Garnet",   bg: "#8F1D3C", fg: "#F4CFA6", paint: "#6C1530" },
    amethyst: { name: "Amethyst", bg: "#5D2C82", fg: "#E8D2F4", paint: "#44205F" }
  };
  var PATTERNS = {
    damask:    { name: "Damask",    note: "Formal and warm: a dining room, a hallway, the wall behind the bed." },
    botanical: { name: "Botanical", note: "Leaf and stem: a soft bedroom, a reading corner, a nursery wall." },
    geometric: { name: "Geometric", note: "Crisp scallops and lines: an entry, an office, a powder room with attitude." }
  };

  var root = d.documentElement;
  var base = qs("#ys-base"), nw = qs("#ys-new"), roller = qs("#ys-roller");
  var patBtns = qsa(".ys-pat"), colBtns = qsa(".ys-col");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var target = { pattern: "damask", colour: "emerald" };
  var shown = { pattern: "damask", colour: "emerald" };
  var inflight = null, timer = null;

  function setVars(el, c) {
    el.style.setProperty("--wp-bg", c.bg);
    el.style.setProperty("--wp-fg", c.fg);
    el.style.setProperty("--wp-paint", c.paint);
  }
  function wall(prefix) { return d.getElementById(prefix + "wall"); }

  function commit() {
    if (!inflight) return;
    clearTimeout(timer);
    wall("a").setAttribute("fill", "url(#adamask)".replace("damask", inflight.pattern));
    setVars(base, COLOURS[inflight.colour]);
    shown = { pattern: inflight.pattern, colour: inflight.colour };
    inflight = null;
    nw.classList.remove("painting");
    roller.classList.remove("painting");
  }

  function paint() {
    if (inflight) commit();
    if (shown.pattern === target.pattern && shown.colour === target.colour) return;
    inflight = { pattern: target.pattern, colour: target.colour };
    var c = COLOURS[target.colour];
    wall("b").setAttribute("fill", "url(#bdamask)".replace("damask", target.pattern));
    setVars(nw, c);
    roller.style.setProperty("--roll", c.bg);
    if (reduce) { commit(); return; }
    void nw.offsetWidth;
    nw.classList.add("painting");
    roller.classList.add("painting");
    timer = setTimeout(commit, 1180);
  }

  function updateUI() {
    var c = COLOURS[target.colour], p = PATTERNS[target.pattern];
    setVars(root, c);
    patBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-pattern") === target.pattern)); });
    colBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-colour") === target.colour)); });
    var label = p.name + " in " + c.name;
    var n = qs("#ys-pickname"), no = qs("#ys-picknote"), fp = qs("#ys-formpick"), ff = qs("#ys-pickfield"), pr = qs("#ys-pickrect");
    if (n) n.textContent = label;
    if (no) no.textContent = p.note;
    if (fp) fp.textContent = label;
    if (ff) ff.value = label;
    if (pr) pr.setAttribute("fill", "url(#sw-" + target.pattern + ")");
  }

  if (base && nw && roller) {
    setVars(base, COLOURS[target.colour]);
    setVars(root, COLOURS[target.colour]);
    patBtns.forEach(function (b) {
      b.addEventListener("click", function () { target.pattern = b.getAttribute("data-pattern"); updateUI(); paint(); });
    });
    colBtns.forEach(function (b) {
      b.addEventListener("click", function () { target.colour = b.getAttribute("data-colour"); updateUI(); paint(); });
    });
  }

  /* ---------- 2. reveals ---------- */
  var rvs = qsa(".ys-rv, .ys-rollh, .ys-droplist");
  function reveal(el) {
    el.classList.add("in");
    if (el.classList.contains("ys-droplist")) {
      qsa(".ys-drop", el).forEach(function (x) { x.classList.add("in"); });
    }
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    rvs.forEach(function (el) { io.observe(el); });
  } else {
    rvs.forEach(reveal);
  }

  /* ---------- 3. form ---------- */
  var form = qs("#ys-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (typeof form.checkValidity === "function" && !form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var ok = qs("#ys-form-ok");
      var prev = qs("#ys-form-preview");
      var btn = qs("button[type=submit]", form);
      if (btn) { btn.disabled = true; btn.setAttribute("aria-disabled", "true"); }
      if (prev) prev.hidden = false;
      if (ok) {
        ok.hidden = false;
        ok.setAttribute("tabindex", "-1");
        ok.focus();
      }
    });
  }
})();
