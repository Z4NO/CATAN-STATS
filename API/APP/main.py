import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.routes import groups, matches, notifications, rulesets, stats, user, websocket, lobbys
from app.config import settings
from app.utils.logging import setup_logging
from app.utils.middleware import RequestLoggingMiddleware

setup_logging()
logger = logging.getLogger(__name__)

app = FastAPI(title=settings.APP_NAME, version="0.1.0")

app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code >= 500:
        logger.error(f"HTTPException {exc.status_code} on {request.method} {request.url.path}: {exc.detail}")
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error on {request.method} {request.url.path}: {exc.errors()}")
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled exception on {request.method} {request.url.path}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Error interno del servidor"},
    )


app.include_router(user.router, prefix="/users", tags=["users"])
app.include_router(groups.router, prefix="/groups", tags=["groups"])
app.include_router(matches.group_matches_router, prefix="/groups", tags=["matches"])
app.include_router(stats.router, prefix="/groups", tags=["stats"])
app.include_router(matches.match_router, prefix="/matches", tags=["matches"])
app.include_router(rulesets.router, prefix="/rulesets", tags=["rulesets"])
app.include_router(websocket.router, prefix="/websocket", tags=["websocket"])
app.include_router(lobbys.router, prefix="/lobbys", tags=["lobbys"])
app.include_router(notifications.router, prefix="/notifications", tags=["notifications"])

@app.get("/")
async def root():
    return {"message": "Catan Stats API", "version": app.version}


@app.get("/health")
async def health():
    return {"status": "ok"}
