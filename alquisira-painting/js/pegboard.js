(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  /* painted shadow outlines: clone each tool as a dashed silhouette */
  $$('.pb-tool svg').forEach(function(sv){
    var d=$('defs g',sv),u=$('use.sil',sv);
    if(!d||!u)return;
    var ns='http://www.w3.org/2000/svg',g=document.createElementNS(ns,'g');
    g.setAttribute('class','sil');g.setAttribute('transform','translate(8 8)');
    Array.prototype.forEach.call(d.children,function(c){g.appendChild(c.cloneNode(true))});
    u.parentNode.replaceChild(g,u);
  });
  /* tool wall */
  var tools=[
    {job:'Interior and exterior painting',name:'Roller',what:'A roller lays an even coat across big walls and ceilings far faster than a brush.',when:"A room looks tired, marked or a colour you've outgrown, or the outside walls look faded."},
    {job:'Drywall patching',name:'Putty knife',what:'A flat blade fills dents, nail holes and cracks and smooths them level, so paint sits on a clean surface.',when:'Old picture-hook holes, dings from furniture, hairline cracks, or a patch where something was removed.'},
    {job:'Trim and straight lines',name:'Level',what:'A level keeps trim, shelves and fixtures straight, so the finished room looks square.',when:'Baseboards have gaps, a door frame looks worn, or something new needs hanging straight.'},
    {job:'Repairs and improvements',name:'Drill',what:'A drill drives screws and fixes things in place: rails, hinges, hardware and brackets.',when:'A small fix-it list has been piling up, or a project needs something fastened properly.'},
    {job:'Sealing gaps',name:'Caulk gun',what:'Caulk closes the thin gaps where two surfaces meet, such as trim, windows and fixtures, before paint goes on.',when:'You can see cracks along joints, or a gap where trim meets the wall.'}
  ];
  var tabs=$$('.pb-tool'),imgs=$$('.pb-stage-photo img');
  function pick(i,focus){
    tabs.forEach(function(t,k){t.setAttribute('aria-selected',k===i?'true':'false');t.tabIndex=k===i?0:-1});
    imgs.forEach(function(im,k){im.classList.toggle('is-on',k===i)});
    var d=tools[i];
    $('#stage-job').textContent=d.job;$('#stage-tool').textContent=d.name;$('#stage-what').textContent=d.what;$('#stage-when').textContent=d.when;
    if(focus)tabs[i].focus();
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){pick(i)});
    t.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();pick((i+1)%tabs.length,true)}
      if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();pick((i+tabs.length-1)%tabs.length,true)}
    });
  });
  /* job builder */
  var order=['Paint','Patch and trim','Repairs','Something else'];
  var boxes=$$('#jobs input');
  function esc(s){return s.replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
  function build(){
    var g={},n=0;
    boxes.forEach(function(b){if(b.checked){n++;(g[b.dataset.g]=g[b.dataset.g]||[]).push(b.value)}});
    $('#job-count').textContent=n;
    var out=$('#job-out');
    if(!n){out.innerHTML='<p class="pb-clip-empty">Nothing hanging yet. Tick a job and it lands here.</p>';return}
    out.innerHTML=order.filter(function(k){return g[k]}).map(function(k){
      return '<div class="pb-clip-grp"><h4>'+k+'</h4><ul>'+g[k].map(function(v){return '<li>'+esc(v)+'</li>'}).join('')+'</ul></div>'}).join('');
  }
  boxes.forEach(function(b){b.addEventListener('change',build)});
  $('#job-send').addEventListener('click',function(){
    var picked=boxes.filter(function(b){return b.checked}).map(function(b){return b.value});
    var ta=$('#quote-details');
    if(picked.length&&ta){ta.value='My list: '+picked.join('; ')+'.'}
  });
  /* checklist */
  var cks=$$('#steps input');
  function steps(){var n=cks.filter(function(c){return c.checked}).length;$('#steps-n').textContent=n;$('#steps-bar').style.width=(n*20)+'%'}
  cks.forEach(function(c){c.addEventListener('change',steps)});
  /* gallery filter */
  var fb=$$('.pb-filters button'),figs=$$('#gal figure');
  fb.forEach(function(b){b.addEventListener('click',function(){
    fb.forEach(function(x){x.classList.toggle('is-on',x===b);x.setAttribute('aria-pressed',x===b?'true':'false')});
    figs.forEach(function(f){f.hidden=!(b.dataset.f==='all'||f.dataset.k===b.dataset.f)});
  })});
})();
