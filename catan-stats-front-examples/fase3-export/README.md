# CATAN-STATS · Fase 3 — Modo en juego

> Guía pantalla-a-pantalla para implementar la **Fase 3** (modo en juego) en la app real.
> Pensada para usarse como prompt en **Claude Code**, abordando **una pantalla cada vez**.

---

## Cómo usar este README

1. **No abordes todo a la vez.** Cada sección de este documento (`## XX · Nombre`) es una unidad de trabajo independiente.
2. Para cada pantalla, copia el bloque **"Prompt para Claude Code"** correspondiente y pégalo como tarea.
3. Adjunta `in-game-screens.jsx` como **referencia visual** (no como código a copiar literalmente: contiene mocks estáticos hechos con React + estilos inline para un canvas de diseño).
4. Sigue el **orden recomendado** del final del documento. Las pantallas tienen dependencias entre sí (sobre todo de socket/realtime).

---

## Stack y convenciones (aplican a TODAS las pantallas)

- **Framework:** lo que ya use el proyecto (React Native / React web / Next… ajustar según la app real).
- **Estado:** la pantalla recibe data por props o por hooks (`useMatch`, `useSocket`, etc.). **No reinventes** estilos inline como en el mock; usa el sistema de diseño de la app (tokens, componentes existentes, navegación, i18n).
- **Idioma UI:** español. Copys exactos en cada sección.
- **Modo oscuro durante la partida:** las pantallas 26-29 usan fondo oscuro `#15130f` con texto crema `#f6f1e7`. Es intencional (alta legibilidad sobre la mesa, no compite con el tablero físico). Las pantallas 22-25 y 30 son modo claro estándar de la app.
- **Tres tonos semánticos para los contadores in-game:**
  - `build` (verde oliva `#7a8c47`) → contadores manuales que el jugador incrementa con +/− (aldeas, ciudades, carreteras, barcos, caballeros).
  - `auto` (azul `#5a8aa6`) → datos que la app calcula sola y muestra en read-only (puntos de victoria, posición, recursos gastados, tiradas).
  - `special` (ocre `#a8854a`) → eventos únicos que requieren validación del host (carretera más larga, ejército más grande, robos del ladrón).
- **Realtime:** todas las pantallas in-game (25-29) deben suscribirse al canal de la partida y reaccionar a eventos. Usa el mecanismo del proyecto (Socket.io, Pusher, Supabase Realtime, lo que sea).

### Modelo de datos asumido

```ts
type Match = {
  id: string;
  groupId: string;
  hostId: string;          // user que arranca
  expansion: 'base' | 'navegantes';
  pointsToWin: number;     // 10 | 13
  randomBoard: boolean;
  longestRoadEnabled: boolean;
  largestArmyEnabled: boolean;
  status: 'lobby' | 'live' | 'finished';
  startedAt: ISODate;
  endedAt?: ISODate;
  durationSec?: number;
  players: MatchPlayer[];
  events: MatchEvent[];    // log para el resumen final
};

type MatchPlayer = {
  userId: string;
  name: string;
  ready: boolean;          // lobby
  vp: number;              // calculado
  villages: number;
  cities: number;
  roads: number;
  ships: number;           // sólo navegantes
  knightsPlayed: number;
  thiefRobs: number;
  cardsBought: number;
  resourcesSpent: number;
  hasLongestRoad: boolean;
  hasLargestArmy: boolean;
  declaredRoadLength?: number;   // cuando solicita la carta
  declaredKnights?: number;      // cuando solicita ejército
};

type SpecialCardRequest = {
  id: string;
  matchId: string;
  fromUserId: string;
  type: 'longest_road' | 'largest_army';
  declaredValue: number;          // p.ej. 8 carreteras
  currentHolder?: { userId: string; value: number };
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expiresAt: ISODate;
};
```

---

# Pantallas

## 22 · Selector de grupo (host)

**Propósito:** al pulsar "Jugar" en la app, el usuario tiene que elegir **en qué grupo** quiere ser host. Solo aparecen los grupos donde el usuario actual tiene rol `host`.

**Componentes:**
- Top bar `Jugar` con subtítulo `Elige un grupo donde eres host`.
- Banner informativo (terracota suave): _"Solo el host arranca la partida. Los demás reciben una invitación cuando configures las reglas."_
- Lista de grupos donde es host: avatar, nombre, chip `host`, metadata `{N}j · {N}p · {última partida}`. El primero de la lista visualmente destacado (border más oscuro) es la sugerencia (último jugado).
- Footer dashed: _"¿No eres host de un grupo? Espera a que tu host inicie · llegará un aviso."_
- Tab bar con `play` activo.

**Estados:**
- 0 grupos donde es host → mostrar solo el footer dashed más prominente, con CTA `Crea un grupo`.
- N grupos → lista normal.

**Acciones:**
- Tap en un grupo → navegar a `23 · Configurar partida` con `groupId` en params.

**Prompt para Claude Code:**
```
Implementa la pantalla "Selector de grupo (host)" de CATAN-STATS Fase 3.
Es la pantalla a la que se llega al pulsar "Jugar" desde la tab bar.

Lee el README.md (sección 22) y la referencia visual en in-game-screens.jsx
(componente IG_GroupSelect).

Requisitos:
- Cargar los grupos donde el usuario actual tiene rol 'host' (filtrar en backend).
- Vacío: mostrar CTA para crear grupo.
- Tap → navegar a /play/configure/[groupId].
- Reutiliza componentes existentes (top bar, avatares, chips, tab bar). NO copies
  los estilos inline del mock; usa el sistema de diseño del proyecto.
```

---

## 23 · Configurar partida (host)

**Propósito:** el host define las reglas y selecciona qué miembros del grupo van a jugar antes de enviar las invitaciones.

**Bloques (en este orden vertical):**
1. **Expansión del juego** — grid 2×2:
   - `Base` (10 pts · 3-4j) y `Navegantes` (13 pts · 3-4j) — seleccionables.
   - `Ciudades & Caballeros` y `Mercaderes & Bárbaros` — disabled, label `próximamente`.
   - Al cambiar expansión, actualizar el `vp` por defecto (Base→10, Navegantes→13).
2. **Jugadores** — listado de miembros del grupo con checkbox. El host está pre-seleccionado y marcado con chip `tú · host`. Header derecho: `{seleccionados} / {total} seleccionados`. Mínimo 3, máximo 4 (Catan estándar).
3. **Reglas básicas** — card con filas:
   - `Puntos para ganar` con stepper +/− (rango 8–15).
   - `Tablero` → `Aleatorio` / `Personalizado` (modal).
   - `Carretera más larga` → activa/inactiva (chip).
   - `Ejército más grande` → activa/inactiva (chip).
   - `Cartas de progreso` → `Estándar` / `Sin cartas`.

**Footer:** botón primario full-width `Enviar invitaciones · {N} jugadores` (donde N = seleccionados − 1, sin contar al host).

**Validaciones:**
- Mínimo 3 jugadores seleccionados (incluido host) para activar el botón.
- VP entre 8 y 15.

**Acción del CTA:** crear el `Match` en estado `lobby`, generar invitaciones para los seleccionados (excepto host), navegar a `25 · Lobby`.

**Prompt para Claude Code:**
```
Implementa la pantalla "Configurar partida (host)" de CATAN-STATS Fase 3.
Recibes groupId por params.

Lee el README.md (sección 23) y la referencia visual en in-game-screens.jsx
(componente IG_HostConfig).

Requisitos:
- 3 bloques: expansión, jugadores, reglas básicas.
- Estado local controlado (expansion, vp, players[], rules).
- Al pulsar "Enviar invitaciones": POST /api/matches que crea Match en
  status=lobby, dispara push/realtime a los jugadores seleccionados, y
  navega al Lobby (pantalla 25) con matchId.
- Validar min 3 jugadores. CTA disabled si no se cumple.
- Reutiliza componentes del sistema. No estilos inline del mock.
```

---

## 24 · Invitación (pop-up)

**Propósito:** lo que ven los jugadores **invitados** (no host) cuando el host envía las invitaciones. Es un modal sobre la pantalla actual del usuario (sea cual sea).

**Componentes:**
- Scrim oscuro (rgba 0 0 0 / 0.55) sobre el contenido actual.
- Sheet centrado:
  - Header: `── INVITACIÓN A PARTIDA` + dot terracota.
  - Avatar del host + título: _"{Host} te invita a jugar en **{Nombre del grupo}**"_.
  - Box con resumen de reglas: Expansión, Puntos, Jugadores (lista de nombres separados por coma).
  - Botones: `Ahora no` (secundario) | `Unirme ✓` (primario, flex 2:1).
  - Texto pequeño abajo: `la invitación caduca en MM:SS` con countdown real.

**Comportamiento:**
- Llega como push notification + realtime event.
- Se abre como modal globalmente, sin importar la pantalla en la que esté el usuario.
- `Ahora no` → marca invitación como `declined`, cierra modal.
- `Unirme` → marca como `accepted`, navega al Lobby (pantalla 25).
- Si caduca el timer → cierra automáticamente con toast "La invitación ha caducado".

**Prompt para Claude Code:**
```
Implementa el modal "Invitación a partida" de CATAN-STATS Fase 3.
Tiene que ser un modal global que escuche el canal de invitaciones del
usuario en realtime y aparezca SOBRE cualquier pantalla.

Lee el README.md (sección 24) y la referencia visual en in-game-screens.jsx
(componente IG_Invitation).

Requisitos:
- Hook useInvitationListener() montado en el root de la app.
- Cuando llega una invitación pendiente, abrir <InvitationModal/>.
- Countdown real basado en expiresAt (cierra al llegar a 0).
- Acciones POST /api/invitations/[id]/accept|decline.
- Tras aceptar → navegar a Lobby (pantalla 25) con matchId.
- Reutiliza el componente Modal/Sheet del sistema de diseño.
```

---

## 25 · Lobby pre-partida

**Propósito:** sala de espera mientras todos los invitados aceptan. Visible para **todos** los jugadores (host y no host), pero solo el host tiene el CTA habilitado para arrancar.

**Componentes:**
- Top bar `Lobby` · subtítulo con nombre del grupo · acción `···` (kebab: cancelar partida, expulsar jugador… si host).
- **Hero card** con barra de progreso:
  - Tag `── PARTIDA · {EXPANSIÓN}`.
  - Título grande: _"Esperando a {Nombre}…"_ (último que falta), o _"Todos listos"_.
  - Barra de progreso `{listos} / {total}`.
  - Footer: `{ratio} LISTOS` · `{tiempo} ESPERANDO`.
- **Lista de jugadores** con avatar, nombre, chip `host` si aplica, y estado:
  - `● LISTO` (verde) si aceptó la invitación.
  - `◐ ESPERANDO` (gris) si pendiente.
- **Reglas resumidas** en grid 2×2 (Expansión, Para ganar, Tablero, Bonus).
- **CTA host** (full-width, primary): `Comenzar partida` (habilitado si todos listos), o `Comenzar partida · {N} falta` (deshabilitado, gris).
- **CTA no-host:** mismo botón pero permanentemente disabled, con texto `Esperando al host`.

**Realtime:**
- Suscribirse a `match:{id}` y escuchar `player_joined`, `player_ready`, `match_started`.
- Cuando llega `match_started` → todos los clientes navegan a `26 · In game · jugador` (o `27 · host`).

**Prompt para Claude Code:**
```
Implementa la pantalla "Lobby pre-partida" de CATAN-STATS Fase 3.
Recibe matchId por params.

Lee el README.md (sección 25) y la referencia visual en in-game-screens.jsx
(componente IG_Lobby).

Requisitos:
- Suscripción realtime al canal match:{id}.
- Mostrar lista de jugadores con su estado (ready/pending).
- CTA "Comenzar partida": solo activo para host y solo si todos ready.
- Al pulsar → POST /api/matches/[id]/start, broadcast match_started.
- Todos los clientes navegan automáticamente a pantalla in-game al recibirlo.
- El kebab "···" abre menú con: cancelar partida (host), salir (no host).
```

---

## 26 · Modo en juego · jugador

**Propósito:** la pantalla principal durante la partida para un jugador no-host. Tiene fondo oscuro y los **3 bloques canónicos** del modo en juego.

**Componentes (de arriba abajo):**

1. **Header partida** (oscuro):
   - Pequeña: `EN JUEGO · {EXPANSIÓN}`.
   - Nombre del jugador en grande.
   - Cronómetro `HH:MM:SS` (calculado desde `match.startedAt`).
   - Indicador `● REC` (rojo).

2. **Bloque AUTO** (`Llevado por la app · auto`):
   - Card grande con borde lateral azul:
     - Label `PUNTOS DE VICTORIA`.
     - Número grande (38px), `{vp} / {pointsToWin}`.
     - A la derecha: `POSICIÓN` con `Nº` (1º, 2º, 3º…).
   - Grid 3 columnas con cards mini: `Recursos gastados`, `Cartas compradas`, `Tiradas tuyas`. Read-only.

3. **Bloque BUILD** (`Construcciones · manual`):
   - Grid 2×2 de `IGCounter` con +/−: Aldeas, Ciudades, Carreteras, Barcos.
   - Sub-label con límite máximo (`/ 5`, `/ 4`, `/ 15`) o nota (`navegantes`).
   - Tap en + o − incrementa/decrementa con optimistic update y emite evento al backend.

4. **Bloque SPECIAL** (`Hitos · cartas únicas · solicita al host`):
   - 2 `IGCheck` rows: Carretera más larga, Ejército más grande.
     - `active` si `player.hasLongestRoad/largestArmy`.
     - Sub: `"Tienes 3 caballeros — ya disponible"` o `"{Otro} lleva 8 carreteras · solicita la carta"`.
     - Tap en row inactiva con condiciones cumplidas → abre prompt para declarar valor (longitud carretera o nº caballeros) y dispara `SpecialCardRequest`.
   - Grid 2×1 con counters mini: Caballeros jugados, Robos del ladrón.

5. **Footer Standings:**
   - Título `STANDINGS` con línea decorativa.
   - Grid horizontal con todos los jugadores: nombre arriba (mono), puntos abajo (display).
   - El que lidera tiene border terracota, el "tú" tiene fondo azul tenue.

**Lógica de "solicita al host":**
- Cuando el jugador cree que tiene la carretera más larga o el ejército más grande, pulsa la check → abre modal de confirmación → declara valor (`8 carreteras`, `3 caballeros`) → POST request → muestra pantalla 29 (esperando).
- Hasta que el host acepte, el flag local NO cambia. La carta solo es oficial cuando el host la valida en pantalla 28.

**Prompt para Claude Code:**
```
Implementa la pantalla "Modo en juego · jugador" de CATAN-STATS Fase 3.
Recibe matchId por params.

Lee el README.md (sección 26) y la referencia visual en in-game-screens.jsx
(componente IG_PlayerLive). Esta pantalla es la base del modo live: el host
(pantalla 27) reutilizará la misma estructura.

Requisitos:
- Fondo oscuro (#15130f, texto #f6f1e7). Documentar en design tokens si no
  existe modo dark.
- 3 bloques semánticos (build/auto/special) con sus 3 colores acento.
- Cronómetro en vivo desde match.startedAt.
- Subscripción realtime: actualizar standings y datos auto cuando llegan
  eventos del host o del backend.
- Counters BUILD: optimistic update + POST /api/matches/[id]/players/[pid]/build.
- Counters SPECIAL "solicitar":
    1. Modal "¿Cuántas carreteras tienes?" con número.
    2. POST /api/matches/[id]/special-requests {type, declaredValue}.
    3. Navegar a pantalla 29 (esperando al host).
- No mostrar acciones de host (terminar partida, etc).
```

---

## 27 · Modo en juego · host

**Propósito:** misma pantalla que la 26 pero con privilegios extra de host: badge, banner de peticiones pendientes, footer con acción "Terminar partida".

**Diferencias vs. pantalla 26:**

1. **Header con badge** `HOST` (terracota) y gradiente sutil terracota → transparente.
2. **Banner de petición pendiente** (solo si hay `SpecialCardRequest` pendientes):
   - Card con borde y fondo terracota.
   - Icono `!` circular.
   - Texto: _"{Jugador} pide {tipo de carta}"_, sub: _"{declaredValue} · supera el actual ({holder} · {holderValue})"_.
   - Botón `REVISAR` → abre pantalla 28.
3. **Counters más densos:** la pantalla del host muestra construcciones en grid 4×1 (mini) en lugar de 2×2, y omite el grid de stats secundarios para dejar sitio al banner.
4. **Footer:** dos botones lado a lado:
   - `Estadísticas en vivo` (secundario) → modal con stats agregadas de toda la partida.
   - `Terminar partida` (primario terracota) → confirma fin → navega a pantalla 30.

**Prompt para Claude Code:**
```
Implementa la pantalla "Modo en juego · host" de CATAN-STATS Fase 3.
Recibe matchId por params. Asume que el usuario actual es match.hostId
(si no, redirigir a pantalla 26).

Lee el README.md (sección 27) y la referencia visual en in-game-screens.jsx
(componente IG_HostLive).

Requisitos:
- Reutiliza la pantalla 26 como base (componente <LiveMatchScreen mode="host" />).
- Header con badge HOST y gradiente terracota.
- Suscripción a special_card_requests del match. Cuando hay pendientes,
  mostrar banner persistente arriba con el más reciente.
- Tap en "REVISAR" → abre pantalla 28 (modal) con la request en context.
- Footer: botón "Estadísticas en vivo" (sheet con stats agregadas) +
  botón "Terminar partida" (modal de confirmación → POST end → pantalla 30).
- Si llegan múltiples peticiones, el banner indica "+N" y al tap muestra cola.
```

---

## 28 · Modal carta especial (host)

**Propósito:** modal que se abre cuando el host pulsa "REVISAR" sobre una petición. Decisión binaria: aceptar o rechazar la atribución de la carta única.

**Componentes:**
- Scrim oscuro sobre el modo in-game del host.
- Modal **rojo oscuro** (`#3b1d18`) con texto crema (`#fff5e9`) — diferenciado del modo en juego normal porque es una **decisión irreversible**.
- Header: `── PETICIÓN DE CARTA ÚNICA` + countdown (`15s`).
- Avatar + título: _"**{Jugador}** está solicitando"_ → `{Tipo de carta}` (display 22px).
- Box comparativo:
  - `{Jugador} declara → {N} carreteras/caballeros`.
  - `Actual · {Holder} → {N} carreteras/caballeros` (más tenue).
- Texto explicativo: _"¿Es correcto? Si aceptas, la carretera más larga pasa a {Jugador} **(+2 pts)**."_
- Acciones: `No` (secundario) | `Sí, aceptar ✓` (primario crema, flex 2:1).

**Acciones:**
- `Sí` → POST `/special-requests/{id}/accept` → backend mueve la carta al jugador, suma +2 pts, broadcast `card_assigned` → modal cierra, banner de peticiones desaparece.
- `No` → POST `/reject` → broadcast `card_rejected` → el jugador en pantalla 29 vuelve a 26 con toast "Petición denegada".
- Timeout 15s → auto-rechazo con flag `expired`.

**Prompt para Claude Code:**
```
Implementa el modal "Carta especial · host" de CATAN-STATS Fase 3.

Lee el README.md (sección 28) y la referencia visual en in-game-screens.jsx
(componente IG_SpecialCardModal).

Requisitos:
- Modal con paleta roja oscura (warning: decisión irreversible).
- Recibe SpecialCardRequest por context o param.
- Countdown 15s. Al expirar → auto-reject.
- Acciones: accept/reject hit los endpoints correspondientes.
- Tras success: cerrar modal y mostrar toast en pantalla 27.
- El backend es responsable de aplicar +2 pts y emitir broadcast a todos.
```

---

## 29 · Esperando al host (jugador)

**Propósito:** estado intermedio del jugador que solicitó una carta única. Bloquea interacción mientras espera la respuesta del host.

**Componentes:**
- La pantalla 26 atenuada (opacity 0.3) como fondo, pointerEvents none.
- Scrim oscuro encima.
- Centro vertical:
  - Spinner circular animado (border terracota, rotación 1.4s).
  - Tag: `── ESPERANDO AL HOST`.
  - Título display: _"Pediste la **{tipo de carta}**"_.
  - Texto: _"{Host} está revisando tu petición. Si la acepta, sumarás **+2 puntos** automáticamente."_
  - Pill mono: _"declaraste: **{N} carreteras**"_.
  - Botón secundario `Cancelar petición`.

**Comportamiento:**
- Mientras `SpecialCardRequest.status === 'pending'`.
- Si llega `accepted` → cierra y muestra toast verde "+2 puntos · ahora tienes la carretera más larga".
- Si llega `rejected` → cierra y muestra toast neutro "Tu petición fue denegada".
- Si llega `expired` → cierra y muestra toast "El host no respondió".
- `Cancelar petición` → DELETE request, cierra inmediato.

**Prompt para Claude Code:**
```
Implementa la pantalla "Esperando al host" de CATAN-STATS Fase 3.

Lee el README.md (sección 29) y la referencia visual en in-game-screens.jsx
(componente IG_PlayerWaiting).

Requisitos:
- Overlay sobre la pantalla 26 (no es navegación, es modal-stack).
- Spinner CSS @keyframes spin.
- Suscripción al evento de la request específica (special_request:{id}).
- Reaccionar a accepted/rejected/expired con toast y dismiss.
- Botón "Cancelar petición" → DELETE /api/special-requests/[id].
```

---

## 30 · Resumen de partida

**Propósito:** pantalla post-partida (modo claro). Aparece para todos cuando el host pulsa "Terminar partida" y se ha calculado el ganador.

**Componentes:**
1. **Hero ganador** (verde sobre fondo verde tenue):
   - Tag `★ GANADOR ★`.
   - Avatar grande del ganador.
   - Título: _"{Nombre} con **{N} puntos**"_.
   - Sub mono: `{EXPANSIÓN} · {duración} · {N} JUGADORES`.
2. **Clasificación final** — tabla con todos los jugadores ordenados por puntos:
   - Posición, avatar, nombre, chips si tiene `ruta` o `ejército`, puntos.
   - Fila #1 con fondo verde tenue.
3. **Momentos clave** — log de eventos con timestamp `H:MM`:
   - `consigue Ejército más grande`, `construye su 2ª ciudad · 7 pts`, `pide carretera más larga · denegada`, `cierra con carta de victoria`, etc.
   - Se calcula del `match.events` log (ver modelo de datos arriba).
4. **Reconocimientos** — grid 2×2 con awards calculados:
   - `Constructor` (más construcciones), `Más caballeros`, `Más cartas`, `Más robos`.
5. **Footer:** `Compartir` (secundario) | `Guardar y volver` (primario, flex 2:1).

**Acciones:**
- `Compartir` → share sheet con imagen generada del resumen.
- `Guardar y volver` → cierra y vuelve al detalle del grupo (la partida ya está persistida; este botón solo navega).

**Notas de cálculo:**
- `events` se va llenando durante la partida (cada vez que un counter cambia, se concede una carta única, etc). El backend lo persiste en `match.events`.
- Los awards se calculan en el cliente al cargar la pantalla, leyendo `match.players[]`.

**Prompt para Claude Code:**
```
Implementa la pantalla "Resumen de partida" de CATAN-STATS Fase 3.
Recibe matchId por params. La partida ya está en status=finished.

Lee el README.md (sección 30) y la referencia visual en in-game-screens.jsx
(componente IG_MatchSummary).

Requisitos:
- Cargar match completo con events y players.
- Calcular awards en cliente (max construcciones, max caballeros, etc).
- Hero del ganador (player con más puntos, desempate por carretera más larga).
- Tabla de clasificación ordenada por puntos descendente.
- Log de momentos clave a partir de match.events (filtrar los notables:
  cartas únicas otorgadas/denegadas, hito de 7+ pts, victoria final).
- Botón compartir → usar el share sheet del proyecto.
- Botón "Guardar y volver" → navegar a /groups/[groupId].
```

---

# Orden recomendado de implementación

Las pantallas tienen dependencias de datos y de eventos realtime. Implementa en este orden:

1. **22 · Selector de grupo** — sin realtime, solo lista. Buen punto de entrada.
2. **23 · Configurar partida** — crea el `Match` en DB. Necesario para todas las demás.
3. **25 · Lobby** — primera pantalla con realtime. Asienta el patrón de sockets.
4. **24 · Invitación (modal)** — depende de que el lobby exista para tener algo a lo que aceptar.
5. **26 · In game · jugador** — la pantalla más compleja. La estructura base.
6. **27 · In game · host** — extensión de la 26. Reutiliza el componente.
7. **28 · Modal carta especial** — necesario para cerrar el ciclo de SPECIAL.
8. **29 · Esperando al host** — el contraparte cliente del 28. Implementarlos en paralelo.
9. **30 · Resumen** — solo accesible cuando el host termina. Última pieza.

---

# Archivos en este zip

- `README.md` — este documento.
- `in-game-screens.jsx` — referencia visual con las 9 pantallas en mock estático (React + estilos inline). **No es código a copiar**: úsalo solo para mirar layouts, copys y paleta. Para verlo renderizado, abre el proyecto original en el entorno de mockups.
