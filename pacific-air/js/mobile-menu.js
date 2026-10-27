/* Full-screen phone menu */
(function(){
  var b = document.querySelector('.mm-btn'), m = document.getElementById('mm-sheet');
  if (!b || !m) return;
  function set(open){
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    m.hidden = !open;
    document.documentElement.classList.toggle('mm-open', open);
    if (open) { var f = m.querySelector('.mm-close'); if (f) f.focus(); }
  }
  b.addEventListener('click', function(){ set(b.getAttribute('aria-expanded') !== 'true'); });
  m.querySelector('.mm-close').addEventListener('click', function(){ set(false); b.focus(); });
  m.addEventListener('click', function(e){ if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !m.hidden) { set(false); b.focus(); } });
  window.addEventListener('resize', function(){ if (window.innerWidth > 860 && !m.hidden) set(false); });
})();
