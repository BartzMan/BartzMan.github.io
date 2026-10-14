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

  /* text-message form: opens the visitor's own text app, nothing is sent from this page */
  var form = document.getElementById("jobform");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var err = document.getElementById("f-err");
      if (!name) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      var lines = ["Hi Mike Hedberg Masonry, this is " + name + "."];
      var job = form.elements.job.value;
      if (job) lines.push("Type of work: " + job + ".");
      var city = form.elements.city.value.trim();
      if (city) lines.push("City: " + city + ".");
      var msg = form.elements.message.value.trim();
      if (msg) lines.push(msg);
      var body = encodeURIComponent(lines.join("\n"));
      var ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
      window.location.href = "sms:+18172714716" + (ios ? "&" : "?") + "body=" + body;
    });
  }

  /* gentle reveal, course by course */
  if (!("IntersectionObserver" in window) || reduce) return;
  var reveal = document.querySelectorAll(".svc, .bat, .mat, .g, .step, .stamp, .qs details, .rate, .line, .tform, .small-card, .send");
  doc.classList.add("js");
  reveal.forEach(function (el) { el.classList.add("rv"); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      io.unobserve(en.target);
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0.1 });
  reveal.forEach(function (el) { io.observe(el); });
  setTimeout(function () { reveal.forEach(function (el) { el.classList.add("in"); }); }, 4000);
})();
