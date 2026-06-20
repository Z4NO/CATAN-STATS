import logging
from fastapi import WebSocket, WebSocketException
from starlette.status import WS_1011_INTERNAL_ERROR

logger = logging.getLogger(__name__)


class WebSocketConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, list[WebSocket]] = {}
    
    


    async def connect_to_lobby(self, websocket: WebSocket, lobby_id: int) -> None:
        try:
            await websocket.accept()
            self.active_connections.setdefault(lobby_id, []).append(websocket)
            logger.info(f"WebSocket connected to lobby {lobby_id}")
        except Exception as e:
            logger.error(f"Failed to accept WebSocket for lobby {lobby_id}: {e}")
            raise WebSocketException(code=WS_1011_INTERNAL_ERROR, reason="Could not establish connection")

    async def connect(self, websocket: WebSocket, game_id: int) -> None:
        try:
            await websocket.accept()
            self.active_connections.setdefault(game_id, []).append(websocket)
            logger.info(f"WebSocket connected to game {game_id}")
        except Exception as e:
            logger.error(f"Failed to accept WebSocket for game {game_id}: {e}")
            raise WebSocketException(code=WS_1011_INTERNAL_ERROR, reason="Could not establish connection")


    def disconnect(self, websocket: WebSocket, game_id: int) -> None:
        connections = self.active_connections.get(game_id, [])
        if websocket in connections:
            connections.remove(websocket)
        logger.info(f"WebSocket disconnected from game {game_id}")

    def disconnect_from_lobby(self, websocket: WebSocket, lobby_id: int) -> None:
        connections = self.active_connections.get(lobby_id, [])
        if websocket in connections:
            connections.remove(websocket)
        logger.info(f"WebSocket disconnected from lobby {lobby_id}")

    async def broadcast_to_game(self, game_id: int, message: dict) -> None:
        for connection in self.active_connections.get(game_id, []):
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting to game {game_id}: {e}")

    
        



manager = WebSocketConnectionManager()
