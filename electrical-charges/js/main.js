(function () {
  "use strict";

  var doc = document.documentElement;
  var body = document.body;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- phone menu sheet ---- */
  var sheet = document.getElementById("menu");
  var burger = document.querySelector(".burger");
  var closeBtn = document.querySelector(".sheet-x");

  function openMenu() {
    if (!sheet || !burger) return;
    sheet.hidden = false;
    burger.setAttribute("aria-expanded", "true");
    body.classList.add("menu-open");
    var first = sheet.querySelector(".sheet-nav a");
    if (first) first.focus();
  }
  function closeMenu(returnFocus) {
    if (!sheet || !burger) return;
    sheet.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
    if (returnFocus) burger.focus();
  }
  if (burger) burger.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", function () { closeMenu(true); });
  if (sheet) sheet.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sheet && !sheet.hidden) closeMenu(true);
  });

  /* ---- header state + scroll cord (pendant drops as you read) ---- */
  var hd = document.getElementById("hd");
  var dock = document.querySelector(".dock");
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.pageYOffset || doc.scrollTop;
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);
    doc.style.setProperty("--p", Math.min(1, y / max).toFixed(4));
    if (hd) hd.classList.toggle("is-solid", y > 40);
    if (dock) dock.classList.toggle("is-up", y > window.innerHeight * 0.55);
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---- reveal on scroll (staggered by --d) ---- */
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && rv.length && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- torch: a warm spot follows the pointer over the dark rooms ---- */
  var torch = document.querySelector(".torch");
  if (torch && !reduce && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", function (e) {
      torch.style.setProperty("--mx", e.clientX + "px");
      torch.style.setProperty("--my", e.clientY + "px");
      var dark = e.target && e.target.closest && e.target.closest("[data-dark]");
      torch.classList.toggle("on", !!dark);
    }, { passive: true });
    document.addEventListener("pointerleave", function () { torch.classList.remove("on"); });
  }

  /* ---- quote form -> visitor's own email app ---- */
  var form = document.getElementById("quote-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };
      var name = v("f-name") || "(no name given)";
      var scope = v("f-scope") || "Lighting";
      var lines = [
        "Name: " + name,
        "Phone or email: " + (v("f-contact") || "(not given)"),
        "What needs light: " + scope,
        "Where: " + (v("f-where") || "(not given)"),
        "",
        "The room and the fixtures:",
        v("f-notes") || "(no details yet)"
      ];
      var subject = "Lighting enquiry: " + scope + " (" + name + ")";
      window.location.href = "mailto:electricalcharges@gmail.com?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\r\n"));
    });
  }
})();
