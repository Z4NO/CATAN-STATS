from fastapi import Depends, HTTPException, status
from jwt import decode, InvalidTokenError
from app.securityf.dependencies import oauth2_scheme
from app.config import settings
from app.services.user import get_user_by_id
from app.schemas.token import TokenData
from app.schemas.user import UserOut
from app.db.session import get_db
from sqlalchemy.orm import Session

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> UserOut:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception

    user = get_user_by_id(db, user_id)
    if not user:
        raise credentials_exception

    return user

async def get_current_active_user(current_user: UserOut = Depends(get_current_user)) -> UserOut:
    if not current_user.active:
        raise HTTPException(status_code=400, detail="Usuario inactivo")
    return current_user
