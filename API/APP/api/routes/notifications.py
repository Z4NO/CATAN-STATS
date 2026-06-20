import asyncio
import json
import logging
from collections.abc import AsyncIterable

from fastapi import APIRouter, Depends
from fastapi.sse import EventSourceResponse, ServerSentEvent
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import UserOut
from app.securityf.auth import get_current_active_user
from app.services.notification import get_pending_notifications, mark_all_as_read
from app.services.notification_servicie import notification_service

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/stream", response_class=EventSourceResponse)
async def notification_stream(
    current_user: UserOut = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> AsyncIterable[ServerSentEvent]:
    queue = notification_service.register_user(current_user.id)

    pending = get_pending_notifications(db, current_user.id)
    event_id = 0
    for n in pending:
        event_id += 1
        yield ServerSentEvent(
            data=json.dumps(n.payload),
            event=n.type,
            id=str(event_id),
            retry=3000,
        )
    if pending:
        mark_all_as_read(db, current_user.id)

    try:
        while True:
            notification = await queue.get()
            event_id += 1
            yield ServerSentEvent(
                data=json.dumps(notification.model_dump()),
                event=notification.type,
                id=str(event_id),
                retry=3000,
            )
    except asyncio.CancelledError:
        notification_service.unregister_user(current_user.id)
        raise
