(function(){
  var burger=document.querySelector('.burger'),sheet=document.querySelector('.sheet'),close=document.querySelector('.sheet .close');
  function open(){sheet.classList.add('open');sheet.setAttribute('aria-hidden','false');burger.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';close.focus();}
  function shut(){sheet.classList.remove('open');sheet.setAttribute('aria-hidden','true');burger.setAttribute('aria-expanded','false');document.body.style.overflow='';burger.focus();}
  if(burger&&sheet){burger.addEventListener('click',open);close.addEventListener('click',shut);
    sheet.querySelectorAll('a').forEach(function(a){a.addEventListener('click',shut);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&sheet.classList.contains('open'))shut();});}
  var form=document.getElementById('quote-form');
  if(form){form.addEventListener('submit',function(e){e.preventDefault();
    var f=form.elements,subject='Tree work request from '+(f.name.value||'website visitor');
    var body='Name: '+f.name.value+'\nPhone: '+f.phone.value+'\nEmail: '+f.email.value+'\nZIP: '+f.zip.value+'\nService: '+f.service.value+'\n\nDetails:\n'+f.details.value+'\n\n(Sent from the Tony\'s Tree Care website)';
    window.location.href='mailto:jonathanarteaga64@yahoo.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    var n=document.getElementById('form-note');if(n)n.textContent='Your email app should open with the details filled in. If it did not, call (832) 594-9052.';});}
  var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
})();
