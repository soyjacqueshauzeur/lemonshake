/* Configuración pública de pagos.
   Este archivo NO contiene secretos: solo la URL del Worker y las banderas. */
(function () {
  'use strict';

  window.JH_CHECKOUT_BACKEND = 'https://lemonshake-payments.lemonshake-payments.workers.dev';

  /* Se activa por área cuando el circuito esté probado. */
  window.JH_PAYMENTS_LIVE = {
    tienda: true,
    ruso: true,
    ovejas: true,
    canciones: false
  };

  /* Guarda las UTM de la URL para enviarlas con la orden. */
  try {
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    var params = new URLSearchParams(window.location.search);
    var utm = {};
    keys.forEach(function (k) {
      var v = params.get(k);
      if (v) utm[k] = v;
    });
    if (window.document.referrer) utm.referrer = window.document.referrer;
    if (Object.keys(utm).length) {
      sessionStorage.setItem('jh-utm', JSON.stringify(utm));
    }
  } catch (e) { /* sin UTM */ }
})();
