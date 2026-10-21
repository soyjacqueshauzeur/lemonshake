# Meta Pixel — White Panda / Lemon Shake

Pixel: **359109475465261**. Va inline en el `<head>` de cada página, con el
snippet oficial de Meta. Dispara `PageView` al cargar.

```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '359109475465261');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=359109475465261&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
```

## Notas

- No cargar dos veces el pixel en la misma página: si el contenedor de GTM
  (`GTM-5CCPPRGS`) ya inyecta este mismo ID, usa solo una de las dos vías para
  no duplicar `PageView`.
- Eventos propios con `fbq('track', '...')`; por ejemplo, en `gracias.html`:

```js
fbq('track', 'Purchase', { value: 84000, currency: 'COP' });
```

- Para verificar: instala **Meta Pixel Helper** y confirma que
  `359109475465261` aparece una sola vez y que `PageView` se envía sin errores.
