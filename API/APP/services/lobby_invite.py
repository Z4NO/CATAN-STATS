import logging
from typing import Optional

from sqlalchemy.orm import Session

from app.models.lobby_invite import LobbyInvite
from app.schemas.lobby_invite import LobbyInviteCreate

logger = logging.getLogger(__name__)


def create_lobby_invite(db: Session, invite_data: LobbyInviteCreate) -> LobbyInvite:
    try:
        invite = LobbyInvite(
            type=invite_data.type,
            lobby_id=invite_data.lobby_id,
            from_user=invite_data.from_user,
            ruleset=invite_data.ruleset,
        )
        db.add(invite)
        db.commit()
        db.refresh(invite)
        logger.info(f"LobbyInvite created for lobby {invite_data.lobby_id} from {invite_data.from_user}")
        return invite
    except Exception as e:
        logger.error(f"Error creating lobby invite: {e}")
        db.rollback()
        raise


def get_lobby_invites(db: Session, lobby_id: int) -> list[LobbyInvite]:
    try:
        return db.query(LobbyInvite).filter(LobbyInvite.lobby_id == lobby_id).all()
    except Exception as e:
        logger.error(f"Error fetching invites for lobby {lobby_id}: {e}")
        raise


def get_lobby_invite(db: Session, invite_id: int) -> Optional[LobbyInvite]:
    try:
        return db.query(LobbyInvite).filter(LobbyInvite.id == invite_id).first()
    except Exception as e:
        logger.error(f"Error fetching lobby invite {invite_id}: {e}")
        raise


def delete_lobby_invite(db: Session, invite_id: int) -> None:
    try:
        invite = db.query(LobbyInvite).filter(LobbyInvite.id == invite_id).first()
        if not invite:
            raise ValueError(f"LobbyInvite {invite_id} not found")
        db.delete(invite)
        db.commit()
        logger.info(f"LobbyInvite {invite_id} deleted")
    except ValueError:
        raise
    except Exception as e:
        logger.error(f"Error deleting lobby invite {invite_id}: {e}")
        db.rollback()
        raise
