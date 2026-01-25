from app.db.session import Base, engine
from sqlalchemy import Column, Integer, PrimaryKeyConstraint, String, Float, Boolean, DateTime, Enum
from sqlalchemy.schema import ForeignKey
import enum
from app.models.user import User
from sqlalchemy.orm import relationship

class RoleEnum(str, enum.Enum):
    MEMBER = "member"
    ADMIN = "admin"
    MODERATOR = "moderator"


class GroupMember(Base):
    __tablename__ = "groupMembers"

    user_id = Column(ForeignKey("users.id"), primary_key=True)
    group_id = Column(ForeignKey("groups.id"), primary_key=True)
    joined_at = Column(DateTime, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False, default=RoleEnum.MEMBER)
    active = Column(Boolean, default=True)
    left_at = Column(DateTime, nullable=True)
    banned = Column(Boolean, default=False)
    is_kicked = Column(Boolean, default=False)
    user = relationship("User", back_populates="groups")
    group = relationship("Group", back_populates="members")
    
    __table_args__ = (
        PrimaryKeyConstraint("user_id", "group_id"),
    )

