/* A-Bug Pest Control — menu sheet, scoped smooth anchors, reveal, mailto form. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- phone menu sheet ---- */
  var btn = document.querySelector(".fm-menubtn");
  var sheet = document.getElementById("fm-sheet");
  var lastFocus = null;
  function focusables() {
    return Array.prototype.slice.call(sheet.querySelectorAll("a[href], button:not([disabled])"));
  }
  function openSheet() {
    lastFocus = document.activeElement;
    sheet.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    var f = focusables();
    if (f.length) f[0].focus();
  }
  function closeSheet(restore) {
    if (sheet.hidden) return;
    sheet.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    if (restore !== false && lastFocus) lastFocus.focus();
  }
  if (btn && sheet) {
    btn.addEventListener("click", openSheet);
    sheet.querySelector(".fm-sheet-close").addEventListener("click", function () { closeSheet(); });
    sheet.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (a) closeSheet(false);
    });
    document.addEventListener("keydown", function (e) {
      if (sheet.hidden) return;
      if (e.key === "Escape") { closeSheet(); return; }
      if (e.key === "Tab") {
        var f = focusables(), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener("resize", function () { if (window.innerWidth >= 1100) closeSheet(false); });
  }

  /* ---- smooth scrolling only for in-page anchor clicks (never global) ---- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a || e.defaultPrevented) return;
    var href = a.getAttribute("href");
    var hash = href.slice(href.indexOf("#"));
    var path = href.slice(0, href.indexOf("#"));
    if (path && path !== "./" ) return;
    if (hash.length < 2) return;
    var t = document.getElementById(hash.slice(1));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    if (history.pushState) history.pushState(null, "", hash);
    t.setAttribute("tabindex", "-1");
    t.focus({ preventScroll: true });
  });

  /* ---- reveal: IntersectionObserver plus a scroll sweep so fast scrolling never strands content ---- */
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  function show(el) { el.classList.add("is-in"); }
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(show);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
    var ticking = false;
    function sweep() {
      ticking = false;
      var vh = window.innerHeight;
      items.forEach(function (el) {
        if (!el.classList.contains("is-in") && el.getBoundingClientRect().top < vh) show(el);
      });
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(sweep); }
    }, { passive: true });
    sweep();
  }

  /* ---- form: build a mailto with the visitor's details ---- */
  var form = document.getElementById("fm-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var v = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ""; };
      var subject = v("service") + " · " + (v("area") || "San Antonio");
      var body = [
        "Name: " + v("name"),
        "Phone: " + v("phone"),
        "ZIP or part of town: " + v("area"),
        "What I need: " + v("service"),
        "",
        v("message"),
        "",
        "(Sent from the A-Bug Pest Control website form)"
      ].join("\n");
      window.location.href = "mailto:abugpestcontrolusa@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }
})();
