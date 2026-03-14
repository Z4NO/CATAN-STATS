import enum

from app.db.session import Base, engine
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.orm import relationship

class PrivacyEnum(str, enum.Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    RESTRICTED = "restricted"

class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True, )
    join_code = Column(String, unique=True, index=True)
    privacy = Column(String, nullable=False, default=PrivacyEnum.PRIVATE)
    description = Column(String, nullable=True)
    creator_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False)
    members = relationship("GroupMember", back_populates="group")
    logs = relationship("GroupLog", back_populates="group", cascade="all, delete-orphan")
