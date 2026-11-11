(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 1. layer diagram: separates when it scrolls into view, tap a layer to isolate
  var dia = document.getElementById('c3-diagram');
  if (dia){
    if (reduce || !('IntersectionObserver' in window)) dia.classList.add('is-open');
    else {
      var io = new IntersectionObserver(function(es){
        es.forEach(function(e){ if (e.isIntersecting){ dia.classList.add('is-open'); io.disconnect(); } });
      },{threshold:.35});
      io.observe(dia);
    }
    var tabs = [].slice.call(document.querySelectorAll('.c3-tabs button'));
    var panels = {finish:document.getElementById('p-finish'),under:document.getElementById('p-under'),deck:document.getElementById('p-deck')};
    function pick(k, isolate){
      tabs.forEach(function(t){ t.setAttribute('aria-selected', t.dataset.layer===k ? 'true':'false'); });
      Object.keys(panels).forEach(function(n){ panels[n].hidden = n!==k; panels[n].classList.toggle('is-on', n===k); });
      if (isolate) dia.setAttribute('data-sel', k);
      dia.classList.add('is-open');
    }
    tabs.forEach(function(t){ t.addEventListener('click', function(){ pick(t.dataset.layer, true); }); });
    [].slice.call(dia.querySelectorAll('.c3-layer')).forEach(function(g){
      g.style.cursor='pointer';
      g.addEventListener('click', function(){ pick(g.getAttribute('data-layer'), true); });
    });
    dia.addEventListener('dblclick', function(){ dia.removeAttribute('data-sel'); });
  }
  // 2. shingle / metal toggle
  var roof = document.querySelector('.c3-roof');
  [].slice.call(document.querySelectorAll('.c3-toggle button')).forEach(function(b){
    b.addEventListener('click', function(){
      roof.setAttribute('data-show', b.dataset.roof);
      [].slice.call(document.querySelectorAll('.c3-toggle button')).forEach(function(o){
        o.classList.toggle('is-on', o===b); o.setAttribute('aria-pressed', o===b?'true':'false');
      });
    });
  });
  // 3. useful comparison
  var D = {
    heat:["Dark shingles absorb heat. Good attic ventilation and lighter colours help.","Many finishes reflect heat, so the roof surface runs cooler in summer sun."],
    hail:["Hail can bruise shingles and knock off granules. Impact-rated types exist.","Hail can dent panels, though they usually keep shedding water."],
    noise:["Shingles over a solid deck are quiet in rain.","Rain can be louder on metal. Solid decking and attic insulation soften it."],
    life:["Shingles wear faster in strong sun and heat, so many homes re-roof sooner.","Metal panels commonly last longer, given sound fasteners and a solid deck."],
    looks:["Textured, layered and familiar. Fits most brick homes in the neighbourhood.","Clean vertical lines. A bolder look that suits some homes more than others."]
  };
  var chips=[].slice.call(document.querySelectorAll('.c3-chips button'));
  chips.forEach(function(c){
    c.addEventListener('click', function(){
      chips.forEach(function(o){ o.setAttribute('aria-selected', o===c?'true':'false'); });
      document.getElementById('vs-sh').textContent = D[c.dataset.k][0];
      document.getElementById('vs-me').textContent = D[c.dataset.k][1];
    });
  });
})();
