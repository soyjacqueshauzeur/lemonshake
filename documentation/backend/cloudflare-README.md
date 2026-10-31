# Backend de pagos · Cloudflare Worker + MercadoPago

> **Notas relacionadas:** [[documentation/README|Índice de documentación]] ·
> [[documentation/hotfix-global#F1 · Cobros que no fallan|Cobros (F1)]] ·
> [[documentation/hotfix-global#F2 · Un solo libro de pedidos|Pedidos (F2)]] ·
> [[documentation/hotfix-global#F3 · Seguridad y postventa|Seguridad (F3)]]

> **Reconstruido el 31 de octubre de 2026** tras perderse el original en un
> `git reset`. Describe el Worker **real** que está en producción, no el borrador
> multi-área que documentaba la versión anterior.
>
> El código vive en `soy/server/cloudflare/` y **está fuera de git**.

---

## 1. Arquitectura

GitHub Pages solo sirve estáticos: no puede guardar secretos. El Worker crea la
preferencia de pago con el token secreto y devuelve el `init_point`; el
navegador nunca ve la credencial.

```
navegador → POST /api/orders → Worker → MercadoPago (preferencia)
                                   ↓
                              D1 (orden guardada)
                                   ↓
                          init_point → Checkout Pro
                                   ↓
                  webhook → D1 + Resend + Telegram + Google Sheets
```

## 2. Rutas

| Método | Ruta | Qué hace |
|---|---|---|
| `GET` | `/` · `/api/health` | health check |
| `GET` | `/catalogo` · `/api/catalogo[?area=]` | catálogo público |
| `POST` | `/api/orders` | crea la orden y la preferencia |
| `GET` | `/api/orders/:id?token=` | consulta el estado de una orden |
| `POST` | `/api/orders/:id/sync?token=` | reconcilia contra MercadoPago |
| `POST` | `/api/webhook/mercadopago` | notificaciones (responde 200 al instante) |

Alias heredados que siguen activos: `/crear-preferencia`,
`/api/crear-preferencia` y `/webhook/mercadopago`.

## 3. Áreas del catálogo (`catalog.json`)

| Área | Contenido | Precio |
|---|---|---|
| `tienda` | almohada 1–10 unidades + 3 complementos | COP, con promo día 15 / último día |
| `ruso` | `ruso-a1-a2` | 39.900 COP |
| `ovejas` | `contador-ovejas` | 35.000 COP |
| `canciones` | esencial / dúo / trío | 29.900 / 39.900 / 49.900 COP |

El precio **siempre** lo calcula el servidor. Los complementos de la tienda son
`cojin` (32.000), `masajeador` (64.500) y `gel` (48.500).

Las rutas de retorno son `/productos/synaptic-sleep-5-z/gracias.html` y
`/pago-fallido.html`, y las equivalentes en `digitales/`.

## 4. Base de datos (D1)

Binding `DB`, base `lemonshake_orders`. Tablas:

- `orders` — una fila por pedido, con totales, estado y datos de envío.
- `order_events` — historial de cada cambio.
- `webhook_events` — idempotencia de los avisos de MercadoPago.
- `idempotency_keys` — evita pedidos duplicados por doble clic.

El esquema está en `schema.sql`; hay un respaldo en
`backup-antes-de-limpieza-20261026.sql`.

## 5. Desplegar

```bash
cd soy/server/cloudflare
npm i -g wrangler && wrangler login
wrangler secret put MP_ACCESS_TOKEN
wrangler secret put MP_WEBHOOK_SECRET
wrangler secret put ADMIN_TOKEN
wrangler secret put ORDER_TOKEN_PEPPER
wrangler secret put RESEND_API_KEY
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_CHAT_ID
wrangler secret put SHEETS_WEBHOOK_URL
wrangler secret put SHEETS_WEBHOOK_SECRET
wrangler deploy
```

Las variables públicas (`ALLOWED_ORIGINS`, `PUBLIC_BASE_URL`, `EMAIL_FROM`,
`ENVIRONMENT`) van en `wrangler.toml`, no como secretos.

## 6. Conectar el frontend

`assets/js/payments-config.js` define la URL del Worker y las banderas por área:

```js
window.JH_CHECKOUT_BACKEND = 'https://<worker>';
window.JH_PAYMENTS_LIVE = { tienda: true, ruso: true, ovejas: true, canciones: false };
```

> ⚠️ **Verificar la URL.** El valor actual del archivo es
> `https://lemonshake-payments.lemonshake-payments.workers.dev`, con el nombre
> repetido. Si no coincide con el Worker desplegado, **todo cobro online falla**
> en tienda, Ruso y Ovejas. Es el punto F1.1 del HOTFIX.

## 7. Seguridad

- El `MP_ACCESS_TOKEN` **nunca** va en HTML, JS, repo ni `wrangler.toml`.
- El webhook valida la firma con `MP_WEBHOOK_SECRET` y, además, consulta el pago
  directamente con el token (defensa en profundidad).
- CORS con allowlist (`ALLOWED_ORIGINS`).
- Pendiente: rate limit, reembolsos con aviso, contracargos y recuperación
  automática con `/sync`. Ver
  [[documentation/hotfix-global#F3 · Seguridad y postventa|F3]].

## 8. Cómo probar

```bash
curl https://<worker>/api/health
curl "https://<worker>/api/catalogo?area=tienda"
curl -X POST https://<worker>/api/orders \
  -H 'Content-Type: application/json' -H 'X-Idempotency-Key: demo-1' \
  -d '{"area":"tienda","items":[{"id":"synaptic-sleep-5-z-1","qty":1}]}'
```

Después abre el `init_point` con un comprador de prueba de MercadoPago y paga
con las tarjetas `APRO`, `OTHE` o `CALL`.
