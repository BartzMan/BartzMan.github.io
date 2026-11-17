(function(){
  'use strict';
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  /* drawn finish swatches for the sample boards */
  var SW=[
    '<svg viewBox="0 0 150 205" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="s0" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8b5127"/><stop offset=".5" stop-color="#a8683a"/><stop offset="1" stop-color="#7a4421"/></linearGradient><filter id="g0"><feTurbulence type="fractalNoise" baseFrequency=".03 .55" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 .15 0 0 0 0 .06 0 0 0 0 .02 0 0 0 .75 -.18"/></filter><linearGradient id="h0" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#fff" stop-opacity=".28"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect width="150" height="205" fill="url(#s0)"/><rect width="150" height="205" filter="url(#g0)"/><rect width="150" height="205" fill="url(#h0)"/></svg>',
    '<svg viewBox="0 0 150 205" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="s1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf9f4"/><stop offset="1" stop-color="#e8e3d8"/></linearGradient><linearGradient id="h1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".35" stop-color="#fff" stop-opacity=".9"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect width="150" height="205" fill="url(#s1)"/><rect width="150" height="205" fill="url(#h1)"/></svg>',
    '<svg viewBox="0 0 150 205" preserveAspectRatio="none" aria-hidden="true"><rect width="150" height="205" fill="#f1eee9"/><g fill="none" stroke="#6B7A86" stroke-linecap="round"><path d="M-5 40C30 55 45 20 80 60S120 90 160 70" stroke-width="2.4" opacity=".7"/><path d="M20 -5C40 40 20 80 70 110S110 170 95 215" stroke-width="3" opacity=".6"/><path d="M-5 150C40 130 60 175 110 150S140 120 160 140" stroke-width="1.8" opacity=".55"/><path d="M60 60C75 85 95 80 105 110" stroke-width="1.2" opacity=".6"/><path d="M110 -5C100 30 130 50 125 90" stroke-width="1.4" opacity=".5"/></g><path d="M20 -5C40 40 20 80 70 110S110 170 95 215" fill="none" stroke="#C98A75" stroke-width="1" opacity=".5" transform="translate(4 2)"/></svg>',
    '<svg viewBox="0 0 150 205" preserveAspectRatio="none" aria-hidden="true"><defs><radialGradient id="s3" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#e9dec6"/><stop offset="1" stop-color="#8d6b45"/></radialGradient><filter id="g3"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .3 0 0 0 0 .2 0 0 0 0 .1 0 0 0 .6 -.15"/></filter></defs><rect width="150" height="205" fill="url(#s3)"/><rect width="150" height="205" filter="url(#g3)"/><g stroke="#5a4028" stroke-width=".8" opacity=".6"><path d="M18 30l22 4M30 60l16-6M110 150l20 5M95 175l22-3M12 120l15 3M120 40l14-5"/></g></svg>',
    '<svg viewBox="0 0 150 205" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="s4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8a6a22"/><stop offset=".25" stop-color="#e9cf82"/><stop offset=".4" stop-color="#fff3c4"/><stop offset=".6" stop-color="#C9A24A"/><stop offset=".8" stop-color="#f0db98"/><stop offset="1" stop-color="#8a6a22"/></linearGradient></defs><rect width="150" height="205" fill="url(#s4)"/><g fill="none" stroke="#7d5f1c" stroke-width=".8" opacity=".55"><path d="M0 30l30 14 20-20 30 30 25-12 45 22M0 90l40 20 25-25 40 40 45-15M0 150l35-12 30 28 35-22 50 24M30 0l12 44M100 0l-10 60M60 100l8 105M130 80l-14 60"/></g></svg>'
  ];
  $$('[data-sw]').forEach(function(n){n.innerHTML=SW[+n.getAttribute('data-sw')]});

  /* sample wall */
  var boards=$$('#boards .dw-board'),panels=$$('#panels .dw-detail');
  var show=function(i){
    boards.forEach(function(b,j){b.setAttribute('aria-pressed',j===i?'true':'false')});
    panels.forEach(function(p,j){p.hidden=j!==i});
  };
  boards.forEach(function(b,i){b.addEventListener('click',function(){show(i)})});

  /* catalogue tabs */
  var tabs=$$('.dw-tab'),panes=[$('#pan-k'),$('#pan-f')];
  var pick=function(i,f){
    tabs.forEach(function(t,j){t.setAttribute('aria-selected',j===i?'true':'false');t.tabIndex=j===i?0:-1});
    panes.forEach(function(p,j){p.hidden=j!==i});
    if(f)tabs[i].focus();
  };
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){pick(i)});
    t.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();pick(i?0:1,true)}
    });
  });

  /* spec card */
  var qs=$$('.dw-q'),count=$('#qcount'),done=$('#qdone');
  qs.forEach(function(q){
    var opts=$$('.dw-opt',q),ans=$('.dw-ans',q);
    opts.forEach(function(o){
      o.addEventListener('click',function(){
        opts.forEach(function(x){x.setAttribute('aria-pressed',x===o?'true':'false')});
        ans.textContent=o.getAttribute('data-a');
        var n=qs.filter(function(z){return $('.dw-opt[aria-pressed=true]',z)}).length;
        count.textContent=n+' of 5';done.hidden=n<5;
      });
    });
  });
})();
