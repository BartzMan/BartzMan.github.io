(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* ---- Spanish copy: same facts as the English in index.html ---- */
  var ES = {
    skip: 'Saltar al contenido',
    tagline: 'Se habla español &middot; Desde 1988',
    nav_tabla: 'La tabla', nav_serv: 'Servicios', nav_after: 'Después de la tormenta', nav_gal: 'Galería', nav_contact: 'Contacto',
    menu_open: 'Abrir menú', menu_close: 'Cerrar menú',
    call_n: 'Llamar (432) 894-5295',
    hero_tag: 'Midland, Texas &middot; Se habla español',
    h1a: 'Escoge tu', h1b: 'carta del techo.',
    hero_sub: 'Triple A Roofing &amp; Co. hace todo tipo de techos en Midland y la cuenca Pérmica: reemplazo de techos de tejas, techos planos, reparación de techos y trabajo de techo en reclamos de seguro.',
    quote: 'Pedir cotización', since: 'Desde', on_google: 'en Google', stars5: '5.0 de 5 estrellas',
    hint: 'Toca una carta para voltearla.',
    read_idle_t: 'La tabla',
    read_idle: 'Seis cartas, seis tipos de problemas de techo. Voltea una para ver una foto, lo que significa para un techo de Midland y el servicio que lo cubre.',
    en_techo: 'el techo', en_gotera: 'la gotera', en_granizo: 'el granizo', en_teja: 'la teja', en_viento: 'el viento', en_plano: 'el techo plano',
    flip_techo: 'El Techo: voltear la carta', flip_gotera: 'La Gotera: voltear la carta', flip_granizo: 'El Granizo: voltear la carta', flip_teja: 'La Teja: voltear la carta', flip_viento: 'El Viento: voltear la carta', flip_plano: 'El Techo Plano: voltear la carta',
    alt_hero: 'Techo nuevo de tejas café bajo un cielo azul despejado',
    alt_hedge: 'Tejas nuevas junto a una línea de arbustos',
    alt_flat: 'Superficie de un techo plano con una cerca y casas al fondo',
    alt_rot: 'Fascia y base de techo podridas, expuestas bajo el techo viejo',
    alt_damaged: 'Tejas de asfalto grises con una zona sin gránulos',
    alt_pasture: 'Atardecer anaranjado del oeste de Texas sobre un pastizal abierto',
    alt_granules: 'Vista cercana de tejas de asfalto café',
    alt_vent: 'Ventila de turbina café sobre tejas nuevas color café',
    alt_flatjob: 'Techo plano en obra con rollo de techar sobre la superficie vieja y paquetes al lado',
    alt_valley: 'Techo de tejas café con un valle con borde metálico',
    alt_gutter: 'Canalón color cobre y bajante blanco en la línea del techo',
    alt_storm: 'Vista en blanco y negro a lo largo de una línea de techo con tejas hacia los árboles',
    deck_a: 'La baraja:', deck_b: 'cuatro servicios.',
    deck_lede: 'Todo tipo de techos, repartidos en cuatro cartas. Cada una dice qué es y cuándo la necesitas.',
    s1_t: 'Reemplazo de techo de tejas', s1_p: 'Un techo nuevo cuando el viejo está gastado, con goteras o ya no se puede reparar.',
    s2_t: 'Techos planos y de poca pendiente', s2_p: 'Superficies y uniones en techos que sueltan el agua despacio, como el rollo de techar.',
    s3_t: 'Reparación de techos', s3_p: 'Goteras, tejas levantadas, ventilas y bordes podridos, arreglados sin reemplazar todo cuando eso basta.',
    s4_t: 'Trabajo de techo en reclamos de seguro', s4_p: 'Ayuda con el trabajo del techo en reclamos de seguro por daños de granizo o viento.',
    cap_rot: 'Fascia y base de techo podridas, encontradas bajo el techo viejo',
    cap_stock: 'Foto de archivo ilustrativa',
    banner_sub: 'Oeste de Texas &middot; Cuenca Pérmica &middot; Foto ilustrativa de un atardecer',
    af_a: 'Después de granizo o viento fuerte en Midland:', af_b: '5 revisiones desde el suelo.',
    af_lede: 'Quédate en el suelo. Un vistazo rápido desde el patio puede decirte si es hora de llamar a un techador. Toca cada carta para poner un frijol cuando la hayas revisado.',
    b1_t: 'Abolladuras en ventilas y canalones', b1_p: 'Busca golpes en las ventilas del techo, los canalones y los bajantes.',
    b2_t: 'Gránulos en los bajantes', b2_p: 'Arenilla de las tejas acumulada donde termina el bajante puede significar tejas gastadas.',
    b3_t: 'Tejas levantadas o faltantes', b3_p: 'Recorre con la vista la línea del techo en busca de tejas levantadas, enroscadas o que ya no están.',
    b4_t: 'Agua acumulada en techo plano', b4_p: 'En un techo plano, agua que sigue en el mismo lugar un día después de la lluvia merece una revisión.',
    b5_t: 'Una mancha de gotera adentro', b5_p: 'Revisa techos y paredes por si hay una mancha café nueva.',
    of5: ' de 5 revisadas',
    gal_a: 'La galería,', gal_b: 'carta por carta.', gal_lede: 'Toca cualquier foto para verla más grande.',
    g1: 'Ventila de turbina café sobre tejas nuevas.', g2: 'Un techo plano en obra, poniendo rollo de techar.', g3: 'Un valle de tejas.',
    g4: 'Canalón y bajante en la línea del techo. Foto de archivo ilustrativa.', g5: 'Una línea de techo después de la lluvia. Foto de archivo ilustrativa.',
    c_a: 'Tu turno.', c_b: 'Llama a tu carta.',
    c_call: 'Llamar o enviar texto', c_wa: 'Escribir por WhatsApp', c_fb: 'Triple A Roofing &amp; Co. en Facebook', c_in: 'Ubicados en', c_maps: 'Ver en Google Maps', c_es: 'Se habla español',
    q_lot: 'Tu carta', f_name: 'Nombre', f_phone: 'Teléfono', f_email: 'Correo electrónico', f_details: 'Detalles del techo', f_ph: '¿Qué pasa con el techo?',
    fc1: 'Contacto', fc2: 'Servicios', fc3: 'Página',
    demo: 'Vista previa de demostración de un sitio web de negocio.',
    credits: 'Fotos: el techo nuevo de tejas, la ventila de turbina, los techos planos, el valle y la fascia podrida son de Triple A Roofing &amp; Co. El resto son fotos de archivo ilustrativas: pastizal al atardecer (Matthew Irvine, Pexels), tejas dañadas (blue soda, Unsplash), línea de canalón (Taylor Hammersla, Unsplash), primer plano de tejas (Martin Leitgeb, Unsplash), línea de techo con luz gris (Adrian Newell, Unsplash).',
    bar_call: 'Llamar', bar_text: 'Texto'
  };

  var CARDS = {
    techo: { n: ['EL TECHO', 'the roof', 'el techo'], t: ['Shingle roof replacement', 'Reemplazo de techo de tejas'],
      m: ['A shingle roof that is worn past patching is replaced with a new one. West Texas sun and wind are hard on shingles.', 'Un techo de tejas desgastado más allá de un parche se reemplaza por uno nuevo. El sol y el viento del oeste de Texas son duros con las tejas.'],
      alt: 'Techo nuevo de tejas café bajo un cielo azul' },
    gotera: { n: ['LA GOTERA', 'the leak', 'la gotera'], t: ['Roof repair', 'Reparación de techos'],
      m: ['A brown stain on the ceiling or a drip after rain means water is getting in. Repair finds where, often a vent, flashing or worn spot, and fixes it.', 'Una mancha café en el techo interior o una gotera después de la lluvia significa que entra agua. La reparación encuentra por dónde, a menudo una ventila, un sellado o un punto desgastado, y lo arregla.'],
      alt: 'Fascia y base de techo podridas, encontradas bajo el techo viejo' },
    granizo: { n: ['EL GRANIZO', 'the hail', 'el granizo'], t: ['Insurance claim roof work', 'Trabajo de techo en reclamos de seguro'],
      m: ['Hail can damage a roof in ways that are hard to see from the ground. Triple A helps with roof work on insurance claims.', 'El granizo puede dañar un techo de maneras difíciles de ver desde el suelo. Triple A ayuda con el trabajo de techo en reclamos de seguro.'],
      alt: 'Línea de techo con tejas en luz gris (foto de archivo ilustrativa)' },
    teja: { n: ['LA TEJA', 'the shingle', 'la teja'], t: ['Roof repair', 'Reparación de techos'],
      m: ['Shingles overlap in rows to shed water. A lifted, cracked or missing shingle is where problems start, and a repair may be all it needs.', 'Las tejas se traslapan en hileras para soltar el agua. Una teja levantada, rota o faltante es donde empiezan los problemas, y a veces basta una reparación.'],
      alt: 'Valle de tejas en un techo' },
    viento: { n: ['EL VIENTO', 'the wind', 'el viento'], t: ['Roof repair', 'Reparación de techos'],
      m: ['Wind lifts shingle edges and loosens vents. A turbine vent, like this one, has to stay sealed into the roof around its base.', 'El viento levanta los bordes de las tejas y afloja las ventilas. Una ventila de turbina, como esta, debe quedar bien sellada al techo alrededor de su base.'],
      alt: 'Ventila de turbina café sobre tejas nuevas' },
    plano: { n: ['EL TECHO PLANO', 'the flat roof', 'el techo plano'], t: ['Flat and low-slope roofs', 'Techos planos y de poca pendiente'],
      m: ['Flat roofs shed water slowly, so the surface and seams matter. This one is being redone with roll roofing.', 'Los techos planos sueltan el agua despacio, así que la superficie y las uniones importan. Este se está rehaciendo con rollo de techar.'],
      alt: 'Techo plano en obra con rollo de techar y paquetes' }
  };

  var lang = 'en', current = null;
  var store = [];
  $$('[data-t]').forEach(function (el) { store.push({ el: el, en: el.innerHTML }); });
  var attrs = [];
  $$('[data-t-attr]').forEach(function (el) {
    el.getAttribute('data-t-attr').split(';').forEach(function (pair) {
      var p = pair.split(':'); if (p.length === 2) attrs.push({ el: el, a: p[0], key: p[1], en: el.getAttribute(p[0]) });
    });
  });
  var backImgs = $$('.carta-back img').map(function (im) { return { im: im, en: im.getAttribute('alt'), k: im.closest('.carta').getAttribute('data-card') }; });

  function renderReading() {
    var tt = $('#readTitle'), tx = $('#readText'), sv = $('#readSvc');
    if (!current) {
      var s = store.filter(function (x) { return x.el === tt || x.el === tx; });
      s.forEach(function (x) { x.el.innerHTML = lang === 'es' ? ES[x.el.getAttribute('data-t')] : x.en; });
      sv.textContent = ''; return;
    }
    var c = CARDS[current], i = lang === 'es' ? 1 : 0;
    tt.removeAttribute('data-t'); tx.removeAttribute('data-t');
    tt.textContent = lang === 'es' ? c.n[0] : c.n[0] + ' · ' + c.n[1];
    tx.textContent = c.m[i];
    sv.textContent = (lang === 'es' ? 'Servicio: ' : 'Service: ') + c.t[i];
  }

  function setLang(l) {
    lang = l;
    document.documentElement.setAttribute('lang', l);
    store.forEach(function (x) {
      var key = x.el.getAttribute('data-t');
      if (!key) return;
      x.el.innerHTML = (l === 'es' && ES[key] !== undefined) ? ES[key] : x.en;
    });
    attrs.forEach(function (x) { x.el.setAttribute(x.a, (l === 'es' && ES[x.key] !== undefined) ? ES[x.key] : x.en); });
    backImgs.forEach(function (b) { b.im.setAttribute('alt', l === 'es' ? CARDS[b.k].alt : b.en); });
    $$('.lang-btn').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === l ? 'true' : 'false'); });
    renderReading();
    try { localStorage.setItem('taLang', l); } catch (e) {}
  }
  $$('.lang-btn').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); }); });

  /* the tabla: tap a card to flip it */
  var btns = $$('.carta-btn');
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-pressed') === 'true';
      btns.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      if (open) { current = null; } else { b.setAttribute('aria-pressed', 'true'); current = b.closest('.carta').getAttribute('data-card'); }
      /* reading panel keys must come back when idle */
      if (!current) { $('#readTitle').setAttribute('data-t', 'read_idle_t'); $('#readText').setAttribute('data-t', 'read_idle'); }
      renderReading();
    });
  });

  /* bean checklist */
  var cards = $$('.bcard'), n = $('#beanN'), stamp = $('#lotStamp');
  cards.forEach(function (c) {
    c.addEventListener('click', function () {
      c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      var k = cards.filter(function (x) { return x.getAttribute('aria-pressed') === 'true'; }).length;
      n.textContent = k;
      var done = k === cards.length;
      stamp.innerHTML = done ? (lang === 'es' ? '¡Lotería!<small>Las cinco revisadas. Si algo se veía mal, llama a un techador.</small>' : '¡Lotería!<small>All five checked. If anything looked off, call a roofer.</small>') : '';
      stamp.classList.toggle('on', done);
    });
  });

  /* scroll progress: beans fill like a tabla being marked */
  var beans = $$('.beans i');
  function prog() {
    var h = document.documentElement.scrollHeight - innerHeight;
    var p = h > 0 ? scrollY / h : 0, k = Math.round(p * beans.length);
    beans.forEach(function (b, i) { b.classList.toggle('on', i < k); });
  }
  addEventListener('scroll', function () { requestAnimationFrame(prog); }, { passive: true });
  prog();

  try { var saved = localStorage.getItem('taLang'); if (saved === 'es') setLang('es'); } catch (e) {}
})();
