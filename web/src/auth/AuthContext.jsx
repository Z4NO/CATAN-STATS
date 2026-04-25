import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { fetchMe, logout as apiLogout } from '../api/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      refresh: async () => {
        try {
          const me = await fetchMe()
          setUser(me)
          return me
        } catch {
          setUser(null)
          return null
        }
      },
      logout: () => {
        apiLogout() // fire-and-forget: borra la cookie en el servidor
        setUser(null)
      },
      setUser,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
