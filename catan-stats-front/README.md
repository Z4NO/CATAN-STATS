# CATAN-STATS · Paquete de diseño para Claude Code

Este zip contiene todo lo necesario para que Claude Code arranque el desarrollo del MVP.

## Contenido

| Archivo | Qué es |
|---|---|
| `CLAUDE_CODE_PROMPT.md` | **Pega esto en Claude Code** como primer mensaje. |
| `CATAN-STATS MVP screens.html` | Canvas interactivo con las 19 pantallas. Ábrelo en cualquier navegador. |
| `ledger-system.jsx` | Tokens (colores, tipografía) + componentes UI base. |
| `variation-a.jsx` | Pantallas 1-7 (Fase 1 core). |
| `ledger-screens.jsx` | Pantallas 8-19 (Fase 1-4 expandido). |
| `data.jsx` | Mock data que muestra el formato esperado. |
| `design-canvas.jsx` | Wrapper de presentación (no se porta). |
| `uploads/Plan de proyecto - …pdf` | Plan completo del proyecto. |

## Cómo usarlo

1. Abre `CATAN-STATS MVP screens.html` en tu navegador para revisar las 19 pantallas.
2. Crea una nueva sesión en Claude Code en una carpeta vacía.
3. Sube este zip y pega el contenido de `CLAUDE_CODE_PROMPT.md` como primer mensaje.
4. Claude Code arrancará por el scaffold de FastAPI y la Fase 1.
