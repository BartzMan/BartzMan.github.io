(function(){
  var btn=document.querySelector('.nav-toggle'),sheet=document.getElementById('nav-sheet');
  if(btn&&sheet){
    var toggle=function(open){sheet.classList.toggle('open',open);btn.setAttribute('aria-expanded',open?'true':'false');document.body.classList.toggle('no-scroll',open);btn.querySelector('.nav-toggle-label').textContent=open?'Close':'Menu';};
    btn.addEventListener('click',function(){toggle(!sheet.classList.contains('open'));});
    sheet.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){toggle(false);});});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&sheet.classList.contains('open')){toggle(false);btn.focus();}});
  }
  var form=document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var g=function(n){var el=form.querySelector('[name="'+n+'"]');return el?el.value.trim():'';};
      var subject='Service request from the website';
      var body='Name: '+g('name')+'\nPhone: '+g('phone')+'\nEmail: '+g('email')+'\nZIP: '+g('zip')+'\nService: '+g('service')+'\n\nDetails:\n'+g('message');
      window.location.href='mailto:jdaleb1@sbcglobal.net?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      var note=form.querySelector('.form-note');if(note){note.textContent='Your email app should open with the request filled in. If it does not, call (817) 233-0562.';}
    });
  }
  var hdr=document.querySelector('.site-header');
  if(hdr){var onS=function(){hdr.classList.toggle('scrolled',window.scrollY>24);};onS();window.addEventListener('scroll',onS,{passive:true});}
})();
