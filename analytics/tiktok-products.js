/*
 * Clic en "Ver producto" → evento de TikTok.
 *
 * Un solo listener cubre todas las tarjetas del catálogo: no hay que
 * configurar un evento por producto en TikTok Ads.
 *
 * Uso: incluir esta línea antes de </body> solo en la tienda (index.html).
 *
 *   <script src="analytics/tiktok-products.js" defer></script>
 *
 * Cada tarjeta debe tener data-id y data-name; data-price y data-currency
 * ya vienen del catálogo.
 */
(function (w, d) {
  'use strict';

  function onProductClick(e) {
    var link = e.target && e.target.closest ? e.target.closest('.store-pin') : null;
    if (!link) return;

    var card = link.closest('.store-card');
    if (!card) return;

    var currency = card.getAttribute('data-currency') || 'COP';
    var usd = parseFloat(card.getAttribute('data-price-usd'));
    var value = (currency === 'USD' && usd > 0)
      ? usd
      : (Number(card.getAttribute('data-price')) || 0);

    var payload = {
      content_id: card.getAttribute('data-id') || '',
      content_type: 'product',
      content_name: card.getAttribute('data-name') || '',
      value: value,
      currency: currency
    };

    // TikTok: clic en el botón del producto.
    if (w.ttq && typeof w.ttq.track === 'function') {
      w.ttq.track('ClickButton', payload);
    }

    // GTM / Meta: el mismo clic queda disponible como select_item.
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: 'select_item',
      ecommerce: {
        currency: payload.currency,
        value: payload.value,
        items: [{
          item_id: payload.content_id,
          item_name: payload.content_name,
          price: payload.value,
          quantity: 1
        }]
      }
    });
  }

  d.addEventListener('click', onProductClick);
})(window, document);
