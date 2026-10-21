/*
 * Tarjeta de producto completamente clickeable.
 *
 * Toda la tarjeta (.store-card) lleva al producto, no solo la imagen:
 * el título, el precio, el autor y el espacio vacío también.
 *
 * No duplica el evento de TikTok: cuando el clic ocurre fuera del enlace,
 * se dispara el clic del .store-pin real, que ya está instrumentado por
 * analytics/tiktok-products.js.
 *
 * Uso: <script src="store-card.js" defer></script> antes de </body>.
 */
(function () {
  'use strict';

  function abrirEnNuevaPestana(href) {
    window.open(href, '_blank', 'noopener');
  }

  var downX = 0;
  var downY = 0;
  var arrastrando = false;

  document.addEventListener('mousedown', function (e) {
    downX = e.clientX;
    downY = e.clientY;
    arrastrando = false;
  });

  document.addEventListener('mousemove', function (e) {
    if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 8) arrastrando = true;
  });

  function tarjetaDe(e) {
    return e.target && e.target.closest ? e.target.closest('.store-card') : null;
  }

  function haySeleccionDentro(card) {
    var sel = window.getSelection ? window.getSelection() : null;
    if (!sel || sel.isCollapsed || !sel.rangeCount) return false;
    var rango = sel.getRangeAt(0);
    return card.contains(rango.commonAncestorContainer);
  }

  function clicEnTarjeta(e) {
    if (arrastrando) {
      arrastrando = false;
      return;
    }

    var card = tarjetaDe(e);
    if (!card) return;

    // Si el clic ya cayó en un enlace o control, el navegador se encarga.
    if (e.target.closest('a,button,input,select,textarea,label')) return;

    // No navegar mientras se selecciona texto (título, precio, etc.).
    if (haySeleccionDentro(card)) return;

    var pin = card.querySelector('.store-pin');
    if (!pin || !pin.href) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      abrirEnNuevaPestana(pin.href);
      return;
    }

    // Dispara el enlace real: navega y deja correr el evento de TikTok.
    pin.click();
  }

  document.addEventListener('click', clicEnTarjeta);

  // Clic con la rueda del ratón: abre en pestaña nueva como un enlace normal.
  document.addEventListener('auxclick', function (e) {
    if (e.button !== 1) return;
    var card = tarjetaDe(e);
    if (!card || e.target.closest('a,button,input,select,textarea,label')) return;
    var pin = card.querySelector('.store-pin');
    if (pin && pin.href) {
      e.preventDefault();
      abrirEnNuevaPestana(pin.href);
    }
  });
})();
