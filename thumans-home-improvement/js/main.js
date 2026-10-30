(function(){
  var btn=document.querySelector('.nav-toggle'),sheet=document.getElementById('nav-sheet');
  if(btn&&sheet){
    function setOpen(o){
      sheet.classList.toggle('open',o);
      btn.setAttribute('aria-expanded',o?'true':'false');
      btn.setAttribute('aria-label',o?'Close menu':'Open menu');
      document.body.classList.toggle('no-scroll',o);
      if(o){var first=sheet.querySelector('a');if(first)setTimeout(function(){first.focus();},60);}
    }
    btn.addEventListener('click',function(){setOpen(!sheet.classList.contains('open'));});
    sheet.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setOpen(false);});});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&sheet.classList.contains('open')){setOpen(false);btn.focus();}});
    window.addEventListener('resize',function(){if(window.innerWidth>980&&sheet.classList.contains('open'))setOpen(false);});
  }
  var form=document.getElementById('contact-form');
  if(form){form.addEventListener('submit',function(e){e.preventDefault();});}
  var bi=document.getElementById('board-img'),bc=document.getElementById('board-cap');
  var sws=[].slice.call(document.querySelectorAll('.sw'));
  sws.forEach(function(s){s.addEventListener('click',function(){
    sws.forEach(function(o){o.setAttribute('aria-pressed',o===s?'true':'false');});
    var n=s.getAttribute('data-n'),w=s.getAttribute('data-w');
    bi.src='images/'+n+'.jpg';bi.srcset='images/'+n+'-720.jpg 720w, images/'+n+'.jpg '+w+'w';bi.alt=s.getAttribute('data-alt');
    bc.textContent=s.getAttribute('data-cap');
  });});
  document.querySelectorAll('[data-chk]').forEach(function(box){
    var tabs=[].slice.call(box.querySelectorAll('.qtab')),panels=[].slice.call(box.querySelectorAll('.qpanel'));
    function pick(i,f){tabs.forEach(function(t,k){t.setAttribute('aria-selected',k===i?'true':'false');t.tabIndex=k===i?0:-1;});panels.forEach(function(p,k){p.hidden=k!==i;});if(f)tabs[i].focus();}
    tabs.forEach(function(t,i){t.addEventListener('click',function(){pick(i);});t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();pick((i+1)%tabs.length,true);}if(e.key==='ArrowLeft'){e.preventDefault();pick((i+tabs.length-1)%tabs.length,true);}});});
  });
  var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
})();
