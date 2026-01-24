from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserOut
from app.db.session import SessionLocal
from app.services.user import create_user, get_user_by_email, get_user_by_username
import traceback
from app.security import create_access_token, verify_password
from app.securityf.auth import get_current_active_user
from app.schemas.token import Token
from fastapi.security import OAuth2PasswordRequestForm
from app.models.user import User





router = APIRouter()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def authenticate_user(db: Session, username_or_email: str, password: str) -> User | None:
    user = db.query(User).filter(
        (User.email == username_or_email) | (User.username == username_or_email)
    ).first()

    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None

    return user

@router.get("/me", response_model=UserOut)
async def get_me(current_user: UserOut = Depends(get_current_active_user)):
    return current_user


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register_user(user_create: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_email(db, user_create.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    if get_user_by_username(db, user_create.username):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")
    
    try:
        new_user = create_user(db, user_create)
        return new_user
    except Exception as e:
        traceback.print_exc() 
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Algo salió mal al crear el usuario")