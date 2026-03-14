import datetime
import secrets
from sqlalchemy.orm import Session
from app.models.groupMember import GroupMember
from app.schemas.groupMember import RoleEnum
from app.schemas.group import GroupOut, GroupCreate
from app.models.group import Group, PrivacyEnum

MAX_CODE_GENERATION_ATTEMPTS = 5

def create_group(db: Session, user_id: int, group: GroupCreate) -> GroupOut:
    try:
        new_group = Group(
            name=group.name,
            description=group.description,
            creator_id=user_id,
            created_at=datetime.datetime.now(),
            privacy=group.privacy.value
        )
        db.add(new_group)
        db.flush() 

        assign_new_join_code(db, new_group.id)

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
    
def get_members_from_group(db: Session, group_id: int) -> list[GroupMember]:
    try:
        memberships = db.query(GroupMember).filter(GroupMember.group_id == group_id).all()
        if not memberships:
            raise ValueError(f"No members found for group with id {group_id}")
        return memberships
    except Exception as e:
        raise e

def is_user_banned_from_group(db: Session, user_id: int, group_id: int) -> bool:
    try:
        membership = db.query(GroupMember).filter(
            GroupMember.group_id == group_id,
            GroupMember.user_id == user_id
        ).first()
        if not membership:
            return False
        return membership.banned
    except Exception as e:
        raise e

def join_group_by_code(db: Session, user_id: int, code: str) -> GroupOut:
    try:
        group = db.query(Group).filter(Group.join_code == code).first()
        if not group:
            raise ValueError("Invalid join code")
        
        if group.privacy == PrivacyEnum.PRIVATE:
            raise ValueError("This group is private and cannot be joined with a code")
        
        existing_membership = db.query(GroupMember).filter(
            GroupMember.group_id == group.id,
            GroupMember.user_id == user_id
        ).first()
        if existing_membership:
            raise ValueError("User is already a member of this group")
        
        if is_user_banned_from_group(db, user_id, group.id):
            raise ValueError("User is banned from this group and cannot join")
        
        new_membership = GroupMember(
            group_id=group.id,
            user_id=user_id,
            role=RoleEnum.MEMBER,
            joined_at=datetime.datetime.now(),
            active=True
        )
        db.add(new_membership)
        db.commit()
        db.refresh(group)
        return group
    except Exception as e:
        db.rollback()
        raise e

def get_all_my_group_memberships(db: Session, user_id: int) -> list[GroupMember]:
    return db.query(GroupMember).filter(GroupMember.user_id == user_id).all()

def verify_code_exists(db: Session, code: str) -> bool:
    return db.query(Group).filter(Group.join_code == code).first() is not None


def assign_new_join_code(db: Session, group_id: int) -> str:
    try:
        new_code = create_unique_code_for_group(db, group_id)
        group = db.query(Group).filter(Group.id == group_id).first()
        if not group:
            raise ValueError(f"Group with id {group_id} not found")
        
        group.join_code = new_code
        db.commit()
        return new_code
    except Exception as e:
        db.rollback()
        raise e

def create_unique_code_for_group(db: Session, group_id: int) -> str:
    try:
        for attempt in range(1, MAX_CODE_GENERATION_ATTEMPTS + 1):
            code = secrets.token_urlsafe(6)
            if not verify_code_exists(db, code):
                return code
            
        raise RuntimeError(f"Could not generate a unique join code for group {group_id} after {attempt} attempts")
    except RuntimeError:
        raise
    except Exception as e:
        raise RuntimeError(f"Unexpected error generating join code for group {group_id}: {e}") from e
