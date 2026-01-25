from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.groupLog import ActionTypeEnum
from app.schemas.groupMember import GroupMemberOut 

class GroupBase(BaseModel):
    name: str
    description: Optional[str] = None

class GroupCreate(GroupBase):
    creator_id: int

class GroupOut(GroupBase):
    id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class GroupUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class GroupLogOut(BaseModel):
    id: int
    group_id: int
    user_id: Optional[int] = None
    action_type: ActionTypeEnum  
    timestamp: datetime
    metadata: Optional[dict] = None

    model_config = {
        "from_attributes": True
    }

class GroupWithMembersOut(GroupOut):
    members: list["GroupMemberOut"] = []

class GroupWithLogsOut(GroupOut):
    logs: list[GroupLogOut] = []
