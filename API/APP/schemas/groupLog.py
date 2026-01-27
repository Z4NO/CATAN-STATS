from pydantic import BaseModel, TypeAdapter
from datetime import datetime
from typing import Optional, Dict


class GroupLogOut(BaseModel):
    id: int
    group_id: int
    user_id: Optional[int] = None
    action_type: str
    timestamp: datetime
    metadata: Optional[Dict] = None
    user: Optional["UserOut"] = None
    group: Optional["GroupOut"] = None

    model_config = {
        "from_attributes": True
    }


from app.schemas.user import UserOut
from app.schemas.group import GroupOut 
GroupLogOut.model_rebuild()
