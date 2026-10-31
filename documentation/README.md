# Documentación · Lemon Shake

Documentación interna del proyecto. Todo lo que no es `README.md` ni `AGENTS.md`
vive aquí, organizado por tema.

**Estos documentos no se publican en la web.**

> **Nota.** La reorganización de octubre se revirtió con un `git reset` el
> 31 de octubre y se perdió el índice anterior. Este archivo lo reconstruye con
> lo que sobrevivió. Varias notas siguen en sus rutas antiguas (`analytics/`,
> `cursos/`) porque nunca se versionaron en `documentation/`.

---

## Índice

### 🚨 Empezar aquí
- [[documentation/hotfix-global|HOTFIX GLOBAL]] — informe técnico + checklist de
  tareas por features, en orden de ejecución. Verificado contra el código el
  31 de octubre de 2026. *(interno, ignorado en git)*

### 📦 Producto
- [[documentation/inventario/README|Inventario]] — cómo la web lee Google Sheets
  para mostrar productos disponibles o agotados. **Pendiente de reescribir.**

### 📊 Medición
- [[analytics/README|Analytics]] — visión general del seguimiento (GTM, TikTok,
  Statcounter).
- [[analytics/meta-whitepanda-lemonshake|Meta Pixel]] — pixel `359109475465261`.
- [[documentation/analytics/statcounter|StatCounter y GTM]] — contador `13360825`.
  *(interno, ignorado en git)*

### 🎓 Cursos
- [[cursos/sushi-founder/avatares|Avatares de Sushi Founder]] — los tres
  compradores de `chef`, `regalo` y `negocio`.
- [[documentation/cursos/instrucciones|Instrucciones de `/cursos`]] — breadcrumb
  oculto y footer reducido. *(interno, ignorado en git)*

### 📣 Anuncios
Textos de campaña del curso de velas y jabones, cuatro ángulos del mismo producto:
- [[cursos/velas-y-jabones-artesanales/ADS/01-general_6e52d1fc|General / descubrimiento]]
- [[cursos/velas-y-jabones-artesanales/ADS/02-negocio_9ce190ff|Negocio / vender]]
- [[cursos/velas-y-jabones-artesanales/ADS/03-relax_8988beb8|Relax / un momento para ti]]
- [[cursos/velas-y-jabones-artesanales/ADS/04-hobby_217deac8|Hobby / pasatiempo creativo]]

### ⚙️ Operación
- [[documentation/operacion/informe|Informe de cambios]] — acta del 23 de octubre.
  *(interno, ignorado en git)*
- [[documentation/backend/cloudflare-README|Backend de pagos]] — Worker de
  Cloudflare, D1 y MercadoPago: rutas, despliegue y secretos.

### 🕸️ Grafo
- [[graphify-out/README|Grafo del proyecto]] — 431 nodos, 531 relaciones.
  Se regenera con `graphify update .`. *(ignorado en git)*

---

## Qué se perdió en el reset

| Archivo | Estado |
|---|---|
| `documentation/README.md` (índice anterior) | reconstruido aquí |
| `documentation/inventario/README.md` | reconstruido |
| `documentation/backend/cloudflare-README.md` | reconstruido |
| `documentation/pagos/PAYMENTS.md` y 4 más | eliminados el 31 oct; su contenido vive en el HOTFIX |

---

## Dónde vive lo que no es documentación

| Archivo | Para qué |
|---|---|
| `README.md` | Presentación pública del proyecto |
| `AGENTS.md` | Reglas para agentes de IA y formato de commits |
| `documentation/` | Todo lo demás |
| `graphify-out/` | Grafo navegable del repositorio |
