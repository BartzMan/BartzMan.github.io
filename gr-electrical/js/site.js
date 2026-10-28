/* G&R Electrical Contractors — panel schedule interactions */
(function () {
  "use strict";

  /* ---------- reveal on scroll ---------- */
  var rvs = document.querySelectorAll(".gr-rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    rvs.forEach(function (el) { io.observe(el); });
  } else {
    rvs.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- the panel schedule ---------- */
  var mainBtn = document.getElementById("gr-main");
  var rows = Array.prototype.slice.call(document.querySelectorAll(".gr-row[data-target]"));
  var sheets = {};
  rows.forEach(function (row) {
    var id = row.getAttribute("data-target");
    var sec = document.getElementById(id);
    var card = sec ? sec.querySelector(".gr-sheet") : null;
    if (card) {
      sheets[id] = card;
      var status = card.querySelector(".gr-status");
      if (status) row._status = status;
    }
  });

  function setRow(row, on) {
    row.setAttribute("aria-pressed", on ? "true" : "false");
    var sheet = sheets[row.getAttribute("data-target")];
    if (sheet) sheet.classList.toggle("on", on);
    if (row._status) row._status.textContent = on ? "ON" : "OFF";
  }

  function syncMain() {
    if (!mainBtn) return;
    var allOn = rows.length > 0 && rows.every(function (r) {
      return r.getAttribute("aria-pressed") === "true";
    });
    mainBtn.setAttribute("aria-pressed", allOn ? "true" : "false");
    document.body.classList.toggle("gr-powered", allOn);
  }

  rows.forEach(function (row) {
    row.addEventListener("click", function () {
      var on = row.getAttribute("aria-pressed") !== "true";
      setRow(row, on);
      syncMain();
    });
  });

  if (mainBtn) {
    mainBtn.addEventListener("click", function () {
      var turnOn = mainBtn.getAttribute("aria-pressed") !== "true";
      rows.forEach(function (row) { setRow(row, turnOn); });
      document.body.classList.toggle("gr-powered", turnOn);
      mainBtn.setAttribute("aria-pressed", turnOn ? "true" : "false");
    });
  }

  /* ---------- the wire-up form ---------- */
  var form = document.getElementById("gr-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var ok = form.querySelector(".gr-form-ok");
      ok.hidden = false;
      form.querySelector(".gr-form-preview").hidden = false;
      var send = form.querySelector("button[type=submit]");
      send.disabled = true;
      send.setAttribute("aria-disabled", "true");
      ok.setAttribute("tabindex", "-1");
      ok.focus({ preventScroll: false });
    });
  }
})();
