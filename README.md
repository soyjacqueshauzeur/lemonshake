# Lemon Shake

**Tienda online de productos y cursos digitales.** Compra fácil, como un batido de limón.

Sitio estático construido con **HTML, CSS y JavaScript vanilla**: sin frameworks, sin build y sin dependencias. Cada página es autocontenida y está pensada para cargar rápido, verse bien en móvil y funcionar en cualquier hosting estático.

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
├── ruso/                      # una carpeta por landing
│   ├── index.html
│   ├── gracias.html
│   ├── pago-fallido.html
│   └── images/
├── sushi-founder/
│   ├── index.html
│   ├── video/
│   └── ...
├── payments/                  # logos de medios de pago
├── copy-badge.js              # copiar el badge de producto al portapapeles
├── terminos.html              # páginas legales
├── privacidad.html
├── cookies.html
├── envios.html
├── devoluciones.html
└── AGENTS.md                  # convenciones de trabajo del repo
```

## Pagos

- Los **cursos** se compran en **Hotmart**; la landing solo enlaza al checkout.
- Los **productos** cierran el pedido por **WhatsApp**, con el resumen armado desde el navegador.
- El **backend de pagos** (MercadoPago, credenciales y catálogo de precios) no forma parte de este repositorio: vive en un servicio aparte y los tokens nunca se publican en el sitio.

## Convenciones

Los commits siguen el formato por web descrito en [`AGENTS.md`](AGENTS.md): un bloque por página, componentes con marcadores `+`, `-`, `/`, `*` y un resumen no técnico.

---

© Lemon Shake. El contenido, las marcas y las imágenes son de sus autores.
