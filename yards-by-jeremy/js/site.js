(function(){
var b=document.querySelector('.burger'),s=document.getElementById('sheet'),x=document.querySelector('.sheet-x');
function open(){s.hidden=false;document.body.classList.add('lock');b.setAttribute('aria-expanded','true');x.focus();}
function close(){s.hidden=true;document.body.classList.remove('lock');b.setAttribute('aria-expanded','false');b.focus();}
if(b&&s){b.addEventListener('click',open);x.addEventListener('click',close);
s.addEventListener('click',function(e){if(e.target.closest('a'))close();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!s.hidden)close();});}
var f=document.getElementById('yform');
if(f){f.addEventListener('submit',function(e){e.preventDefault();var d=new FormData(f),n=document.getElementById('fnote');
if(!(d.get('name')||'').trim()){n.textContent='Please add your name so the email is signed.';f.querySelector('[name=name]').focus();return;}
var lines=['Name: '+d.get('name'),'Phone: '+(d.get('phone')||''),'Service: '+(d.get('service')||''),'Area: '+(d.get('area')||''),'','About the yard:',d.get('msg')||''];
var subj='Yard request: '+(d.get('service')||'landscaping')+' ('+d.get('name')+')';
window.location.href='mailto:yardsbyjeremyllc@gmail.com?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(lines.join('\n'));
n.textContent='Your email app should open now. Attach yard photos there if you have them.';});}
})();
