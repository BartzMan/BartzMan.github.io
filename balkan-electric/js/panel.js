(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Hero: main breaker flips, then the three globes come on */
  window.addEventListener('load', function () {
    setTimeout(function () { doc.classList.add('is-ready'); }, reduce ? 0 : 250);
  });
  setTimeout(function () { doc.classList.add('is-ready'); }, 1800);

  /* Section breakers: flip ON as each section enters */
  var heads = [].slice.call(document.querySelectorAll('[data-brk]'));
  var reveals = [].slice.call(document.querySelectorAll('.rv'));
  var bks = [].slice.call(document.querySelectorAll('[data-bk]'));

  function on(el) {
    el.classList.add('is-on');
    var sec = el.closest('section');
    if (sec) sec.classList.add('live');
  }

  if (reduce || !('IntersectionObserver' in window)) {
    heads.forEach(on);
    reveals.forEach(function (r) { r.classList.add('in'); });
    bks.forEach(function (b) { b.classList.add('on'); });
    setTimeout(function(){ bks.forEach(sync); }, 0);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target;
        if (t.hasAttribute('data-brk')) setTimeout(function () { on(t); }, 180);
        else t.classList.add('in');
        io.unobserve(t);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    heads.forEach(function (h) { io.observe(h); });
    reveals.forEach(function (r) { io.observe(r); });

    /* Services panel: breakers flip ON one after another */
    var panel = document.querySelector('.breakers');
    if (panel) {
      var io2 = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        bks.forEach(function (b, i) { setTimeout(function () { _add(b); }, 160 + i * 220); });
        io2.disconnect();
      }, { threshold: 0.2 });
      io2.observe(panel);
    }
  }

  /* Breakers are buttons: flip a circuit off and on */
  function sync(b) { b.querySelector('.bk-sw').setAttribute('aria-expanded', b.classList.contains('on') ? 'true' : 'false'); }
  var _add = function (b) { b.classList.add('on'); sync(b); };
  bks.forEach(function (b) {
    var sw = b.querySelector('.bk-sw');
    sync(b);
    sw.addEventListener('click', function () {
      var isOn = b.classList.toggle('on');
      sw.setAttribute('aria-expanded', isOn ? 'true' : 'false');
    });
  });

  /* Scroll: the copper bus bar fills, the load meter reads 0 to 200A */
  var fill = document.getElementById('busfill');
  var lm = document.getElementById('lmv');
  var ticking = false;
  function onScroll() {
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (fill) fill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    if (lm) lm.textContent = Math.round(p * 200);
    doc.classList.toggle('scrolled', window.scrollY > 520);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* Phone menu: the directory card, full screen */
  var btn = document.querySelector('.menu-btn');
  var sheet = document.getElementById('sheet');
  if (btn && sheet) {
    var closeBtn = sheet.querySelector('.sheet-x');
    var open = function () {
      sheet.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };
    var close = function (refocus) {
      sheet.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (refocus) btn.focus();
    };
    btn.addEventListener('click', open);
    closeBtn.addEventListener('click', function () { close(true); });
    sheet.addEventListener('click', function (e) {
      if (e.target === sheet) close(true);
      if (e.target.closest('a')) close(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !sheet.hidden) close(true);
    });
  }

  /* Panel schedule form: opens the visitor's email app */
  var form = document.getElementById('jobform');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var err = document.getElementById('f-err');
      if (!v('name')) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      var job = v('job') || 'Electrical work';
      var body = [
        'Name: ' + v('name'),
        'Phone: ' + v('phone'),
        'Neighborhood or city: ' + v('area'),
        'The job: ' + job,
        '',
        v('message'),
        '',
        '(Panel photo attached if I have one.)'
      ].join('\n');
      window.location.href = 'mailto:nikelectric11@gmail.com?subject=' +
        encodeURIComponent(job + ' request from ' + v('name')) + '&body=' + encodeURIComponent(body);
    });
  }
})();
