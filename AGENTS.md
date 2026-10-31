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

---

## Regla: commit pendiente de otro día

**Cuándo aplica.** Al abrir el proyecto, si se cumplen las dos condiciones:

1. Hay cambios sin commitear (`git status --porcelain` no está vacío).
2. El último commit es de **otro día** que hoy.

Es decir: ayer se trabajó, no se guardó, y hoy se retoma.

**Qué NO hacer.** Nunca hacer el commit automáticamente. Primero se avisa, se
pregunta y se espera respuesta.

**Procedimiento obligatorio**

**Paso 1 · Detectar.** Compara la fecha del último commit con la de hoy y mira si
hay trabajo pendiente:

```bash
last=$(git log -1 --format=%cd --date=short)
today=$(date +%F)
echo "último commit: $last · hoy: $today"
[ "$last" != "$today" ] && [ -n "$(git status --porcelain)" ] && echo "→ hay commit pendiente de otro día"
```

**Paso 2 · Inventariar** qué entraría, con los ignorados aparte:

```bash
git status --porcelain --untracked-files=all
```

**Paso 3 · Escanear secretos y material que no debe subir.** Este paso es el
motivo por el que existe la regla:

```bash
# Archivos sospechosos por nombre
git status --porcelain -uall | awk '{print $2}' | grep -Ei \
  '\.env|secret|credential|token|\.pem$|\.key$|\.p12$|\.sql$|backup|\.zip$|test|demo|playwright'

# Cadenas sospechosas en lo que se va a subir
git diff --cached -U0 2>/dev/null; git diff -U0
grep -rEn 'api[_-]?key|secret|token|password|passwd|APP_USR-|TEST-|sk_live|sk_test|AKIA|ghp_|AIza|xoxb-|BEGIN (RSA|OPENSSH|PRIVATE)' \
  $(git status --porcelain -uall | awk '{print $2}') 2>/dev/null

# Archivos grandes (> 1 MB) que no deberían versionarse
git status --porcelain -uall | awk '{print $2}' | while read f; do
  [ -f "$f" ] && s=$(stat -c%s "$f") && [ "$s" -gt 1048576 ] && echo "$((s/1024/1024)) MB  $f"
done
```

**Paso 4 · Preguntar.** Con los resultados del paso 3, pregunta **siempre**, aunque
el escaneo salga limpio:

- ¿Hay API keys, tokens, contraseñas o credenciales en lo pendiente?
- ¿Hay archivos de prueba, demos, backups o datos de clientes?
- ¿Hay algo que no deba quedar público en GitHub Pages?
- ¿Se hace el commit con todo, solo con parte, o se deja para después?

**Paso 5 · Actuar según la respuesta.**

- Si dice **sí, commitea**: formatea con la plantilla de arriba, `git add` de lo
  acordado y `git commit`. Pregunta aparte si quiere `push`.
- Si pide **excluir algo**: añádelo a `.gitignore` (si es un patrón) o déjalo
  fuera del `git add`. Repite el escaneo antes de confirmar.
- Si dice **no**: no commitees. Deja el árbol como está y anótalo.

**Paso 6 · Recordar.** El commit va con el formato obligatorio de este archivo y
con la fecha real del trabajo, no la de hoy si el contenido es de ayer.

### Ejemplo de la conversación

```text
Último commit: 2026-10-30 · Hoy: 2026-10-31
→ Hay 4 archivos sin commitear de ayer.

Antes de guardar, revisa esto:
  ⚠ src/config.js        → contiene `API_KEY = "sk_live_…"`
  ⚠ productos/demo/      → carpeta de pruebas, no debería publicarse
  ⚠ backup-ordenes.sql   → datos de clientes

¿Hay API keys, pruebas o credenciales que no deban subir?
¿Commiteo todo, solo parte, o lo dejamos para después?
```

