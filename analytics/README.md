# Analytics

Código de seguimiento compartido por todas las páginas del sitio: **Google Tag Manager** y **Statcounter**.

| Archivo | Para qué sirve |
| --- | --- |
| `gtm.js` | Carga el contenedor GTM. Se incluye en el `<head>`. |
| `gtm-noscript.html` | Respaldo de GTM para navegadores sin JavaScript. Se pega tras `<body>`. |
| `statcounter.js` | Carga el contador de Statcounter. Se incluye antes de `</body>`. |
| `statcounter-noscript.html` | Respaldo de Statcounter sin JavaScript. Se pega antes de `</body>`. |

Cuentas actuales:

- GTM: **GTM-5CCPPRGS**
- Statcounter: proyecto **13360825**

## Cómo activarlo en una página

**1. En el `<head>`**, lo antes posible:

```html
<script src="/analytics/gtm.js"></script>
```

**2. Justo después de `<body>`**, el respaldo de GTM:

```html
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5CCPPRGS"
height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>
```

**3. Antes de `</body>`**, Statcounter:

```html
<script src="/analytics/statcounter.js" async></script>
<noscript><div class="statcounter"><a title="Web Analytics"
href="https://statcounter.com/" target="_blank" rel="noopener"><img
class="statcounter"
src="https://c.statcounter.com/13360825/0/bc639320/1/"
alt="Web Analytics"
referrerpolicy="no-referrer-when-downgrade"></a></div></noscript>
```

No hay que repetir el snippet completo de cada herramienta: los archivos `.js` ya traen la configuración.

## La ruta de los scripts

`/analytics/gtm.js` y `/analytics/statcounter.js` funcionan si el sitio se publica
en la raíz de un dominio (por ejemplo `https://lemonshake.shop/`). Si se publica
como proyecto de GitHub Pages (`usuario.github.io/lemonshake/`), usa la ruta con
el prefijo:

```html
<script src="/lemonshake/analytics/gtm.js"></script>
```

O una ruta relativa desde cada página:

```html
<!-- index.html, en la raíz -->
<script src="analytics/gtm.js"></script>

<!-- ruso/index.html, una carpeta abajo -->
<script src="../analytics/gtm.js"></script>
```

En este repo ya están todas las páginas con rutas relativas, así funcionan en local y en el dominio.

## Cambiar de cuenta

- **GTM**: edita `GTM_ID` en `gtm.js` y el `id` del iframe en `gtm-noscript.html`.
- **Statcounter**: edita `SC_PROJECT` y `SC_SECURITY` en `statcounter.js`, y el `src` del iframe en `statcounter-noscript.html`.

Los valores deben coincidir en cada pareja.

## Eventos personalizados

El contenedor de GTM ya expone `window.dataLayer`. Para medir acciones propias:

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'compra_iniciada',
  producto: 'synaptic-sleep-5-z',
  valor: 84000,
  moneda: 'COP'
});
```

Después creas el trigger y la etiqueta correspondientes en la interfaz de GTM.

## Verificar que funciona

1. Abre la página y revisa que `window.dataLayer` exista en la consola.
2. En GTM, usa **Preview** con la URL de la página.
3. Instala **Tag Assistant** para confirmar que el contenedor `GTM-5CCPPRGS` carga una sola vez.
4. En Statcounter, revisa **Stats → Summary** o el estado del proyecto para confirmar que llegan visitas.
