(function(){
  'use strict';
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  /* roofing / siding switch */
  $$('[data-job]').forEach(function(b){b.addEventListener('click',function(){
    var j=b.getAttribute('data-job');
    $$('[data-job]').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
    $$('[data-panel]').forEach(function(p){if(p.getAttribute('data-panel')===j){p.removeAttribute('hidden')}else{p.setAttribute('hidden','')}});
  })});

  /* ice dam diagram */
  var svg=$('#dam-svg'),ins=0,vent=0;
  var texts={
    '00':['Ice dam forms','big','Heat from the rooms leaks into the attic and warms the roof deck. Snow on the upper roof melts, runs down to the cold eave, and refreezes. The ice grows into a dam, and meltwater backs up under the shingles.'],
    '10':['Smaller dam','small','Insulation slows heat leaving the house, so less snow melts. The attic is cooler, but without air moving through it a small dam can still form at the eave.'],
    '01':['Smaller dam','small','Air moving from the eaves to the ridge keeps the roof deck cold, so less snow melts. Heat still leaks up from the rooms, so some meltwater and a small dam can remain.'],
    '11':['No ice dam','none','Less heat reaches the attic, and the air flow carries away what does. The roof stays cold and even, so snow melts slowly or not at all and no dam forms.']
  };
  function render(){
    var k=''+ins+vent,t=texts[k];
    svg.setAttribute('data-ins',ins);svg.setAttribute('data-vent',vent);
    svg.setAttribute('data-dam',k==='00'?'3':(k==='11'?'0':'1'));
    $('#dam-chip').textContent=t[0];$('#dam-status').setAttribute('data-s',t[1]);$('#dam-text').textContent=t[2];
  }
  $$('[data-fix]').forEach(function(b){b.addEventListener('click',function(){
    var on=b.getAttribute('aria-checked')!=='true';
    b.setAttribute('aria-checked',on?'true':'false');
    if(b.getAttribute('data-fix')==='ins')ins=on?1:0;else vent=on?1:0;
    render();
  })});

  /* guide tabs */
  var tabs=$$('[role=tab]'),panels=$$('[role=tabpanel]'),gp=$$('[data-gp]');
  function pick(i,focus){
    tabs.forEach(function(t,k){t.setAttribute('aria-selected',k===i?'true':'false');t.tabIndex=k===i?0:-1});
    panels.forEach(function(p,k){if(k===i){p.removeAttribute('hidden')}else{p.setAttribute('hidden','')}});
    gp.forEach(function(g,k){g.classList.toggle('on',k===i);if(k===i)g.loading='eager'});
    if(focus)tabs[i].focus();
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){pick(i)});
    t.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight'){e.preventDefault();pick((i+1)%tabs.length,true)}
      if(e.key==='ArrowLeft'){e.preventDefault();pick((i+tabs.length-1)%tabs.length,true)}
    });
  });
})();
