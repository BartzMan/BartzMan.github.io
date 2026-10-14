(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pct = document.querySelector("[data-bay-pct]");

  function charge() {
    var max = root.scrollHeight - window.innerHeight;
    var p = reduce ? 0.66 : max > 0 ? Math.min(1, window.scrollY / max) : 1;
    root.style.setProperty("--bay-charge", String(p));
    if (pct) pct.textContent = String(Math.round(p * 100));
  }

  charge();
  if (!reduce) {
    window.addEventListener("scroll", charge, { passive: true });
    window.addEventListener("resize", charge);
  }

  var btn = document.querySelector("[data-bay-open]");
  var sheet = document.getElementById("baySheet");
  var closeBtn = document.querySelector("[data-bay-close]");

  function openSheet() {
    sheet.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    document.body.classList.add("bay-lock");
    var first = sheet.querySelector("button, a");
    if (first) first.focus();
  }

  function closeSheet() {
    sheet.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("bay-lock");
    btn.focus();
  }

  if (btn && sheet) {
    btn.addEventListener("click", function () {
      if (sheet.hidden) openSheet();
      else closeSheet();
    });
    if (closeBtn) closeBtn.addEventListener("click", closeSheet);
    sheet.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeSheet();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !sheet.hidden) closeSheet();
    });
  }

  var form = document.querySelector("[data-bay-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var body = [
        "CenCal Electric",
        "Name: " + (d.get("name") || ""),
        "Phone: " + (d.get("phone") || ""),
        "Town: " + (d.get("town") || ""),
        "Need: " + (d.get("need") || ""),
        String(d.get("message") || ""),
      ].join("\n");
      window.location.href = "sms:+14083105246?&body=" + encodeURIComponent(body);
    });
    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      field.addEventListener("invalid", function () {
        field.setAttribute("aria-invalid", "true");
      });
      field.addEventListener("input", function () {
        field.removeAttribute("aria-invalid");
      });
    });
  }
})();
