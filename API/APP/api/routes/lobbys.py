import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.lobby import LobbyCreate, LobbyJoinOut, LobbyOut, LobbyPlayerOut
from app.schemas.notification import LobbyInviteNotification
from app.schemas.user import UserOut
from app.securityf.auth import get_current_active_user
from app.services.lobby import create_lobby as create_lobby_service
from app.services.lobby import finish_lobby as finish_lobby_service
from app.services.lobby import get_lobby
from app.services.lobby import join_lobby as join_lobby_service
from app.services.lobby import set_player_ready as set_player_ready_service
from app.services.lobby import start_lobby as start_lobby_service
from app.services.notification_servicie import notification_service

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/create", response_model=LobbyJoinOut, status_code=status.HTTP_201_CREATED)
def create_new_lobby(
    lobby: LobbyCreate,
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    try:
        lobby_obj, token = create_lobby_service(db=db, group_id=lobby.group_id, lobby_data=lobby, creator_id=current_user.id)
        full_lobby = get_lobby(db, lobby_obj.id)
        host_player = next((p for p in full_lobby.players if p.is_host), None)
        return LobbyJoinOut(token=token, lobby=full_lobby, player=host_player)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error creating lobby for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail="Error creando lobby")


@router.post("/{lobby_id}/join", response_model=LobbyJoinOut)
def join_lobby(
    lobby_id: int,
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    try:
        player, token = join_lobby_service(db=db, lobby_id=lobby_id, user_id=current_user.id)
        lobby = get_lobby(db, lobby_id)
        return LobbyJoinOut(token=token, lobby=lobby, player=player)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error joining lobby {lobby_id} for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail="Error uniéndose al lobby")


@router.post("/{lobby_id}/ready", response_model=LobbyPlayerOut)
def player_ready(
    lobby_id: int,
    is_ready: bool = True,
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    try:
        player = set_player_ready_service(db=db, lobby_id=lobby_id, user_id=current_user.id, is_ready=is_ready)
        return player
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error updating ready state in lobby {lobby_id} for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail="Error actualizando estado")


@router.post("/{lobby_id}/start", response_model=LobbyOut)
def start_lobby(
    lobby_id: int,
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    try:
        lobby = start_lobby_service(db=db, lobby_id=lobby_id, user_id=current_user.id)
        return lobby
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error starting lobby {lobby_id} for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail="Error iniciando lobby")


@router.post("/{lobby_id}/finish", response_model=LobbyOut)
def finish_lobby(
    lobby_id: int,
    match_id: int,
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    try:
        lobby = finish_lobby_service(db=db, lobby_id=lobby_id, match_id=match_id)
        return lobby
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error finishing lobby {lobby_id}: {e}")
        raise HTTPException(status_code=500, detail="Error finalizando lobby")


@router.get("/{lobby_id}", response_model=LobbyOut)
def get_lobby_endpoint(
    lobby_id: int,
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    try:
        lobby = get_lobby(db, lobby_id)
        if not lobby:
            raise HTTPException(status_code=404, detail="Lobby no encontrado")
        return lobby
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching lobby {lobby_id}: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo lobby")


@router.post("/invite/{lobby_id}/{user_id}", status_code=status.HTTP_200_OK)
async def invite_to_lobby(
    lobby_id: int,
    user_id: int,
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    try:
        lobby = get_lobby(db, lobby_id)
        if not lobby:
            raise ValueError(f"Lobby {lobby_id} not found")

        is_host = any(p.user_id == current_user.id and p.is_host for p in lobby.players)
        if not is_host:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Solo el host puede invitar")

        await notification_service.send_notification(
            user_id=user_id,
            notification=LobbyInviteNotification(
                lobby_id=lobby_id,
                from_user=current_user.username,
                ruleset=lobby.ruleset.name if lobby.ruleset else "",
                players=[p.user.username for p in lobby.players if p.user],
            ),
            db=db,
        )
        return {"ok": True}
    except HTTPException:
        raise
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error invitando al usuario {user_id} al lobby {lobby_id}: {e}")
        raise HTTPException(status_code=500, detail="Error enviando invitación")
