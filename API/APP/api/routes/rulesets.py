import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.ruleset import Ruleset
from app.schemas.ruleset import RulesetOut
from app.schemas.user import UserOut
from app.securityf.auth import get_current_active_user

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/", response_model=list[RulesetOut])
async def list_rulesets(
    _: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return db.query(Ruleset).order_by(Ruleset.victory_points, Ruleset.max_players).all()


@router.get("/{ruleset_id}", response_model=RulesetOut)
async def get_ruleset(
    ruleset_id: int,
    _: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    ruleset = db.query(Ruleset).filter(Ruleset.id == ruleset_id).first()
    if not ruleset:
        raise HTTPException(status_code=404, detail="Ruleset not found")
    return ruleset
