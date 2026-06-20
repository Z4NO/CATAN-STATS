import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { connectNotificationStream } from '../api/notifications.js'
import { getLobby } from '../api/lobby.js'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [invitations, setInvitations] = useState([])

  const removeInvitation = useCallback((lobbyId) => {
    setInvitations(prev => prev.filter(inv => inv.lobby_id !== lobbyId))
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      setInvitations([])
      return
    }

    const cleanup = connectNotificationStream({
      LOBBY_INVITE: async (data) => {
        // Discard malformed events
        if (data.lobby_id == null) return

        // Enrich notification with full lobby details
        let enriched = data
        try {
          const lobby = await getLobby(data.lobby_id)
          enriched = { ...data, lobby }
        } catch {
          // Use bare notification if lobby fetch fails
        }
        setInvitations(prev => {
          if (prev.some(inv => inv.lobby_id === data.lobby_id)) return prev
          return [...prev, enriched]
        })
      },
    })

    return cleanup
  }, [isAuthenticated])

  return (
    <NotificationContext.Provider value={{ invitations, removeInvitation }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider')
  return ctx
}
