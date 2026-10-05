/* ==========================================================================
   COPPER & BRASS — Testerman Plumbing & Heating Inc.
   Vanilla JS. Three jobs:
     1  mark the document as JS-capable so reveal animations can be opt-in
     2  reveal sections as they scroll into view (content is visible without JS)
     3  turn the request form into an sms: link to the visitor's own app
   No dependencies, no network calls, no tracking.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("has-js");

  /* 1  Reveal on scroll ---------------------------------------------------- */

  var revealables = document.querySelectorAll(".reveal");

  function showAll() {
    for (var i = 0; i < revealables.length; i += 1) {
      revealables[i].classList.add("is-in");
    }
  }

  if (!revealables.length) {
    /* nothing to do */
  } else if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
    );

    for (var r = 0; r < revealables.length; r += 1) {
      observer.observe(revealables[r]);
    }
  } else {
    showAll();
  }

  /* 2  Request form -> sms: ------------------------------------------------ */

  var NUMBER = "+13477293785";
  var form = document.querySelector("[data-sms-form]");

  if (form) {
    var status = form.querySelector("[data-sms-status]");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = new FormData(form);
      var name = String(data.get("name") || "").trim();
      var phone = String(data.get("phone") || "").trim();
      var job = String(data.get("job") || "").trim();

      var lines = [
        name
          ? "Hi Testerman Plumbing & Heating, this is " + name + "."
          : "Hi Testerman Plumbing & Heating,",
        phone ? "Best number: " + phone : "",
        job ? "The job: " + job : ""
      ];

      var body = lines
        .filter(function (line) {
          return line !== "";
        })
        .join("\n");

      if (status) {
        status.textContent =
          "Opening your messaging app now. Nothing reaches us until you press send.";
      }

      window.location.href = "sms:" + NUMBER + "?body=" + encodeURIComponent(body);
    });
  }

  /* 3  Anchor links: keep focus on the target section for keyboard users ---- */

  var anchors = document.querySelectorAll('a[href^="#"]');

  for (var a = 0; a < anchors.length; a += 1) {
    anchors[a].addEventListener("click", function () {
      var id = this.getAttribute("href").slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      window.setTimeout(function () {
        if (!target.hasAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1");
        }
        target.focus({ preventScroll: true });
      }, 40);
    });
  }
})();