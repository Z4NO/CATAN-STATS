import asyncio
import logging

from sqlalchemy.orm import Session

from app.schemas.notification import BaseNotification
from app.services.notification import create_notification, get_pending_notifications

logger = logging.getLogger(__name__)


class NotificationService:
    def __init__(self):
        self.queues: dict[int, asyncio.Queue] = {}

    def register_user(self, user_id: int) -> asyncio.Queue:
        if user_id not in self.queues:
            self.queues[user_id] = asyncio.Queue()
        else:
            logger.info(f"User {user_id} is already registered.")
        return self.queues[user_id]

    def unregister_user(self, user_id: int):
        if user_id in self.queues:
            del self.queues[user_id]
        else:
            logger.info(f"User {user_id} is not registered.")

    async def send_notification(self, user_id: int, notification: BaseNotification, db: Session):
        if user_id in self.queues:
            await self.queues[user_id].put(notification)
        else:
            create_notification(db, user_id, notification)

    def has_pending_notifications(self, user_id: int, db: Session) -> bool:
        return len(get_pending_notifications(db, user_id)) > 0


notification_service = NotificationService()