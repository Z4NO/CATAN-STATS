import enum

from app.db.session import Base, engine
from sqlalchemy import Column, ForeignKey, Integer,  Boolean, String
from sqlalchemy.orm import relationship



class ExpansionsName(str, enum.Enum):
    BASE = "base"
    SEAFARERS = "seafarers"
    CITIES_AND_KNIGHTS = "cities_and_knights"
    TRADERS_AND_BARBARIANS = "traders_and_barbarians"
    EXPLORERS_AND_PIRATES = "explorers_and_pirates"

class Ruleset(Base):
    __tablename__ = "ruleset"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, default=ExpansionsName.BASE)
    description = Column(String, nullable=True)
    victory_points = Column(Integer, nullable=False, default=10)
    max_players = Column(Integer, nullable=False, default=4)

    matches = relationship("Match", back_populates="ruleset", cascade="all, delete-orphan")