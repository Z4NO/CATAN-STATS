import enum
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Enum, Integer
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship
from sqlalchemy.schema import ForeignKey

from app.db.session import Base


class ActionTypeEnum(str, enum.Enum):
    JOIN = "join"
    LEAVE = "leave"
    KICK = "kick"
    BAN = "ban"
    CREATED_MATCH = "created_match"


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class GroupLog(Base):
    __tablename__ = "group_logs"

    id = Column(Integer, primary_key=True)
    group_id = Column(ForeignKey("groups.id"), nullable=False)
    user_id = Column(ForeignKey("users.id"), nullable=True)
    action_type = Column(Enum(ActionTypeEnum), nullable=False)
    timestamp = Column(DateTime, default=_utcnow, nullable=False)
    extra_data = Column(JSON, nullable=True)

    group = relationship("Group", back_populates="logs")
    user = relationship("User", back_populates="logs")
