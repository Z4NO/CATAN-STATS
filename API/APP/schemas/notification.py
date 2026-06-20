from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class NotificationOut(BaseModel):
    id: int
    user_id: int
    type: str
    payload: dict
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class BaseNotification(BaseModel):
    type: str


class LobbyInviteNotification(BaseNotification):
    type: str = "LOBBY_INVITE"
    lobby_id: int
    from_user: str
    ruleset: str
    players: list[str]


class GameStartedNotification(BaseNotification):
    type: str = "GAME_STARTED"
    lobby_id: int
    match_id: int


class PlayerKickedNotification(BaseNotification):
    type: str = "PLAYER_KICKED"
    lobby_id: int
    reason: Optional[str] = None
