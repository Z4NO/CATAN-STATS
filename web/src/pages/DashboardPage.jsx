import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LAvatar,
  LButton,
  LCard,
  LSectionLabel,
  LTopBar,
} from '../components/Ledger/index.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { listMyGroups } from '../api/groups.js'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [memberships, setMemberships] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    listMyGroups()
      .then((data) => !cancelled && setMemberships(data))
      .catch((err) => !cancelled && setError(err.response?.data?.detail || 'Error cargando grupos'))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  function onLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <LTopBar
        title="Tus peñas"
        subtitle={user?.display_name || user?.username}
        right={
          <button onClick={onLogout} style={{ color: 'var(--ink3)', fontSize: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Salir
          </button>
        }
      />

      <main style={{ padding: 22, paddingBottom: 100 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <LButton size="md" variant="primary" full onClick={() => navigate('/groups/new')}>
            + Crear grupo
          </LButton>
          <LButton size="md" variant="secondary" full onClick={() => navigate('/groups/join')}>
            Unirme con código
          </LButton>
        </div>

        <LSectionLabel>Mis grupos · {memberships.length}</LSectionLabel>

        {loading && <p className="muted">Cargando…</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && memberships.length === 0 && (
          <LCard>
            <p className="muted" style={{ fontSize: 13 }}>
              Aún no tienes grupos. Crea uno o únete con un código.
            </p>
          </LCard>
        )}

        <div className="stack" style={{ gap: 12 }}>
          {memberships.map((m) => (
            <Link
              key={m.group_id}
              to={`/groups/${m.group_id}`}
              style={{ textDecoration: 'none' }}
            >
              <LCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <LAvatar name={m.group?.name || '?'} size={44} />
                  <div style={{ flex: 1 }}>
                    <div className="disp" style={{ fontSize: 17, color: 'var(--ink)' }}>
                      {m.group?.name || `Grupo ${m.group_id}`}
                    </div>
                    <div
                      className="mono"
                      style={{ fontSize: 11, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: 0.5 }}
                    >
                      {m.role} · desde {new Date(m.joined_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span style={{ fontSize: 18, color: 'var(--ink3)' }}>→</span>
                </div>
              </LCard>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
