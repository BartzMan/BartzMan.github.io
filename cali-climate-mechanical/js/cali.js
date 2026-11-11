(function(){
  /* thermal house: switch + five markers */
  var hw=document.querySelector('[data-house]');
  if(hw){
    var svg=hw.querySelector('.cc-house'),tg=hw.querySelector('[data-toggle]');
    tg.addEventListener('click',function(){
      var on=tg.getAttribute('aria-checked')!=='true';
      tg.setAttribute('aria-checked',on);svg.setAttribute('data-thermal',on);
    });
    var pick=function(k){
      hw.querySelectorAll('[data-hs]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-hs')===k)});
      hw.querySelectorAll('.cc-why').forEach(function(w){w.classList.toggle('cc-on',w.getAttribute('data-for')===k)});
      if(tg.getAttribute('aria-checked')!=='true'&&!hw._said){hw._said=1}
    };
    hw.querySelectorAll('[data-hs]').forEach(function(b){b.addEventListener('click',function(){pick(b.getAttribute('data-hs'))})});
  }

  /* service cards flip */
  document.querySelectorAll('[data-flip] .cc-flip').forEach(function(card){
    var front=card.querySelector('.cc-front'),back=card.querySelector('.cc-back');
    var set=function(on){
      card.classList.toggle('cc-on',on);
      if(on){front.setAttribute('inert','');back.removeAttribute('inert')}else{back.setAttribute('inert','');front.removeAttribute('inert')}
    };
    front.querySelector('.cc-flip-btn').addEventListener('click',function(){set(true)});
    back.querySelector('.cc-back-btn').addEventListener('click',function(){set(false)});
  });

  /* why upstairs is hotter */
  var cw=document.querySelector('[data-cause]');
  if(cw){
    var sv=cw.querySelector('svg');
    cw.querySelectorAll('.cc-cause').forEach(function(b){
      b.addEventListener('click',function(){
        var k=b.getAttribute('data-c');
        cw.querySelectorAll('.cc-cause').forEach(function(x){x.setAttribute('aria-pressed',x===b)});
        cw.querySelectorAll('.cc-cause-text').forEach(function(t){t.classList.toggle('cc-on',t.getAttribute('data-for')===k)});
        sv.setAttribute('data-cause-now',k);
      });
    });
  }
})();
