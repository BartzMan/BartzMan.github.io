/* Demo quote form (Sanket, 25 Oct 2026): nothing is sent. On submit the page shows a short note that on the live site the request
   goes straight to the owner's email. Added to every demo by factory/fix_forms.py; at launch the form is wired to the real handler. */
(function () {
  var es = /^es/i.test(document.documentElement.lang || '');
  var T = es ? { btn: 'Solicitar cotización', ok: 'Vista previa: en su sitio web real, esta solicitud le llegaría directamente a su correo.' }
             : { btn: 'Request a quote', ok: 'Preview: on your live website, this request would be sent straight to your email.' };
  var HELPER = /email app|mail app|messages? app|messaging app|nothing is sent|opens (an |your |your own |a )?(email|text message|whatsapp|messag)|draft in your own|choose send there|press send there|copy the message|email app should now be open/i;

  function isQuote(f) {
    if (f.getAttribute('role') === 'search') return false;
    return !!(f.querySelector('textarea') || f.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio])').length >= 2);
  }
  function note(f) {
    var m = f.querySelector('.sc-form-msg');
    if (!m) {
      m = document.createElement('p'); m.className = 'sc-form-msg'; m.setAttribute('role', 'status');
      m.style.cssText = 'margin:14px 0 0;padding:12px 14px;border-radius:10px;font-weight:600;line-height:1.45;background:rgba(46,160,90,.14);border:1px solid rgba(46,160,90,.45);color:inherit';
      f.appendChild(m);
    }
    m.textContent = T.ok;
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form').forEach(function (f) {
      if (!isQuote(f)) return;
      f.removeAttribute('action'); f.removeAttribute('target');
      var b = f.querySelector('button[type=submit], input[type=submit]') || f.querySelector('button:last-of-type');
      if (b) { if (b.tagName === 'INPUT') b.value = T.btn; else { var svg = b.querySelector('svg'); b.textContent = T.btn; if (svg) b.prepend(svg); } b.type = 'submit'; }
      f.querySelectorAll('p, small, span, div').forEach(function (el) {
        if (!el.querySelector('input, select, textarea, button') && HELPER.test(el.textContent)) el.remove();
      });
    });
    document.querySelectorAll('p, small').forEach(function (el) {
      if (HELPER.test(el.textContent) && el.closest('form, [class*=form], [class*=contact], [class*=quote], [id*=contact], [id*=quote]')) el.remove();
    });
  });

  document.addEventListener('submit', function (e) {
    var f = e.target; if (!(f instanceof HTMLFormElement) || !isQuote(f)) return;
    e.preventDefault(); e.stopImmediatePropagation();
    note(f);
  }, true);
})();
