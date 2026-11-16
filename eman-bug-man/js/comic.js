(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  /* case files */
  var cases=[
    {name:'Ants',
      where:{home:'Kitchens and pantries, along baseboards and window frames, and out on the patio or around the foundation.',biz:'Break rooms, kitchens, storerooms and anywhere food crumbs gather, plus the building edges outside.'},
      signs:'Thin trails of tiny insects heading for crumbs or sweet spills, and small piles of sandy soil near the foundation or in lawns.',
      service:{home:['Residential pest control','Regular pest control for the house you live in, from kitchen trails to yard mounds.'],biz:['Commercial pest control','Pest control for shops, restaurants and offices, where a trail across the counter is a bigger problem.']}},
    {name:'Roaches',
      where:{home:'Under sinks, behind the fridge and dishwasher, around drains and in dark cabinet corners.',biz:'Kitchens, prep areas, dish stations, storerooms and loading docks.'},
      signs:'Droppings that look like ground pepper, a musty smell, egg cases, and sightings when you switch the lights on at night.',
      service:{home:['Residential pest control','Pest control for the house you live in, including kitchens and bathrooms.'],biz:['Commercial pest control','Pest control for restaurants, shops and offices.']}},
    {name:'Termites',
      where:{home:'Wooden framing, door and window frames, floors near damp areas, and the foundation edge where mud tubes can climb.',biz:'Wooden framing, trim, pallets and storage, and anywhere moisture meets wood.'},
      signs:'Thin mud tubes on walls or foundations, wood that sounds hollow when tapped, bubbling paint, and piles of shed wings near windows.',
      service:{home:['Termite control','Termite control for homes, for when you find mud tubes, swarmers or hollow-sounding wood.'],biz:['Termite control','Termite control for commercial buildings and their wooden structures.']}},
    {name:'Rodents',
      where:{home:'Attics, garages, wall voids, pantries and the spaces behind appliances.',biz:'Storerooms, ceilings, loading areas and any dark corner near food.'},
      signs:'Scratching or scurrying at night, droppings, gnawed boxes and wiring, greasy rub marks along walls, and nesting material.',
      service:{home:['Rodent control','Rodent control for homes: finding where they get in and dealing with them.'],biz:['Rodent control','Rodent control for businesses, from storerooms to roof spaces.']}},
    {name:'Wildlife',
      where:{home:'Attics, under decks and porches, crawlspaces, chimneys and around the yard.',biz:'Roof spaces, loading areas, dumpster enclosures and quiet corners of the property.'},
      signs:'Noise in the attic around dusk or dawn, damaged vents or soffits, tracks, torn insulation and tipped trash.',
      service:{home:['Wildlife trapping','Trapping for when an animal has moved into a place it should not be at home.'],biz:['Wildlife trapping','Trapping for animals that have settled into a business property.']}}
  ];
  var mode='home',cur=0;
  var tabs=$$('.cb-case');
  function render(){
    var c=cases[cur];
    $('#strip-name').textContent=c.name;
    $('#strip-sfx').textContent='Case 0'+(cur+1);
    $('#strip-where').textContent=c.where[mode];
    $('#strip-signs').textContent=c.signs;
    $('#strip-service').textContent=c.service[mode][0];
    $('#strip-service-txt').textContent=c.service[mode][1];
    var art=$('#strip-art');art.textContent='';
    var src=$('svg',tabs[cur]);
    if(src){art.appendChild(src.cloneNode(true))}
  }
  function pick(i,focus){
    cur=i;
    tabs.forEach(function(t,k){t.setAttribute('aria-selected',k===i?'true':'false');t.tabIndex=k===i?0:-1});
    render();
    if(focus)tabs[i].focus();
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){pick(i)});
    t.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();pick((i+1)%tabs.length,true)}
      if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();pick((i+tabs.length-1)%tabs.length,true)}
    });
  });
  $$('.cb-switch button').forEach(function(b){b.addEventListener('click',function(){
    mode=b.dataset.mode;
    $$('.cb-switch button').forEach(function(x){x.classList.toggle('is-on',x===b);x.setAttribute('aria-pressed',x===b?'true':'false')});
    render();
  })});
  render();
  /* termite or flying ant */
  var radios=$$('#qs input');
  function verdict(){
    var t=0,a=0;
    radios.forEach(function(r){if(r.checked){if(r.value==='t')t++;else a++}});
    var n=t+a;
    $('#res-tally').textContent=n+' of 4 answered';
    var h=$('#res-head'),p=$('#res-text');
    if(!n){h.textContent='Your verdict';p.textContent='Answer the checks to see which way your insect leans.';return}
    if(t>a){h.textContent='Leaning termite';p.textContent=t+' of '+n+' checks point to a termite. Wings of equal length, a straight body and straight antennae are the usual giveaways.'}
    else if(a>t){h.textContent='Leaning flying ant';p.textContent=a+' of '+n+' checks point to a flying ant: uneven wings, a pinched waist and bent antennae.'}
    else{h.textContent='Mixed signals';p.textContent='The checks split evenly. Look again at the wings and the waist, which are the clearest.'}
  }
  radios.forEach(function(r){r.addEventListener('change',verdict)});
  /* gallery filter */
  var fb=$$('.cb-filters button'),figs=$$('#gal figure');
  fb.forEach(function(b){b.addEventListener('click',function(){
    fb.forEach(function(x){x.classList.toggle('is-on',x===b);x.setAttribute('aria-pressed',x===b?'true':'false')});
    figs.forEach(function(f){f.hidden=!(b.dataset.f==='all'||f.dataset.k===b.dataset.f)});
  })});
})();
