import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import groups, matches, rulesets, stats, user
from app.config import settings

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

app = FastAPI(title=settings.APP_NAME, version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router, prefix="/users", tags=["users"])
app.include_router(groups.router, prefix="/groups", tags=["groups"])
app.include_router(matches.group_matches_router, prefix="/groups", tags=["matches"])
app.include_router(stats.router, prefix="/groups", tags=["stats"])
app.include_router(matches.match_router, prefix="/matches", tags=["matches"])
app.include_router(rulesets.router, prefix="/rulesets", tags=["rulesets"])


@app.get("/")
async def root():
    return {"message": "Catan Stats API", "version": app.version}


@app.get("/health")
async def health():
    return {"status": "ok"}
