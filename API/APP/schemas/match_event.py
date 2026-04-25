from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.user import UserOut


class MatchEventBase(BaseModel):
    player_id: int
    event_type: str
    event_time: datetime
    details: Optional[str] = None


class MatchEventCreate(MatchEventBase):
    pass


class MatchEventOut(MatchEventBase):
    id: int
    match_id: int
    player: Optional[UserOut] = None

    model_config = {
        "from_attributes": True
    }
