from pydantic import BaseModel, EmailStr, TypeAdapter
from typing import Optional
from datetime import datetime
from app.models.groupMember import RoleEnum


class GroupMemberBase(BaseModel):
    role: RoleEnum 


class GroupMemberOut(GroupMemberBase):
    user_id: int
    group_id: int
    joined_at: datetime
    left_at: Optional[datetime] = None
    banned: bool
    is_kicked: bool
    active: bool
    group: Optional["GroupOut"] = None

    model_config = {
        "from_attributes": True
    }

class GroupMemberCreate(BaseModel):
    user_id: int
    group_id: int
    active: Optional[bool] = True


class GroupMemberUpdate(BaseModel):
    role: Optional[RoleEnum] = None
    active: Optional[bool] = None
    left_at: Optional[datetime] = None
    banned: Optional[bool] = None
    is_kicked: Optional[bool] = None
    
class GroupMemberWithLogsOut(GroupMemberOut):
    logs: Optional[list["GroupLogOut"]] = []

    model_config = {
        "from_attributes": True
    }

class GroupMemberListOut(BaseModel):
    members: list[GroupMemberOut]

    model_config = {
        "from_attributes": True
    }


from app.schemas.group import GroupOut
from app.schemas.groupLog import GroupLogOut
GroupMemberOut.model_rebuild()