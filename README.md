# CATAN-STATS
Una aplicación donde podrás llevar un seguimiento de tus partidas al catán con tus amigos a parte de estadísticas.

---

## How to Run

### Backend (FastAPI)

```bash
# Desde la raíz del proyecto, activa el entorno virtual
env\Scripts\activate      # Windows
# source env/bin/activate  # Linux/Mac

# Entra a la carpeta API y levanta el servidor
cd API
uvicorn app.main:app --reload
```

API disponible en `http://localhost:8000` · Docs en `http://localhost:8000/docs`

---

### Frontend (React + Vite)

```bash
# Desde la raíz del proyecto
cd web
npm install   # solo la primera vez
npm run dev
```

App disponible en `http://localhost:5173`

---

### Migraciones (Alembic)

```bash
# Desde la carpeta API
cd API
alembic upgrade head
```

