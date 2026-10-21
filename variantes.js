/* Limón del footer: abre un modal con las versiones (ángulos) de la página actual.
 * Si la página no está en el mapa, o el grupo tiene menos de dos versiones,
 * no se inyecta nada: el footer queda igual que siempre. */
(function () {
  'use strict';

  /* ── Configuración ────────────────────────────────────────────────
   * Una entrada por carpeta. La clave es la ruta de la carpeta y cada
   * versión apunta a un archivo dentro de esa misma carpeta.
   * Para agregar variantes: crea el .html y añade su línea aquí.
   * La primera versión suele ser la principal (index.html). */
  var GRUPOS = {
    '/cursos/velas-y-jabones-artesanales/': [
      { nombre: 'Principal', archivo: 'index.html',   nota: 'Página base' },
      { nombre: 'General',   archivo: 'general.html', nota: 'Descubrimiento' },
      { nombre: 'Negocio',   archivo: 'negocio.html', nota: 'Vender lo que creas' },
      { nombre: 'Relax',     archivo: 'relax.html',   nota: 'Un momento para ti' },
      { nombre: 'Hobby',     archivo: 'hobby.html',   nota: 'Pasatiempo creativo' }
    ]

    /* Ejemplo para el producto (descomenta cuando existan los archivos):
    '/productos/synaptic-sleep-5-z/': [
      { nombre: 'Principal',      archivo: 'index.html', nota: 'Página base' },
      { nombre: 'Dolor cervical', archivo: 'dolor.html', nota: 'Alivio' },
      { nombre: 'Regalo',         archivo: 'regalo.html', nota: 'Para regalar' }
    ],
    */
  };

  var dir = location.pathname.replace(/[^/]*$/, '');
  var archivoActual = location.pathname.slice(dir.length) || 'index.html';
  var items = GRUPOS[dir];
  if (!items || items.length < 2) return;

  var actual = null;
  for (var i = 0; i < items.length; i++) {
    if (items[i].archivo === archivoActual) actual = items[i];
  }
  if (!actual) return; // gracias.html, pago-fallido.html, etc.

  /* ── Estilos ─────────────────────────────────────────────────────── */
  var CSS = ''
    + '.lsv-lemon{background:none;border:0;padding:0 2px;margin:0;font:inherit;line-height:1;'
    + 'cursor:pointer;opacity:.9;transition:transform .18s ease,opacity .18s ease;vertical-align:-.08em}'
    + '.lsv-lemon:hover,.lsv-lemon:focus-visible{opacity:1;transform:scale(1.12)}'
    + '.lsv-lemon:focus-visible{outline:2px solid #D4FF3D;outline-offset:3px;border-radius:4px}'

    + '.lsv-modal{position:fixed;inset:0;z-index:9998;display:grid;place-items:center;padding:20px}'
    + '.lsv-modal[hidden]{display:none}'
    + '.lsv-backdrop{position:absolute;inset:0;background:rgba(5,5,7,.72);'
    + 'backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:lsvFade .18s ease both}'

    + '.lsv-panel{position:relative;width:100%;max-width:430px;background:#111114;color:#F4F4F0;'
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
    + '.lsv-title{margin:0 0 18px;font-size:1.25rem;font-weight:700;letter-spacing:-.01em;line-height:1.2}'

    + '.lsv-list{list-style:none;margin:0;padding:0;display:grid;gap:8px}'
    + '.lsv-item{display:flex;align-items:center;gap:10px;border:1px solid rgba(244,244,240,.09);'
    + 'border-radius:12px;padding:11px 12px;background:rgba(244,244,240,.02)}'
    + '.lsv-item.is-current{opacity:.55}'
    + '.lsv-link{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;'
    + 'text-decoration:none;color:#F4F4F0}'
    + '.lsv-link:hover .lsv-name{color:#D4FF3D}'
    + '.lsv-link:focus-visible{outline:2px solid #D4FF3D;outline-offset:3px;border-radius:6px}'
    + '.lsv-name{font-size:.98rem;font-weight:600}'
    + '.lsv-nota{color:#80807A;font-family:"Geist Mono",ui-monospace,monospace;'
    + 'font-size:.68rem;letter-spacing:.06em;text-transform:uppercase}'
    + '.lsv-badge{flex:1;color:#80807A;font-family:"Geist Mono",ui-monospace,monospace;'
    + 'font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;text-align:right;padding-right:4px}'

    + '.lsv-copy{flex:0 0 auto;background:transparent;color:#C9C9C2;cursor:pointer;'
    + 'border:1px solid rgba(244,244,240,.18);border-radius:999px;padding:7px 12px;'
    + 'font-family:"Geist Mono",ui-monospace,monospace;font-size:.66rem;letter-spacing:.08em;'
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
    + '@keyframes lsvSheet{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}}}'
    + '@media(prefers-reduced-motion:reduce){.lsv-panel,.lsv-backdrop{animation:none}}';

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  /* ── Limón en el footer ──────────────────────────────────────────── */
  var desc = document.querySelector('.sf-desc') || document.querySelector('.sf-brand');
  if (!desc) return;

  var lemon = document.createElement('button');
  lemon.type = 'button';
  lemon.className = 'lsv-lemon';
  lemon.textContent = '🍋';
  lemon.setAttribute('aria-haspopup', 'dialog');
  lemon.setAttribute('aria-label', 'Ver versiones de esta página');
  lemon.setAttribute('title', 'Versiones de esta página');
  desc.appendChild(document.createTextNode(' '));
  desc.appendChild(lemon);

  /* ── Modal ──────────────────────────────────────────────────────── */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var filas = items.map(function (it) {
    var esActual = it.archivo === actual.archivo;
    var rotulo = '<span class="lsv-name">' + esc(it.nombre) + '</span>'
      + (it.nota ? '<span class="lsv-nota">' + esc(it.nota) + '</span>' : '');

    if (esActual) {
      return '<li class="lsv-item is-current">' + rotulo
        + '<span class="lsv-badge">Actual</span></li>';
    }

    var url = new URL(it.archivo, location.href);
    var copiar = url.origin + url.pathname;
    var destino = it.archivo + location.search;
    return '<li class="lsv-item">'
      + '<a class="lsv-link" href="' + esc(destino) + '">' + rotulo + '</a>'
      + '<button class="lsv-copy" type="button" data-url="' + esc(copiar) + '">Copiar</button>'
      + '</li>';
  }).join('');

  var modal = document.createElement('div');
  modal.className = 'lsv-modal';
  modal.hidden = true;
  modal.innerHTML =
    '<div class="lsv-backdrop" data-close></div>'
    + '<div class="lsv-panel" role="dialog" aria-modal="true" aria-labelledby="lsv-title">'
    + '<button class="lsv-close" type="button" data-close aria-label="Cerrar">✕</button>'
    + '<p class="lsv-kicker">Lemon Shake</p>'
    + '<h2 class="lsv-title" id="lsv-title">Versiones de esta página</h2>'
    + '<ul class="lsv-list">' + filas + '</ul>'
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

  lemon.addEventListener('click', abrir);

  modal.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close')) cerrar();
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

  /* ── Copiar URL limpia (sin utm ni fbclid, lista para el anuncio) ── */
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
})();
