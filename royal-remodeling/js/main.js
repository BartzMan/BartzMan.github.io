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
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var f=form.elements;
      var body='Name: '+f.name.value+'\nPhone: '+f.phone.value+'\nEmail: '+f.email.value+'\nZIP: '+f.zip.value+'\nJob: '+f.job.value+'\n\n'+f.message.value;
      var subject='Website request: '+f.job.value+(f.zip.value?' in '+f.zip.value:'');
      window.location.href='mailto:royal.remodeling@outlook.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      var note=document.getElementById('form-note');
      if(note){note.textContent='Your email app should open with the details filled in. If it does not, call (469) 399-1001 or email royal.remodeling@outlook.com.';}
    });
  }
  var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
})();
