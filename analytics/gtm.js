/*
 * Google Tag Manager — carga centralizada.
 *
 * Uso: incluir esta línea en el <head> de cada página que se quiera medir.
 *
 *   <script src="/analytics/gtm.js"></script>
 *
 * Debe ir sin `defer` ni `async` para que el evento de carga se registre
 * lo antes posible. El script de GTM que se inyecta sí es asíncrono.
 *
 * Para cambiar de contenedor, edita solo GTM_ID.
 * El <noscript> de respaldo está en analytics/gtm-noscript.html.
 */
(function (w, d) {
  'use strict';

  var GTM_ID = 'GTM-5CCPPRGS';

  if (!GTM_ID || GTM_ID.indexOf('GTM-') !== 0) return;
  if (w.__gtmLoaded) return; // evita cargarlo dos veces
  w.__gtmLoaded = true;

  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });

  var firstScript = d.getElementsByTagName('script')[0];
  var gtmScript = d.createElement('script');
  gtmScript.async = true;
  gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(GTM_ID);

  firstScript.parentNode.insertBefore(gtmScript, firstScript);
})(window, document);
