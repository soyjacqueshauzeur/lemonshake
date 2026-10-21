# Lemon Shake

**Tienda online de productos y cursos digitales.** Compra fácil, como un batido de limón.

Sitio estático construido con **HTML, CSS y JavaScript vanilla**: sin frameworks ni build. Las páginas comparten fuentes, estilos base y el código de analítica, y funcionan en cualquier hosting estático.

---

## Stack

- **HTML5** semántico, un solo `lang="es"`.
- **CSS** a medida con variables (tokens de color, tipografía y espaciado).
- **JavaScript** sin librerías: carrito, resumen del pedido, acordeones, menús y animaciones.
- **Tema claro / oscuro** persistido en `localStorage` (`jh-theme`).
- **Datos estructurados** JSON-LD (`Product`, `Offer`, `FAQPage`) en las landings.
- **Diseño responsive** y navegación por teclado, con foco visible y `skip-link`.
- **Imágenes en AVIF/WebP** y video solo donde aporta.

## Estructura

```text
.
├── index.html                 # tienda y catálogo
├── cursos/                    # cursos vendidos en Hotmart
│   ├── jardin-vertical/
│   ├── sushi-founder/
│   └── velas-y-jabones-artesanales/
├── digitales/                 # productos digitales propios
│   ├── el-contador-de-ovejas/
│   └── ruso/
├── productos/                 # productos físicos
│   └── synaptic-sleep-5-z/
├── assets/                    # CSS, fuentes y JS compartidos
├── analytics/                 # GTM, TikTok y Statcounter
├── pictures/                  # logos y marca
├── payments/                  # logos de medios de pago
├── copy-badge.js              # copiar el badge de producto al portapapeles
├── variantes.js               # limón del footer + modal con las versiones de cada landing
├── sitemap.xml                # mapa del sitio para Google
├── robots.txt                 # permite el rastreo y apunta al sitemap
├── terminos.html              # páginas legales
├── privacidad.html
├── cookies.html
├── envios.html
├── devoluciones.html
└── AGENTS.md                  # convenciones de trabajo del repo
```

Cada landing incluye su `index.html`, sus imágenes y, cuando tiene checkout propio, `gracias.html` y `pago-fallido.html`.

## Variantes de landing

Cada landing puede tener varias versiones del mismo producto o curso, una por
ángulo de venta (`general.html`, `negocio.html`, `relax.html`…). Las versiones
no se enlazan en el menú: se llega a ellas desde el anuncio correspondiente.

En el footer, al final de la frase de marca, aparece un limón clickeable. Abre
un modal con las versiones de esa página, marca la actual y permite **abrir** o
**copiar** la URL limpia de cada una. Si la página no tiene versiones, el limón
no se muestra.

Para agregar versiones:

1. Copia el `index.html` de la carpeta con el nuevo nombre (`dolor.html`…).
2. Ajusta el copy, las imágenes y el `<title>` de esa copia.
3. Deja el `canonical` apuntando a su propia URL y **sin** `noindex`.
4. Añade su línea en `variantes.js`, dentro del grupo de esa carpeta.
5. Súmala a `sitemap.xml` para que Google la descubra aunque no haya enlaces.

Todas las landings incluyen `<script src="../../variantes.js" defer></script>`
antes de `</body>`; el script no hace nada en las páginas sin versiones.

## Pagos

- Los **cursos** se compran en **Hotmart**; la landing solo enlaza al checkout.
- Los **productos** cierran el pedido por **WhatsApp**, con el resumen armado desde el navegador.
- El **backend de pagos** (MercadoPago, credenciales y catálogo de precios) no forma parte de este repositorio: vive en un servicio aparte y los tokens nunca se publican en el sitio.

## Convenciones

Los commits siguen el formato por web descrito en [`AGENTS.md`](AGENTS.md): un bloque por página, componentes con marcadores `+`, `-`, `/`, `*` y un resumen no técnico.

---

© Lemon Shake. El contenido, las marcas y las imágenes son de sus autores.
