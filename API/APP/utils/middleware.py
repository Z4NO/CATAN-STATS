import logging
import time
import uuid

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.utils.logging import request_id_ctx

logger = logging.getLogger("app.request")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        if request.headers.get("upgrade", "").lower() == "websocket":
            return await call_next(request)

        request_id = request.headers.get("X-Request-ID") or uuid.uuid4().hex[:12]
        token = request_id_ctx.set(request_id)
        request.state.request_id = request_id

        start = time.perf_counter()
        try:
            response = await call_next(request)
        except Exception:
            duration_ms = (time.perf_counter() - start) * 1000
            logger.exception(
                f"{request.method} {request.url.path} -> 500 ({duration_ms:.1f}ms)"
            )
            request_id_ctx.reset(token)
            raise

        duration_ms = (time.perf_counter() - start) * 1000
        response.headers["X-Request-ID"] = request_id

        log_level = logging.WARNING if response.status_code >= 500 else logging.INFO
        logger.log(
            log_level,
            f"{request.method} {request.url.path} -> {response.status_code} ({duration_ms:.1f}ms)",
        )

        request_id_ctx.reset(token)
        return response
