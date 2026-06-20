import logging
import secrets
from typing import Optional

from sqlalchemy.orm import Session, joinedload

from app.models.group import Group
from app.models.groupMember import GroupMember
from app.models.lobby import Lobby, LobbyPlayer
from app.models.ruleset import Ruleset
from app.schemas.lobby import LobbyCreate

logger = logging.getLogger(__name__)


def _ensure_group_exists(db: Session, group_id: int) -> Group:
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise ValueError(f"Group {group_id} not found")
    return group


def _ensure_ruleset_exists(db: Session, ruleset_id: int) -> Ruleset:
    ruleset = db.query(Ruleset).filter(Ruleset.id == ruleset_id).first()
    if not ruleset:
        raise ValueError(f"Ruleset {ruleset_id} not found")
    return ruleset


def _ensure_active_member(db: Session, group_id: int, user_id: int) -> None:
    member = (
        db.query(GroupMember)
        .filter(
            GroupMember.group_id == group_id,
            GroupMember.user_id == user_id,
            GroupMember.active == True,
            GroupMember.banned == False,
        )
        .first()
    )
    if not member:
        raise ValueError(f"User {user_id} is not an active member of group {group_id}")


def _load_lobby(db: Session, lobby_id: int) -> Lobby:
    lobby = (
        db.query(Lobby)
        .options(
            joinedload(Lobby.ruleset),
            joinedload(Lobby.players).joinedload(LobbyPlayer.user),
        )
        .filter(Lobby.id == lobby_id)
        .first()
    )
    if not lobby:
        raise ValueError(f"Lobby {lobby_id} not found")
    return lobby


def create_lobby(db: Session, group_id: int, lobby_data: LobbyCreate, creator_id: int) -> tuple[Lobby, str]:
    try:
        _ensure_group_exists(db, group_id)
        _ensure_ruleset_exists(db, lobby_data.ruleset_id)
        _ensure_active_member(db, group_id, creator_id)

        lobby = Lobby(
            group_id=group_id,
            ruleset_id=lobby_data.ruleset_id,
            status="waiting",
        )
        db.add(lobby)
        db.flush()

        token = secrets.token_urlsafe(32)
        host = LobbyPlayer(
            lobby_id=lobby.id,
            user_id=creator_id,
            is_host=True,
            is_ready=True,
            token=token,
        )
        db.add(host)
        db.commit()
        db.refresh(lobby)

        logger.info(f"Lobby {lobby.id} created in group {group_id} by user {creator_id}")
        return lobby, token

    except ValueError:
        db.rollback()
        raise
    except Exception as e:
        logger.error(f"Unexpected error creating lobby in group {group_id}: {e}")
        db.rollback()
        raise


def join_lobby(db: Session, lobby_id: int, user_id: int) -> tuple[LobbyPlayer, str]:
    try:
        lobby = _load_lobby(db, lobby_id)

        if lobby.status != "waiting":
            raise ValueError(f"Lobby {lobby_id} is not accepting new players (status: {lobby.status})")

        _ensure_active_member(db, lobby.group_id, user_id)

        already_in = any(p.user_id == user_id for p in lobby.players)
        if already_in:
            raise ValueError(f"User {user_id} is already in lobby {lobby_id}")

        ruleset = _ensure_ruleset_exists(db, lobby.ruleset_id)
        if len(lobby.players) >= ruleset.max_players:
            raise ValueError(f"Lobby {lobby_id} is full ({ruleset.max_players} players max)")

        token = secrets.token_urlsafe(32)
        player = LobbyPlayer(
            lobby_id=lobby_id,
            user_id=user_id,
            is_host=False,
            is_ready=False,
            token=token,
        )
        db.add(player)
        db.commit()
        db.refresh(player)

        logger.info(f"User {user_id} joined lobby {lobby_id}")
        return player, token

    except ValueError:
        db.rollback()
        raise
    except Exception as e:
        logger.error(f"Unexpected error joining lobby {lobby_id}: {e}")
        db.rollback()
        raise


def set_player_ready(db: Session, lobby_id: int, user_id: int, is_ready: bool) -> LobbyPlayer:
    try:
        lobby = db.query(Lobby).filter(Lobby.id == lobby_id).first()
        if not lobby:
            raise ValueError(f"Lobby {lobby_id} not found")
        if lobby.status != "waiting":
            raise ValueError(f"Lobby {lobby_id} is not in waiting state")

        player = (
            db.query(LobbyPlayer)
            .filter(LobbyPlayer.lobby_id == lobby_id, LobbyPlayer.user_id == user_id)
            .first()
        )
        if not player:
            raise ValueError(f"User {user_id} is not in lobby {lobby_id}")

        player.is_ready = is_ready
        db.commit()
        db.refresh(player)

        logger.info(f"User {user_id} set ready={is_ready} in lobby {lobby_id}")
        return player

    except ValueError:
        db.rollback()
        raise
    except Exception as e:
        logger.error(f"Unexpected error updating ready state in lobby {lobby_id}: {e}")
        db.rollback()
        raise


def start_lobby(db: Session, lobby_id: int, user_id: int) -> Lobby:
    try:
        lobby = _load_lobby(db, lobby_id)

        if lobby.status != "waiting":
            raise ValueError(f"Lobby {lobby_id} cannot be started (status: {lobby.status})")

        host = next((p for p in lobby.players if p.user_id == user_id and p.is_host), None)
        if not host:
            raise ValueError(f"User {user_id} is not the host of lobby {lobby_id}")

        if len(lobby.players) < 2:
            raise ValueError("Need at least 2 players to start")

        not_ready = [p.user_id for p in lobby.players if not p.is_ready]
        if not_ready:
            raise ValueError(f"Players {not_ready} are not ready")

        lobby.status = "in_progress"
        db.commit()
        db.refresh(lobby)

        logger.info(f"Lobby {lobby_id} started by host {user_id}")
        return lobby

    except ValueError:
        db.rollback()
        raise
    except Exception as e:
        logger.error(f"Unexpected error starting lobby {lobby_id}: {e}")
        db.rollback()
        raise


def finish_lobby(db: Session, lobby_id: int, match_id: int) -> Lobby:
    try:
        lobby = db.query(Lobby).filter(Lobby.id == lobby_id).first()
        if not lobby:
            raise ValueError(f"Lobby {lobby_id} not found")
        if lobby.status == "finished":
            raise ValueError(f"Lobby {lobby_id} is already finished")

        lobby.status = "finished"
        lobby.match_id = match_id
        db.commit()
        db.refresh(lobby)

        logger.info(f"Lobby {lobby_id} finished, linked to match {match_id}")
        return lobby

    except ValueError:
        db.rollback()
        raise
    except Exception as e:
        logger.error(f"Unexpected error finishing lobby {lobby_id}: {e}")
        db.rollback()
        raise


def get_lobby(db: Session, lobby_id: int) -> Optional[Lobby]:
    return (
        db.query(Lobby)
        .options(
            joinedload(Lobby.ruleset),
            joinedload(Lobby.players).joinedload(LobbyPlayer.user),
        )
        .filter(Lobby.id == lobby_id)
        .first()
    )
