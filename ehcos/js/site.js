(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function draw() {
    if (reduce) {
      root.style.setProperty("--flow-draw", "1");
      return;
    }
    var max = root.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, window.scrollY / max) : 1;
    root.style.setProperty("--flow-draw", String(Math.max(0.08, p)));
  }
  draw();
  if (!reduce) {
    window.addEventListener("scroll", draw, { passive: true });
    window.addEventListener("resize", draw);
  }

  var btn = document.querySelector("[data-flow-open]");
  var sheet = document.getElementById("flowSheet");
  var closeBtn = document.querySelector("[data-flow-close]");
  function openSheet() {
    sheet.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    document.body.classList.add("flow-lock");
    var first = sheet.querySelector("button, a");
    if (first) first.focus();
  }
  function closeSheet() {
    sheet.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("flow-lock");
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
      if (e.key === "Escape" && sheet.hidden === false) closeSheet();
    });
  }

  var form = document.querySelector("[data-flow-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var body = [
        "EHCOS",
        "Name: " + (d.get("name") || ""),
        "Phone: " + (d.get("phone") || ""),
        "Town: " + (d.get("town") || ""),
        String(d.get("message") || ""),
      ].join("\n");
      var href = "mailto:ehcosair@gmail.com?subject=" + encodeURIComponent("Message for EHCOS") + "&body=" + encodeURIComponent(body);
      window.location.href = href;
    });
  }
})();
