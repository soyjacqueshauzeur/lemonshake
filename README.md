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
├── terminos.html              # páginas legales
├── privacidad.html
├── cookies.html
├── envios.html
├── devoluciones.html
└── AGENTS.md                  # convenciones de trabajo del repo
```

Cada landing incluye su `index.html`, sus imágenes y, cuando tiene checkout propio, `gracias.html` y `pago-fallido.html`.

## Pagos

- Los **cursos** se compran en **Hotmart**; la landing solo enlaza al checkout.
- Los **productos** cierran el pedido por **WhatsApp**, con el resumen armado desde el navegador.
- El **backend de pagos** (MercadoPago, credenciales y catálogo de precios) no forma parte de este repositorio: vive en un servicio aparte y los tokens nunca se publican en el sitio.

## Convenciones

Los commits siguen el formato por web descrito en [`AGENTS.md`](AGENTS.md): un bloque por página, componentes con marcadores `+`, `-`, `/`, `*` y un resumen no técnico.

---

© Lemon Shake. El contenido, las marcas y las imágenes son de sus autores.
