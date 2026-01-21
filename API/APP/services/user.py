from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserOut, UserBase
from app.security import hash_password
from datetime import datetime


def create_user(db: Session, user_create: UserCreate) -> UserOut:
    hashed_password = hash_password(user_create.password)
    db_user = User(
        username=user_create.username,
        email=user_create.email,
        display_name=user_create.display_name,
        avatar=user_create.avatar,
        password_hash=hashed_password,
        account_created=datetime.now(),
        active=True
    )
    db.add(db_user)
    
    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise e
    
def get_user_by_id(db: Session, user_id: int) -> UserOut | None:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str) -> UserOut | None:
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str) -> UserOut | None:
    return db.query(User).filter(User.email == email).first()