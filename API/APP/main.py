from fastapi import FastAPI
import logging
from app.api.routes import user, groups

app = FastAPI()

app.include_router(user.router, prefix="/users", tags=["users"])
app.include_router(groups.router, prefix="/groups", tags=["groups"])

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)

@app.get("/")
async def root():
    return {"message": "Hello World"}