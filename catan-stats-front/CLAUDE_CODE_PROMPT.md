## Stack acordado

- **Backend:** Python 3 + **FastAPI** + **SQLAlchemy** + **Pydantic** + **Alembic** (migraciones).
- **DB:** SQLite en desarrollo, PostgreSQL en producción. Configurable por variable de entorno.
- **Frontend MVP:** plantillas **Jinja2** servidas por FastAPI + HTML5 + CSS (Bootstrap o equivalente ligero) + JS mínimo. **Chart.js** para gráficos cuando llegue Fase 2.
- **Auth:** registro con email + contraseña hasheada (bcrypt). JWT o sesión de FastAPI.
- **Análisis:** Pandas para cálculos estadísticos no triviales.
- **Tests:** pytest para lógica crítica de stats.

## Diseño visual (incluido en el zip)

Los mockups React están en `CATAN-STATS MVP screens.html`. Dirección visual **única (Ledger)**:

- Paleta cálida tipo papel: `#f6f1e7` paper, `#fbf8f1` card, `#1c1a16` ink, acento terracotta `#b54a2a`, win green `#5a7a3a`.
- Tipografías: **Fraunces** (display, serif), **Inter** (texto), **JetBrains Mono** (números y labels).
- Tokens completos en `ledger-system.jsx` (objeto `L`).
- Componentes UI ya diseñados: `LFrame`, `LTopBar`, `LField`, `LButton`, `LChip`, `LStat`, `LAvatar`, `LSectionLabel`, `LTabBar`, `LStepButton`, `LResource`.

**No reinventes el sistema visual.** Traduce esos tokens a CSS variables y reutiliza los componentes 1:1 cuando portes a Jinja+CSS.

## Pantallas que ya están diseñadas (19)

**Fase 1 core (1-7):** Login, Home/Grupos, Crear grupo, Detalle grupo, Nueva partida wizard (paso 2), Detalle partida, Perfil de jugador.

**Fase 1-4 expandido (8-19):** Crear cuenta, Recuperar acceso, Unirse con código de invitación, Miembros del grupo (con roles), Estado vacío, Historial filtrable, Wizard nueva partida pasos 1/3/4, **Modo en juego (Fase 3, dark mode)**, Matchups head-to-head, **Dashboard desktop**.

Cada artboard del canvas mapea 1:1 a una ruta/vista que tienes que implementar.

## Modelo de datos (del PDF, sección "Modelo de Datos")

Implementa estas entidades con SQLAlchemy:

- **User** — `id, username, email, password_hash, display_name, created_at`.
- **Group** — `id, name, description, creator_id, invite_code, created_at`.
- **GroupMember** — `user_id, group_id, role (admin|moderator|member), joined_at`.
- **Ruleset** — `id, name, victory_points_required, max_players, has_longest_road, has_largest_army, has_metropolis`. Seed inicial: Base (10 pts, 4 jug), Navegantes (13 pts, 4 jug), Base 5-6 (10 pts, 6 jug), Navegantes 5-6 (13 pts, 6 jug).
- **Match** — `id, group_id, ruleset_id, date, winner_id, duration_minutes, notes, created_at`.
- **MatchPlayer** — `match_id, user_id, victory_points, longest_road (bool), largest_army (bool), exploration_points (nullable, para Navegantes)`.
- **MatchEvent** — `id, match_id, timestamp, event_type (LONGEST_ROAD|LARGEST_ARMY|KNIGHT_PLAYED|BUILT_CITY|VP_CHANGE), player_id, value (nullable)`. Para el modo en juego.

NO crees `PlayerProfile` como tabla — calcula stats al vuelo desde Match/MatchPlayer.

## Roadmap por fases (orden estricto)

### Fase 1 — MVP Básico (4-6 semanas) ⭐ EMPIEZA AQUÍ
1. Estructura del proyecto FastAPI con capas: `app/api`, `app/services`, `app/models`, `app/schemas`, `app/templates`, `app/static`. Config por env vars (`DATABASE_URL`, `SECRET_KEY`).
2. Modelos SQLAlchemy + migraciones Alembic iniciales + seed de Rulesets.
3. Auth: registro, login, logout, recuperación por magic link (Fase 1 deja stub si SMTP es complejo).
4. CRUD grupos: crear, unirse con código de invitación de 6 chars, listar grupos del usuario, ver miembros.
5. Registrar partida (formulario wizard 4 pasos: jugadores → puntos → ganador+bonus → confirmación). Validar: ganador entre participantes, num jugadores válido para ruleset, puntos ≤ victory_points_required.
6. Listado de partidas del grupo (filtrable por expansión y fecha).
7. Detalle de partida (con notas y bonus).
8. Stats básicas por grupo: total partidas, victorias por jugador y win rate, puntos promedio, duración media, partidas/mes.
9. Perfil de jugador en grupo: partidas, ganadas, win rate, puntuación media, racha actual, mejor compañero, némesis.
10. Templates Jinja2 portando los componentes Ledger. Mobile-first.

**Entregable Fase 1:** app usable. Un usuario puede registrarse, crear grupo, invitar amigos, registrar partidas y ver stats básicas.

### Fase 2 — Dashboard completo (3-4 semanas)
- Gráficos con Chart.js: barras win rate, líneas partidas/tiempo, comparativa puntos.
- Filtros: por expansión, por rango de fechas, head-to-head entre 2 jugadores.
- Matchups (pantalla 18) con métricas comparadas.
- Estadísticas "Catán puro": % victorias con Ruta Más Larga, con Ejército, con ambos.
- Editar/borrar partida.

### Fase 3 — Modo en juego (~3 semanas)
- Pantalla dark de tracking en vivo (mockup 17): cronómetro, ranking en tiempo real, botones de acción rápida (+1pt, +2pts, ruta, ejército, +1 caballero, carta VP).
- Cada acción crea un `MatchEvent`. Timeline visible durante la partida.
- Finalizar partida → consolida en Match con eventos enlazados.
- Vista de timeline en detalle de partida.

### Fase 4 — Navegantes y 5-6 jugadores (2-3 semanas)
- UI condicionada por ruleset: si Navegantes, max points = 13; si ruleset 5-6, permitir hasta 6 jugadores.
- Campo `exploration_points` en MatchPlayer.
- Stats split por expansión.

## Requisitos no funcionales (del PDF)

- **Mobile-first responsive.** Botones grandes, formularios mínimos, pocos toques.
- **Seguridad:** bcrypt para passwords, rate limit en login, validación Pydantic en todos los endpoints, protección de rutas por ownership de grupo.
- **Transacciones** al guardar Match + MatchPlayer (todo o nada).
- **12-factor:** config en env vars, stateless, logs a stdout.
- **Tests:** mínimo cubrir el cálculo de win rate, racha, mejor compañero y némesis con datos conocidos.

## Lo que NO entra en MVP

Tablero gráfico, lectura por cámara, simulación de tiradas, juego online, matchmaking, apps nativas, ELO. Solo registro retrospectivo + modo en juego ligero.

## Cómo quiero que trabajes

1. **Empieza creando la estructura del proyecto** y un README.md con instrucciones de setup local (venv, migraciones, seed, run).
2. **Implementa Fase 1 completa antes de tocar Fase 2.** No te adelantes.
3. Cuando portes una pantalla del mockup, **abre el archivo `CATAN-STATS MVP screens.html` y los `.jsx` correspondientes** para copiar tokens, espaciados y jerarquía visual exactamente.
4. Commits pequeños y descriptivos.
5. Si encuentras una decisión ambigua, **pregúntame antes de inventar**.
6. Al final de cada hito (auth funcionando, grupos funcionando, etc.), pausa y muéstrame qué probar.

## Archivos en el zip

- `CATAN-STATS MVP screens.html` — canvas con las 19 pantallas (ábrelo en navegador).
- `ledger-system.jsx` — tokens y componentes UI base.
- `data.jsx` — datos mock que ilustran formato esperado.
- `variation-a.jsx` — pantallas Fase 1 core (1-7).
- `ledger-screens.jsx` — pantallas expandidas (8-19).
- `design-canvas.jsx` — sólo el canvas para visualizar; no portar.
- `uploads/Plan de proyecto - Aplicación web de estadísticas de Catán.pdf` — plan completo de referencia.

Empieza creando el scaffold del proyecto FastAPI. Cuando esté listo, avísame y seguimos con auth.
