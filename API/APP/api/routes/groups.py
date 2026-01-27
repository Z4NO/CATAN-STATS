from fastapi import APIRouter, Depends, HTTPException
from app.models.groupMember import GroupMember
from app.schemas.groupMember import GroupMemberOut
from app.securityf.auth import get_current_active_user
from app.db.session import SessionLocal
from app.services.groups import *
from app.schemas.user import UserOut


router = APIRouter()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/create", response_model=GroupOut)
async def create_new_group(
    group: GroupCreate,
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new group with the current user as admin."""
    try:
        result = create_group(db, current_user.id, group)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/my-groups", response_model=list[GroupMemberOut])
async def get_all_my_groups(
    current_user: UserOut=Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Retrieve the groups the current user is a member of."""
    try:
        result = get_all_my_group_memberships(db, current_user.id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
     
    