from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.schemas.ruleset import RulesetOut
from app.schemas.user import UserOut


class LobbyCreate(BaseModel):
    ruleset_id: int
    group_id: int


class LobbyPlayerOut(BaseModel):
    id: int
    lobby_id: int
    user_id: int
    user: Optional[UserOut] = None
    is_ready: bool
    is_host: bool
    joined_at: datetime

    model_config = {"from_attributes": True}


class LobbyPlayerWithTokenOut(LobbyPlayerOut):
    token: str


class LobbyOut(BaseModel):
    id: int
    group_id: int
    ruleset_id: int
    status: str
    current_sequence: int
    match_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    ruleset: Optional[RulesetOut] = None
    players: list[LobbyPlayerOut] = []

    model_config = {"from_attributes": True}


class LobbyJoinOut(BaseModel):
    token: str
    lobby: LobbyOut
    player: LobbyPlayerOut
