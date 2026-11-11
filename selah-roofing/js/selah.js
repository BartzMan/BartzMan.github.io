(function(){
  'use strict';
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  /* audience toggle: church & commercial / homes */
  function setAud(a){
    document.documentElement.setAttribute('data-aud',a);
    $$('[data-aud-set]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-aud-set')===a?'true':'false')});
    $$('[data-for]').forEach(function(p){
      if(p.getAttribute('data-for')===a){p.removeAttribute('hidden')}else{p.setAttribute('hidden','')}
    });
  }
  $$('[data-aud-set]').forEach(function(b){b.addEventListener('click',function(){setAud(b.getAttribute('data-aud-set'))})});

  /* roof cross-section */
  var info=[
    {t:'Waterproofing',h:'1. Eave and gutter edge',p:'The edge of the roof carries water into the gutter instead of letting it run down behind the wall.'},
    {t:'Restoration',h:'2. Roof deck',p:'The structural layer under everything else. If boards are soft or stained, restoration starts here, before anything new goes on top.'},
    {t:'Waterproofing',h:'3. Underlayment',p:'A water-resistant sheet between the deck and the roof surface. It is the back-up layer if wind pushes water under the top.'},
    {t:'Restoration',h:'4. Roofing surface',p:'Shingles or panels are what you see from the ground. Worn, loose or missing pieces are repaired or replaced here.'},
    {t:'Waterproofing',h:'5. Sealed seam',p:'Seams and joints on flat or low sections are sealed with a coating, like the white sealant in the photo, so water cannot get through.'},
    {t:'Waterproofing',h:'6. Wall and steeple flashing',p:'Metal flashing and sealant where the roof meets a wall, steeple or vent. It is one of the usual places a leak starts.'}
  ];
  var hots=$$('.hot'),imgs=$$('[data-xp]');
  function want(c,i){return c==='all'||(c==='rest'&&info[i].t==='Restoration')||(c==='water'&&info[i].t==='Waterproofing')}
  function showHot(i){
    hots.forEach(function(h,k){if(k===i){h.setAttribute('aria-current','true')}else{h.removeAttribute('aria-current')}});
    imgs.forEach(function(im,k){im.classList.toggle('on',k===i);if(k===i)im.loading='eager'});
    $('#xs-tag').textContent=info[i].t;$('#xs-title').textContent=info[i].h;$('#xs-body').textContent=info[i].p;
  }
  hots.forEach(function(h,i){h.addEventListener('click',function(){showHot(i)})});
  function applyChip(c){
    $$('[data-chip]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-chip')===c?'true':'false')});
    hots.forEach(function(h,i){h.classList.toggle('dim',!want(c,i))});
    var cur=hots.findIndex(function(h){return h.getAttribute('aria-current')==='true'});
    if(cur<0||!want(c,cur)){
      for(var i=0;i<info.length;i++){if(want(c,i)){showHot(i);break}}
    }
  }
  $$('[data-chip]').forEach(function(b){b.addEventListener('click',function(){applyChip(b.getAttribute('data-chip'))})});
  if(hots.length)showHot(0);

  /* care checklist */
  var items=$$('#care-list button');
  items.forEach(function(b){b.addEventListener('click',function(){
    b.setAttribute('aria-checked',b.getAttribute('aria-checked')==='true'?'false':'true');
    var n=items.filter(function(x){return x.getAttribute('aria-checked')==='true'}).length;
    $('#care-n').textContent=n;$('#care-fill').style.width=(n/items.length*100)+'%';
  })});

  /* line drawings draw in when seen */
  var lines=$$('.steeple-draw,.care-line');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}})},{threshold:.3});
    lines.forEach(function(el){io.observe(el)});
  }else{lines.forEach(function(el){el.classList.add('on')})}
})();
