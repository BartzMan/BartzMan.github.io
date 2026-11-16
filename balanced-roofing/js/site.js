/* Balanced Roofing: EN/ES switch, level bars, pitch reader, signs checklist, tabs, form note. Plain JS. */
(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- copy for the parts the script writes itself ---------- */
  var EN = {
    flat: { t: 'Flat commercial', p: 'Common on shops, offices and warehouses. A flat roof still has a slight slope so water can drain, and it is usually covered with a membrane or coating, not shingles.', w: 'ponding water, open seams, and drains or scuppers that are blocked.' },
    low:  { t: 'Low', p: 'Seen on many ranch-style homes. Water runs off gently, and asphalt shingles are the usual covering.', w: 'shingle rows that lift or curl, and the flashing at walls and vents.' },
    med:  { t: 'Medium', p: 'One of the most common pitches on family homes. It sheds rain and leaves well and gives shingles an easy job.', w: 'missing or creased shingles after high wind.' },
    steep:{ t: 'Steep', p: 'Sheds water quickly and puts the roof on show from the street. Shingles and metal both suit it.', w: 'shingles slipping near the ridge and along the edges. Steep roofs are hard to walk, so look from the ground and call a roofer.' },
    signs: ['The top line of the roof should run straight. A dip or a bow is worth a closer look.',
            'Rows of shingles should run in neat, parallel lines. Waves or ripples can point to trouble underneath.',
            'Look along the roof edge for a gap between the roofing and the fascia board, or an edge that has lifted.',
            'Brown rings or patches on a ceiling often mean water is getting in from above.',
            'Gutters that sag or pull away from the house can mean water is not leaving the roof the way it should.'],
    res: ['Nothing ticked yet. The bubble sits level.', 'Worth a closer look. A roofer can check it for you.', 'Several signs. It is worth a call to a roofer soon.'],
    rise: 'in 12', form: 'Preview: on your live website, this request would be sent straight to your email.'
  };
  var ES = {
    skip: 'Saltar al contenido', tag: 'Techado residencial y comercial', n_services: 'Servicios', n_pitch: 'Lector de pendiente', n_signs: '5 señales', n_gallery: 'Galería', n_contact: 'Contacto',
    lang_label: 'Idioma', menu: 'Menú', close: 'Cerrar', call_num: 'Llamar al (817) 771-3094',
    h_kick: 'Techado residencial y comercial <span>· Dallas-Fort Worth, TX</span>', h_big: 'A nivel', h_sub: 'techos. Líneas rectas.',
    h_lede: 'Techado para casas y edificios comerciales en Dallas-Fort Worth, TX. Llame, envíe un texto o escríbanos por WhatsApp.',
    h_quote: 'Solicitar cotización', h_pitches: 'Pendientes de techo comunes', rate_label: '5.0 estrellas en Google', rate_on: 'en Google', c_aerial: 'El techo desde arriba: aquí empieza un nivel.',
    s_h1: 'Dos tipos de techo.', s_h2: 'Un solo estándar.', s_tabs: 'Tipo de techo', s_res: 'Residencial', s_com: 'Comercial',
    r1_t: 'Techado residencial', r1_p: 'Un techo nuevo o un reemplazo completo para la casa donde vive. Es el servicio indicado cuando el techo llegó al final de su vida útil, no solo tiene una gotera en un punto.',
    r2_t: 'Inspecciones de techo', r2_p: 'Una revisión de cerca del techo, los flashings y las canaletas para ver en qué estado están. Útil después de una tormenta, antes de comprar una casa o cuando algo simplemente no se ve bien.',
    r3_t: 'Reparación de techos', r3_p: 'Arreglar una gotera, reponer tejas faltantes o sellar alrededor de una ventila. La decisión correcta cuando el resto del techo sigue en buen estado.',
    c1_t: 'Techado comercial', c1_p: 'Techos planos y de poca pendiente en tiendas, oficinas, bodegas y edificios de apartamentos. Normalmente un sistema de membrana o recubrimiento en lugar de tejas.',
    c2_t: 'Inspecciones de techo', c2_p: 'Un recorrido por las juntas, los drenajes y los equipos del techo para que el dueño del edificio vea qué necesita atención ahora y qué puede esperar.',
    c3_t: 'Reparación de techos', c3_p: 'Encontrar una gotera alrededor de una ventila, una junta o un drenaje y sellarla. Una reparación común en techos planos.',
    p_h1: 'Elija una pendiente.', p_h2: 'Lea el techo.', p_lede: 'La pendiente es cuántas pulgadas sube un techo por cada 12 pulgadas de recorrido. Toque una y vea cómo se asienta el nivel.',
    p_svg: 'Perfil de techo que cambia según la pendiente elegida', p_group: 'Pendiente', p_flat: 'Plano comercial', p_low: 'Baja', p_med: 'Media', p_steep: 'Pronunciada', p_watch: 'Tenga cuidado con',
    g_h1: '¿Su techo sigue a nivel?', g_h2: '5 señales que se ven desde el jardín.', g_lede: 'Párese en el jardín, mire hacia arriba y repase la lista. Marque las que pueda ver.',
    g_safe: 'Mire siempre desde el suelo. Nunca suba al techo a revisar.', g_seen: 'Puedo ver esto',
    g1_t: 'Una cumbrera hundida', g2_t: 'Hileras de tejas onduladas', g3_t: 'Espacios en la fascia', g4_t: 'Manchas de agua en los techos', g5_t: 'Canaletas que se separan',
    g1_a: 'Una línea de cumbrera que baja por debajo de una línea recta punteada', g2_a: 'Hileras de tejas que ondulan en lugar de ir rectas', g3_a: 'Un espacio entre el borde del techo y la tabla de la fascia',
    g4_a: 'Un techo interior con anillos marrones donde pasó el agua', g5_a: 'Una canaleta que se hunde y se separa de la casa',
    b_kick: 'Dallas · Fort Worth · Texas', b_line: 'Techado en toda el área de Dallas-Fort Worth.',
    l_h1: 'Líneas de techo,', l_h2: 'de cerca.', l_note: 'Fotos de archivo ilustrativas, no son trabajos de Balanced Roofing. Toque cualquier foto para ampliarla.',
    m1: 'Trabajo en un techo inclinado', m2: 'Una casa de noche', m3: 'Borde de techo viejo, martillo en mano', m4: 'Horizonte al anochecer', m5: 'Un barrio de techos', m6: 'Una ventila en un techo oscuro', m7: 'Techos vistos desde un dron',
    band_label: 'A nivel. Recto. A plomo.', band_txt: 'A nivel. Recto. A plomo.',
    k_h1: 'Llame. Escriba.', k_h2: 'Mándenos un mensaje.', k_text: 'Envíenos un texto', k_wa: 'Mensaje por WhatsApp', k_area: 'Dallas-Fort Worth, TX',
    f_h: 'Solicitar cotización', f_name: 'Nombre', f_phone: 'Teléfono', f_email: 'Correo electrónico', f_details: 'Detalles', f_btn: 'Solicitar cotización',
    foot_say: 'Techos a nivel. Líneas rectas.', foot_svc: 'Servicios', foot_find: 'Contacto', foot_more: 'Más', foot_priv: 'Privacidad', foot_terms: 'Términos',
    foot_photo: 'Ninguna foto de esta página es de Balanced Roofing. Todas son fotos de archivo ilustrativas de Unsplash: Muhammet Cengiz, blue soda, Taylor Hammersla, LXS Photography, Martin Leitgeb, Raze Solar, Ryunosuke Kikuno, Hal Gatewood, Adrian Newell, Chandler Cruttenden, AccuPhotography, Will Haddock, Brad Switzer, CR, Paragon Exterior, Max Fray, Brevan Combs, Jeff Le, Daivik Goel, Phil Hearing y Josh Lemmon.',
    bar_call: 'Llamar', bar_text: 'Texto',
    a_homes: 'Hilera de casas con techos de tejas marrones', a_aerial: 'Vista aérea de una casa de barrio con techo gris', a_brick: 'Casa de ladrillo con techo de tejas y jardín al frente',
    a_gutter: 'Borde de techo con canaleta y bajante contra un cielo azul', a_damaged: 'Tejas grises con un parche donde faltan tejas', a_flat: 'Techo plano con ventilas y equipos sobre una ciudad',
    a_seam: 'Techo metálico oscuro de juntas elevadas contra un cielo nublado', a_deck: 'Manos usando taladros sobre la cubierta de un techo', a_shingles: 'Tejas asfálticas marrones en hileras ordenadas',
    a_shingle: 'Vista cercana de un techo de tejas', a_storm: 'Vista en blanco y negro a lo largo de un techo hacia árboles y una calle', a_dallas: 'Horizonte de Dallas al atardecer',
    a_dallas2: 'Horizonte de una ciudad al anochecer con un tanque de agua al frente', a_roofer: 'Techador con camisa reflectante trabajando sobre un techo de tejas',
    a_town: 'Vista aérea de un barrio y sus techos', a_bungalow: 'Casa blanca con techo inclinado entre árboles', a_suburb: 'Barrio residencial visto desde arriba con bosque al fondo', a_vent: 'Pendiente de techo oscura con una pequeña ventila bajo un cielo gris', a_drone: 'Casas y árboles de otoño vistos desde un dron', a_night: 'Casa blanca de noche con ventanas encendidas', a_hammer: 'Mano con guante sosteniendo un martillo en el borde de un techo viejo',
    flat: { t: 'Plano comercial', p: 'Común en tiendas, oficinas y bodegas. Un techo plano igual tiene una ligera inclinación para que el agua drene, y normalmente se cubre con una membrana o un recubrimiento, no con tejas.', w: 'agua estancada, juntas abiertas y drenajes o desagües bloqueados.' },
    low:  { t: 'Baja', p: 'Se ve en muchas casas estilo rancho. El agua escurre suavemente y las tejas asfálticas son el material habitual.', w: 'hileras de tejas levantadas o enrolladas, y el flashing en paredes y ventilas.' },
    med:  { t: 'Media', p: 'Una de las pendientes más comunes en casas familiares. Despide bien la lluvia y las hojas y le facilita el trabajo a las tejas.', w: 'tejas faltantes o dobladas después de vientos fuertes.' },
    steep:{ t: 'Pronunciada', p: 'Despide el agua rápido y deja el techo a la vista desde la calle. Le van bien tanto las tejas como el metal.', w: 'tejas que se deslizan cerca de la cumbrera y a lo largo de los bordes. Los techos pronunciados son difíciles de caminar: mire desde el suelo y llame a un techador.' },
    signs: ['La línea superior del techo debe verse recta. Una hendidura o una curva merece una revisión más de cerca.',
            'Las hileras de tejas deben formar líneas rectas y paralelas. Las ondas pueden indicar un problema debajo.',
            'Mire a lo largo del borde del techo: busque un espacio entre el techado y la tabla de la fascia, o un borde levantado.',
            'Los anillos o manchas marrones en un techo interior suelen indicar que entra agua desde arriba.',
            'Las canaletas hundidas o separadas de la casa pueden indicar que el agua no sale del techo como debería.'],
    res: ['Todavía nada marcado. La burbuja está a nivel.', 'Vale la pena una revisión más de cerca. Un techador puede revisarlo.', 'Varias señales. Conviene llamar pronto a un techador.'],
    rise: 'en 12', form: 'Vista previa: en su sitio web real, esta solicitud se enviaría directamente a su correo.',
    title: 'Balanced Roofing | Techado residencial y comercial, DFW',
    desc: 'Balanced Roofing: techado residencial y comercial en Dallas-Fort Worth, TX. Reparación e inspecciones. Llame, envíe un texto o escriba por WhatsApp. Se habla español.'
  };
  var hasPage = !!document.getElementById('stage-svg');
  var meta = { title: document.title, desc: ($('meta[name="description"]') || {}).content };
  var lang = 'en';
  var T = function (k) { return (lang === 'es' ? ES : EN)[k]; };

  /* ---------- language switch ---------- */
  $$('[data-i]').forEach(function (el) { el.setAttribute('data-en', el.innerHTML); });
  $$('[data-ia]').forEach(function (el) {
    el.setAttribute('data-ia-en', JSON.stringify(el.getAttribute('data-ia').split(',').map(function (p) { var a = p.split(':')[0]; return [a, el.getAttribute(a)]; })));
  });
  function setLang(l, save) {
    lang = l;
    document.documentElement.lang = l;
    $$('[data-i]').forEach(function (el) {
      var k = el.getAttribute('data-i');
      el.innerHTML = (l === 'es' && ES[k] != null) ? ES[k] : el.getAttribute('data-en');
    });
    $$('[data-ia]').forEach(function (el) {
      var orig = JSON.parse(el.getAttribute('data-ia-en'));
      el.getAttribute('data-ia').split(',').forEach(function (p, i) {
        var a = p.split(':'), k = a[1];
        el.setAttribute(a[0], (l === 'es' && ES[k] != null) ? ES[k] : orig[i][1]);
      });
    });
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === l ? 'true' : 'false'); });
    document.title = l === 'es' ? ES.title : meta.title;
    var md = $('meta[name="description"]'); if (md) md.content = l === 'es' ? ES.desc : meta.desc;
    renderPitch(); renderSign(); renderResult();
    var m = $('.sc-form-msg'); if (m && m.textContent) m.textContent = T('form');
    if (save) { try { localStorage.setItem('br-lang', l); } catch (e) {} }
  }
  $$('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); }); });

  /* ---------- level bars: the bubble settles as the section arrives ---------- */
  var levels = $$('.level');
  function levelUpdate() {
    var vh = window.innerHeight;
    levels.forEach(function (l) {
      var r = l.getBoundingClientRect();
      var t = still ? 1 : Math.max(0, Math.min(1, (vh * 0.97 - r.top) / (vh * 0.55)));
      var e = 1 - Math.pow(1 - t, 3);
      var dir = l.getAttribute('data-dir') === 'r' ? 1 : -1;
      var wob = t >= 1 ? 0 : Math.sin(t * 11) * (1 - t) * 0.22;
      var off = (1 - e) * dir + wob;
      l.style.setProperty('--off', off.toFixed(3));
      var d = l.querySelector('.level-deg');
      if (d) d.textContent = (Math.abs(off) * 2.4).toFixed(1) + '°';
    });
  }
  var ticking = false;
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; levelUpdate(); }); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  levelUpdate();

  /* ---------- services tabs ---------- */
  var tabs = $$('.vtab');
  function pickTab(i) {
    tabs.forEach(function (t, j) {
      var on = i === j;
      t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      p.hidden = !on;
      if (on) { p.classList.remove('is-in'); void p.offsetWidth; p.classList.add('is-in'); }
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pickTab(i); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = (i + 1) % tabs.length; pickTab(n); tabs[n].focus(); e.preventDefault(); }
    });
  });

  /* ---------- pitch reader ---------- */
  var svg = $('#stage-svg');
  var st = { p: 6, f: 0 }, cur = 'med', raf = 0;
  var roof = $('#roof-poly'), riseLine = $('#rise-line'), riseTxt = $('#rise-txt'), arc = $('#arc'), arcTxt = $('#arc-txt');
  var gHouse = $('#g-house'), gFlat = $('#g-flat'), gLevel = $('#g-level'), bubble = $('#g-bubble');
  function draw() {
    var p = st.p, f = st.f;
    var rise = 200 * p / 12, ax = 320, ay = 230 - rise;
    roof.setAttribute('points', '120,230 ' + ax + ',' + ay.toFixed(1) + ' 520,230');
    riseLine.setAttribute('y1', ay.toFixed(1));
    riseTxt.setAttribute('y', (230 - rise / 2 + 5).toFixed(1));
    riseTxt.textContent = (p >= 1 ? Math.round(p * 10) / 10 : '¼') + ' ' + T('rise');
    var th = Math.atan(p / 12), deg = th * 180 / Math.PI;
    var hv = f < 0.5 ? 1 : 0;
    gHouse.style.opacity = String(1 - f); gFlat.style.opacity = String(f);
    arc.style.opacity = String(Math.max(0, 1 - f * 2)); arcTxt.style.opacity = arc.style.opacity;
    var R = 70;
    arc.setAttribute('d', 'M' + (120 + R) + ' 230 A' + R + ' ' + R + ' 0 0 0 ' + (120 + R * Math.cos(th)).toFixed(1) + ' ' + (230 - R * Math.sin(th)).toFixed(1));
    arcTxt.setAttribute('x', 196); arcTxt.setAttribute('y', 224); arcTxt.textContent = deg.toFixed(1) + '°';
    var px = 220, py = 230 - (px - 120) * p / 12;
    var fx = 300, fy = 186;
    var x = px + (fx - px) * f, y = py + (fy - py) * f;
    gLevel.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (-deg).toFixed(2) + ')');
    var bx = Math.min(14, deg * 0.45);
    bubble.setAttribute('cx', bx.toFixed(2));
    $('#rd-ang').textContent = deg.toFixed(1) + '°';
    return hv;
  }
  function renderPitch() {
    if (!hasPage) return;
    var d = EN[cur] && (lang === 'es' ? ES[cur] : EN[cur]);
    var p = parseFloat($('.pbtn[data-k="' + cur + '"]').getAttribute('data-p'));
    var label = p < 1 ? '¼/12' : p + '/12';
    var deg = (Math.atan(p / 12) * 180 / Math.PI).toFixed(1);
    $('#rd-pitch').textContent = label;
    $('#pc-tag').textContent = label + ' · ' + deg + '°';
    $('#pc-title').textContent = d.t; $('#pc-text').textContent = d.p; $('#pc-watch').textContent = d.w;
    draw();
  }
  function tween(toP, toF) {
    cancelAnimationFrame(raf);
    var p0 = st.p, f0 = st.f, t0 = performance.now(), dur = still ? 1 : 700;
    (function step(now) {
      var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      st.p = p0 + (toP - p0) * e; st.f = f0 + (toF - f0) * e;
      draw();
      if (k < 1) raf = requestAnimationFrame(step);
    })(t0);
  }
  $$('.pbtn').forEach(function (b) {
    b.addEventListener('click', function () {
      cur = b.getAttribute('data-k');
      $$('.pbtn').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      $$('.pc-img').forEach(function (im) { im.classList.toggle('is-on', im.getAttribute('data-k') === cur); });
      var p = parseFloat(b.getAttribute('data-p'));
      renderPitch(); tween(p, cur === 'flat' ? 1 : 0);
      $('.pitch-card').classList.remove('pc-swap'); void $('.pitch-card').offsetWidth; $('.pitch-card').classList.add('pc-swap');
    });
  });

  $$('[data-pick]').forEach(function (a) {
    a.addEventListener('click', function () { var b = $('.pbtn[data-k="' + a.getAttribute('data-pick') + '"]'); if (b) b.click(); });
  });

  /* ---------- 5 signs ---------- */
  var sel = 0, ticks = $$('#sign-list input[type=checkbox]'), sbtns = $$('.sign-btn'), arts = $$('.sign-art');
  function renderSign() {
    if (!hasPage) return;
    $('#sign-p').textContent = T('signs')[sel];
    $('#sign-n').textContent = '0' + (sel + 1) + ' / 05';
  }
  function renderResult() {
    if (!hasPage) return;
    var n = ticks.filter(function (c) { return c.checked; }).length;
    var tier = n === 0 ? 0 : (n < 3 ? 1 : 2);
    var r = $('#result');
    r.setAttribute('data-tier', tier);
    $('#result-bubble').style.setProperty('--n', n);
    $('#result-txt').textContent = T('res')[tier];
  }
  sbtns.forEach(function (b) {
    b.addEventListener('click', function () {
      sel = +b.getAttribute('data-n');
      sbtns.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      arts.forEach(function (a) { a.classList.toggle('is-on', +a.getAttribute('data-n') === sel); });
      renderSign();
    });
  });
  ticks.forEach(function (c) {
    c.addEventListener('change', function () {
      c.closest('li').classList.toggle('is-seen', c.checked);
      renderResult();
    });
  });

  /* ---------- quote form note in the chosen language ---------- */
  $$('form[data-kit-form]').forEach(function (f) {
    f.addEventListener('submit', function () {
      if (!f.checkValidity()) return;
      var m = f.querySelector('.sc-form-msg');
      if (m) m.textContent = T('form');
    });
  });

  /* ---------- start ---------- */
  var saved = null; try { saved = localStorage.getItem('br-lang'); } catch (e) {}
  var qs = /[?&]lang=es/.test(location.search) ? 'es' : null;
  renderPitch(); renderSign(); renderResult();
  if (qs || saved === 'es') setLang('es', false);
})();
