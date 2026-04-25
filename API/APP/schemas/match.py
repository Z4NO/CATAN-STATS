from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator, model_validator

from app.schemas.match_event import MatchEventOut
from app.schemas.match_player import MatchPlayerCreate, MatchPlayerOut
from app.schemas.ruleset import RulesetOut
from app.schemas.user import UserOut


class MatchBase(BaseModel):
    date: datetime
    ruleset_id: int
    duration_mins: Optional[int] = None
    has_player_extension: bool = False
    notes: Optional[str] = None

    @field_validator("duration_mins")
    @classmethod
    def duration_non_negative(cls, value: Optional[int]) -> Optional[int]:
        if value is not None and value < 0:
            raise ValueError("duration_mins must be >= 0")
        return value


class MatchCreate(MatchBase):
    winner_id: int
    players: list[MatchPlayerCreate]

    @model_validator(mode="after")
    def validate_players_and_winner(self) -> "MatchCreate":
        if len(self.players) < 2:
            raise ValueError("At least 2 players are required")

        player_ids = [p.player_id for p in self.players]
        if len(set(player_ids)) != len(player_ids):
            raise ValueError("Duplicate player_id in match players")

        if self.winner_id not in player_ids:
            raise ValueError("winner_id must be one of the participants")

        if sum(1 for p in self.players if p.longest_road) > 1:
            raise ValueError("Only one player can hold the longest road")

        if sum(1 for p in self.players if p.largest_army) > 1:
            raise ValueError("Only one player can hold the largest army")

        return self


class MatchOut(MatchBase):
    id: int
    group_id: int
    winner_id: int
    winner: Optional[UserOut] = None
    ruleset: Optional[RulesetOut] = None
    match_players: list[MatchPlayerOut] = []
    events: list[MatchEventOut] = []

    model_config = {
        "from_attributes": True
    }


class MatchSummaryOut(BaseModel):
    id: int
    date: datetime
    group_id: int
    ruleset_id: int
    winner_id: int
    winner: Optional[UserOut] = None
    ruleset: Optional[RulesetOut] = None
    duration_mins: Optional[int] = None
    has_player_extension: bool = False

    model_config = {
        "from_attributes": True
    }


class MatchListOut(BaseModel):
    items: list[MatchSummaryOut]
    total: int
    limit: int
    offset: int
