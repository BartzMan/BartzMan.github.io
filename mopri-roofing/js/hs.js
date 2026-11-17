(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var NS = 'http://www.w3.org/2000/svg';
  var lang = 'en';

  /* ---------- Spanish ---------- */
  var ES = {
    skip: 'Saltar al contenido', tagline: 'Techos · Austin, TX',
    nav1: 'Guía de granizo', nav2: 'Servicios', nav3: 'Después del granizo', nav4: 'Galería', nav5: 'Contacto',
    callnum: 'Llamar (512) 364-1635',
    h_tag1: 'GUÍA DE CAMPO', h_tag2: 'Noreste de Austin, TX',
    h1a: 'Temporada', h1b: 'de granizo.',
    h_lede: 'Una guía tranquila sobre las tormentas del Hill Country y el trabajo de techos que sigue: reemplazo, reparación, reparación por daños de tormenta y granizo, e inspecciones en Austin y el centro de Texas.',
    fig1: 'FIG. 1 · Una piedra de granizo, cortada por la mitad',
    fig1b: 'Capa por capa: el granizo crece mientras sube y baja una y otra vez dentro de la nube de tormenta.',
    alt_sky: 'Una hilera de casas con techos bajo un frente oscuro de nubes de tormenta (foto de archivo ilustrativa)',
    alt_band: 'Un cielo oscuro de tormenta sobre árboles y un techo, con un resplandor naranja (foto de archivo ilustrativa)', pb1: 'LÁMINA 2B', pb2: 'Después de la tormenta', band_l: 'Después de la tormenta, una mirada más de cerca.',
    sv1: 'Reemplazo de techos', sv2: 'Reparación de techos', sv3: 'Reparación por daños de tormenta y granizo', sv4: 'Inspecciones de techos',
    p1a: 'LÁMINA 1', p1b: 'La guía de tamaños de granizo',
    g_h2: '¿Qué tan grande fue el granizo?',
    g_sub: 'Elija el tamaño que coincide con lo que vio en el pasto. Los tamaños son una guía aproximada: cada tormenta y cada techo es distinto.',
    r1: 'Tejas asfálticas', r2: 'Techos de metal', r3: 'Canalones y ventilas', r4: 'Qué revisar desde el suelo',
    alt_hail: 'Piedras grandes de granizo sobre pasto verde', cap_hail: 'Lámina 2. Granizo sobre pasto. Foto de archivo ilustrativa.',
    p3a: 'LÁMINA 3', p3b: 'Lo que hacemos', s_h2: 'Reparar, reemplazar o revisar el techo.',
    tab1: 'Reparar', tab2: 'Reemplazar', tab3: 'Inspección',
    alt_dam: 'Tejas asfálticas grises con una zona oscura donde se desgastaron los gránulos', cap_dam: 'Lámina 4. Zona desgastada en tejas grises. Foto de archivo ilustrativa.',
    rep_h: 'Reparación de techos', rep_p: 'Arreglamos goteras, tejas levantadas o faltantes y el sellado dañado, para que un problema pequeño no se haga grande.',
    hail_h: 'Reparación por daños de tormenta y granizo', hail_p: 'Ventilas abolladas, tejas golpeadas o agrietadas y canalones dañados por la tormenta, arreglados cuando pasa el mal tiempo.',
    ask: 'Pregúntenos',
    alt_roofer: 'Un techador con camisa amarilla colocando tejas en un techo (foto de archivo ilustrativa)', cap_roofer: 'Lámina 5. Techador trabajando. Foto de archivo ilustrativa.',
    repl_h: 'Reemplazo de techos', repl_p: 'Cuando un techo está gastado o muy dañado para parcharlo, se retiran las capas viejas y se instala un techo nuevo.',
    repl_1: 'Se retira el techo viejo hasta la base', repl_2: 'Se revisa la base antes de las capas nuevas', repl_3: 'Tejas o metal, según la casa',
    alt_gable: 'Un techo de tejas grises con una ventila en el frontal y árboles sin hojas atrás (foto de archivo ilustrativa)', cap_gable: 'Lámina 6. Techo de tejas y frontal. Foto de archivo ilustrativa.',
    insp_h: 'Inspecciones de techos', insp_p: 'Una revisión cuidadosa de todo el techo, y una explicación clara de lo que está bien y lo que necesita trabajo.',
    insp_1: 'Tejas, ventilas y sellado', insp_2: 'Canalones y bajantes', insp_3: 'Señales de goteras desde el ático',
    p7a: 'LÁMINA 7', p7b: 'Dónde trabajamos', alt_austin: 'El horizonte de Austin sobre un río bajo un cielo azul con nubes (foto de archivo ilustrativa)',
    ban_sub: 'Noreste de Austin, TX 78754 y el centro de Texas.',
    p8a: 'LÁMINA 8', p8b: 'Bitácora de la tormenta',
    a_h2: 'Después del granizo en Austin: 5 cosas para la primera semana',
    a_sub: 'Abra cada nota a medida que avanza. Nada de esto implica subirse al techo.',
    alt_grey: 'Primer plano de tejas asfálticas grises en filas que se traslapan', cap_grey: 'Lámina 9. Primer plano de tejas. Foto de archivo ilustrativa.',
    st1h: 'Fotografíe las abolladuras', st1p: 'Tome fotos de las abolladuras en canalones, ventilas y autos. El teléfono guarda la fecha por usted.',
    st2h: 'Revise las bajantes', st2p: 'Busque gránulos sueltos de las tejas, como arena oscura gruesa, donde las bajantes descargan al suelo.',
    st3h: 'Mire los techos interiores', st3p: 'Revise los cielos rasos y las orillas del ático en busca de manchas nuevas o zonas húmedas.',
    st4h: 'Anote la fecha de la tormenta', st4p: 'Anote el día y la hora en que cayó el granizo, y qué tan grande se veía junto a una moneda o una pelota.',
    st5h: 'Pida que revisen el techo', st5p: 'Pida a un techador que lo revise antes de la próxima lluvia, para que los problemas pequeños sigan siendo pequeños.',
    p10a: 'LÁMINA 10', p10b: 'Supercelda', alt_light: 'Un rayo cayendo sobre agua oscura bajo un cielo de tormenta (foto de archivo ilustrativa)',
    storm_l: 'La tormenta pasa. El techo sigue ahí.', storm_cta: 'Hable con un techador',
    p11a: 'LÁMINAS 11 A 16', p11b: 'Techos y cielos', gal_h2: 'Techos de Texas, en láminas.',
    alt_brown: 'Tejas asfálticas cafés en filas parejas', c11: 'Lámina 11. Tejas cafés. Foto de archivo ilustrativa.',
    alt_seam: 'Planos oscuros de un techo de metal de junta alzada contra un cielo pálido', c12: 'Lámina 12. Techo de metal de junta alzada. Foto de archivo ilustrativa.',
    alt_sub: 'Vista aérea de un vecindario con techos color arena entre árboles verdes', c13: 'Lámina 13. Un vecindario desde arriba. Foto de archivo ilustrativa.',
    alt_past: 'Un atardecer naranja de Texas sobre un pastizal con una cerca blanca', c14: 'Lámina 14. Atardecer sobre el pastizal. Foto de archivo ilustrativa.',
    alt_roofer2: 'Un techador con camisa amarilla colocando tejas', c15: 'Lámina 15. Techador trabajando. Foto de archivo ilustrativa.',
    alt_gable2: 'Un techo de tejas con una ventila triangular en el frontal', c16: 'Lámina 16. Frontal en un techo de tejas. Foto de archivo ilustrativa.',
    gal_note: 'Toque una lámina para ampliarla. Todas las fotos son de archivo ilustrativas, no trabajos de Mopri Roofing.',
    p17a: 'LÁMINA 17', p17b: 'Salude', c_h2: 'Hable con Mopri Roofing.',
    k_call: 'Llamar', k_text: 'Mensaje de texto', k_wa: 'Escríbanos', k_area: 'Zona', k_area_v: 'Noreste de Austin, TX 78754 y el centro de Texas',
    f_h: 'Solicitar cotización', f_name: 'Nombre', f_phone: 'Teléfono', f_email: 'Correo electrónico', f_details: 'Sobre el techo o la tormenta', f_btn: 'Solicitar cotización',
    f_tag: 'Techos en el noreste de Austin, TX 78754 y el centro de Texas.', fh1: 'Techos', fh2: 'Guía de campo', fh3: 'Contáctenos', priv: 'Privacidad', terms: 'Términos',
    f_note: 'Todas las fotos de esta página son de archivo ilustrativas, no trabajos del negocio. Fotógrafos en Unsplash y Pexels: Giorgio Trovato, Ethan Howard, Champers Fu, MJ Tangonan, blue soda, Martin Leitgeb, Ryunosuke Kikuno, Jeff Le, Matthew Irvine (Pexels), Zoltan Tasi, Raze Solar, Yucel M y Hal Gatewood. Los dibujos son ilustrativos.'
  };

  var SIZES = [
    { id: 'pea', in: .25, obj: 'pea',
      en: { n: 'Pea', i: 'About ¼ inch across', l: 'about the size of a pea',
        r: ['Usually no more than scuffed granules. Old, brittle shingles can show small marks.', 'Rarely leaves a mark.', 'At most a few tiny dimples on thin soft metal.', 'Look over the car and garden plants. Little else to find.'] },
      es: { n: 'Chícharo', i: 'Cerca de ¼ de pulgada', l: 'del tamaño de un chícharo',
        r: ['Por lo general solo gránulos raspados. Las tejas viejas y quebradizas pueden mostrar marcas pequeñas.', 'Rara vez deja marca.', 'A lo más unas pequeñas abolladuras en metal delgado y blando.', 'Revise el auto y las plantas del jardín. Poco más que encontrar.'] } },
    { id: 'marble', in: .5, obj: 'marble',
      en: { n: 'Marble', i: 'About ½ inch across', l: 'about the size of a marble',
        r: ['Can loosen granules, mostly on older shingles.', 'Little to no effect on most metal roofing.', 'Light dimples are possible on thin gutters and vents.', 'Look for granules where the downspouts empty.'] },
      es: { n: 'Canica', i: 'Cerca de ½ pulgada', l: 'del tamaño de una canica',
        r: ['Puede soltar gránulos, sobre todo en tejas más viejas.', 'Poco o ningún efecto en la mayoría de los techos de metal.', 'Son posibles abolladuras leves en canalones y ventilas delgados.', 'Busque gránulos donde descargan las bajantes.'] } },
    { id: 'quarter', in: 1, obj: 'quarter',
      en: { n: 'Quarter', i: 'About 1 inch across', l: 'about the size of a quarter',
        r: ['Can bruise shingles and knock off granules, more so on older roofs.', 'May dent soft trim and flashing.', 'Dents in thin vents and gutters are common.', 'Look for dents on vents, gutters and the fins of the air-conditioner outside.'] },
      es: { n: 'Moneda de 25¢', i: 'Cerca de 1 pulgada', l: 'del tamaño de una moneda de 25 centavos (quarter)',
        r: ['Puede golpear las tejas y quitar gránulos, más en techos viejos.', 'Puede abollar molduras y sellos blandos.', 'Son comunes las abolladuras en ventilas y canalones delgados.', 'Busque abolladuras en ventilas, canalones y en las aletas del aire acondicionado exterior.'] } },
    { id: 'golf', in: 1.75, obj: 'golf',
      en: { n: 'Golf ball', i: 'About 1¾ inches across', l: 'about the size of a golf ball',
        r: ['Can crack or puncture shingles, leaving bruises and bare spots.', 'Metal panels can dent.', 'Gutters and vents are often dented or bent.', 'Expect dents on anything soft. Look at the ceilings for new stains.'] },
      es: { n: 'Pelota de golf', i: 'Cerca de 1¾ pulgadas', l: 'del tamaño de una pelota de golf',
        r: ['Puede agrietar o perforar las tejas, dejando golpes y zonas peladas.', 'Los paneles de metal pueden abollarse.', 'Los canalones y las ventilas suelen quedar abollados o doblados.', 'Espere abolladuras en todo lo blando. Revise los cielos rasos en busca de manchas nuevas.'] } },
    { id: 'base', in: 2.75, obj: 'base',
      en: { n: 'Baseball', i: 'About 2¾ inches across', l: 'about the size of a baseball',
        r: ['Heavy damage is likely, and stones can break through.', 'Heavy denting is likely, and seams can be affected.', 'Gutters and vents may be crushed or torn loose.', 'Check inside for stains and drips, stay off the roof and call a roofer.'] },
      es: { n: 'Pelota de béisbol', i: 'Cerca de 2¾ pulgadas', l: 'del tamaño de una pelota de béisbol',
        r: ['Es probable un daño grave, y las piedras pueden atravesar el techo.', 'Es probable un abollado fuerte, y las juntas pueden afectarse.', 'Los canalones y las ventilas pueden aplastarse o soltarse.', 'Revise adentro por manchas y goteras, no se suba al techo y llame a un techador.'] } }
  ];

  /* ---------- hailstone drawings ---------- */
  function lumpy(cx, cy, r, seed, k) {
    var pts = [], n = 36, rr = r * k;
    for (var i = 0; i <= n; i++) {
      var a = i / n * Math.PI * 2;
      var f = 1 + .055 * Math.sin(3 * a + seed) + .035 * Math.sin(5 * a + seed * 2.1) + .02 * Math.sin(9 * a + seed * 3);
      pts.push((cx + Math.cos(a) * rr * f).toFixed(1) + ' ' + (cy + Math.sin(a) * rr * f).toFixed(1));
    }
    return 'M' + pts.join('L') + 'Z';
  }
  function stone(cx, cy, r, seed, layers) {
    var cols = ['#F4F6F8', '#C3CED9', '#E8EDF2', '#A9B8C7', '#DCE4EC', '#8EA2B6'], s = '';
    s += '<path d="' + lumpy(cx + 3, cy + 5, r, seed, 1.02) + '" fill="rgba(31,23,51,.22)"/>';
    for (var k = 0; k < layers; k++) {
      var sc = 1 - k * (0.84 / layers);
      s += '<path d="' + lumpy(cx, cy, r, seed + k * .35, sc) + '" fill="' + cols[k % cols.length] + '" stroke="#6F8296" stroke-width="' + (k ? .8 : 1.6) + '"/>';
    }
    s += '<path d="' + lumpy(cx - r * .28, cy - r * .3, r * .18, seed, 1) + '" fill="#fff" opacity=".7"/>';
    return s;
  }
  function objectSvg(kind, cx, cy, d) {
    var r = d / 2, s = '';
    if (kind === 'pea') {
      s += '<circle cx="' + (cx + 1) + '" cy="' + (cy + 2) + '" r="' + r + '" fill="rgba(31,23,51,.22)"/><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#6E9A4F" stroke="#4E6B45" stroke-width="1"/><circle cx="' + (cx - r * .3) + '" cy="' + (cy - r * .3) + '" r="' + r * .25 + '" fill="#fff" opacity=".5"/>';
    } else if (kind === 'marble') {
      s += '<circle cx="' + (cx + 2) + '" cy="' + (cy + 3) + '" r="' + r + '" fill="rgba(31,23,51,.22)"/><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#4C7FB5" stroke="#2F5B8A" stroke-width="1"/><path d="M' + (cx - r * .8) + ' ' + cy + 'Q' + cx + ' ' + (cy - r * .9) + ' ' + (cx + r * .8) + ' ' + (cy + r * .1) + 'Q' + cx + ' ' + (cy + r * .5) + ' ' + (cx - r * .8) + ' ' + cy + 'Z" fill="#F4F6F8" opacity=".75"/><circle cx="' + (cx - r * .4) + '" cy="' + (cy - r * .45) + '" r="' + r * .16 + '" fill="#fff"/>';
    } else if (kind === 'quarter') {
      s += '<circle cx="' + (cx + 3) + '" cy="' + (cy + 4) + '" r="' + r + '" fill="rgba(31,23,51,.22)"/><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#B9C0C7" stroke="#7D868F" stroke-width="2"/><circle cx="' + cx + '" cy="' + cy + '" r="' + (r * .86) + '" fill="none" stroke="#7D868F" stroke-width="1.5" stroke-dasharray="2 3"/><path d="M' + cx + ' ' + (cy - r * .45) + 'l' + r * .13 + ' ' + r * .3 + 'h' + r * .3 + 'l-' + r * .24 + ' ' + r * .2 + 'l' + r * .1 + ' ' + r * .32 + 'l-' + r * .29 + '-' + r * .2 + 'l-' + r * .29 + ' ' + r * .2 + 'l' + r * .1 + '-' + r * .32 + 'l-' + r * .24 + '-' + r * .2 + 'h' + r * .3 + 'z" fill="#8B949D"/>';
    } else if (kind === 'golf') {
      s += '<circle cx="' + (cx + 4) + '" cy="' + (cy + 6) + '" r="' + r + '" fill="rgba(31,23,51,.22)"/><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#F4F6F8" stroke="#B5BFC9" stroke-width="2"/>';
      for (var i = 0; i < 46; i++) { var a = i * 2.4, rad = r * .86 * Math.sqrt((i + .5) / 46); s += '<circle cx="' + (cx + Math.cos(a) * rad).toFixed(1) + '" cy="' + (cy + Math.sin(a) * rad).toFixed(1) + '" r="' + (r * .07).toFixed(1) + '" fill="none" stroke="#C3CCD5" stroke-width="1.2"/>'; }
    } else {
      s += '<circle cx="' + (cx + 5) + '" cy="' + (cy + 7) + '" r="' + r + '" fill="rgba(31,23,51,.22)"/><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#F6F1E6" stroke="#B9AE98" stroke-width="2"/><path d="M' + (cx - r * .55) + ' ' + (cy - r * .82) + 'Q' + (cx - r * .15) + ' ' + cy + ' ' + (cx - r * .55) + ' ' + (cy + r * .82) + 'M' + (cx + r * .55) + ' ' + (cy - r * .82) + 'Q' + (cx + r * .15) + ' ' + cy + ' ' + (cx + r * .55) + ' ' + (cy + r * .82) + '" fill="none" stroke="#B5453A" stroke-width="3"/>';
      for (var j = -3; j <= 3; j++) {
        var yy = cy + j * r * .24, xl = cx - r * (.46 - Math.abs(j) * .018), xr = cx + r * (.46 - Math.abs(j) * .018);
        s += '<path d="M' + (xl - 7) + ' ' + (yy - 4) + 'l9 4M' + (xr + 7) + ' ' + (yy - 4) + 'l-9 4" stroke="#B5453A" stroke-width="2" fill="none"/>';
      }
    }
    return s;
  }
  var obj_d = { pea: .27, marble: .5, quarter: .955, golf: 1.68, base: 2.9 };
  var obj_name_en = { pea: 'pea', marble: 'marble', quarter: 'quarter', golf: 'golf ball', base: 'baseball' };

  /* hero stone, cut in half */
  var hs = $('#heroStone');
  if (hs) {
    hs.innerHTML = '<circle cx="160" cy="160" r="150" fill="rgba(244,246,248,.08)"/>' + stone(160, 156, 128, 1.3, 7) +
      '<g fill="none" stroke="#E07A3F" stroke-width="1.5"><path d="M160 156L270 82"/><path d="M270 82H300"/></g><circle cx="160" cy="156" r="4" fill="#E07A3F"/>';
  }

  /* ---------- guide ---------- */
  var cur = 2;
  var pick = $('#sizePick');
  function buildPick() {
    pick.innerHTML = '';
    SIZES.forEach(function (z, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', i === cur ? 'true' : 'false'); b.tabIndex = i === cur ? 0 : -1;
      var r = 8 + z.in * 5;
      b.innerHTML = '<svg viewBox="0 0 56 56" aria-hidden="true">' + stone(28, 28, Math.min(24, r), i + 1, 3) + '</svg><span>' + z[lang].n + '</span>';
      b.addEventListener('click', function () { setSize(i, false); });
      b.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % SIZES.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + SIZES.length) % SIZES.length;
        if (n !== null) { e.preventDefault(); setSize(n, true); }
      });
      pick.appendChild(b);
    });
  }
  function setSize(i, focus) {
    cur = i;
    var z = SIZES[i], t = z[lang];
    $$('button', pick).forEach(function (b, k) {
      b.setAttribute('aria-checked', k === i ? 'true' : 'false'); b.tabIndex = k === i ? 0 : -1;
      b.querySelector('span').textContent = SIZES[k][lang].n;
      if (focus && k === i) b.focus();
    });
    $('#gName').textContent = t.n;
    $('#gInch').textContent = t.i; $('#gLike').textContent = t.l;
    for (var k = 0; k < 4; k++) $('#gR' + (k + 1)).textContent = t.r[k];
    var narrow = window.innerWidth < 700, W = narrow ? 340 : 640, ppi = narrow ? 50 : 82, sd = z.in * ppi, od = obj_d[z.obj] * ppi, gap = narrow ? 22 : 34, total = sd + gap + od;
    var x0 = W / 2 - total / 2, cy = narrow ? 92 : 128, svg = $('#gSvg'), s = '';
    svg.setAttribute('viewBox', '0 0 ' + W + (narrow ? ' 200' : ' 300'));
    var layers = Math.max(2, Math.min(7, Math.round(sd / 26)));
    s += '<g class="hs-pop">' + stone(x0 + sd / 2, cy, sd / 2, 2.2 + i, layers) + '</g>';
    s += '<g class="hs-pop2">' + objectSvg(z.obj, x0 + sd + gap + od / 2, cy, od) + '</g>';
    var y = narrow ? 180 : 268;
    s += '<path d="M40 ' + y + 'H' + (40 + 4 * ppi) + '" stroke="#3B2E5A" stroke-width="2"/>';
    for (var q = 0; q <= 16; q++) { var h = q % 4 === 0 ? 14 : (q % 2 === 0 ? 9 : 5); s += '<path d="M' + (40 + q * ppi / 4) + ' ' + y + 'v-' + h + '" stroke="#3B2E5A" stroke-width="1.6"/>'; }
    for (var w = 0; w <= 3; w++) s += '<text x="' + (40 + w * ppi) + '" y="' + (y + 20) + '" class="hs-svgtxt">' + w + '</text>';
    s += '<text x="' + (40 + 4 * ppi) + '" y="' + (y + 20) + '" class="hs-svgtxt">4 ' + (lang === 'es' ? 'pulg.' : 'in') + '</text>';
    svg.innerHTML = s;
    var key = lang === 'es' ? 'Granizo (izquierda) junto a un objeto del mismo tamaño a la misma escala.' : 'Hailstone (left) beside a ' + obj_name_en[z.obj] + ' at the same scale.';
    svg.setAttribute('aria-label', key);
  }
  buildPick(); setSize(cur, false);
  var lw = window.innerWidth; window.addEventListener('resize', function () { if ((window.innerWidth < 700) !== (lw < 700)) { lw = window.innerWidth; setSize(cur, false); } });

  /* ---------- tabs ---------- */
  function loadImgs(p) {
    $$('img[data-src]', p).forEach(function (im) {
      if (im.getAttribute('data-srcset')) im.setAttribute('srcset', im.getAttribute('data-srcset'));
      im.setAttribute('src', im.getAttribute('data-src'));
      im.removeAttribute('data-src'); im.removeAttribute('data-srcset');
    });
  }
  var tl = $('.hs-tabs'), tb = $$('[role=tab]', tl);
  function pickTab(b, focus) {
    tb.forEach(function (x) { var on = x === b; x.setAttribute('aria-selected', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1; });
    var map = { repair: 'sp-repair', replace: 'sp-replace', inspect: 'sp-inspect' };
    Object.keys(map).forEach(function (k) { var p = document.getElementById(map[k]), on = k === b.getAttribute('data-tab'); p.hidden = !on; if (on) loadImgs(p); });
    if (focus) b.focus();
  }
  tb.forEach(function (b, i) {
    b.addEventListener('click', function () { pickTab(b); });
    b.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = tb[(i + 1) % tb.length];
      if (e.key === 'ArrowLeft') n = tb[(i - 1 + tb.length) % tb.length];
      if (n) { e.preventDefault(); pickTab(n, true); }
    });
  });

  /* ---------- storm log steps ---------- */
  $$('#steps button').forEach(function (b) {
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', open ? 'false' : 'true');
      document.getElementById(b.getAttribute('aria-controls')).hidden = open;
      b.parentNode.classList.toggle('is-open', !open);
    });
  });

  /* ---------- EN / ES ---------- */
  var orig = {}, origAlt = {};
  $$('[data-t]').forEach(function (e) { var k = e.getAttribute('data-t'); if (!(k in orig)) orig[k] = e.innerHTML; });
  $$('[data-t-alt]').forEach(function (e) { var k = e.getAttribute('data-t-alt'); if (!(k in origAlt)) origAlt[k] = e.getAttribute('alt'); });
  var T = { title: 'Mopri Roofing LLC | Roofing in Austin, TX', titleEs: 'Mopri Roofing LLC | Techos en Austin, TX' };
  function setLang(l, save) {
    lang = l;
    document.documentElement.lang = l;
    $$('[data-t]').forEach(function (e) { var k = e.getAttribute('data-t'); e.innerHTML = (l === 'es' && ES[k] != null) ? ES[k] : orig[k]; });
    $$('[data-t-alt]').forEach(function (e) { var k = e.getAttribute('data-t-alt'); e.setAttribute('alt', (l === 'es' && ES[k] != null) ? ES[k] : origAlt[k]); });
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === l ? 'true' : 'false'); });
    document.title = l === 'es' ? T.titleEs : T.title;
    buildPick(); setSize(cur, false);
    if (save) { try { localStorage.setItem('mopri-lang', l); } catch (e) {} }
  }
  $$('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); }); });
  try { var sv = localStorage.getItem('mopri-lang'); if (sv === 'es') setLang('es', false); } catch (e) {}
})();
