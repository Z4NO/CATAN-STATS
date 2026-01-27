from pydantic import BaseModel, TypeAdapter
from typing import Optional
from datetime import datetime
from app.models.groupLog import ActionTypeEnum

class GroupBase(BaseModel):
    name: str
    description: Optional[str] = None

class GroupCreate(GroupBase):
    pass

class GroupOut(GroupBase):
    id: int
    created_at: datetime
    creator_id: int

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
    logs: list["GroupLogOut"] = []

from app.schemas.groupMember import GroupMemberOut 
GroupWithMembersOut.model_rebuild()
