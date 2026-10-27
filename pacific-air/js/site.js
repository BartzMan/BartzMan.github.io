/* Pacific Air: one-shot reveals, gauge needles and service shortcuts */
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('[data-reveal],[data-gauge]');
  function on(el){ el.classList.add(el.hasAttribute('data-gauge') ? 'is-on' : 'is-in'); }
  if (reduce || !('IntersectionObserver' in window)) { items.forEach(on); }
  else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) { on(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.15 });
    items.forEach(function(el){ io.observe(el); });
  }
  var details = document.getElementById('q-details');
  document.querySelectorAll('[data-service]').forEach(function(a){
    a.addEventListener('click', function(){
      if (!details) return;
      var tag = 'Service: ' + a.getAttribute('data-service') + '. ';
      details.value = tag + details.value.replace(/^Service: [^.]*\.\s*/, '');
    });
  });
})();
