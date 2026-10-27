/* Copia el texto del badge de producto y cualquier elemento [data-copy]. */
(function () {
  function init() {
    var badge = document.querySelector('.product-badge');
    var copyEls = Array.prototype.slice.call(document.querySelectorAll('[data-copy]'));
    if (!badge && !copyEls.length) return;

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

    function getText(el) {
      return ((el.getAttribute('data-copy') || el.textContent) || '').replace(/\s+/g, ' ').trim();
    }

    function copyFrom(el) {
      var text = getText(el);
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(showToast).catch(function () {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    }

    function bind(el, label) {
      el.style.cursor = 'pointer';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      if (!el.hasAttribute('title')) el.setAttribute('title', label);
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', label);
      el.addEventListener('click', function () { copyFrom(el); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          copyFrom(el);
        }
      });
    }

    if (badge) {
      bind(badge, 'Copiar información del producto');
    }

    copyEls.forEach(function (el) {
      bind(el, 'Copiar ' + getText(el));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
