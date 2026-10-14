(function () {
  var btn = document.querySelector("[data-cab-open]");
  var sheet = document.getElementById("cabSheet");
  var closeBtn = document.querySelector("[data-cab-close]");
  function openSheet() { sheet.hidden = false; btn.setAttribute("aria-expanded", "true"); document.body.classList.add("cab-lock"); var f = sheet.querySelector("button, a"); if (f) f.focus(); }
  function closeSheet() { sheet.hidden = true; btn.setAttribute("aria-expanded", "false"); document.body.classList.remove("cab-lock"); btn.focus(); }
  if (btn && sheet) {
    btn.addEventListener("click", function () { if (sheet.hidden) openSheet(); else closeSheet(); });
    if (closeBtn) closeBtn.addEventListener("click", closeSheet);
    sheet.addEventListener("click", function (e) { if (e.target.closest("a")) closeSheet(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sheet.hidden) closeSheet(); });
  }
  var form = document.querySelector("[data-cab-form]");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var body = ["Mister Garcia Painting", "Name: " + (d.get("name")||""), "Phone: " + (d.get("phone")||""), "Town: " + (d.get("town")||""), "Need: " + (d.get("need")||""), String(d.get("message")||"")].join("\n");
    window.location.href = "mailto:mistergarciapainting@gmail.com?subject=" + encodeURIComponent("Message for Mister Garcia Painting") + "&body=" + encodeURIComponent(body);
  });
})();
