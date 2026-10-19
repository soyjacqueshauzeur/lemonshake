# Analytics

Código de seguimiento del sitio.

- **Google Tag Manager** va pegado inline en cada página, con el snippet oficial.
- **Statcounter** se centraliza en esta carpeta con un archivo JS que importan todas las páginas.

| Archivo | Para qué sirve |
| --- | --- |
| `statcounter.js` | Carga el contador de Statcounter. Se incluye antes de `</body>`. |
| `statcounter-noscript.html` | Respaldo de Statcounter para navegadores sin JavaScript. Se pega antes de `</body>`. |

Cuenta de Statcounter: proyecto **13360825**.

## Google Tag Manager

Contenedor: **GTM-5CCPPRGS**. Va inline, no como archivo externo, porque así lo
espera la verificación de GTM y evita fallos de carga por rutas o caché.

**1. En el `<head>`**, lo más arriba posible:

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5CCPPRGS');</script>
<!-- End Google Tag Manager -->
```

**2. Justo después de abrir `<body>`**:

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5CCPPRGS"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

Todas las páginas del repo ya lo tienen. Si agregas una página nueva, copia los dos bloques tal cual.

## Statcounter

**1. Antes de `</body>`**, importa el script:

```html
<script src="../analytics/statcounter.js" async></script>
```

**2. El respaldo sin JavaScript** va justo después:

```html
<noscript><div class="statcounter"><a title="Web Analytics"
href="https://statcounter.com/" target="_blank" rel="noopener"><img
class="statcounter"
src="https://c.statcounter.com/13360825/0/bc639320/1/"
alt="Web Analytics"
referrerpolicy="no-referrer-when-downgrade"></a></div></noscript>
```

En la raíz del sitio la ruta es `analytics/statcounter.js`; en las landings,
`../analytics/statcounter.js`.

## Cambiar de cuenta

- **GTM**: reemplaza `GTM-5CCPPRGS` en los dos bloques de arriba, en cada página.
- **Statcounter**: edita `SC_PROJECT` y `SC_SECURITY` en `statcounter.js`, y el `src` del iframe en `statcounter-noscript.html`.

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
