from pydantic import BaseModel
from typing import Optional
from app.models.ruleset import ExpansionsName


class RulesetBase(BaseModel):
    name: ExpansionsName = ExpansionsName.BASE
    description: Optional[str] = None
    victory_points: int = 10
    max_players: int = 4


class RulesetCreate(RulesetBase):
    pass


class RulesetOut(RulesetBase):
    id: int

    model_config = {
        "from_attributes": True
    }
