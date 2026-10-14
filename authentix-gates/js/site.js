(function () {
  "use strict";
  var body = document.body;
  var burger = document.querySelector(".burger");
  var sheet = document.getElementById("sheet");

  function setMenu(open) {
    if (!burger || !sheet) return;
    sheet.hidden = !open;
    body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.querySelector(".sr").textContent = open ? "Close menu" : "Open menu";
    if (open) { var first = sheet.querySelector("a"); if (first) first.focus(); }
  }
  if (burger) burger.addEventListener("click", function () { setMenu(sheet.hidden); });
  if (sheet) sheet.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && sheet && !sheet.hidden) { setMenu(false); burger.focus(); } });

  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  var form = document.getElementById("ct-form");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements;
    var name = f.name.value.trim();
    var old = form.querySelector(".form-err");
    if (old) old.remove();
    if (!name) {
      var p = document.createElement("p");
      p.className = "form-err"; p.setAttribute("role", "alert");
      p.textContent = "Please add your name so Authentix knows who to reply to.";
      form.insertBefore(p, form.querySelector("button"));
      f.name.focus();
      return;
    }
    var lines = [
      "Name: " + name,
      "Phone: " + f.phone.value.trim(),
      "Part of Houston or ZIP: " + f.town.value.trim(),
      "Needs: " + f.service.value,
      "",
      f.msg.value.trim()
    ];
    var subject = "Gate enquiry: " + f.service.value + (f.town.value.trim() ? " in " + f.town.value.trim() : "");
    window.location.href = "mailto:authentixgatesystems@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
  });
})();
