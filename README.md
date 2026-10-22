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
├── store-card.js              # toda la tarjeta de la tienda abre el producto
├── tienda-mapa.js             # limón de la tienda: mapa del sitio con clave
├── variantes.js               # limón del footer + modal con las versiones de cada landing
├── sitemap.xml                # mapa del sitio para Google, con imágenes
├── robots.txt                 # permite el rastreo (incluidos bots de IA) y apunta al sitemap
├── llms.txt                   # resumen del catálogo para asistentes de IA
├── site.webmanifest           # iconos y datos de instalación
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

En el footer, al final de la frase de marca, aparece un limón clickeable. En las
landings pide la misma clave que la tienda y abre un modal con las versiones de
esa página, marca la actual y permite **abrir** o **copiar** la URL limpia de
cada una. Si la página no tiene versiones, el limón no se muestra. La clave se
comparte entre tienda y landings en la misma pestaña (`sessionStorage`, 24 h).

En la tienda (`index.html`) el limón pide una clave y, si coincide, abre el
**mapa completo del sitio**: todas las páginas agrupadas por producto, separadas
con una línea, cada una con su limón y su botón **Copiar**. Si la clave no
coincide, no se muestra nada. La clave se recuerda en `sessionStorage` durante
24 h o hasta cerrar la pestaña.

Para agregar versiones:

1. Copia el `index.html` de la carpeta con el nuevo nombre (`dolor.html`…).
2. Ajusta el copy, las imágenes y el `<title>` de esa copia.
3. Deja el `canonical` apuntando a su propia URL y **sin** `noindex`.
4. Añade su línea en `variantes.js`, dentro del grupo de esa carpeta.
5. Añádela también a `tienda-mapa.js` y a `sitemap.xml`.

Todas las landings incluyen `<script src="../../variantes.js" defer></script>`
antes de `</body>`; el script no hace nada en las páginas sin versiones. La
tienda incluye `tienda-mapa.js`.

## SEO y datos estructurados

Cada página indexable lleva un bloque `<!-- seo:start --> … <!-- seo:end -->`
en el `<head>` con:

- `canonical` absoluto y self-referencing, más `hreflang="es"` y `x-default`
  (preparado para añadir otros idiomas).
- `robots`, Open Graph y Twitter Cards con imagen 1200×630 propia.
- JSON-LD en un solo `@graph`: `OnlineStore` + `WebSite` (con `@id` estable en
  todas las páginas), nodo de página (`CollectionPage`, `ItemPage` o `WebPage`)
  y, según el caso, `Product` + `Offer`/`AggregateOffer`, `FAQPage` y
  `BreadcrumbList`.

Criterios:

- `Organization` es un `OnlineStore` con logo, `sameAs`, `contactPoint`,
  `areaServed` y medios de pago. No se declaran reseñas ni valoraciones que no
  se puedan verificar.
- Los cursos se marcan como `Product` + `Offer` (precio y disponibilidad), no
  como `Course`.
- `/cursos/` no lleva migas visibles ni `BreadcrumbList`, para no ofrecer
  salidas en el embudo. En `/productos/` y `/digitales/` el breadcrumb va solo
  en JSON-LD.
- `gracias.html` y `pago-fallido.html` llevan `noindex, nofollow` y quedan
  fuera del sitemap.
- `llms.txt` resume catálogo, precios y contacto para asistentes de IA, y
  `robots.txt` permite GPTBot, ClaudeBot, PerplexityBot y similares.
- Iconos en `pictures/icons/` (ICO, SVG, 32/192/512, apple-touch y maskable) y
  tarjetas Open Graph en `pictures/og/`.

Al añadir una landing: incluir su bloque SEO, crear su imagen OG, sumarla al
`sitemap.xml` y, si tiene versiones, a `variantes.js` y `tienda-mapa.js`.

## Pagos

- Los **cursos** se compran en **Hotmart**; la landing solo enlaza al checkout.
- Los **productos** cierran el pedido por **WhatsApp**, con el resumen armado desde el navegador.
- El **backend de pagos** (MercadoPago, credenciales y catálogo de precios) no forma parte de este repositorio: vive en un servicio aparte y los tokens nunca se publican en el sitio.

## Convenciones

Los commits siguen el formato por web descrito en [`AGENTS.md`](AGENTS.md): un bloque por página, componentes con marcadores `+`, `-`, `/`, `*` y un resumen no técnico.

---

© Lemon Shake. El contenido, las marcas y las imágenes son de sus autores.
