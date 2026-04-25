from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.groupMember import GroupMember, RoleEnum
from app.models.match import Match
from app.schemas.user import UserOut
from app.securityf.auth import get_current_active_user


def require_admin_permission_on_group(
    group_id: int,
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> UserOut:
    membership = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == current_user.id,
    ).first()

    if not membership or membership.role != RoleEnum.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin permissions required for this group",
        )

    return current_user


def require_group_member(
    group_id: int,
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> UserOut:
    is_member = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == current_user.id,
        GroupMember.active == True,
        GroupMember.banned == False,
    ).first()

    if not is_member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this group",
        )

    return current_user


def require_match_group_member(
    match_id: int,
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> UserOut:
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")

    is_member = db.query(GroupMember).filter(
        GroupMember.group_id == match.group_id,
        GroupMember.user_id == current_user.id,
        GroupMember.active == True,
        GroupMember.banned == False,
    ).first()

    if not is_member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this match's group",
        )

    return current_user


def require_match_group_admin(
    match_id: int,
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> UserOut:
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")

    membership = db.query(GroupMember).filter(
        GroupMember.group_id == match.group_id,
        GroupMember.user_id == current_user.id,
    ).first()

    if not membership or membership.role != RoleEnum.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin permissions required for this match's group",
        )

    return current_user
