import enum

from app.db.session import Base
from sqlalchemy import Column, ForeignKey, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship


class PrivacyEnum(str, enum.Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    RESTRICTED = "restricted"


class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    join_code = Column(String, unique=True, index=True)
    privacy = Column(String, nullable=False, default=PrivacyEnum.PRIVATE.value)
    description = Column(String, nullable=True)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, nullable=False)

    creator = relationship("User", foreign_keys=[creator_id])
    members = relationship("GroupMember", back_populates="group")
    matches = relationship("Match", back_populates="group", cascade="all, delete-orphan")
    logs = relationship("GroupLog", back_populates="group", cascade="all, delete-orphan")
