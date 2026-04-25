import enum

from app.db.session import Base, engine
from sqlalchemy import Column, ForeignKey, Integer,  Boolean
from sqlalchemy.orm import relationship

class MatchPlayer(Base):
    __tablename__ = "match_players"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=False)
    player_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    points_earned = Column(Integer, nullable=False)
    longest_road = Column(Boolean, default=False)
    largest_army = Column(Boolean, default=False)
    thief_moves = Column(Integer, default=0)
    city_count = Column(Integer, default=0)
    village_count = Column(Integer, default=0)
    roads_built = Column(Integer, default=0)
    

    match = relationship("Match", back_populates="match_players")
    player = relationship("User", back_populates="match_participations")