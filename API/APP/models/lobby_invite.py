from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class LobbyInvite(Base):
    __tablename__ = "lobby_invites"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, default="LOBBY_INVITE", nullable=False)
    lobby_id = Column(Integer, ForeignKey("lobbies.id", ondelete="CASCADE"), nullable=False)
    from_user = Column(String, nullable=False)
    ruleset = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    lobby = relationship("Lobby", back_populates="invites")
