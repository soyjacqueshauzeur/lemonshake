/* Limón del footer de la tienda: mapa completo del sitio, protegido por clave.
 *
 * Solo se incluye en index.html. Al hacer clic pide una clave; si no coincide,
 * no pasa nada. Si coincide, abre un panel con todas las páginas y sus
 * variaciones, agrupadas por producto y separadas con una línea.
 */
(function () {
  'use strict';

  /* Clave: "Меня" (en escapes para no depender del charset del servidor). */
  var CLAVE = '\u041C\u0435\u043D\u044F';

  var GRUPOS = [
    {
      titulo: 'Tienda',
      ruta: '/',
      items: [{ nombre: 'Catálogo', archivo: '' }]
    },
    {
      titulo: 'Cursos · Velas y jabones',
      ruta: '/cursos/velas-y-jabones-artesanales/',
      items: [
        { nombre: 'Principal', archivo: '' },
        { nombre: 'General', archivo: 'general.html' },
        { nombre: 'Negocio', archivo: 'negocio.html' },
        { nombre: 'Relax', archivo: 'relax.html' },
        { nombre: 'Hobby', archivo: 'hobby.html' }
      ]
    },
    {
      titulo: 'Cursos · Sushi Founder',
      ruta: '/cursos/sushi-founder/',
      items: [
        { nombre: 'Principal', archivo: '' },
        { nombre: 'Chef', archivo: 'chef.html' },
        { nombre: 'Regalo', archivo: 'regalo.html' },
        { nombre: 'Negocio', archivo: 'negocio.html' }
      ]
    },
    {
      titulo: 'Digitales · Ruso',
      ruta: '/digitales/ruso/',
      items: [{ nombre: 'Principal', archivo: '' }]
    },
    {
      titulo: 'Digitales · El contador de ovejas',
      ruta: '/digitales/el-contador-de-ovejas/',
      items: [
        { nombre: 'Ficha de venta', archivo: '' },
        { nombre: 'Libro', archivo: 'elcontadordeovejas.html' },
        { nombre: 'Cuaderno de ejercicios', archivo: 'elcontadordeovejas-librodidactico.html' },
        { nombre: 'Recetas e infusiones', archivo: 'elcontadordeovejas-infusiones.html' }
      ]
    },
    {
      titulo: 'Productos · Synaptic Sleep 5-Z',
      ruta: '/productos/synaptic-sleep-5-z/',
      items: [{ nombre: 'Principal', archivo: '' }]
    },
    {
      titulo: 'Programas · Canciones personalizadas',
      ruta: '/programas/canciones/',
      items: [{ nombre: 'Principal', archivo: '' }]
    },
    {
      titulo: 'Legal',
      ruta: '/',
      items: [
        { nombre: 'Términos y condiciones', archivo: 'terminos.html' },
        { nombre: 'Privacidad', archivo: 'privacidad.html' },
        { nombre: 'Cookies', archivo: 'cookies.html' },
        { nombre: 'Envíos', archivo: 'envios.html' },
        { nombre: 'Devoluciones', archivo: 'devoluciones.html' }
      ]
    }
  ];

  function normalizar(ruta) {
    var p = String(ruta || '/').replace(/\/index\.html$/, '/');
    if (p.length > 1) p = p.replace(/\/+$/, '');
    return p || '/';
  }

  var actual = normalizar(location.pathname);

  var CSS = ''
    + '.lsv-lemon{background:none;border:0;padding:0 2px;margin:0;font:inherit;line-height:1;'
    + 'cursor:pointer;opacity:.9;transition:transform .18s ease,opacity .18s ease;vertical-align:-.08em}'
    + '.lsv-lemon:hover,.lsv-lemon:focus-visible{opacity:1;transform:scale(1.12)}'
    + '.lsv-lemon:focus-visible{outline:2px solid #D4FF3D;outline-offset:3px;border-radius:4px}'

    + '.lsv-modal{position:fixed;inset:0;z-index:9998;display:grid;place-items:center;padding:20px}'
    + '.lsv-modal[hidden]{display:none}'
    + '.lsv-backdrop{position:absolute;inset:0;background:rgba(5,5,7,.72);'
    + 'backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:lsvFade .18s ease both}'

    + '.lsv-panel{position:relative;width:100%;max-width:520px;background:#111114;color:#F4F4F0;'
    + 'border:1px solid rgba(244,244,240,.12);border-radius:18px;padding:26px 24px 22px;'
    + 'box-shadow:0 24px 60px rgba(0,0,0,.55);font-family:"Inter Tight",system-ui,sans-serif;'
    + 'animation:lsvIn .22s cubic-bezier(.2,.8,.3,1) both}'

    + '.lsv-close{position:absolute;top:14px;right:14px;width:32px;height:32px;display:grid;'
    + 'place-items:center;background:transparent;color:#C9C9C2;border:1px solid rgba(244,244,240,.14);'
    + 'border-radius:999px;font:400 18px/1 system-ui,sans-serif;cursor:pointer}'
    + '.lsv-close:hover{color:#F4F4F0;border-color:rgba(244,244,240,.3)}'
    + '.lsv-close:focus-visible{outline:2px solid #D4FF3D;outline-offset:2px}'

    + '.lsv-kicker{margin:0 0 6px;color:#D4FF3D;font-family:"Geist Mono",ui-monospace,monospace;'
    + 'font-size:.7rem;letter-spacing:.14em;text-transform:uppercase}'
    + '.lsv-title{margin:0 0 14px;font-size:1.25rem;font-weight:700;letter-spacing:-.01em;line-height:1.2}'

    + '.lsv-scroll{max-height:min(70vh,620px);overflow-y:auto;padding-right:6px;'
    + 'scrollbar-width:thin;scrollbar-color:rgba(244,244,240,.2) transparent}'
    + '.lsv-group{margin:0;padding:0}'
    + '.lsv-group-title{margin:0 0 8px;color:#D4FF3D;font-family:"Geist Mono",ui-monospace,monospace;'
    + 'font-size:.7rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase}'
    /* mismo sistema de tarjetas de la ficha de producto */
    + '.lsv-group{background:transparent;border:1px solid rgba(244,244,240,.12);border-radius:14px;'
    + 'padding:14px 12px 10px;margin:0 0 14px}'
    + '.lsv-hr{display:none}'
    + '.lsv-links{list-style:none;margin:0;padding:0;display:grid;gap:2px}'
    + '.lsv-links li{margin:0;padding:0}'
    + '.lsv-row{display:flex;align-items:center;gap:6px}'
    + '.lsv-links a,.lsv-links .lsv-actual{display:flex;align-items:center;gap:9px;flex:1;min-width:0;'
    + 'padding:8px 10px;border-radius:10px;color:#F4F4F0;text-decoration:none;font-size:.95rem}'
    + '.lsv-name{min-width:0}'
    + '.lsv-txt{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}'
    + '.lsv-ruta{display:block;color:#80807A;font-family:"Geist Mono",ui-monospace,monospace;'
    + 'font-size:.64rem;letter-spacing:.02em;word-break:break-all;line-height:1.25}'
    /* Botón Copiar: mismo borde y radio que las tarjetas */
    + '.lsv-copy{flex:0 0 auto;background:transparent;color:#C9C9C2;cursor:pointer;'
    + 'border:1px solid rgba(244,244,240,.12);border-radius:8px;padding:7px 12px;'
    + 'font-family:"Geist Mono",ui-monospace,monospace;font-size:.62rem;letter-spacing:.08em;'
    + 'text-transform:uppercase;transition:color .15s ease,border-color .15s ease,background .15s ease}'
    + '.lsv-copy:hover{color:#F4F4F0;border-color:rgba(244,244,240,.35)}'
    + '.lsv-copy:focus-visible{outline:2px solid #D4FF3D;outline-offset:2px}'
    + '.lsv-copy.is-done{color:#0A0A0C;background:#D4FF3D;border-color:#D4FF3D}'

    + '@keyframes lsvFade{from{opacity:0}to{opacity:1}}'
    + '@keyframes lsvIn{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}'

    + '@media(max-width:520px){'
    + '.lsv-modal{place-items:end center;padding:0}'
    + '.lsv-panel{max-width:none;border-radius:18px 18px 0 0;padding:26px 18px 24px;'
    + 'animation:lsvSheet .24s cubic-bezier(.2,.8,.3,1) both}'
    + '.lsv-scroll{max-height:72vh}'
    + '@keyframes lsvSheet{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}}}'
    + '@media(prefers-reduced-motion:reduce){.lsv-panel,.lsv-backdrop{animation:none}}';

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  var desc = document.querySelector('.sf-desc') || document.querySelector('.sf-brand');
  if (!desc) return;

  var lemon = document.createElement('button');
  lemon.type = 'button';
  lemon.className = 'lsv-lemon';
  lemon.textContent = '🍋';
  lemon.setAttribute('aria-label', 'Ver todas las páginas');
  lemon.setAttribute('title', 'Ver todas las páginas');
  desc.appendChild(document.createTextNode(' '));
  desc.appendChild(lemon);

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var bloques = GRUPOS.map(function (g) {
    var filas = g.items.map(function (it) {
      var ruta = g.ruta + it.archivo;
      if (ruta === '') ruta = '/';
      var ico = '<span class="lsv-ico" aria-hidden="true">\ud83c\udf4b</span>';
      var etiqueta = '<span class="lsv-txt"><span class="lsv-name">' + esc(it.nombre) + '</span>'
        + '<span class="lsv-ruta">' + esc(ruta) + '</span></span>';
      if (normalizar(ruta) === actual) {
        return '<li class="lsv-row"><span class="lsv-actual">' + ico + etiqueta
          + '<span class="lsv-badge">Actual</span></span></li>';
      }
      var absoluta = location.origin + ruta;
      return '<li class="lsv-row"><a href="' + esc(ruta) + '">' + ico + etiqueta + '</a>'
        + '<button class="lsv-copy" type="button" data-url="' + esc(absoluta) + '">Copiar</button></li>';
    }).join('');

    return '<div class="lsv-group"><h3 class="lsv-group-title">' + esc(g.titulo)
      + '</h3><ul class="lsv-links">' + filas + '</ul></div><hr class="lsv-hr" />';
  }).join('');

  var modal = document.createElement('div');
  modal.className = 'lsv-modal';
  modal.hidden = true;
  modal.innerHTML =
    '<div class="lsv-backdrop" data-close></div>'
    + '<div class="lsv-panel" role="dialog" aria-modal="true" aria-labelledby="lsv-title">'
    + '<button class="lsv-close" type="button" data-close aria-label="Cerrar">✕</button>'
    + '<p class="lsv-kicker">Lemon Shake</p>'
    + '<h2 class="lsv-title" id="lsv-title">Todas las páginas</h2>'
    + '<div class="lsv-scroll">' + bloques + '</div>'
    + '</div>';
  document.body.appendChild(modal);

  var panel = modal.querySelector('.lsv-panel');
  var closeBtn = modal.querySelector('.lsv-close');
  var abridor = null;

  function focusables() {
    return Array.prototype.filter.call(
      panel.querySelectorAll('a[href],button:not([disabled])'),
      function (el) { return el.offsetParent !== null; }
    );
  }

  function abrir() {
    abridor = document.activeElement;
    modal.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function cerrar() {
    modal.hidden = true;
    document.documentElement.style.overflow = '';
    if (abridor && abridor.focus) abridor.focus();
  }

  var STORAGE_KEY = 'lsv_map';
  var VIGENCIA = 864e5; /* 24 horas */

  function accesoVigente() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      var o = JSON.parse(raw);
      return !!o && typeof o.exp === 'number' && o.exp > Date.now();
    } catch (e) {
      return false;
    }
  }

  function guardarAcceso() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ exp: Date.now() + VIGENCIA }));
    } catch (e) {}
  }

  lemon.addEventListener('click', function () {
    if (accesoVigente()) {
      abrir();
      return;
    }

    var entrada = window.prompt('Clave');
    if (entrada === null || entrada !== CLAVE) return;

    guardarAcceso();
    abrir();
  });

  modal.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close')) cerrar();
  });

  /* Los enlaces se abren siempre en la misma pestaña. */
  modal.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('.lsv-links a') : null;
    if (!a) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    window.location.assign(a.href);
  });

  modal.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.lsv-copy') : null;
    if (!btn || btn.classList.contains('is-done')) return;
    var texto = btn.getAttribute('data-url');

    function marcar() {
      btn.textContent = 'Copiado';
      btn.classList.add('is-done');
      setTimeout(function () {
        btn.textContent = 'Copiar';
        btn.classList.remove('is-done');
      }, 1600);
    }

    function respaldo() {
      var ta = document.createElement('textarea');
      ta.value = texto;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); marcar(); } catch (err) {}
      document.body.removeChild(ta);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(marcar).catch(respaldo);
    } else {
      respaldo();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      cerrar();
      return;
    }

    if (e.key === 'Tab') {
      var f = focusables();
      if (!f.length) return;
      var primero = f[0];
      var ultimo = f[f.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }
  });
})();
