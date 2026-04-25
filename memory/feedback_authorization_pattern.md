---
name: Authorization pattern - FastAPI Dependency
description: Membership verification must use a FastAPI Dependency, not inline in routes or services
type: feedback
---

Usar siempre un **FastAPI Dependency** para verificar membresía de grupo, nunca inline en la route ni dentro del servicio.

**Why:** Los servicios deben ser agnósticos a autorización para poder reutilizarlos desde jobs, admin endpoints, etc. El patrón Dependency es el idiomático de FastAPI, es reutilizable y aparece en `/docs` automáticamente.

**How to apply:**
- Las dependencias de autorización van en `app/api/dependencies.py`
- Si solo se necesita ejecutar el check sin usar el retorno, usar `dependencies=[Depends(...)]` en el decorador de la route
- Los servicios reciben solo `db` y parámetros de negocio, sin `current_user` para autorización
