/*
 * inventario.js — Disponibilidad de productos desde Google Sheets.
 *
 * Fuente: la hoja de inventario publicada como CSV
 * (Archivo > Compartir > Publicar en la web > CSV).
 *
 * Reglas (el padre es la llave):
 *   1. Padre SI  + hijo SI  -> se muestra
 *   2. Padre SI  + hijo NO  -> se oculta ese complemento
 *   3. Padre NO             -> página AGOTADO y sus hijos ocultos
 *   4. Sin padre + NO       -> página propia AGOTADO
 *   5. CSV caído            -> no se oculta nada (fallback al HTML)
 *
 * La web NO recalcula el umbral: solo obedece a la columna
 * disponibilidad_web. Si esa celda viene vacía, usa cantidad > 25.
 *
 * Uso:
 *   <body data-sku="2122714" data-uri="productos/synaptic-sleep-5-z/">
 *   <div class="t-addon" data-sku="1418543" data-padre="2122714" data-hijo>
 *   <article class="store-card" data-sku="2122714">
 *   <script src="inventario.js" defer></script>
 */
(function () {
  'use strict';

  var CSV_URL = (function () {
    try {
      var param = new URLSearchParams(window.location.search).get('inventario');
      if (param) return param;
    } catch (e) { /* entorno antiguo */ }
    return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSkn7moOONmVq4gCXG_PvL3EGXwdOLm8qGAQzuIkpLfiWTAj0hhi2RhbC5OVbm1drYk7eaO7ZA0OYAL/pub?output=csv';
  })();
  var DB_KEY = 'ls_inventario_v1';
  var MAX_HORAS = 6;
  var UMBRAL_RESPALDO = 25;

  var mapa = {};
  var listo = false;

  /* ============================================================
     1. Lectura de la hoja (CSV)
     ============================================================ */

  function leerCSV(texto) {
    var filas = [];
    var fila = [];
    var campo = '';
    var enComillas = false;
    var i;
    var c;

    for (i = 0; i < texto.length; i++) {
      c = texto[i];
      if (enComillas) {
        if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
        else if (c === '"') { enComillas = false; }
        else { campo += c; }
      } else if (c === '"') {
        enComillas = true;
      } else if (c === ',') {
        fila.push(campo); campo = '';
      } else if (c === '\n') {
        fila.push(campo); filas.push(fila); fila = []; campo = '';
      } else if (c !== '\r') {
        campo += c;
      }
    }
    if (campo !== '' || fila.length) { fila.push(campo); filas.push(fila); }

    if (filas.length < 2) return [];

    var cabecera = filas[0].map(function (h) {
      return String(h).replace(/^\uFEFF/, '').trim().toLowerCase();
    });

    return filas.slice(1).filter(function (f) {
      return f.join('').replace(/[,\s]/g, '') !== '';
    }).map(function (f) {
      var o = {};
      cabecera.forEach(function (h, k) { o[h] = String(f[k] == null ? '' : f[k]).trim(); });
      return o;
    });
  }

  function aId(v) {
    var s = String(v == null ? '' : v).trim();
    var m = s.match(/(\d+)\s*$/);
    if (m) return Number(m[1]);
    var n = parseInt(s, 10);
    return isNaN(n) ? null : n;
  }

  function aNumero(v) {
    var s = String(v == null ? '' : v).replace(/[^\d.-]/g, '');
    if (s === '') return null;
    var n = Number(s);
    return isNaN(n) ? null : n;
  }

  function aDisponible(v) {
    var s = String(v == null ? '' : v).trim().toUpperCase();
    if (s === 'NO' || s === '0' || s === 'FALSE' || s === 'AGOTADO') return false;
    if (s === 'SI' || s === 'SÍ' || s === '1' || s === 'TRUE') return true;
    return null;
  }

  function indexar(filas) {
    var m = {};
    filas.forEach(function (f) {
      var id = aId(f['producto id']);
      if (id === null) return;
      var padre = aId(f['producto_padre']);
      m[id] = {
        id: id,
        padre: padre || null,
        disponible: aDisponible(f['disponibilidad_web']),
        cantidad: aNumero(f['cantidad']),
        umbral: aNumero(f['umbral']),
        precioDropi: aNumero(f['precio_dropi']),
        precioSugerido: aNumero(f['precio_sugerido']),
        uri: f['uri'] || f['uir'] || ''  // la hoja puede usar "uir" por error de tipeo
      };
    });
    return m;
  }

  /* ============================================================
     2. Reglas
     ============================================================ */

  function datos(id) {
    return mapa[aId(id)] || null;
  }

  function esAgotado(id) {
    var p = datos(id);
    if (!p) return false;                       // sin fila: visible
    if (p.disponible === false) return true;
    if (p.disponible === true) return false;
    // Celda vacía: respaldo con el umbral de referencia.
    if (p.cantidad === null) return false;
    var u = p.umbral === null ? UMBRAL_RESPALDO : p.umbral;
    return p.cantidad <= u;
  }

  /* Un producto se muestra si él y su padre (si existe) tienen inventario. */
  function seMuestra(id) {
    var p = datos(id);
    if (!p) return true;
    if (esAgotado(p.id)) return false;
    if (p.padre && esAgotado(p.padre)) return false;
    return true;
  }

  function hijosDe(padreId) {
    var pid = aId(padreId);
    return Object.keys(mapa).map(function (k) { return mapa[k]; })
      .filter(function (p) { return p.padre === pid; });
  }

  /* ============================================================
     3. Aplicar al DOM
     ============================================================ */

  function ocultar(el, si) {
    if (!el) return;
    if (si) el.setAttribute('hidden', '');
    else el.removeAttribute('hidden');
  }

  function marcarJSONLD(estado) {
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    Array.prototype.forEach.call(scripts, function (s) {
      if (s.textContent.indexOf('"Product"') === -1) return;
      var json;
      try { json = JSON.parse(s.textContent); } catch (e) { return; }
      var nodos = json['@graph'] || [json];
      var cambio = false;
      nodos.forEach(function (n) {
        if (!n || n['@type'] !== 'Product') return;
        if (n.offers && typeof n.offers === 'object') {
          // AggregateOffer u Offer
          n.offers.availability = 'https://schema.org/' + estado;
          cambio = true;
        }
      });
      if (cambio) s.textContent = JSON.stringify(json);
    });
  }

  function limpiarCarrito() {
    try {
      var claves = [];
      for (var i = 0; i < localStorage.length; i++) claves.push(localStorage.key(i));
      claves.forEach(function (k) {
        if (/carrito|cart|checkout|compra/i.test(k) && /synaptic|5-z/i.test(localStorage.getItem(k) || '')) {
          localStorage.removeItem(k);
        }
      });
    } catch (e) { /* sin storage */ }
  }

  function aplicarPagina() {
    var body = document.body;
    var principal = body ? aId(body.getAttribute('data-sku')) : null;

    if (principal && esAgotado(principal)) {
      document.documentElement.setAttribute('data-producto-agotado', String(principal));

      Array.prototype.forEach.call(document.querySelectorAll('.t-purchase, .purchase-controls, .picker, [data-go-cta]'), function (el) {
        el.setAttribute('hidden', '');
        el.style.display = 'none';
      });

      var aviso = document.getElementById('tAgotado');
      if (aviso) {
        aviso.hidden = false;
        var wa = aviso.querySelector('[data-agotado-wa]');
        if (wa) {
          var sku = body.getAttribute('data-sku');
          wa.href = 'https://wa.me/573507402009?text=' + encodeURIComponent(
            'Hola, quiero que me avisen cuando vuelva a estar disponible (SKU: ' + sku + ').'
          );
        }
      }

      marcarJSONLD('OutOfStock');
      limpiarCarrito();
    }

    // Complementos y tarjetas marcadas con data-sku (+ data-hijo opcional).
    var nodos = document.querySelectorAll('[data-sku][data-hijo], .store-card[data-sku]');
    Array.prototype.forEach.call(nodos, function (n) {
      var id = aId(n.getAttribute('data-sku'));
      if (id === null) return;
      var mostrar = seMuestra(id);
      var esTarjeta = n.classList.contains('store-card');

      if (esTarjeta) {
        // La tarjeta no se oculta: queda gris con badge "Agotado".
        n.classList.toggle('is-agotado', !mostrar);
        n.setAttribute('aria-disabled', mostrar ? 'false' : 'true');
        n.setAttribute('data-disponible', mostrar ? 'SI' : 'NO');
        var pin = n.querySelector('.store-pin');
        if (pin) {
          if (mostrar) { pin.removeAttribute('aria-disabled'); pin.style.pointerEvents = ''; }
          else { pin.setAttribute('aria-disabled', 'true'); pin.style.pointerEvents = 'none'; }
        }
        var badge = n.querySelector('.store-badge--agotado');
        if (badge) badge.hidden = mostrar;
      } else {
        // Complemento: se oculta sin dejar hueco.
        n.style.display = mostrar ? '' : 'none';
        if (mostrar) n.removeAttribute('hidden');
        else n.setAttribute('hidden', '');
      }
    });

    // Si no queda ningún complemento visible, se colapsa toda la sección.
    var lista = document.getElementById('addonList');
    if (lista) {
      var hijosMarcados = lista.querySelectorAll('[data-sku][data-hijo]');
      if (hijosMarcados.length) {
        var visibles = 0;
        Array.prototype.forEach.call(hijosMarcados, function (n) {
          if (n.style.display !== 'none') visibles++;
        });
        var seccion = document.getElementById('complementos');
        ocultar(seccion, visibles === 0);
        var contador = document.querySelector('.crosssell-count');
        if (contador) contador.textContent = visibles + (visibles === 1 ? ' producto' : ' productos');
        var todos = document.getElementById('tAddonAll');
        if (todos) ocultar(todos.closest('label') || todos, visibles === 0);
      }
    }
  }

  /* ============================================================
     4. Caché de 6 h + arranque
     ============================================================ */

  function leerCache() {
    try {
      var g = JSON.parse(localStorage.getItem(DB_KEY) || 'null');
      if (!g || !g.t || !g.mapa) return null;
      if ((Date.now() - g.t) / 36e5 > MAX_HORAS) return null;
      return g.mapa;
    } catch (e) { return null; }
  }

  function guardarCache(m) {
    try { localStorage.setItem(DB_KEY, JSON.stringify({ t: Date.now(), mapa: m })); } catch (e) { /* cuota */ }
  }

  function anunciar(fuente) {
    listo = true;
    try {
      document.dispatchEvent(new CustomEvent('lemonshake:listo', { detail: { fuente: fuente } }));
    } catch (e) {
      var ev = document.createEvent('Event');
      ev.initEvent('lemonshake:listo', true, true);
      document.dispatchEvent(ev);
    }
  }

  function iniciar() {
    var cache = leerCache();
    if (cache) { mapa = cache; aplicarPagina(); }

    fetch(CSV_URL, { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function (texto) {
        var nuevo = indexar(leerCSV(texto));
        if (!Object.keys(nuevo).length) throw new Error('CSV sin filas válidas');
        mapa = nuevo;
        guardarCache(nuevo);
        aplicarPagina();
        anunciar('red');
      })
      .catch(function (e) {
        if (!cache) {
          // Fallback total: el HTML manda. Nada se oculta.
          mapa = {};
          aplicarPagina();
          console.warn('[inventario] sin datos, todo visible:', e.message);
        }
        anunciar(cache ? 'cache' : 'ninguno');
      });
  }

  function arrancar() {
    iniciar();
    // Algunos scripts de la página construyen el DOM después (defer);
    // reaplicamos cuando todo terminó de cargar.
    window.addEventListener('load', function () {
      if (listo) aplicarPagina();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }

  window.LemmonShake = {
    datos: datos,
    esAgotado: esAgotado,
    seMuestra: seMuestra,
    hijosDe: hijosDe,
    lista: function () { return mapa; },
    estaListo: function () { return listo; },
    refrescar: iniciar
  };
})();
