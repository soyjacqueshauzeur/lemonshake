/*
 * Statcounter — carga centralizada.
 *
 * Uso: incluir antes de la etiqueta </body> de cada página que se quiera medir.
 *
 *   <script src="/analytics/statcounter.js" async></script>
 *
 * El respaldo para navegadores sin JavaScript está en
 * analytics/statcounter-noscript.html.
 */
(function (w, d) {
  'use strict';

  var SC_PROJECT = 13360825;
  var SC_SECURITY = 'bc639320';

  if (w.__statcounterLoaded) return; // evita cargarlo dos veces
  w.__statcounterLoaded = true;

  w.sc_project = SC_PROJECT;
  w.sc_invisible = 1;
  w.sc_security = SC_SECURITY;

  var counterScript = d.createElement('script');
  counterScript.async = true;
  counterScript.src = 'https://www.statcounter.com/counter/counter.js';

  (d.head || d.body).appendChild(counterScript);
})(window, document);
