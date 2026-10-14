(function () {
  var btn = document.querySelector("[data-bp-open]");
  var sheet = document.getElementById("bpSheet");
  var closeBtn = document.querySelector("[data-bp-close]");
  function openSheet() {
    sheet.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    document.body.classList.add("bp-lock");
    var first = sheet.querySelector("button, a");
    if (first) first.focus();
  }
  function closeSheet() {
    sheet.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("bp-lock");
    btn.focus();
  }
  if (btn && sheet) {
    btn.addEventListener("click", function () { if (sheet.hidden) openSheet(); else closeSheet(); });
    if (closeBtn) closeBtn.addEventListener("click", closeSheet);
    sheet.addEventListener("click", function (e) { if (e.target.closest("a")) closeSheet(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sheet.hidden) closeSheet(); });
  }
  var form = document.querySelector("[data-bp-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var body = ["Fred's Plumbing & Heating", "Name: " + (d.get("name") || ""), "Phone: " + (d.get("phone") || ""), "Town: " + (d.get("town") || ""), "Need: " + (d.get("need") || ""), String(d.get("message") || "")].join("\n");
      window.location.href = "mailto:fcianfrone@live.com?subject=" + encodeURIComponent("Message for Fred's Plumbing & Heating") + "&body=" + encodeURIComponent(body);
    });
  }
})();
