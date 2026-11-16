(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  /* room tour */
  var order=['kitchen','living','bedroom','bath','hall'];
  function setRoom(k){
    $$('.plan .room').forEach(function(r){r.classList.toggle('on',r.getAttribute('data-room')===k)});
    $$('.rchip').forEach(function(c){c.setAttribute('aria-pressed',c.getAttribute('data-room')===k?'true':'false')});
    $$('.stage-photo img').forEach(function(i){i.classList.toggle('on',i.getAttribute('data-room')===k)});
    $$('.stg').forEach(function(s){s.classList.toggle('on',s.getAttribute('data-room')===k)});
    var t=$('#stage-tape');if(t)t.textContent='Room 0'+(order.indexOf(k)+1)+' of 05';
  }
  $$('.plan .room').forEach(function(r){
    r.addEventListener('click',function(){setRoom(r.getAttribute('data-room'))});
    r.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();setRoom(r.getAttribute('data-room'))}});
  });
  $$('.rchip').forEach(function(c){c.addEventListener('click',function(){setRoom(c.getAttribute('data-room'))})});
  setRoom('kitchen');
  /* services switch */
  $$('[data-tab]').forEach(function(b){b.addEventListener('click',function(){
    var k=b.getAttribute('data-tab');
    $$('[data-tab]').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
    $$('.svc-panel').forEach(function(p){p.classList.toggle('on',p.getAttribute('data-panel')===k)});
  });});
  /* decisions */
  var cks=$$('.decide input'),dn=$('#dec-n'),df=$('.decide-foot');
  function dec(){var n=cks.filter(function(c){return c.checked}).length;
    cks.forEach(function(c){c.closest('li').classList.toggle('done',c.checked)});
    dn.textContent=n+' of 5 decided';df.style.setProperty('--p',n/5);}
  cks.forEach(function(c){c.addEventListener('change',dec)});dec();
})();