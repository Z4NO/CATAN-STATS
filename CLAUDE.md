# Catan Stats API - Guía de Desarrollo

## Visión General del Proyecto

Aplicación web responsive para registrar partidas de Catán entre grupos de amigos y generar estadísticas. Se enfatiza **modularización**, **escalabilidad** y **código limpio**. El objetivo es mantener estas prácticas a lo largo de toda la vida del proyecto.

**Stack tecnológico:**
- Backend: Python 3 + FastAPI (últimas versiones)
- ORM: SQLAlchemy (últimas versiones) con Alembic para migraciones
- BD: SQLite (dev), PostgreSQL/Neon (prod)
- Validación: Pydantic
- Estadísticas: Pandas
- Frontend: **React (Vite) + React Router + axios + Chart.js**, sistema visual **Ledger** (tokens en `web/src/styles/tokens.css`)
- Seguridad: JWT + bcrypt
- CORS habilitado en backend; orígenes configurables vía `CORS_ORIGINS`

---

## Principios Fundamentales

### 1. Modularización Obligatoria
- **Estructura por capas**: Datos → ORM → Servicios → API → Presentación
- **Separación de responsabilidades**: cada módulo tiene un propósito único
- **No mezclar lógica**: La lógica de negocio vive en `/services`, no en routes
- **Carpeta por dominio**: `/users`, `/groups`, `/matches`, `/stats`, `/securityf`
- Cada carpeta contiene: `models.py`, `schemas.py`, `routes.py`, `services.py`, `dependencies.py` (si aplica)

### 2. Código Simple, Bien Estructurado y Elegible
- Máxima legibilidad por encima de "cleverness"
- Funciones enfocadas en una tarea
- Nombres explícitos: `get_user_by_id()` en lugar de `fetch_user()`
- El código es el que comunica: escribir código que se entienda a primera lectura
- La lógica debe ser simple y buena, aunque se pase un par de líneas está bien si es legible y mantenible

### 3. Escalabilidad sin Refactor Futuro
- **No hardcodeos**: Configuración en `.env` (variables de entorno)
- **Diseño extensible**: La arquitectura debe permitir agregar expansiones sin romper el modelo
- **Rulesets como entidad**: Define reglas por expansión en DB, no en código
- **MatchEvent para timeline**: Permite análisis futuro sin reescribir partidas
- **ORM relationships**: Aprovecha SQLAlchemy para queries flexibles
- Considera cómo extender antes de implementar

### 4. Manejo de Excepciones: Siempre Try/Catch
- Todo lo que pueda fallar (DB queries, validaciones complejas, llamadas externas) envuelto en try/except
- **Nunca silenciar errores**: Siempre loguear qué pasó
- Excepciones específicas: `ValueError`, `HTTPException`, custom exceptions
- Pattern:
  ```python
  try:
      # operación
  except SpecificError as e:
      logger.error(f"Descripción del error: {e}")
      raise HTTPException(status_code=400, detail="Mensaje amigable al cliente")
  except Exception as e:
      logger.critical(f"Error inesperado: {e}")
      raise HTTPException(status_code=500, detail="Error interno del servidor")
  ```

### 5. Snake_case en Todo
- Variables, funciones, parámetros: `user_id`, `get_group_stats()`, `victory_points`
- Columnas DB: `victory_points`, `longest_road`, `largest_army`
- Archivos/carpetas: `user_service.py`, `match_model.py`
- URLs: `/api/groups/{group_id}/matches`, `/api/users/login`
- **Excepto**: Nombres de clases en PascalCase (`User`, `Match`, `Ruleset`)

### 6. Prácticas Escalables
- **Transacciones**: Al registrar una partida, todo o nada (partida + MatchPlayers)
- **Índices DB**: Planificar desde inicio (foreign keys, búsquedas frecuentes)
- **Caching**: Pre-calcular stats si los queries son lentos (usar Redis si crece)
- **Paginación**: Listados siempre paginados
- **Rate limiting**: En login y endpoints críticos
- **Validación en boundaries**: Input del user → DB, no confiar en datos externos

---

## Estructura del Proyecto

```
API/
├── app/
│   ├── __init__.py
│   ├── main.py                    # Punto de entrada, configuración FastAPI
│   ├── config.py                  # Variables de entorno, settings
│   ├── db/
│   │   ├── __init__.py
│   │   ├── session.py             # get_db() dependency
│   │   ├── base.py                # Declarative base para ORM
│   │   └── migrations/            # Alembic
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py                # ORM model User
│   │   ├── group.py               # ORM models Group, GroupMember
│   │   ├── match.py               # ORM models Match, MatchPlayer, MatchEvent, Ruleset
│   │   └── base.py                # Shared (timestamps, etc)
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py                # Pydantic schemas UserIn, UserOut, UserLogin
│   │   ├── group.py               # Pydantic schemas Group, GroupCreate, etc
│   │   ├── match.py               # Pydantic schemas Match, MatchCreate, etc
│   │   ├── token.py               # TokenData, Token schemas
│   │   └── stats.py               # Schemas para respuestas de stats
│   ├── services/
│   │   ├── __init__.py
│   │   ├── user.py                # get_user_by_id(), create_user(), etc
│   │   ├── group.py               # create_group(), add_member(), etc
│   │   ├── match.py               # create_match(), get_group_matches(), etc
│   │   └── stats.py               # calculate_group_stats(), player_winrate(), etc
│   ├── securityf/
│   │   ├── __init__.py
│   │   ├── auth.py                # get_current_user(), get_current_active_user()
│   │   ├── dependencies.py        # oauth2_scheme, token dependencies
│   │   └── password.py            # hash_password(), verify_password()
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── users.py               # @router /users
│   │   ├── groups.py              # @router /groups
│   │   ├── matches.py             # @router /matches
│   │   └── stats.py               # @router /stats
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── logging.py             # Configuración de logs
│   │   └── helpers.py             # Funciones helper genéricas
│   └── tests/
│       ├── __init__.py
│       ├── test_users.py
│       ├── test_groups.py
│       ├── test_matches.py
│       └── test_stats.py
├── .env.example                   # Template variables entorno
├── requirements.txt               # Dependencias Python
├── alembic.ini                    # Configuración Alembic
└── main.py                        # Entry point local dev

web/                               # Frontend React (Vite)
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── api/                       # cliente axios + auth interceptor
    ├── auth/                      # AuthContext, ProtectedRoute
    ├── components/                # componentes Ledger (LFrame, LField, LButton, LStat...)
    ├── pages/                     # Login, Register, Dashboard, GroupDetail, MatchWizard, MatchDetail, PlayerProfile
    ├── styles/                    # tokens.css (paleta Ledger), global.css
    └── lib/                       # helpers (fechas, formato)
```

---

## Estándares de Código

### Imports
```python
import logging
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import pandas as pd

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserOut
from app.services.user import get_user_by_id
```

### Type Hints Obligatorios
```python
def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    try:
        return db.query(User).filter(User.id == user_id).first()
    except Exception as e:
        logger.error(f"Error fetching user {user_id}: {e}")
        return None
```

### Documentación
- **Sin docstrings en funciones**: El código es autoexplicativo
- **Para documentación de API**: Usar parámetros de FastAPI (`description`, `example`)
- **Endpoint docs**: FastAPI genera automáticamente `/docs` y `/redoc`

```python
@router.post("/users/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    return create_user_service(db, user_data)

@router.get("/groups/{group_id}/stats", response_model=GroupStatsResponse)
async def get_group_stats(
    group_id: int = Path(..., description="ID único del grupo"),
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return get_group_stats_service(db, group_id)
```

### Logging
```python
import logging

logger = logging.getLogger(__name__)

logger.info(f"User {user_id} registered successfully")
logger.warning(f"Unusual activity: {user_id} tried to access {group_id}")
logger.error(f"Database error creating match: {exc}")
logger.debug(f"Query took {elapsed_time}ms")
```

### Validación de Input
```python
from pydantic import BaseModel, Field, validator

class MatchCreate(BaseModel):
    group_id: int
    date: datetime
    ruleset_id: int
    winner_id: int
    victory_points: dict[int, int]

    @validator('victory_points')
    def validate_victory_points(cls, v):
        if not v:
            raise ValueError('At least one player must have points')
        if any(p < 0 for p in v.values()):
            raise ValueError('Points must be >= 0')
        return v
```

### Servicios (Business Logic)
```python
from sqlalchemy.orm import Session
from app.models.match import Match, MatchPlayer, Ruleset
from app.schemas.match import MatchCreate
import logging

logger = logging.getLogger(__name__)

def create_match(db: Session, match_data: MatchCreate) -> Match:
    try:
        ruleset = db.query(Ruleset).filter(Ruleset.id == match_data.ruleset_id).first()
        if not ruleset:
            raise ValueError(f"Ruleset {match_data.ruleset_id} not found")

        match = Match(
            group_id=match_data.group_id,
            date=match_data.date,
            ruleset_id=match_data.ruleset_id,
            winner_id=match_data.winner_id
        )
        db.add(match)
        db.flush()

        for user_id, points in match_data.victory_points.items():
            mp = MatchPlayer(
                match_id=match.id,
                user_id=user_id,
                victory_points=points
            )
            db.add(mp)

        db.commit()
        logger.info(f"Match {match.id} created for group {match_data.group_id}")
        return match

    except ValueError as e:
        logger.warning(f"Validation error creating match: {e}")
        db.rollback()
        raise
    except Exception as e:
        logger.error(f"Unexpected error creating match: {e}")
        db.rollback()
        raise
```

### Routes (FastAPI)
```python
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.match import MatchCreate, MatchOut
from app.services.match import create_match
from app.securityf.auth import get_current_active_user
from app.schemas.user import UserOut

router = APIRouter(prefix="/matches", tags=["matches"])

@router.post("/", response_model=MatchOut, status_code=status.HTTP_201_CREATED)
async def create_new_match(
    match_data: MatchCreate,
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    try:
        is_member = db.query(GroupMember).filter(
            GroupMember.group_id == match_data.group_id,
            GroupMember.user_id == current_user.id
        ).first()

        if not is_member:
            raise HTTPException(status_code=403, detail="Not a member of this group")

        match = create_match(db, match_data)
        return match
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error creating match")
```

---

## Prácticas de Datos

### ORM (SQLAlchemy)
- **Siempre usar ORM**, nunca SQL crudo en lógica de negocio
- Relaciones bien definidas con `relationship()` y `foreign_keys`
- Índices en columnas frecuentes (user_id, group_id, date)
- Cascades apropiadas (si se borra un grupo, ¿qué pasa con partidas?)

```python
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(String(1000))
    creator_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    creator = relationship("User", back_populates="created_groups")
    members = relationship("GroupMember", back_populates="group", cascade="all, delete-orphan")
    matches = relationship("Match", back_populates="group", cascade="all, delete-orphan")
```

### Migraciones (Alembic)
- **NUNCA modificar manualmente** el schema sin migraciones
- Cada cambio en modelos → nueva migración
- Convención: `alembic revision --autogenerate -m "Add longest_road to match_player"`
- Revisar las migraciones generadas antes de aplicar
- En producción: siempre testear migraciones en dev primero

### Validación
- Pydantic valida en las routes (frontend de la API)
- Lógica compleja en servicios (try/except)
- DB constraints para la última línea de defensa

---

## Seguridad

### Autenticación
- JWT con expiración (configurar en `.env`)
- Tokens HTTP-only si usas cookies (no en localStorage)
- Refresh tokens para sesiones largas
- Logout = invalidar token (lista negra o expirarlo)

### Contraseñas
- **Siempre hashear** con bcrypt (nunca almacenar plain text)
- Salt automático incluido en bcrypt
- Verificar con `bcrypt.verify(password, hashed)`

```python
import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
```

### Autorización
- `get_current_user()` obtiene el usuario autenticado
- `get_current_active_user()` verifica que no esté inactivo
- En cada route que requiera auth, usar el Depends
- **La verificación de membresía va en un FastAPI Dependency** (`app/api/dependencies.py`), no inline en la route ni en el servicio
  - Los servicios permanecen agnósticos a autorización (reutilizables desde jobs, admin, etc.)
  - Si solo se necesita ejecutar el check sin usar el retorno, usar `dependencies=[Depends(...)]` en el decorador

```python
# app/api/dependencies.py
def require_group_member(
    group_id: int,
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> UserOut:
    is_member = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == current_user.id
    ).first()
    if not is_member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of this group")
    return current_user

# app/api/routes/groups.py — check corre automáticamente, route queda limpia
@router.get("/{group_id}/members", response_model=list[GroupMemberOut], dependencies=[Depends(require_group_member)])
async def get_group_members(
    group_id: int,
    db: Session = Depends(get_db)
):
    return get_members_from_group(db, group_id)

# app/services/groups.py — sin lógica de autorización
def get_members_from_group(db: Session, group_id: int) -> list[GroupMember]:
    ...
```

### Validación de Input
- Pydantic schema para request bodies
- Path/query params validados automáticamente por FastAPI
- Nunca confiar en datos del cliente

---

## Estadísticas y Pandas

- Usar Pandas para agregaciones complejas
- No cargar millones de registros en memoria (paginar/filtrar primero)
- Cachear resultados si se consultan frecuentemente
- Testear cálculos con datasets conocidos

```python
import pandas as pd
from sqlalchemy.orm import Session

def get_group_stats(db: Session, group_id: int) -> dict:
    try:
        matches = db.query(Match).filter(Match.group_id == group_id).all()
        if not matches:
            return {"total_matches": 0, "players": []}

        data = []
        for match in matches:
            for mp in match.match_players:
                data.append({
                    'user_id': mp.user_id,
                    'won': match.winner_id == mp.user_id,
                    'points': mp.victory_points
                })

        df = pd.DataFrame(data)

        winrate = df.groupby('user_id')['won'].agg(['sum', 'count']).reset_index()
        winrate.columns = ['user_id', 'wins', 'games']
        winrate['winrate_pct'] = (winrate['wins'] / winrate['games'] * 100).round(2)

        return winrate.to_dict('records')

    except Exception as e:
        logger.error(f"Error calculating stats for group {group_id}: {e}")
        raise
```

---

## Testing

- Mínimo: tests para servicios críticos (cálculos de stats, creación de partidas)
- Usar fixtures con pytest
- Test con datos reales, no mocks genéricos
- Verificar edge cases (0 partidas, empates, mismo jugador 2 veces, etc)

```python
import pytest
from app.services.stats import calculate_player_winrate
from app.models.match import Match, MatchPlayer

def test_calculate_player_winrate_basic(db_session):
    player_id, group_id = 1, 1

    for i in range(5):
        match = Match(group_id=group_id, winner_id=player_id if i < 2 else 999)
        db_session.add(match)
        db_session.flush()

        mp = MatchPlayer(match_id=match.id, user_id=player_id, victory_points=10)
        db_session.add(mp)

    db_session.commit()

    winrate = calculate_player_winrate(db_session, player_id, group_id)
    assert winrate == 40.0

def test_calculate_player_winrate_no_matches(db_session):
    winrate = calculate_player_winrate(db_session, 999, 999)
    assert winrate == 0.0
```

---

## Configuración y Entorno

### `.env` (nunca commitearlo, usar `.env.example`)
```
DATABASE_URL=sqlite:///./test.db
# DATABASE_URL=postgresql://user:pass@localhost/catan  # prod

SECRET_KEY=tu_clave_secreta_super_larga_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

API_TITLE=Catan Stats API
API_VERSION=0.1.0

LOG_LEVEL=INFO
```

### Iniciar Desarrollo
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python main.py  # O: uvicorn app.main:app --reload
```

---

## Buenas Prácticas Generales

✅ **DO:**
- Escribir código que sea fácil de entender (legibilidad first)
- Usar constants para valores que se repiten (`MAX_PLAYERS = 6`)
- Comentarios solo para decisiones no obvias o contexto importante
- Separar lógica en funciones enfocadas
- Usar enums para estados/tipos (`class RulesetType(str, Enum)`)
- Validar siempre en boundaries (entrada user, salida a DB)
- Loguear contexto suficiente para debuggear en prod
- Hacer migraciones atómicas y reversibles

❌ **DON'T:**
- Hardcodear valores (usar .env)
- Mezclar lógica en routes
- SQL crudo en servicios
- Silenciar excepciones
- Confiar en datos del cliente sin validar
- Crear abstracciones "por si acaso" (YAGNI)
- Comentarios obvios (`i += 1  # increment i`)
- Estado global/singletons sin razón
- Queries N+1 (usa relationships y lazy loading)

---

## Escalabilidad para el Futuro

- **Nuevas expansiones**: Agregar campos/tablas sin romper existentes
  - Usa `Ruleset` para definir reglas por expansión
  - `MatchEvent` para eventos que pueden variar

- **Más usuarios**:
  - Índices en queries frecuentes
  - Caching (Redis) para stats que no cambian cada minuto
  - Paginación en listados

- **Complejidad stats**:
  - Servicios separados por dominio (`stats_basic.py`, `stats_advanced.py`)
  - Precalcular nightly si es lento
  - Usar Pandas para manipulaciones complejas

- **Frontend dinámico**:
  - API REST ya existe, solo consumirla
  - Migrar a SPA (React/Vue) sin tocar backend
  - WebSockets si quieres updates en tiempo real

---

## Resumen Checklist para Cada PR

- [ ] Código modularizado (servicios, no en routes)
- [ ] Type hints en todas las funciones
- [ ] Try/except donde puede fallar
- [ ] Logging adecuado
- [ ] Migraciones Alembic si cambio schemas
- [ ] Tests para lógica crítica
- [ ] Snake_case en variables/funciones
- [ ] Sin hardcodeos (valores en .env o constantes)
- [ ] Validación con Pydantic
- [ ] SQL solo a través de ORM
- [ ] Autorización verificada en routes
- [ ] FastAPI docs actualizadas (`description`, `example`)

---

**Última actualización:** Marzo 2026
**Proyecto:** Catan Stats - Aplicación web de estadísticas
