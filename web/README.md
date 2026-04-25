# Catan Stats — Frontend (React + Vite)

Cliente web mobile-first del backend FastAPI.

## Setup

```bash
cd web
npm install
cp .env.example .env   # ajusta VITE_API_BASE_URL si tu API no está en localhost:8000
npm run dev            # http://localhost:5173
```

El backend debe correr en `http://localhost:8000` (o el host que pongas en `VITE_API_BASE_URL`) y tener `CORS_ORIGINS` apuntando al puerto del front.

## Estructura

- `src/api/` — cliente axios + endpoints por dominio (auth, groups, matches, stats, rulesets)
- `src/auth/` — `AuthContext`, `ProtectedRoute`
- `src/components/Ledger/` — sistema visual Ledger portado a CSS vars + componentes React
- `src/pages/` — pantallas (Login, Register, Dashboard, CreateGroup, JoinGroup, GroupDetail)
- `src/styles/` — `tokens.css` (paleta + tipografías) y `global.css`

## Estado

Bloque B del plan: scaffold + auth + dashboard + grupos básicos. Pendiente:

- Wizard de nueva partida (4 pasos)
- Detalle de partida
- Perfil de jugador en grupo
- Miembros con kick/leave
- Filtros e historial paginado
- Charts con `chart.js` / `react-chartjs-2` (ya en deps)
