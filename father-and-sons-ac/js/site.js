(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* phone menu sheet */
  var burger = document.querySelector(".burger");
  var sheet = document.getElementById("sheet");
  if (burger && sheet) {
    var closeBtn = sheet.querySelector(".sheet-close");
    var open = function () {
      sheet.hidden = false;
      burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    };
    var close = function (back) {
      sheet.hidden = true;
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      if (back) burger.focus();
    };
    burger.addEventListener("click", open);
    closeBtn.addEventListener("click", function () { close(true); });
    sheet.addEventListener("click", function (e) { if (e.target.closest("a")) close(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sheet.hidden) close(true); });
  }

  /* email form: opens the visitor's own email app */
  var form = document.getElementById("jobform");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var err = document.getElementById("f-err");
      if (!name) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      var job = form.elements.job.value;
      var lines = ["Hi Father & Sons,", "", "Name: " + name];
      var phone = form.elements.phone.value.trim();
      if (phone) lines.push("Phone: " + phone);
      var area = form.elements.area.value.trim();
      if (area) lines.push("Neighborhood or ZIP: " + area);
      lines.push("Need: " + job);
      var msg = form.elements.message.value.trim();
      if (msg) lines.push("", msg);
      window.location.href = "mailto:lsfathernsons@gmail.com?subject=" + encodeURIComponent(job + " - " + name) + "&body=" + encodeURIComponent(lines.join("\n"));
    });
  }

  /* plates switch "on" as they come into view; gentle reveal */
  var plates = document.querySelectorAll(".svc");
  var reveal = document.querySelectorAll(".svc, .arch, .head, .sign, .col-card, .pin-card, .rev-seal, .hoops a");
  if (!("IntersectionObserver" in window) || reduce) {
    plates.forEach(function (p) { p.classList.add("on"); });
    return;
  }
  doc.classList.add("js");
  reveal.forEach(function (el) { el.classList.add("rv"); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      el.classList.add("in");
      if (el.matches(".svc")) {
        setTimeout(function () { el.classList.add("on"); }, 350);
      }
      io.unobserve(el);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  reveal.forEach(function (el) { io.observe(el); });
  /* safety: never leave content hidden */
  setTimeout(function () { reveal.forEach(function (el) { el.classList.add("in"); }); }, 4000);
})();
