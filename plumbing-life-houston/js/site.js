(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- odometers: scroll runs the meter ---- */
  var odos = $$("[data-odo]").map(function (el) {
    var n = +el.getAttribute("data-odo"), drums = [];
    for (var i = 0; i < n; i++) {
      var d = document.createElement("span"); d.className = "pl-drum" + (i === n - 1 ? " red" : "");
      var strip = document.createElement("i"); strip.innerHTML = "<span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>0</span>";
      d.appendChild(strip); el.appendChild(d); drums.push(strip);
    }
    return { el: el, drums: drums, fixed: el.getAttribute("data-fixed") };
  });
  function setOdo(v) {
    odos.forEach(function (o) {
      var n = o.drums.length, s;
      if (o.fixed) s = o.fixed; else s = String(Math.floor(v)).padStart(n, "0").slice(-n);
      o.drums.forEach(function (strip, i) {
        strip.style.transform = "translateY(" + (-(+s.charAt(i)) * 1.25) + "em)";
      });
    });
  }

  /* ---- header + scroll ---- */
  var hdr = $("#hdr"), ticking = false;
  function onScroll() {
    var y = window.scrollY || 0;
    if (hdr) hdr.classList.toggle("is-stuck", y > 40);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, y / max) : 0;
    setOdo(p * 99999 * 1.0 + 4271);
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("load", onScroll);
  onScroll();

  /* ---- phone sheet ---- */
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

  /* ---- reveal ---- */
  var rv = $$(".pl-rise");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add("in"); }); }

  /* ---- nav scroll-spy ---- */
  var links = $$(".pl-nav a"), secs = links.map(function (a) { return $(a.getAttribute("href").replace(/^.*#/, "#")); });
  if (links.length && "IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = secs.indexOf(en.target);
        links.forEach(function (l, j) { l.classList.toggle("on", i === j); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secs.forEach(function (s) { if (s) so.observe(s); });
  }

  /* ---- hero meter box lid ---- */
  var box = $("#box"), lid = $("#lid"), relid = $("#relid");
  if (box && lid) {
    var lifted = false;
    var lift = function () { if (lifted) return; lifted = true; box.classList.add("is-open"); if (reduce) box.classList.add("nomove"); lid.setAttribute("tabindex", "-1"); };
    var drop = function () { lifted = false; box.classList.remove("is-open"); lid.removeAttribute("tabindex"); };
    lid.addEventListener("click", lift);
    relid.addEventListener("click", drop);
    setTimeout(lift, reduce ? 0 : 1500);
  }

  /* ---- services: lids lift on scroll, or by tap ---- */
  var cards = $$("[data-lc]");
  function setLid(c, open) {
    c.classList.toggle("is-open", open);
    $(".pl-lc-lid", c).setAttribute("aria-expanded", open ? "true" : "false");
  }
  cards.forEach(function (c) {
    $(".pl-lc-lid", c).addEventListener("click", function () { c.dataset.touched = "1"; setLid(c, true); });
    $(".pl-lc-reset", c).addEventListener("click", function () { c.dataset.touched = "1"; setLid(c, false); });
  });
  if ("IntersectionObserver" in window && !reduce) {
    var lo = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var c = en.target; lo.unobserve(c);
        var delay = 500 + cards.indexOf(c) * 180;
        setTimeout(function () { if (!c.dataset.touched) setLid(c, true); }, delay);
      });
    }, { threshold: 0.35 });
    cards.forEach(function (c) { lo.observe(c); });
  } else { cards.forEach(function (c) { setLid(c, true); }); }

  /* ---- shower door compare ---- */
  var cmp = $("#cmp"), rng = $("#cmp-range");
  if (cmp && rng) {
    var setP = function () { cmp.style.setProperty("--p", rng.value); };
    rng.addEventListener("input", setP); setP();
  }

  /* ---- leak test ---- */
  var face = $("#face"), tabs = $$(".pl-tabs [role=tab]"), steps = $$(".pl-step");
  function goStep(i) {
    tabs.forEach(function (t, j) { t.setAttribute("aria-selected", j === i ? "true" : "false"); t.tabIndex = j === i ? 0 : -1; });
    steps.forEach(function (p, j) { p.hidden = j !== i; });
    face.setAttribute("data-hl", tabs[i].getAttribute("data-hl") || "");
    face.setAttribute("data-flow", "0"); face.setAttribute("data-hint", i === 1 ? "1" : "0");
    $$("[data-res]").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
    $$(".pl-result").forEach(function (r) { r.hidden = true; });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { goStep(i); });
    t.addEventListener("keydown", function (e) {
      var n = e.key === "ArrowRight" ? (i + 1) % 3 : e.key === "ArrowLeft" ? (i + 2) % 3 : -1;
      if (n > -1) { e.preventDefault(); goStep(n); tabs[n].focus(); }
    });
  });
  $$("[data-go]").forEach(function (b) { b.addEventListener("click", function () { goStep(+b.getAttribute("data-go")); }); });
  $$("[data-res]").forEach(function (b) {
    b.addEventListener("click", function () {
      var r = b.getAttribute("data-res");
      $$("[data-res]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      $("#res-still").hidden = r !== "still"; $("#res-moving").hidden = r !== "moving";
      face.setAttribute("data-flow", r === "moving" ? "1" : "0");
    });
  });

  /* ---- form: preview only ---- */
  var f = $("#quote");
  if (f) f.addEventListener("submit", function (e) { e.preventDefault(); });
})();
