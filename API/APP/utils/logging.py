import logging
import logging.handlers
import sys
from contextvars import ContextVar
from pathlib import Path

from app.config import settings

request_id_ctx: ContextVar[str] = ContextVar("request_id", default="-")

_LOG_FORMAT = "%(asctime)s [%(levelname)s] [%(request_id)s] %(name)s: %(message)s"
_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
_MAX_BYTES = 5 * 1024 * 1024
_BACKUP_COUNT = 5


class RequestIdFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = request_id_ctx.get()
        return True


def setup_logging() -> None:
    log_dir = Path(settings.LOG_DIR)
    log_dir.mkdir(parents=True, exist_ok=True)

    level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    formatter = logging.Formatter(_LOG_FORMAT, datefmt=_DATE_FORMAT)
    request_filter = RequestIdFilter()

    root = logging.getLogger()
    root.setLevel(level)
    root.handlers.clear()

    file_handler = logging.handlers.RotatingFileHandler(
        log_dir / "app.log",
        maxBytes=_MAX_BYTES,
        backupCount=_BACKUP_COUNT,
        encoding="utf-8",
    )
    file_handler.setFormatter(formatter)
    file_handler.addFilter(request_filter)
    root.addHandler(file_handler)

    error_handler = logging.handlers.RotatingFileHandler(
        log_dir / "error.log",
        maxBytes=_MAX_BYTES,
        backupCount=_BACKUP_COUNT,
        encoding="utf-8",
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(formatter)
    error_handler.addFilter(request_filter)
    root.addHandler(error_handler)

    if settings.ENVIRONMENT != "production":
        console = logging.StreamHandler(sys.stdout)
        console.setFormatter(formatter)
        console.addFilter(request_filter)
        root.addHandler(console)

    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.pool").setLevel(logging.WARNING)
