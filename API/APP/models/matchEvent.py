import enum

from app.db.session import Base, engine
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

class MatchEvent(Base):
    __tablename__ = "match_events"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=False)
    player_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_type = Column(String, nullable=False)
    event_time = Column(DateTime, nullable=False)
    details = Column(String, nullable=True)

    match = relationship("Match", back_populates="events")
    player = relationship("User", back_populates="match_events")