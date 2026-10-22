// ================= CONFIGURACIÓN =================
// Webhook de Google Apps Script que registra las solicitudes.
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyZ4sfK_BZ5lhi7bZgjR8UomgQwmeogWNP95ASUJFRQ84VLHOF4z1eMJtOZ67i7U7WkWw/exec';

// WhatsApp de Lemon Shake (código país + número, solo dígitos)
const WHATSAPP_NUMBER = '573507402009';

const PAQUETES = {
    esencial: { nombre: 'Esencial · 1 género', precio: 29900, usd: '7,50' },
    duo: { nombre: 'Dúo · 2 géneros', precio: 39900, usd: '9,90' },
    trio: { nombre: 'Trío · 3 géneros', precio: 49900, usd: '12,50' }
};
// ===================================================

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('songForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const paqueteKey = formData.get('paquete') || 'esencial';
        const paquete = PAQUETES[paqueteKey] || PAQUETES.esencial;

        const data = {
            nombre: formData.get('nombre'),
            whatsapp: formData.get('whatsapp'),
            mensaje: formData.get('mensaje'),
            genero: formData.get('genero'),
            idioma: formData.get('idioma'),
            voz: formData.get('voz'),
            paquete: paqueteKey,
            paqueteNombre: paquete.nombre,
            precio: paquete.precio,
            moneda: 'COP',
            timestamp: new Date().toISOString()
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = 'ENVIANDO...';
        submitBtn.disabled = true;

        // 1. Registro en Google (fire and forget)
        fetch(WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(err => console.error('Error enviando a Google:', err));

        // 2. Eventos de analítica
        if (window.dataLayer) {
            window.dataLayer.push({
                event: 'solicitud_cancion',
                paquete: paqueteKey,
                valor: paquete.precio,
                moneda: 'COP'
            });
        }
        if (window.ttq) {
            try { ttq.track('SubmitForm', { contents: [{ content_id: 'cancion-' + paqueteKey, content_name: paquete.nombre }], value: paquete.precio, currency: 'COP' }); } catch (err) {}
        }

        // 3. WhatsApp con el resumen
        const messageText = `*Nueva solicitud de canción — Lemon Shake*\n\n` +
            `👤 *Para:* ${data.nombre}\n` +
            `📱 *WhatsApp:* ${data.whatsapp}\n` +
            `💌 *Mensaje:* ${data.mensaje}\n` +
            `🎵 *Género:* ${data.genero}\n` +
            `🌐 *Idioma:* ${data.idioma}\n` +
            `🎤 *Voz:* ${data.voz}\n` +
            `📦 *Paquete:* ${paquete.nombre}\n` +
            `💰 *Total:* $${paquete.precio.toLocaleString('es-CO')} COP (aprox. USD $${paquete.usd})`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageText)}`;
        window.open(whatsappUrl, '_blank');

        submitBtn.innerHTML = '✅ ENVIADO';
        setTimeout(function () {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            form.reset();
        }, 3000);
    });
});
