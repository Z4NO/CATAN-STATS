import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import (
    require_group_member,
    require_match_group_admin,
    require_match_group_member,
)
from app.db.session import get_db
from app.schemas.match import MatchCreate, MatchListOut, MatchOut, MatchSummaryOut
from app.services.matches import (
    create_match,
    delete_match,
    get_match_detail,
    list_group_matches,
)

logger = logging.getLogger(__name__)

group_matches_router = APIRouter()
match_router = APIRouter()


@group_matches_router.post(
    "/{group_id}/matches",
    response_model=MatchOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_group_member)],
)
async def create_match_in_group(
    group_id: int,
    match_data: MatchCreate,
    db: Session = Depends(get_db),
):
    try:
        match = create_match(db, group_id, match_data)
        return get_match_detail(db, match.id)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error creating match in group {group_id}: {e}")
        raise HTTPException(status_code=500, detail="Error creating match")


@group_matches_router.get(
    "/{group_id}/matches",
    response_model=MatchListOut,
    dependencies=[Depends(require_group_member)],
)
async def list_matches_in_group(
    group_id: int,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    ruleset_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    items, total = list_group_matches(db, group_id, limit, offset, ruleset_id)
    return MatchListOut(
        items=[MatchSummaryOut.model_validate(m) for m in items],
        total=total,
        limit=limit,
        offset=offset,
    )


@match_router.get(
    "/{match_id}",
    response_model=MatchOut,
    dependencies=[Depends(require_match_group_member)],
)
async def get_match(match_id: int, db: Session = Depends(get_db)):
    match = get_match_detail(db, match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    return match


@match_router.delete(
    "/{match_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_match_group_admin)],
)
async def delete_match_endpoint(match_id: int, db: Session = Depends(get_db)):
    deleted = delete_match(db, match_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Match not found")
    return None
