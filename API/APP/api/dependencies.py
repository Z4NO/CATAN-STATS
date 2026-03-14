from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.groupMember import GroupMember
from app.schemas.user import UserOut
from app.securityf.auth import get_current_active_user


def require_group_member(
    group_id: int,
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> UserOut:
    is_member = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == current_user.id
    ).first()

    if not is_member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this group"
        )

    return current_user
