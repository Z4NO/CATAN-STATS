from typing import Optional

from fastapi import Depends, HTTPException, Request, status
from jwt import decode, InvalidTokenError
from sqlalchemy.orm import Session

from app.config import settings
from app.db.session import get_db
from app.schemas.user import UserOut
from app.securityf.dependencies import oauth2_scheme
from app.services.user import get_user_by_id

_UNAUTHORIZED = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="No autenticado",
    headers={"WWW-Authenticate": "Bearer"},
)

_INVALID_TOKEN = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="No se pudieron validar las credenciales",
    headers={"WWW-Authenticate": "Bearer"},
)


async def get_current_user(
    request: Request,
    header_token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> UserOut:
    token = header_token or request.cookies.get("access_token")

    if not token:
        raise _UNAUTHORIZED

    try:
        payload = decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise _INVALID_TOKEN
    except InvalidTokenError:
        raise _INVALID_TOKEN

    user = get_user_by_id(db, user_id)
    if not user:
        raise _INVALID_TOKEN

    return user

async def get_current_active_user(current_user: UserOut = Depends(get_current_user)) -> UserOut:
    if not current_user.active:
        raise HTTPException(status_code=400, detail="Usuario inactivo")
    return current_user
