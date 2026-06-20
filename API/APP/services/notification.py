import logging
from typing import Optional

from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.schemas.notification import BaseNotification

logger = logging.getLogger(__name__)


def create_notification(db: Session, user_id: int, notification: BaseNotification) -> Notification:
    try:
        record = Notification(
            user_id=user_id,
            type=notification.type,
            payload=notification.model_dump(),
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        logger.info(f"Notification of type '{notification.type}' created for user {user_id}")
        return record
    except Exception as e:
        logger.error(f"Error creating notification: {e}")
        db.rollback()
        raise


def get_pending_notifications(db: Session, user_id: int) -> list[Notification]:
    try:
        return (
            db.query(Notification)
            .filter(Notification.user_id == user_id, Notification.is_read == False)
            .order_by(Notification.created_at.asc())
            .all()
        )
    except Exception as e:
        logger.error(f"Error fetching pending notifications for user {user_id}: {e}")
        raise


def mark_as_read(db: Session, notification_id: int) -> Optional[Notification]:
    try:
        notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if not notification:
            raise ValueError(f"Notification {notification_id} not found")
        notification.is_read = True
        db.commit()
        db.refresh(notification)
        logger.info(f"Notification {notification_id} marked as read")
        return notification
    except ValueError:
        raise
    except Exception as e:
        logger.error(f"Error marking notification {notification_id} as read: {e}")
        db.rollback()
        raise


def mark_all_as_read(db: Session, user_id: int) -> int:
    try:
        updated = (
            db.query(Notification)
            .filter(Notification.user_id == user_id, Notification.is_read == False)
            .update({"is_read": True})
        )
        db.commit()
        logger.info(f"Marked {updated} notifications as read for user {user_id}")
        return updated
    except Exception as e:
        logger.error(f"Error marking all notifications as read for user {user_id}: {e}")
        db.rollback()
        raise


def delete_notification(db: Session, notification_id: int) -> None:
    try:
        notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if not notification:
            raise ValueError(f"Notification {notification_id} not found")
        db.delete(notification)
        db.commit()
        logger.info(f"Notification {notification_id} deleted")
    except ValueError:
        raise
    except Exception as e:
        logger.error(f"Error deleting notification {notification_id}: {e}")
        db.rollback()
        raise
