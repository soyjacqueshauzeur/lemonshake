# AGENTS.md — Lemon Shake

## Formato obligatorio de commits

Cada commit de este repositorio debe usar **un bloque por web**:

```text
web: <ruta>
  html: <cambios>
  css: <cambios>
  js: <cambios>
  img: <cambios>
  video: <cambios>
  resumen: <resumen no técnico>
```

Reglas:

- Un bloque por web; nunca mezclar varias páginas en un mismo bloque.
- Si el commit toca varias webs, repetir el bloque completo por separado.
- Listar solo los componentes modificados; omitir los que no cambian.
- `web` usa la ruta relativa desde la raíz del repo: `index`, `digitales/ruso/index`, `cursos/sushi-founder/index`, etc.
- El `resumen` siempre debe ser no técnico: explicar el resultado visible para el usuario, no los detalles del código.

## Marcadores de cambio

Dentro de cada componente, cada cambio se marca así:

- `+` agregar: `+imagen`, `+precios`
- `-` eliminar: `-imagen`, `-precios`
- `/` modificar: `/precios`
- `*` permanente: `*precios`

Ejemplo:

```text
web: index
  css: tarjetas blancas con borde, radio y sombra; logo del nav a 40px.
  resumen: La tienda muestra cada producto como una tarjeta independiente y la marca queda mejor proporcionada.

web: ruso/index
  html: badge de vendedor con logo del limón y nombre Jacques H.
  js: sincronización del logo con el tema claro/oscuro.
  resumen: La página de ruso ahora deja claro quién vende el curso y la marca se adapta al tema.
```
