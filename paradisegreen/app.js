document.querySelectorAll(".ham").forEach(b=>b.onclick=()=>{
  const d=document.getElementById("drawer");
  d.classList.toggle("open");
  document.body.classList.toggle("menu-open", d.classList.contains("open"));
});
document.querySelectorAll("form[data-sms]").forEach(f=>f.addEventListener("submit",e=>{
  e.preventDefault();
  const d=new FormData(f);
  const name=(d.get("name")||"").trim();
  const phone=(d.get("phone")||"").trim();
  const city=(d.get("city")||"").trim();
  if(name.length<2||phone.replace(/\D/g,"").length<10||!city){alert("Name, a real phone, and city.");return;}
  const body=encodeURIComponent("Hi Paradise Green, I'm "+name+" in "+city+". "+(d.get("service")||"")+". "+(d.get("message")||"")+" Call me at "+phone+".");
  f.outerHTML='<p><strong>Got it.</strong> Tap to text the shop.</p><p><a class="btn" href="sms:'+f.dataset.sms+'?body='+body+'">Text Paradise Green</a></p>';
}));
