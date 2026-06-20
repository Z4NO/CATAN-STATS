from datetime import datetime

from pydantic import BaseModel


class LobbyInviteCreate(BaseModel):
    type: str = "LOBBY_INVITE"
    lobby_id: int
    from_user: str
    ruleset: str


class LobbyInviteOut(LobbyInviteCreate):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
