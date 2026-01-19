from app.db.session import Base, engine
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False, index=True, unique=True)
    display_name = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    account_created = Column(DateTime, nullable=False)
    account_deleted = Column(DateTime, nullable=True)
    active = Column(Boolean, default=True)
    email = Column(String, unique=True, index=True, nullable=False)

    