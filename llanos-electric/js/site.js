/* Llanos Electric // PLAZA MARQUEE
   letterboards that slot in, scroll reveals, bolt-line progress, phone sheet,
   CTA cursor badge, and the WhatsApp form (opens wa.me with the answers filled in). */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. split letterboard rows into slotted letters */
  document.querySelectorAll('[data-board]').forEach(function (board) {
    var i = 0;
    board.querySelectorAll('.board-row').forEach(function (row) {
      var frag = document.createDocumentFragment();
      Array.prototype.slice.call(row.childNodes).forEach(function (node) {
        var red = node.nodeType === 1 && node.tagName === 'B';
        var text = node.textContent;
        for (var k = 0; k < text.length; k++) {
          var ch = text.charAt(k);
          var s = document.createElement('span');
          s.className = 't' + (red ? ' red' : '');
          s.setAttribute('aria-hidden', 'true');
          s.style.setProperty('--i', i++);
          s.textContent = ch === ' ' ? ' ' : ch;
          frag.appendChild(s);
        }
      });
      row.textContent = '';
      row.appendChild(frag);
    });
    var lab = board.getAttribute('data-label');
    if (lab) { var sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = lab; board.appendChild(sr); }
  });

  /* 2. reveal on scroll (boards light up, sections rise, bolt lines draw) */
  var targets = document.querySelectorAll('[data-board], [data-reveal], .boltline');
  if (!('IntersectionObserver' in window) || reduce) {
    targets.forEach(function (el) { el.classList.add('lit', 'in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('lit', 'in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* 3. bolt-line scroll progress */
  var root = document.documentElement, ticking = false;
  function progress() {
    var max = root.scrollHeight - root.clientHeight;
    root.style.setProperty('--p', max > 0 ? Math.min(1, root.scrollTop / max).toFixed(4) : 0);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(progress); } }, { passive: true });
  progress();

  /* 4. phone menu: full-screen sign-blue sheet */
  var burger = document.querySelector('.burger');
  var sheet = document.getElementById('sheet');
  function setSheet(open) {
    if (!burger || !sheet) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu';
    sheet.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && sheet) {
    burger.addEventListener('click', function () { setSheet(burger.getAttribute('aria-expanded') !== 'true'); });
    sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setSheet(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setSheet(false); });
  }

  /* 5. lime bolt badge that follows the cursor over CTAs */
  var badge = document.querySelector('.cta-badge');
  if (badge && !reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var label = badge.querySelector('span');
    document.querySelectorAll('[data-badge]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { label.textContent = el.getAttribute('data-badge'); badge.classList.add('on'); });
      el.addEventListener('mouseleave', function () { badge.classList.remove('on'); });
    });
    window.addEventListener('mousemove', function (e) {
      badge.style.left = (e.clientX + 46) + 'px';
      badge.style.top = (e.clientY - 40) + 'px';
    }, { passive: true });
  }

  /* 6. THE BOARD: one lit sign box; each letter row lights its photo in the bulb window */
  var form = document.getElementById('waForm');
  var mq = document.querySelector('[data-marquee]');
  if (mq) {
    var rows = mq.querySelectorAll('.mq-row');
    var pics = mq.querySelectorAll('.mq-glass img');
    var nEl = mq.querySelector('[data-mq-n]');
    var capEl = mq.querySelector('[data-mq-cap]');
    var nameEl = mq.querySelector('[data-mq-name]');
    var ask = mq.querySelector('[data-mq-ask]');
    var cur = 0, timer = null, touched = false;
    function light(i) {
      cur = i;
      rows.forEach(function (r, k) { r.classList.toggle('is-on', k === i); r.setAttribute('aria-pressed', String(k === i)); });
      pics.forEach(function (p, k) { if (k === i) p.removeAttribute('loading'); p.classList.toggle('is-on', k === i); });
      var r = rows[i];
      nEl.textContent = (i < 9 ? '0' : '') + (i + 1);
      capEl.textContent = r.getAttribute('data-cap');
      nameEl.textContent = r.getAttribute('data-name');
      ask.setAttribute('data-svc', r.getAttribute('data-svc'));
    }
    function stop() { touched = true; if (timer) { clearInterval(timer); timer = null; } }
    rows.forEach(function (r, k) {
      r.addEventListener('click', function () { stop(); light(k); });
      r.addEventListener('mouseenter', function () { if (window.matchMedia('(hover: hover)').matches) { stop(); light(k); } });
    });
    if (!reduce && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !touched && !timer) timer = setInterval(function () { light((cur + 1) % rows.length); }, 3600);
          if (!e.isIntersecting && timer) { clearInterval(timer); timer = null; }
        });
      }, { threshold: 0.4 }).observe(mq);
    }
    ask.addEventListener('click', function () {
      if (form) form.elements.service.value = ask.getAttribute('data-svc');
    });
  }

  /* 7. WhatsApp form: answers go into the wa.me message; nothing is sent from this page */
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var err = document.getElementById('f-err');
      if (!name) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      var lines = [
        'Hi Llanos Electric,',
        'Name: ' + name,
        'Need: ' + form.elements.service.value
      ];
      var area = form.elements.area.value.trim();
      var msg = form.elements.message.value.trim();
      if (area) lines.push('Area: ' + area);
      if (msg) lines.push('Details: ' + msg);
      lines.push('(I can send a photo of the panel/problem.)');
      var url = 'https://wa.me/18324392222?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');
    });
  }
})();
