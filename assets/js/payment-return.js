/* Muestra el estado real de una orden en las páginas de resultado.
   Lee `order` y `token` de la URL (o de sessionStorage), consulta al Worker
   y actualiza los elementos con [data-payment-state]. */
(function () {
  'use strict';

  var BACKEND = (window.JH_CHECKOUT_BACKEND || '/api').replace(/\/$/, '');
  var params = new URLSearchParams(window.location.search);
  var orderId = params.get('order') || '';
  var token = params.get('token') || '';

  try {
    if (!orderId) orderId = sessionStorage.getItem('jh-order-id') || '';
    if (!token) token = sessionStorage.getItem('jh-order-token') || '';
  } catch (e) {}

  var stateEl = document.querySelector('[data-payment-state]');
  if (!stateEl || !orderId || !token) return;

  var tries = 0;
  var maxTries = 12;
  var stopped = false;

  var LABELS = {
    approved: '✅ Pago aprobado. Tu pedido quedó confirmado.',
    pending: '⏳ Estamos esperando la confirmación de MercadoPago.',
    in_process: '⏳ MercadoPago está procesando el pago.',
    authorized: '⏳ Pago autorizado, esperando confirmación.',
    rejected: '❌ El pago no se completó. Puedes intentarlo de nuevo.',
    cancelled: '❌ El pago fue cancelado.',
    refunded: '↩️ El pago fue reembolsado.',
    charged_back: '↩️ El pago fue revertido por el banco.',
    manual_review: '⚠️ Estamos revisando tu pago manualmente.',
    preference_error: '⚠️ No pudimos iniciar el pago. Escríbenos por WhatsApp.',
    created: '⏳ Estamos verificando tu pago.'
  };

  function money(n) {
    return '$' + Number(n || 0).toLocaleString('es-CO');
  }

  function setText(sel, value) {
    var el = document.querySelector(sel);
    if (el) el.textContent = value;
  }

  function paint(order) {
    var status = order.status || 'pending';
    stateEl.hidden = false;
    stateEl.textContent = LABELS[status] || '⏳ Estamos verificando tu pago.';
    stateEl.className = 'paynote show payment-state payment-state--' + status;

    setText('[data-payment-order]', order.id || orderId);
    setText('[data-payment-total]', money(order.total));
    setText('[data-payment-method]', order.paymentMethod || '—');
    setText('[data-payment-detail]', order.statusDetail || status);

    if (status === 'approved') {
      var key = 'jh-purchase-' + order.id;
      try {
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, '1');
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'purchase',
            transaction_id: order.id,
            value: order.total,
            currency: order.currency || 'COP'
          });
          if (window.ttq && typeof window.ttq.track === 'function') {
            window.ttq.track('CompletePayment', { value: order.total, currency: order.currency || 'COP' });
          }
        }
      } catch (e) {}
    }

    return status;
  }

  function fetchOrder() {
    return fetch(BACKEND + '/api/orders/' + encodeURIComponent(orderId) + '?token=' + encodeURIComponent(token))
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (r) {
        if (!r || !r.ok || !r.order) throw new Error((r && r.error) || 'No se pudo verificar el pago');
        return r.order;
      });
  }

  function tick() {
    if (stopped) return;
    tries++;
    fetchOrder()
      .then(function (order) {
        var status = paint(order);
        if (status === 'pending' || status === 'in_process' || status === 'authorized' || status === 'created') {
          if (tries < maxTries) setTimeout(tick, 5000);
        } else {
          stopped = true;
        }
      })
      .catch(function () {
        if (tries < maxTries) {
          setTimeout(tick, 5000);
        } else {
          stateEl.hidden = false;
          stateEl.textContent = 'No pudimos verificar el pago. Escríbenos por WhatsApp.';
          stateEl.className = 'paynote show payment-state payment-state--error';
        }
      });
  }

  try {
    var clean = window.location.pathname;
    window.history.replaceState({}, '', clean);
  } catch (e) {}

  tick();
})();
