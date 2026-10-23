(function () {
  "use strict";
  var doc = document.documentElement;
  var body = document.body;

  /* menu sheet */
  var sheet = document.getElementById("sheet");
  var burger = document.querySelector(".burger");
  var closer = document.querySelector(".sheet-close");
  function openSheet() {
    if (!sheet) return;
    sheet.hidden = false;
    body.classList.add("menu-open");
    if (burger) burger.setAttribute("aria-expanded", "true");
    var first = sheet.querySelector(".sheet-nav a");
    if (first) first.focus();
  }
  function closeSheet(back) {
    if (!sheet || sheet.hidden) return;
    sheet.hidden = true;
    body.classList.remove("menu-open");
    if (burger) { burger.setAttribute("aria-expanded", "false"); if (back) burger.focus(); }
  }
  if (burger) burger.addEventListener("click", openSheet);
  if (closer) closer.addEventListener("click", function () { closeSheet(true); });
  if (sheet) sheet.addEventListener("click", function (e) { if (e.target.closest("a")) closeSheet(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSheet(true); });

  /* roller progress: paints across the top as you scroll */
  var ticking = false;
  function paint() {
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    doc.style.setProperty("--p", p.toFixed(4));
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
  window.addEventListener("resize", paint);
  paint();

  /* reveals, the wash line and the fan deck */
  var targets = document.querySelectorAll(".reveal, .wash, [data-fan]");
  function show(el) { el.classList.add(el.hasAttribute("data-fan") ? "is-open" : "is-in"); }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(show);
  }

  /* job ticket: opens the visitor's own email app */
  var form = document.getElementById("job-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };
      var picked = [].slice.call(form.querySelectorAll('input[name="what"]:checked')).map(function (c) { return c.value; });
      var what = picked.length ? picked.join(", ") : "Not sure yet";
      var name = v("f-name");
      var lines = [
        "Name: " + (name || "-"),
        "Phone: " + (v("f-phone") || "-"),
        "Email: " + (v("f-email") || "-"),
        "City or ZIP: " + (v("f-where") || "-"),
        "What needs doing: " + what,
        "",
        "Rooms, walls or surfaces:",
        v("f-msg") || "-"
      ];
      var subject = "Job ticket: " + what + (name ? " (" + name + ")" : "");
      window.location.href = "mailto:sippie3435@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\r\n"));
    });
  }
})();
