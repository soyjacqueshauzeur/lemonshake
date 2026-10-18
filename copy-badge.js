/* Copia el texto del badge de producto al hacer clic. */
(function () {
  function init() {
    var badge = document.querySelector('.product-badge');
    if (!badge) return;

    badge.style.cursor = 'pointer';
    badge.setAttribute('role', 'button');
    badge.setAttribute('tabindex', '0');
    badge.setAttribute('title', 'Copiar información del producto');
    badge.setAttribute('aria-label', 'Copiar información del producto');

    var toast = document.createElement('div');
    toast.id = 'copyToast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = 'Copiado';
    toast.style.cssText = [
      'position:fixed', 'left:50%', 'bottom:24px',
      'transform:translateX(-50%) translateY(10px)',
      'background:#0A0A0C', 'color:#F4F4F0',
      'border:1px solid rgba(244,244,240,.2)', 'border-radius:999px',
      'padding:10px 18px', 'font:600 12px/1 monospace',
      'letter-spacing:.06em', 'text-transform:uppercase',
      'opacity:0', 'pointer-events:none', 'z-index:9999',
      'transition:opacity .2s ease, transform .2s ease'
    ].join(';');
    document.body.appendChild(toast);

    var timer = null;
    function showToast() {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
      clearTimeout(timer);
      timer = setTimeout(function () {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
      }, 1600);
    }

    function fallbackCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand('copy'); showToast(); } catch (e) {}
      document.body.removeChild(ta);
    }

    function copyBadge() {
      var text = (badge.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(showToast).catch(function () {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    }

    badge.addEventListener('click', copyBadge);
    badge.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copyBadge();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
