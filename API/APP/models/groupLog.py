from app.db.session import Base, engine
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Enum
from sqlalchemy.schema import ForeignKey
from sqlalchemy.dialects.postgresql import JSON
from datetime import datetime , timezone
import enum
from sqlalchemy.orm import relationship

class ActionTypeEnum(str, enum.Enum):
    JOIN = "join"
    LEAVE = "leave"
    KICK = "kick"
    BAN = "ban"
    CREATED_MATCH = "created_match"

class GroupLog(Base):
    __tablename__ = "group_logs"
    id = Column(Integer, primary_key=True)
    group_id = Column(ForeignKey("groups.id"), nullable=False)
    group = relationship("Group", back_populates="logs")
    user_id = Column(ForeignKey("users.id"), nullable=True)
    user = relationship("User", back_populates="logs", )
    action_type = Column(Enum(ActionTypeEnum), nullable=False)
    timestamp = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    extra_data  = Column(JSON, nullable=True)
