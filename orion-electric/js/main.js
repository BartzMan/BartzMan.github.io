(function(){
  var burger=document.querySelector('.burger'),sheet=document.querySelector('.sheet'),closeBtn=document.querySelector('.sheet .close');
  function open(){sheet.classList.add('open');document.body.style.overflow='hidden';burger.setAttribute('aria-expanded','true');closeBtn.focus();}
  function close(){sheet.classList.remove('open');document.body.style.overflow='';burger.setAttribute('aria-expanded','false');burger.focus();}
  if(burger&&sheet){
    burger.addEventListener('click',open);
    closeBtn.addEventListener('click',close);
    sheet.querySelectorAll('a').forEach(function(a){a.addEventListener('click',close);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&sheet.classList.contains('open'))close();});
  }
  var form=document.getElementById('quote');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var f=form.elements;
      var subject='Website request - '+(f.job.value||'Electrical work')+' in '+(f.city.value||'Clearwater');
      var body='Name: '+f.name.value+'\nPhone: '+f.phone.value+'\nEmail: '+f.email.value+'\nCity / ZIP: '+f.city.value+'\nType of work: '+f.job.value+'\n\nDetails:\n'+f.msg.value+'\n\n(Sent from the Orion Electric website)';
      window.location.href='mailto:orionelectricinc@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      var note=form.querySelector('.sent');if(note){note.hidden=false;}
    });
  }
})();
