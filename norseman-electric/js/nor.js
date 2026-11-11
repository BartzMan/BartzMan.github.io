(function(){
var $=function(s,e){return Array.prototype.slice.call((e||document).querySelectorAll(s))};
/* panel directory */
var brs=$('.cab button'),out=document.getElementById('plout');
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
brs.forEach(function(b){b.addEventListener('click',function(){
brs.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
out.innerHTML='<span class="tag">'+esc(b.getAttribute('data-s'))+'</span><h3>'+esc(b.getAttribute('data-t'))+'</h3><p>'+esc(b.getAttribute('data-w'))+'</p><p class="why">A label like this is what lets you find the right switch in seconds.</p>';
out.classList.remove('swap');void out.offsetWidth;out.classList.add('swap');
})});
/* EV planner */
var D={short:['A steady overnight top-up','Under 30 miles a day is a light load. A standard outlet can keep up, but a dedicated 240-volt circuit with a wall charger is the tidier long-term choice and leaves room for a bigger battery.'],
mid:['A 240-volt wall charger','Thirty to sixty miles a day is what most households do. A wall charger on its own 240-volt circuit refills a day of driving comfortably overnight.'],
long:['A full-speed 240-volt wall charger','Over sixty miles a day needs a proper charger running at the full capacity the circuit allows. That makes the panel capacity check the first step.']};
var P={garage:['Mounted on the garage wall, near where the car’s charge port ends up.','A sheltered spot, so most indoor-rated chargers suit it.'],
drive:['Needs an outdoor-rated charger with weather-sealed fittings.','The run from the panel is often longer, so distance matters here.'],
carport:['Open to the weather, so choose an outdoor-rated unit.','Mount it under the roofline where you can, close to the panel side of the house.']};
var spec=document.getElementById('spec');
function plan(){var d=document.querySelector('input[name=dist]:checked').value,p=document.querySelector('input[name=park]:checked').value;
spec.innerHTML='<span class="kicker">Usually suits</span><h3>'+D[d][0]+'</h3><p>'+D[d][1]+'</p><ul><li>'+P[p][0]+'</li><li>'+P[p][1]+'</li><li>A load check on the panel comes first, and a permit is normally needed.</li></ul>';
spec.classList.remove('swap');void spec.offsetWidth;spec.classList.add('swap')}
$('input[name=dist],input[name=park]').forEach(function(i){i.addEventListener('change',plan)});plan();
/* stepper */
var tabs=$('.steps [role=tab]'),pans=$('.stp');
function go(n){tabs.forEach(function(t,i){var on=i===n-1;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1});pans.forEach(function(p,i){p.classList.toggle('on',i===n-1)})}
tabs.forEach(function(t,i){t.addEventListener('click',function(){go(i+1)});t.addEventListener('keydown',function(e){var k=e.key==='ArrowDown'||e.key==='ArrowRight'?1:e.key==='ArrowUp'||e.key==='ArrowLeft'?-1:0;if(!k)return;e.preventDefault();var n=(i+k+tabs.length)%tabs.length;go(n+1);tabs[n].focus()})});
$('[data-go]').forEach(function(b){b.addEventListener('click',function(){go(+b.getAttribute('data-go'))})});
})();
