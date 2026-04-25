import logging
import traceback

from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.config import settings
from app.db.session import get_db
from app.models.user import User
from app.schemas.token import Token
from app.schemas.stats import PlayerGlobalProfileStats
from app.schemas.user import UserCreate, UserOut
from app.security import create_access_token, verify_password
from app.securityf.auth import get_current_active_user
from app.services.stats import get_player_profile_stats
from app.services.user import create_user, get_user_by_email, get_user_by_username

logger = logging.getLogger(__name__)
router = APIRouter()

_COOKIE_NAME = "access_token"


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


@router.get("/me/stats", response_model=PlayerGlobalProfileStats)
async def get_my_stats(
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    try:
        return get_player_profile_stats(db, current_user.id)
    except Exception as e:
        logger.error(f"Error fetching stats for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail="Error calculando estadísticas")


@router.post("/token", response_model=Token)
async def login_for_access_token(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    access_token = create_access_token(data={"sub": str(user.id)})

    response.set_cookie(
        key=_COOKIE_NAME,
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=settings.cookie_secure,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response):
    response.delete_cookie(key=_COOKIE_NAME, samesite="lax", httponly=True)
    return None


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
        logger.error(f"Error creating user: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Algo salió mal al crear el usuario")
