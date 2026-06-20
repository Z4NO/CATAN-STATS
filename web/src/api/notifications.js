const BASE = import.meta.env.VITE_API_BASE_URL

export function connectNotificationStream(handlers) {
  const es = new EventSource(`${BASE}/notifications/stream`, { withCredentials: true })

  if (handlers.LOBBY_INVITE) {
    es.addEventListener('LOBBY_INVITE', (e) => {
      try { handlers.LOBBY_INVITE(JSON.parse(e.data)) } catch { /* ignore malformed */ }
    })
  }
  if (handlers.GAME_STARTED) {
    es.addEventListener('GAME_STARTED', (e) => {
      try { handlers.GAME_STARTED(JSON.parse(e.data)) } catch { /* ignore malformed */ }
    })
  }
  if (handlers.PLAYER_KICKED) {
    es.addEventListener('PLAYER_KICKED', (e) => {
      try { handlers.PLAYER_KICKED(JSON.parse(e.data)) } catch { /* ignore malformed */ }
    })
  }

  es.onerror = () => {
    // EventSource auto-reconnects; nothing to do here
  }

  return () => es.close()
}
