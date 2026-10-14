(function () {
  var btn = document.querySelector("[data-gloss-open]");
  var sheet = document.getElementById("glossSheet");
  var closeBtn = document.querySelector("[data-gloss-close]");
  function openSheet() { sheet.hidden = false; btn.setAttribute("aria-expanded", "true"); document.body.classList.add("gloss-lock"); var f = sheet.querySelector("button, a"); if (f) f.focus(); }
  function closeSheet() { sheet.hidden = true; btn.setAttribute("aria-expanded", "false"); document.body.classList.remove("gloss-lock"); btn.focus(); }
  if (btn && sheet) {
    btn.addEventListener("click", function () { if (sheet.hidden) openSheet(); else closeSheet(); });
    if (closeBtn) closeBtn.addEventListener("click", closeSheet);
    sheet.addEventListener("click", function (e) { if (e.target.closest("a")) closeSheet(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sheet.hidden) closeSheet(); });
  }
  var form = document.querySelector("[data-gloss-form]");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var body = ["R&R Paint and Resurfacing", "Name: " + (d.get("name")||""), "Phone: " + (d.get("phone")||""), "Town: " + (d.get("town")||""), "Need: " + (d.get("need")||""), String(d.get("message")||"")].join("\n");
    window.location.href = "mailto:rrpaintandresurfacing@gmail.com?subject=" + encodeURIComponent("Message for R&R Paint and Resurfacing") + "&body=" + encodeURIComponent(body);
  });
})();
