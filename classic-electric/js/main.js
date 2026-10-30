(function(){
  var btn=document.querySelector('.nav-toggle'),sheet=document.getElementById('sheet');
  function setOpen(o){
    if(!btn||!sheet)return;
    sheet.classList.toggle('open',o);
    btn.setAttribute('aria-expanded',o?'true':'false');
    btn.setAttribute('aria-label',o?'Close menu':'Open menu');
    document.body.classList.toggle('locked',o);
    if(o){var f=sheet.querySelector('a');if(f)f.focus();}
  }
  if(btn&&sheet){
    btn.addEventListener('click',function(){setOpen(!sheet.classList.contains('open'));});
    sheet.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setOpen(false);});});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&sheet.classList.contains('open')){setOpen(false);btn.focus();}});
    window.addEventListener('resize',function(){if(window.innerWidth>980&&sheet.classList.contains('open'))setOpen(false);});
  }
  var f=document.getElementById('quote');
  if(f){f.addEventListener('submit',function(e){e.preventDefault();});}
  var y=document.getElementById('yr');if(y){y.textContent=new Date().getFullYear();}
})();
