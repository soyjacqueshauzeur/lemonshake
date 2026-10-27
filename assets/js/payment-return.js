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

  var TITLES = {
    approved: '¡Pago aprobado!',
    pending: 'Estamos confirmando tu pago',
    in_process: 'Estamos confirmando tu pago',
    authorized: 'Pago autorizado',
    rejected: 'No pudimos completar el pago',
    cancelled: 'Pago cancelado',
    refunded: 'Pago reembolsado',
    charged_back: 'Pago revertido por el banco',
    manual_review: 'Estamos revisando tu pago',
    preference_error: 'No pudimos iniciar el pago',
    created: 'Estamos verificando tu pago'
  };

  var SUBTITLES = {
    approved: 'Tu pago se acreditó. Te contactaremos por WhatsApp para coordinar la entrega.',
    pending: 'MercadoPago todavía no confirma el pago. Te avisaremos cuando se acredite.',
    in_process: 'MercadoPago está procesando el pago. Te avisaremos cuando se acredite.',
    authorized: 'El pago quedó autorizado. Estamos esperando la confirmación final.',
    rejected: 'El pago no se completó y no se hizo ningún cobro. Puedes intentarlo de nuevo.',
    cancelled: 'El pago fue cancelado y no se hizo ningún cobro.',
    refunded: 'El pago fue reembolsado. Si tienes dudas, escríbenos por WhatsApp.',
    charged_back: 'El banco revirtió el pago. Escríbenos por WhatsApp para revisarlo.',
    manual_review: 'Estamos revisando el pago manualmente. Te contactaremos por WhatsApp.',
    preference_error: 'No pudimos iniciar el pago. Escríbenos por WhatsApp y lo resolvemos.',
    created: 'Estamos verificando el estado del pago.'
  };

  var STEPS = {
    approved: {
      physical: [
        'Te escribimos por WhatsApp para confirmar tus datos.',
        'Preparamos tu pedido.',
        'Te compartimos la guía de seguimiento.'
      ],
      digital: [
        'Pago confirmado.',
        'Preparamos tu acceso.',
        'Te lo enviamos al correo en menos de 24 horas hábiles.'
      ]
    },
    pending: [
      'Estamos esperando la confirmación de MercadoPago.',
      'Te avisaremos por correo cuando se acredite.',
      'Después coordinamos la entrega.'
    ],
    in_process: [
      'Estamos esperando la confirmación de MercadoPago.',
      'Te avisaremos por correo cuando se acredite.',
      'Después coordinamos la entrega.'
    ],
    authorized: [
      'Estamos esperando la confirmación final de MercadoPago.',
      'Te avisaremos por correo cuando se acredite.',
      'Después coordinamos la entrega.'
    ],
    refunded: [
      'El pago fue reembolsado.',
      'Si tienes dudas, escríbenos por WhatsApp.'
    ],
    manual_review: [
      'Estamos revisando el pago manualmente.',
      'Te contactaremos por WhatsApp con el resultado.'
    ],
    created: [
      'Estamos verificando el estado del pago.',
      'Te avisaremos cuando tengamos una respuesta.'
    ],
    rejected: [],
    cancelled: []
  };

  function stepsFor(order, status) {
    if (status === 'approved') {
      return order.area === 'tienda' ? STEPS.approved.physical : STEPS.approved.digital;
    }
    return STEPS[status] || [];
  }

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

    var title = TITLES[status] || 'Estado de tu pedido';
    var subtitle = SUBTITLES[status] || 'Revisa el estado de tu pago.';
    if (status === 'approved' && order.area !== 'tienda') {
      subtitle = 'Tu pago se acreditó. Te enviaremos el acceso a este correo en menos de 24 horas hábiles.';
    }
    var titleEl = document.querySelector('[data-payment-title]');
    var subtitleEl = document.querySelector('[data-payment-subtitle]');
    if (titleEl) titleEl.textContent = title;
    if (subtitleEl) subtitleEl.textContent = subtitle;
    document.title = title + ' — Lemon Shake';

    var stepsEl = document.querySelector('[data-payment-steps]');
    if (stepsEl) {
      var steps = stepsFor(order, status);
      stepsEl.textContent = '';
      if (steps.length) {
        stepsEl.hidden = false;
        steps.forEach(function (text, i) {
          var li = document.createElement('li');
          li.textContent = (i + 1) + '. ' + text;
          stepsEl.appendChild(li);
        });
      } else {
        stepsEl.hidden = true;
      }
    }

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
