(function () {
  "use strict";

  /* phone menu sheet */
  var sheet = document.getElementById("rxSheet");
  var burger = document.getElementById("rxBurger");
  var closer = document.getElementById("rxSheetX");
  function openSheet() {
    sheet.hidden = false;
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    closer.focus();
  }
  function closeSheet(returnFocus) {
    sheet.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (returnFocus) burger.focus();
  }
  if (sheet && burger && closer) {
    burger.addEventListener("click", openSheet);
    closer.addEventListener("click", function () { closeSheet(true); });
    sheet.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeSheet(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !sheet.hidden) closeSheet(true);
    });
  }

  /* staggered reveal */
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && rv.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* torch-seam progress under the header + the level panel */
  var prog = document.getElementById("rxProg");
  var levels = Array.prototype.slice.call(document.querySelectorAll("[data-level]"));
  var liftLinks = {};
  Array.prototype.forEach.call(document.querySelectorAll(".rx-lift a[data-lv]"), function (a) {
    liftLinks[a.getAttribute("data-lv")] = a;
  });
  var ticking = false;
  function update() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? window.scrollY / max : 0;
    if (prog) prog.style.width = (Math.min(1, Math.max(0, p)) * 100).toFixed(2) + "%";
    var mid = window.innerHeight * 0.45;
    var current = levels.length ? levels[0].getAttribute("data-level") : null;
    levels.forEach(function (s) {
      if (s.getBoundingClientRect().top <= mid) current = s.getAttribute("data-level");
    });
    Object.keys(liftLinks).forEach(function (k) {
      var on = k === current;
      liftLinks[k].classList.toggle("is-on", on);
      if (on) liftLinks[k].setAttribute("aria-current", "true");
      else liftLinks[k].removeAttribute("aria-current");
    });
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener("resize", update);
  update();

  /* quote form: opens the visitor's email app */
  var form = document.getElementById("rxForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var phone = form.elements.phone.value.trim();
      if (!name || !phone) {
        (name ? form.elements.phone : form.elements.name).focus();
        form.reportValidity && form.reportValidity();
        return;
      }
      var where = form.elements.where.value.trim();
      var job = form.elements.job.value;
      var roof = (form.querySelector("input[name=rooftype]:checked") || {}).value || "";
      var msg = form.elements.message.value.trim();
      var subject = "Roof request: " + job + (where ? " (" + where + ")" : "");
      var body =
        "Name: " + name + "\n" +
        "Phone: " + phone + "\n" +
        "Neighborhood / ZIP: " + (where || "-") + "\n" +
        "What the roof needs: " + job + "\n" +
        "The roof is: " + roof + "\n\n" +
        (msg ? "What is going on:\n" + msg + "\n" : "");
      window.location.href = "mailto:trexcontracting03@gmail.com?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }
})();
