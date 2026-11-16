(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  /* junction boxes */
  var boxes=$$('.jbx');
  function setBox(b,open){b.classList.toggle('open',open);var bt=$('.jbx-btn',b);bt.setAttribute('aria-expanded',open?'true':'false');var c=$('.jbx-cover',b);if(c)c.setAttribute('aria-hidden',open?'true':'false');}
  boxes.forEach(function(b){$('.jbx-btn',b).addEventListener('click',function(){
    var o=!b.classList.contains('open');
    if(window.matchMedia('(min-width:901px)').matches&&o){boxes.forEach(function(x){if(x!==b)setBox(x,false)});}
    setBox(b,o);
  });});
  /* mode switch */
  var svc=$('#run');
  $$('[data-mode-btn]').forEach(function(bt){bt.addEventListener('click',function(){
    svc.setAttribute('data-mode',bt.getAttribute('data-mode-btn'));
    $$('[data-mode-btn]').forEach(function(x){x.setAttribute('aria-pressed',x===bt?'true':'false')});
  });});
  /* sound / smell picker */
  var ans=$('#answer'),A=window.CBN_ANS||{};
  function showAns(k){
    var a=A[k];if(!a)return;
    var h='<h3>'+a.t+'</h3><p>'+a.p+'</p>';
    if(a.w)h+='<span class="warn">'+a.w+'</span>';
    h+='<div class="routes"><span>Usually points to</span>';
    a.r.forEach(function(r){h+='<a class="go" href="#box-'+r[0]+'" data-open="'+r[0]+'">'+r[1]+'</a>';});
    h+='</div>';
    ans.innerHTML=h;
    $$('[data-open]',ans).forEach(function(l){l.addEventListener('click',function(){
      var b=document.getElementById('box-'+l.getAttribute('data-open'));
      if(b){boxes.forEach(function(x){if(window.matchMedia('(min-width:901px)').matches)setBox(x,false)});setBox(b,true);}
    });});
  }
  $$('.chip[data-ans]').forEach(function(c){c.addEventListener('click',function(){
    $$('.chip[data-ans]').forEach(function(x){x.setAttribute('aria-pressed',x===c?'true':'false')});
    showAns(c.getAttribute('data-ans'));
  });});
  showAns('buzz');
  /* checks */
  var cks=$$('.check input'),tn=$('#tally-n'),tm=$('.tally');
  function tally(){var n=cks.filter(function(c){return c.checked}).length;
    cks.forEach(function(c){c.closest('.check').classList.toggle('done',c.checked)});
    tn.textContent=n+' of 5 pulled';tm.style.setProperty('--p',n/5);}
  cks.forEach(function(c){c.addEventListener('change',tally)});tally();
  /* gallery filter */
  $$('[data-f]').forEach(function(bt){bt.addEventListener('click',function(){
    var f=bt.getAttribute('data-f');
    $$('[data-f]').forEach(function(x){x.setAttribute('aria-pressed',x===bt?'true':'false')});
    $$('.gal figure').forEach(function(fg){fg.classList.toggle('off',f!=='all'&&fg.getAttribute('data-cat')!==f)});
  });});
})();