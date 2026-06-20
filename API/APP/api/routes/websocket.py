import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.websocket import manager

logger = logging.getLogger(__name__)
router = APIRouter()


@router.websocket("/ws/lobby/{lobby_id}")
async def websocket_lobby_endpoint(websocket: WebSocket, lobby_id: int):
    await manager.connect_to_lobby(websocket, lobby_id)
    try:
        while True:
            data = await websocket.receive_json()
            # Aquí podrías manejar mensajes específicos para el lobby
            logger.info(f"Received message for lobby {lobby_id}: {data}")
    except WebSocketDisconnect:
        manager.disconnect_from_lobby(websocket, lobby_id)
        
@router.websocket("/ws/game/{game_id}")
async def websocket_endpoint(websocket: WebSocket, game_id: int):
    await manager.connect(websocket, game_id)
    try:
        while True:
            data = await websocket.receive_json()
            await manager.broadcast_to_game(game_id, data)
    except WebSocketDisconnect:
        manager.disconnect(websocket, game_id)


@router.get("/ws/game/{game_id}/status")
async def game_connection_status(game_id: int):
    connections = len(manager.active_connections.get(game_id, []))
    return {"game_id": game_id, "active_connections": connections}
