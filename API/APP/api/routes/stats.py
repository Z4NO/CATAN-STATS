import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.dependencies import require_group_member
from app.db.session import get_db
from app.schemas.stats import GroupStatsOut, PlayerProfileStats
from app.services.stats import get_group_stats, get_player_profile_in_group

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get(
    "/{group_id}/stats",
    response_model=GroupStatsOut,
    dependencies=[Depends(require_group_member)],
)
async def group_stats(
    group_id: int,
    ruleset_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    try:
        return get_group_stats(db, group_id, ruleset_id)
    except Exception as e:
        logger.error(f"Error calculating group stats {group_id}: {e}")
        raise HTTPException(status_code=500, detail="Error calculating group stats")


@router.get(
    "/{group_id}/players/{user_id}/stats",
    response_model=PlayerProfileStats,
    dependencies=[Depends(require_group_member)],
)
async def player_profile_stats(
    group_id: int,
    user_id: int,
    db: Session = Depends(get_db),
):
    try:
        return get_player_profile_in_group(db, group_id, user_id)
    except Exception as e:
        logger.error(f"Error calculating player profile {user_id} in group {group_id}: {e}")
        raise HTTPException(status_code=500, detail="Error calculating player profile")
