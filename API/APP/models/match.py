from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False)
    ruleset_id = Column(Integer, ForeignKey("ruleset.id"), nullable=False)
    winner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    duration_mins = Column(Integer, nullable=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False, index=True)
    has_player_extension = Column(Boolean, default=False)
    notes = Column(String, nullable=True)

    group = relationship("Group", back_populates="matches")
    winner = relationship("User", back_populates="won_matches", foreign_keys=[winner_id])
    ruleset = relationship("Ruleset", back_populates="matches")
    match_players = relationship("MatchPlayer", back_populates="match", cascade="all, delete-orphan")
    events = relationship("MatchEvent", back_populates="match", cascade="all, delete-orphan")
