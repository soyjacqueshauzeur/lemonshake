/* Cliente compartido de MercadoPago (Checkout Pro — pago único del total).
   El backend resuelve los precios desde su catálogo; el navegador solo manda
   ids + cantidades. Incluye anti doble-clic e Idempotency-Key por carrito.

   Configuración:
     window.JH_CHECKOUT_BACKEND = 'https://<worker>'   // opcional
   Por defecto usa '/api' (mismo dominio o proxy al Worker). */
(function () {
  'use strict';

  var BACKEND = (window.JH_CHECKOUT_BACKEND || '/api').replace(/\/$/, '');
  var inFlight = false;

  /* Reutiliza una Idempotency-Key por carrito para evitar cobros duplicados. */
  function idemKey(payload) {
    var sig = (payload.area || '') + '|' + JSON.stringify(payload.items || []) + '|' + ((payload.payer && payload.payer.email) || '');
    var store = {};
    try { store = JSON.parse(sessionStorage.getItem('jh-ck-keys') || '{}') || {}; } catch (e) { store = {}; }
    if (!store[sig]) {
      store[sig] = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
      var keys = Object.keys(store);
      for (var i = 0; i < keys.length - 20; i++) delete store[keys[i]];
      try { sessionStorage.setItem('jh-ck-keys', JSON.stringify(store)); } catch (e) {}
    }
    return store[sig];
  }

  function go(opts) {
    opts = opts || {};
    if (!opts.area || !Array.isArray(opts.items) || !opts.items.length) {
      return Promise.reject(new Error('Falta el área o los productos.'));
    }
    if (inFlight) return Promise.reject(new Error('Ya hay un pago en curso.'));

    var button = opts.button || null;
    inFlight = true;
    if (button) button.disabled = true;

    var key = idemKey(opts);
    var restore = function () { inFlight = false; if (button) button.disabled = false; };

    return fetch(BACKEND + '/crear-preferencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Idempotency-Key': key },
      body: JSON.stringify({
        area: opts.area,
        items: opts.items,
        payer: opts.payer || {},
        back: opts.back,
        backFail: opts.backFail,
        idempotencyKey: key
      })
    })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (r) {
        if (!r || !r.ok || !r.init_point) {
          restore();
          throw new Error((r && r.error) || 'No se pudo iniciar el pago.');
        }

        /* Red de seguridad: nunca cobrar un total distinto al mostrado. */
        if (opts.expectedTotal != null && r.total != null && Number(r.total) !== Number(opts.expectedTotal)) {
          restore();
          throw new Error('El precio cambió. Actualiza la página antes de pagar.');
        }

        window.location.assign(r.init_point);
        return r;
      })
      .catch(function (err) {
        restore();
        throw err;
      });
  }

  /* Carga perezosa para páginas que no incluyen este archivo. */
  function load(cb) {
    if (window.JH_CHECKOUT) { if (cb) cb(window.JH_CHECKOUT); return; }
    var s = document.createElement('script');
    s.src = '/assets/js/checkout.js';
    s.onload = function () { if (cb) cb(window.JH_CHECKOUT); };
    s.onerror = function () { if (cb) cb(null); };
    document.head.appendChild(s);
  }

  window.JH_CHECKOUT = {
    pay: function (opts) { return go(opts); },
    load: load,
    backend: BACKEND
  };
})();
