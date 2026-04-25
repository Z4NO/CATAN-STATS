# DEV NOTES — Catan Stats

Decisiones técnicas y cosas a tener en cuenta durante el desarrollo.

---

## Autenticación — httpOnly cookies

El token JWT viaja como cookie `httpOnly` (invisible para JavaScript, inmune a XSS).

**Flujo:**
1. `POST /users/token` → el backend setea la cookie automáticamente.
2. Axios envía la cookie en cada request gracias a `withCredentials: true` (`client.js`).
3. `POST /users/logout` → el backend borra la cookie.

**⚠ Producción con dominios distintos (frontend ≠ backend):**

Si el frontend está en Vercel y el API en otro dominio, las cookies `SameSite=lax` **no se envían** en requests POST cross-site.

Soluciones (elegir una):
- **Opción A (recomendada):** Hacer proxy del API desde el mismo dominio del frontend (e.g., en `vite.config.js` en dev, o un rewrite en Vercel en prod).
- **Opción B:** Cambiar a `SameSite=none` + `Secure=True` en `routes/user.py`. Requiere HTTPS obligatorio.

---

## Debugging en Vite / React

Antes de pedir ayuda, abrir **F12 → Console** en el navegador.

- **Página en blanco:** casi siempre es un `ReferenceError` o error de render — el mensaje exacto aparece en Console.
- **API no responde:** revisar la pestaña **Network** — el request aparece ahí con su status code y respuesta.
- **Desarrollar siempre con `npm run dev`**, no con el build. En dev mode Vite muestra un overlay rojo con el error directamente en pantalla.

**Caso real (abril 2026):** `Step1Players` usaba `{maxPoints}` en JSX pero no lo recibía como prop → `ReferenceError` silencioso → pantalla en blanco. Solución: pasar `maxPoints` como prop.

---

## Expiración del token

- Configurada en `.env` → `ACCESS_TOKEN_EXPIRE_MINUTES`.
- El valor actual es `7200` min (5 días). Ajustar según necesidad.
- `security.py::create_access_token` lo lee del config; no hardcodear.

---

## Base de datos

- **Dev:** PostgreSQL en Neon (misma DB que prod, cuidado con datos de prueba).
- **Migraciones:** siempre con Alembic. Nunca modificar el schema a mano.
- **Seed de rulesets:** ya ejecutado — 4 expansiones en la tabla `ruleset`.

---
