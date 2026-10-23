(function () {
  "use strict";

  var doc = document.documentElement;
  var body = document.body;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* phone sheet */
  var sheet = document.getElementById("sheet");
  var burger = document.querySelector(".burger");
  var closeBtn = document.querySelector(".sheet-x");
  function openSheet() {
    if (!sheet || !burger) return;
    sheet.hidden = false;
    burger.setAttribute("aria-expanded", "true");
    body.classList.add("menu-open");
    var first = sheet.querySelector(".sheet-nav a");
    if (first) first.focus();
  }
  function closeSheet(back) {
    if (!sheet || !burger) return;
    sheet.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
    if (back) burger.focus();
  }
  if (burger) burger.addEventListener("click", openSheet);
  if (closeBtn) closeBtn.addEventListener("click", function () { closeSheet(true); });
  if (sheet) sheet.addEventListener("click", function (e) { if (e.target.closest("a")) closeSheet(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sheet && !sheet.hidden) closeSheet(true);
  });

  /* scroll progress: conditioned air filling the duct under the header */
  var ticking = false;
  function progress() {
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    doc.style.setProperty("--p", p.toFixed(4));
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(progress); }
  }, { passive: true });
  progress();

  /* staggered reveals */
  var groups = {};
  var reveals = document.querySelectorAll(".reveal");
  reveals.forEach(function (el) {
    var key = el.parentNode ? (el.parentNode.className || "x") : "x";
    groups[key] = (groups[key] || 0) + 1;
    el.style.setProperty("--d", ((groups[key] - 1) * 0.12).toFixed(2) + "s");
  });
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* "Ask about ..." links preselect the service in the form */
  var svcSelect = document.getElementById("f-svc");
  document.querySelectorAll("[data-svc]").forEach(function (a) {
    a.addEventListener("click", function () {
      if (!svcSelect) return;
      var want = a.getAttribute("data-svc");
      for (var i = 0; i < svcSelect.options.length; i++) {
        if (svcSelect.options[i].text === want) { svcSelect.selectedIndex = i; break; }
      }
    });
  });

  /* form -> the visitor's own email app */
  var form = document.getElementById("quote-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };
      var where = form.querySelector("input[name=where]:checked");
      var name = val("f-name") || "(no name given)";
      var svc = val("f-svc") || "HVAC";
      var lines = [
        "Name: " + name,
        "Phone or email: " + (val("f-contact") || "(not given)"),
        "Service: " + svc,
        "Where the unit is: " + (where ? where.value : "Not sure"),
        "",
        "What it is doing:",
        val("f-notes") || "(no details yet)",
        "",
        "Sent from the J's Heating & Cooling website"
      ];
      var subject = svc + " - " + name;
      window.location.href = "mailto:heatandairaz@gmail.com?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\r\n"));
    });
  }
})();
