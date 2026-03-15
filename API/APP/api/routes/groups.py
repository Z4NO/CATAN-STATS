from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import require_admin_permission_on_group, require_group_member
from app.db.session import get_db
from app.schemas.group import GroupOut, GroupCreate
from app.schemas.groupMember import GroupMemberOut, MemberStatusFilter
from app.schemas.user import UserOut
from app.securityf.auth import get_current_active_user
from app.services.groups import (
    create_group,
    get_members_from_group,
    join_group_by_code,
    get_all_my_group_memberships,
    kick_member_from_group,
)


router = APIRouter()


@router.post("/create", response_model=GroupOut, status_code=status.HTTP_201_CREATED)
async def create_new_group(
    group: GroupCreate,
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    try:
        return create_group(db, current_user.id, group)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{group_id}/kick/{user_id}", status_code=status.HTTP_200_OK, dependencies=[Depends(require_admin_permission_on_group)])
async def kick_member(
    group_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    try:
        success = kick_member_from_group(db, group_id, user_id)
        if not success:
            raise HTTPException(status_code=404, detail="Membership not found")
        return {"detail": success}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{group_id}/members", response_model=list[GroupMemberOut], dependencies=[Depends(require_group_member)])
async def get_group_members(
    group_id: int,
    status: MemberStatusFilter = MemberStatusFilter.ACTIVE,
    db: Session = Depends(get_db)
):
    try:
        return get_members_from_group(db, group_id, status)
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/join", response_model=GroupOut)
async def join_group(
    code: str,
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    try:
        return join_group_by_code(db, current_user.id, code)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/my-groups", response_model=list[GroupMemberOut])
async def get_my_groups(
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    try:
        return get_all_my_group_memberships(db, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
