# Inventario · disponibilidad de productos desde Google Sheets

La web decide si un producto se muestra o aparece como agotado leyendo una hoja
de Google publicada como CSV. El sync de la hoja lo hace Jacques por fuera; la
web **solo lee**.

> **Notas relacionadas:** [[documentation/README|Índice de documentación]] ·
> [[documentation/hotfix-global#F4 · Inventario y precio con una sola fuente|Pendientes de inventario (F4)]]

> **Este README se reconstruyó el 31 de octubre de 2026.** El original se perdió
> en un `git reset` junto con el resto de la reorganización de `documentation/`.

---

## 1. Piezas

| Pieza | Dónde | Qué hace |
|---|---|---|
| `inventario.js` | raíz del repo | Lee el CSV, aplica las reglas y modifica el HTML |
| Hoja de Google | publicada como CSV | Fuente de verdad del inventario |
| `data-sku` en el HTML | páginas de producto y portada | Le dice a `inventario.js` qué número de producto es cada bloque |

URL publicada:

```
https://docs.google.com/spreadsheets/d/e/2PACX-1vSkn7moOONmVq4gCXG_PvL3EGXwdOLm8qGAQzuIkpLfiWTAj0hhi2RhbC5OVbm1drYk7eaO7ZA0OYAL/pub?output=csv
```

---

## 2. Columnas de la hoja

```
valor_referencia | fecha | producto id | producto_padre | precio_dropi | precio_sugerido | cantidad | umbral | disponibilidad_web | uir | estado_validacion
```

- `valor_referencia`: el SKU tal como llega de Dropi (`SKU: SYNAPTICS-2122714`).
- `producto id`: solo el número final del SKU (`2122714`).
- `producto_padre`: el ID del producto principal cuando la fila es un complemento.
- `cantidad`: unidades disponibles en Dropi.
- `umbral`: unidades mínimas para considerarse disponible. Hoy 25.
- `disponibilidad_web`: `SI` o `NO`. La web **solo obedece a esta columna**.
- `uir`: dirección del producto dentro del sitio. La web acepta `uir` o `uri`.
- `estado_validacion`: `ok`, `uri_vacia`, `padre_no_existe`, `error_dropi`.

La web no recalcula el umbral: usa `disponibilidad_web`. Solo si esa celda viene
vacía aplica el respaldo `cantidad > 25`.

---

## 3. Reglas de visibilidad

El padre es la llave. Un complemento solo existe si su padre tiene inventario.

| Padre | Hijo | Resultado |
|---|---|---|
| `SI` | `SI` | Se muestra |
| `SI` | `NO` | Se oculta ese complemento |
| `NO` | cualquiera | Página del padre en AGOTADO y todos sus hijos ocultos |
| Sin padre | `NO` | Página propia en AGOTADO |
| CSV caído | — | No se oculta nada (manda el HTML) |

### Qué pasa cuando el principal está agotado

- Se oculta el botón de compra y el selector de cantidad.
- Aparece el bloque `#tAgotado` con el botón de WhatsApp (mensaje con el SKU).
- Se ocultan los complementos y la sección "Súmale algo a tu compra".
- El JSON-LD cambia `InStock` por `OutOfStock`.
- En la portada, la tarjeta queda gris con la etiqueta "Agotado".

---

## 4. Etiquetas que necesita cada página

### Página principal de un producto

```html
<body data-sku="2122714" data-uri="productos/synaptic-sleep-5-z/">
```

### Cada complemento

```html
<div class="t-addon" data-sku="1418543" data-padre="2122714"
     data-uri="productos/synaptic-sleep-5-z/#complementos" data-hijo>
```

### Tarjeta de la portada

```html
<article class="store-card" data-sku="2122714" ...>
  <span class="store-badge store-badge--agotado" hidden>Agotado</span>
</article>
```

### Bloque de aviso

```html
<section class="t-aviso-agotado" id="tAgotado" hidden>
  <p class="t-aviso-agotado__title">Producto agotado por el momento</p>
  <a data-agotado-wa href="https://wa.me/573507402009">Avísame cuando llegue</a>
</section>
```

### Script

```html
<script src="../../inventario.js?v=1" defer></script>
```

Los números de `data-sku` deben coincidir exactamente con la columna
`producto id` de la hoja. Si no coinciden, la página no encuentra su fila y
se queda como está.

---

## 5. Cómo agregar un producto nuevo

1. Copia el HTML de un producto existente a `productos/<slug>/index.html`.
2. Cambia el `<body>` con su `data-sku` y su `data-uri`.
3. En cada complemento, pon `data-sku` del complemento y `data-padre` del principal.
4. Agrega las filas en la hoja con los mismos números.
5. Publica la hoja otra vez (los cambios tardan uno o dos minutos).

No hay que tocar `inventario.js`.

---

## 6. Caché y fallback

- La respuesta del CSV se guarda en `localStorage` durante 6 horas.
- Si la hoja falla pero hay caché de menos de 6 horas, se usa la caché.
- Si falla y no hay caché, no se oculta nada.
- `window.LemmonShake` expone `datos(id)`, `esAgotado(id)`, `seMuestra(id)`,
  `hijosDe(id)`, `lista()` y `refrescar()`.

> ⚠️ El espacio de nombres se llama **`LemmonShake`** (dos emes), igual en el
> código y en esta nota. Se mantiene así a propósito hasta que
> [[documentation/hotfix-global#F4 · Inventario y precio con una sola fuente|F4.1]]
> decida renombrarlo.

### Probar con otro CSV sin tocar código

```
productos/synaptic-sleep-5-z/index.html?inventario=/archivo-de-prueba.csv
```

---

## 7. Cómo verificar que funciona

1. Abrir la página del producto en una ventana de incógnito.
2. En la consola: `LemmonShake.datos(2122714)` debe devolver la fila de la hoja.
3. Cambiar `disponibilidad_web` a `NO` en la hoja, esperar a que se publique
   y recargar: la página cambia a agotado.
4. Bloquear la URL del CSV en la pestaña *Network* y recargar: nada se oculta.

---

## 8. Estado actual (31 de octubre de 2026)

- `inventario.js` existe en la raíz, pero **ninguna página lo carga todavía**:
  el `git reset` revirtió el marcado (`data-sku`, `#tAgotado`, el `<script>`).
  Hay que reponerlo en `productos/synaptic-sleep-5-z/index.html` e `index.html`.
- Los SKU reales de la hoja son `2122714` (padre) y `1418543`, `2214521`,
  `2104675` (complementos).
- El sync de Dropi a la hoja lo mantiene Jacques por fuera.
- `scripts-apps-script/dropi_sync.gs` está ignorado en git y **no se usa** en
  este flujo: la web solo lee el CSV publicado.
