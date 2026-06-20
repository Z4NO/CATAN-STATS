from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class Lobby(Base):
    __tablename__ = "lobbies"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    ruleset_id = Column(Integer, ForeignKey("ruleset.id"), nullable=False)

    status = Column(String, default="waiting", nullable=False)
    # "waiting"     → sala de espera, jugadores entrando
    # "in_progress" → partida en curso (Modo En Juego activo)
    # "finished"    → partida terminada, Match ya creado

    match_id = Column(Integer, ForeignKey("matches.id"), nullable=True)
    # null mientras la partida no ha terminado

    current_sequence = Column(Integer, default=0, nullable=False)
    # se incrementa con cada evento WebSocket

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    group = relationship("Group", back_populates="lobbies")
    ruleset = relationship("Ruleset", back_populates="lobbies")
    match = relationship("Match", back_populates="lobby", foreign_keys=[match_id])
    players = relationship("LobbyPlayer", back_populates="lobby", cascade="all, delete-orphan")
    invites = relationship("LobbyInvite", back_populates="lobby", cascade="all, delete-orphan")


class LobbyPlayer(Base):
    __tablename__ = "lobby_players"

    id = Column(Integer, primary_key=True, index=True)
    lobby_id = Column(Integer, ForeignKey("lobbies.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    is_ready = Column(Boolean, default=False, nullable=False)
    # el anfitrión no puede empezar hasta que todos sean True

    is_host = Column(Boolean, default=False, nullable=False)
    # solo el host puede pulsar "empezar" y "terminar"

    token = Column(String, nullable=False)
    # generado al unirse, guardado en localStorage del cliente
    # se usa para reconexión WebSocket en ws/lobby/{id}?token=xxx

    joined_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    lobby = relationship("Lobby", back_populates="players")
    user = relationship("User", back_populates="lobby_players")
