import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LAvatar, LButton, LCard, LSectionLabel, LStat, LTopBar } from '../components/Ledger/index.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { getMyStats } from '../api/stats.js'

function pct(rate) {
  return `${Math.round(rate * 100)}%`
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    getMyStats()
      .then((data) => !cancelled && setStats(data))
      .catch((err) => !cancelled && setError(err.response?.data?.detail || 'Error cargando estadísticas'))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [])

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const displayName = user?.display_name || user?.username || '?'

  return (
    <>
      <LTopBar title="Perfil" />

      {/* Hero */}
      <div style={{ padding: '28px 22px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <LAvatar name={displayName} size={60} />
        <div>
          <div style={{ fontFamily: 'var(--font-disp)', fontSize: 22, fontWeight: 500, color: 'var(--ink)', letterSpacing: -0.4 }}>
            {displayName}
          </div>
          {user?.display_name && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>
              @{user.username}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 32 }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--ink3)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            Cargando...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--alert)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            {error}
          </div>
        )}

        {stats && (
          <>
            {/* Primary stats */}
            <LSectionLabel>Estadísticas globales</LSectionLabel>
            <LCard>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 0' }}>
                <LStat big={pct(stats.win_rate)} label="Winrate" tone="accent" />
                <LStat big={stats.matches_won} label="Victorias" />
                <LStat big={stats.current_streak} label="Racha actual" />
                <LStat big={stats.avg_points.toFixed(1)} label="Pts medios" />
              </div>
            </LCard>

            {/* Secondary metrics */}
            <LSectionLabel>Detalles</LSectionLabel>
            <LCard>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <StatRow label="Partidas jugadas" value={stats.matches_played} />
                <StatRow label="Mejor racha" value={stats.best_streak} />
                <StatRow label="Camino más largo" value={pct(stats.longest_road_rate)} />
                <StatRow label="Ejército más grande" value={pct(stats.largest_army_rate)} />
                <StatRow label="Ciudades (media)" value={stats.avg_cities.toFixed(1)} />
                <StatRow label="Pueblos (media)" value={stats.avg_villages.toFixed(1)} />
                <StatRow label="Carreteras (media)" value={stats.avg_roads_built.toFixed(1)} />
                <StatRow label="Robos con ladrón (media)" value={stats.avg_thief_moves.toFixed(1)} />
              </div>
            </LCard>
          </>
        )}

        {/* Account */}
        <LSectionLabel>Cuenta</LSectionLabel>
        <LCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink2)' }}>
                {user?.email}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink3)', background: 'var(--rule-soft)', padding: '2px 8px', borderRadius: 4 }}>
                Próximamente
              </span>
            </div>
            <div style={{ height: 1, background: 'var(--rule-soft)' }} />
            <LButton variant="danger" full onClick={handleLogout}>
              Cerrar sesión
            </LButton>
          </div>
        </LCard>
      </div>
    </>
  )
}

function StatRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink3)', letterSpacing: 0.3, textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-disp)', fontSize: 18, color: 'var(--ink)', letterSpacing: -0.3 }}>
        {value}
      </span>
    </div>
  )
}
