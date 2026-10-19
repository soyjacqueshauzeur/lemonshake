# Analytics

Código de seguimiento de **Google Tag Manager** compartido por todas las páginas del sitio.

| Archivo | Para qué sirve |
| --- | --- |
| `gtm.js` | Carga el contenedor GTM. Se incluye en el `<head>`. |
| `gtm-noscript.html` | Respaldo para navegadores sin JavaScript. Se pega en el `<body>`. |

Contenedor actual: **GTM-5CCPPRGS**.

## Cómo activarlo en una página

**1. En el `<head>`**, lo antes posible:

```html
<script src="/analytics/gtm.js"></script>
```

**2. Justo después de `<body>`**, pega el contenido de `gtm-noscript.html`:

```html
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5CCPPRGS"
height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>
```

Eso es todo: no hay que repetir el snippet completo de GTM en cada página.

## La ruta del script

`/analytics/gtm.js` funciona si el sitio se publica en la raíz de un dominio
(por ejemplo `https://lemonshake.dev/`). Si se publica como proyecto de GitHub
Pages (`usuario.github.io/lemonshake/`), usa la ruta con el prefijo:

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

## Cambiar de contenedor

Edita `GTM_ID` en `gtm.js` y el `id` del iframe en `gtm-noscript.html`.
Los dos deben coincidir.

## Eventos personalizados

El contenedor ya expone `window.dataLayer`. Para medir acciones propias:

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
