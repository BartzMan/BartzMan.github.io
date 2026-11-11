(function(){
  // 1. illustrated house hotspots
  var H = {
    limb:["The overhanging limb","Limbs near a roof scrape shingles in wind and drop needles, cones and sap onto it.","Branches touching or hanging over the roof, seen from the ground."],
    gutter:["The gutter","Needles collect in gutters, hold water and make them overflow or sag.","Water spilling over the edge in rain, or needles poking out of the gutter."],
    valley:["The valley","Where two slopes meet, water runs fast and needles pile up in the channel.","Dark debris lines or damp streaks where the slopes meet."],
    ridge:["The ridge","Shade keeps the top of a roof damp longer, which invites moss and algae.","Green or black patches, or lifted shingles along the ridge line."]
  };
  var hotBtns=[].slice.call(document.querySelectorAll('[data-h]'));
  function showHot(k){
    hotBtns.forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.h===k?'true':'false'); });
    document.getElementById('hp-t').textContent=H[k][0];
    document.getElementById('hp-a').textContent=H[k][1];
    document.getElementById('hp-l').textContent=H[k][2];
  }
  hotBtns.forEach(function(b){ b.addEventListener('click', function(){ showHot(b.dataset.h); }); });

  // 2. gallery filter
  var fb=[].slice.call(document.querySelectorAll('.pw-filter button'));
  var figs=[].slice.call(document.querySelectorAll('.pw-gal figure'));
  fb.forEach(function(b){
    b.addEventListener('click', function(){
      fb.forEach(function(o){ o.setAttribute('aria-pressed', o===b?'true':'false'); });
      figs.forEach(function(f){ f.hidden = !(b.dataset.f==='all' || f.dataset.t.indexOf(b.dataset.f)>-1); });
    });
  });

  // 3. pine guide
  var P = {
    needles:["Needles","They pile up in gutters and valleys, hold moisture and slow water down.","Overflowing gutters in rain, and dark debris lines where roof slopes meet."],
    shade:["Shade","Deep shade keeps shingles damp, so moss and algae grow more easily.","Green or black patches on the shaded side of the roof."],
    limbs:["Limbs","Branches rub shingles in wind and a storm can bring a limb down.","Any branch touching the roof, or dead limbs above it. A tree service can handle these."],
    sap:["Sap","Sticky sap and cones land on shingles and gutters and collect dirt.","Sticky spots, cones in the gutters and stains under the trees."]
  };
  var rings=[].slice.call(document.querySelectorAll('.pw-rings button'));
  rings.forEach(function(b){
    b.addEventListener('click', function(){
      rings.forEach(function(o){ o.setAttribute('aria-selected', o===b?'true':'false'); });
      var d=P[b.dataset.p];
      document.getElementById('pp-t').textContent=d[0];
      document.getElementById('pp-a').textContent=d[1];
      document.getElementById('pp-l').textContent=d[2];
    });
  });
})();
