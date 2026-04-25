from pydantic import BaseModel
from typing import Optional
from app.schemas.user import UserOut


class MatchPlayerBase(BaseModel):
    player_id: int
    points_earned: int
    longest_road: bool = False
    largest_army: bool = False
    thief_moves: int = 0
    city_count: int = 0
    village_count: int = 0
    roads_built: int = 0


class MatchPlayerCreate(BaseModel):
    player_id: int
    points_earned: int
    longest_road: bool = False
    largest_army: bool = False
    thief_moves: int = 0
    city_count: int = 0
    village_count: int = 0
    roads_built: int = 0


class MatchPlayerOut(MatchPlayerBase):
    id: int
    match_id: int
    player: Optional[UserOut] = None

    model_config = {
        "from_attributes": True
    }
