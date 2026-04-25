from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings
from sqlalchemy.orm import Session
from typing import Generator

connect_args = {}
engine_kwargs = {}

if settings.ENVIRONMENT == "dev":
    connect_args = {"check_same_thread": False}
else:
    engine_kwargs = {"pool_pre_ping": True}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    **engine_kwargs
)

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

