import datetime
from sqlalchemy.orm import Session
from app.models.groupMember import GroupMember
from app.schemas.groupMember import  RoleEnum
from app.schemas.group import GroupOut, GroupCreate
from app.models.group import Group


def create_group(db: Session, user_id: int, group: GroupCreate) -> GroupOut:
    try:
        new_group = Group(
            name=group.name,
            description=group.description,
            creator_id=user_id,
            created_at=datetime.datetime.now()
        )
        db.add(new_group)
        db.flush() 

        group_relation = GroupMember(
            group_id=new_group.id,
            user_id=user_id,
            role=RoleEnum.ADMIN,
            joined_at=datetime.datetime.now(),
            active=True
        )
        db.add(group_relation)
        db.commit()
        db.refresh(new_group)
        return new_group
    except Exception as e:
        db.rollback()
        raise e
    

def get_all_my_group_memberships(db: Session, user_id: int) -> list[GroupMember]:
    return db.query(GroupMember).filter(GroupMember.user_id == user_id).all()

