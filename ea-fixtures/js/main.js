(function(){
  var burger=document.querySelector('.burger'),sheet=document.getElementById('sheet'),close=document.querySelector('.sheet .close');
  function openSheet(){sheet.classList.add('open');sheet.setAttribute('aria-hidden','false');burger.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';close.focus();}
  function closeSheet(){sheet.classList.remove('open');sheet.setAttribute('aria-hidden','true');burger.setAttribute('aria-expanded','false');document.body.style.overflow='';burger.focus();}
  if(burger&&sheet){
    burger.addEventListener('click',openSheet);
    close.addEventListener('click',closeSheet);
    sheet.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeSheet);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&sheet.classList.contains('open'))closeSheet();});
  }
  var track=document.querySelector('.marq .track');
  if(track){track.innerHTML+=track.innerHTML;}
  var form=document.getElementById('quote');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var f=form.elements;
      var subject='Fixture install request from '+(f.name.value||'website');
      var body='Name: '+f.name.value+'\nPhone: '+f.phone.value+'\nZIP: '+f.zip.value+'\nFixture: '+f.fixture.value+'\n\nDetails:\n'+f.details.value+'\n';
      window.location.href='mailto:erikram80@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      var ok=document.getElementById('sent');if(ok){ok.hidden=false;}
    });
  }
  var y=document.getElementById('yr');if(y){y.textContent=new Date().getFullYear();}
})();
