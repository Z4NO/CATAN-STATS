import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faHouse, faRoad, faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { LAvatar, LCard, LSectionLabel, LTopBar } from '../components/Ledger/index.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { getMyStats } from '../api/stats.js'

function pct(v) {
  return `${Math.round(v * 100)}%`
}

function RingChart({ value, size = 72, strokeWidth = 7, color = 'var(--accent)' }) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.max(0, Math.min(1, value)))
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--rule-soft)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  )
}

function ProgressBar({ value, max }) {
  const w = Math.min(100, (value / max) * 100)
  return (
    <div style={{ height: 3, background: 'var(--rule-soft)', borderRadius: 2, marginTop: 5 }}>
      <div style={{ height: '100%', width: `${w}%`, background: 'var(--accent)', borderRadius: 2 }} />
    </div>
  )
}

function ConstructionRow({ icon, label, value, max, hint }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FontAwesomeIcon icon={icon} style={{ fontSize: 11, color: 'var(--accent)', width: 14 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink2)' }}>{label}</span>
        </div>
        <span style={{ fontFamily: 'var(--font-disp)', fontSize: 20, color: 'var(--ink)', letterSpacing: -0.3 }}>
          {value.toFixed(1)}
        </span>
      </div>
      <ProgressBar value={value} max={max} />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink3)', marginTop: 3 }}>
        {hint}
      </div>
    </div>
  )
}

function BonusCard({ label, value }) {
  return (
    <LCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ position: 'relative' }}>
        <RingChart value={value} size={64} strokeWidth={6} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-disp)', fontSize: 14, color: 'var(--accent)', fontWeight: 600 }}>
            {pct(value)}
          </span>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink2)', textAlign: 'center', lineHeight: 1.4 }}>
        {label}
      </div>
    </LCard>
  )
}

export default function StatsPage() {
  const { user } = useAuth()
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

  const displayName = user?.display_name || user?.username || '?'

  return (
    <>
      <LTopBar title="Mi perfil global" subtitle="todas las peñas combinadas" />

      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <LAvatar name={displayName} size={48} />
        <div>
          <div style={{ fontFamily: 'var(--font-disp)', fontSize: 20, fontWeight: 500, color: 'var(--ink)', letterSpacing: -0.3 }}>
            {displayName}
          </div>
          {user?.username && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink3)', marginTop: 1 }}>
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
            {/* Hero: win rate + victories */}
            <LCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <RingChart value={stats.win_rate} />
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontFamily: 'var(--font-disp)', fontSize: 15, fontWeight: 600, color: 'var(--accent)', lineHeight: 1 }}>
                      {pct(stats.win_rate)}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'var(--ink3)', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 2 }}>
                      win rate
                    </span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-disp)', fontSize: 21, color: 'var(--ink)', letterSpacing: -0.4, lineHeight: 1.15 }}>
                    <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>{stats.matches_won}</span>
                    {' '}victorias en{' '}
                    <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>{stats.matches_played}</span>
                    {' '}partidas
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink3)', marginTop: 8, letterSpacing: 0.5 }}>
                    {stats.avg_points.toFixed(1)} PUNTOS · MEDIA
                  </div>
                </div>
              </div>
            </LCard>

            {/* Streaks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <LCard>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                  Racha activa
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                  <span style={{ fontFamily: 'var(--font-disp)', fontSize: 36, color: 'var(--win)', lineHeight: 1 }}>
                    {stats.current_streak}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--win)' }}>W</span>
                </div>
              </LCard>
              <LCard>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                  Récord
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                  <span style={{ fontFamily: 'var(--font-disp)', fontSize: 36, color: 'var(--ink)', lineHeight: 1 }}>
                    {stats.best_streak}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink2)' }}>W</span>
                </div>
              </LCard>
            </div>

            {/* Puntuación */}
            <LSectionLabel right="por partida">Puntuación</LSectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <LCard>
                <div style={{ fontFamily: 'var(--font-disp)', fontSize: 38, color: 'var(--accent)', letterSpacing: -1.5, lineHeight: 1 }}>
                  {stats.avg_points.toFixed(1)}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink3)', letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 6 }}>
                  Puntos · media
                </div>
              </LCard>
              <LCard>
                <div style={{ fontFamily: 'var(--font-disp)', fontSize: 38, color: 'var(--accent)', letterSpacing: -1.5, lineHeight: 1 }}>
                  {stats.matches_played}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink3)', letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 6 }}>
                  Partidas jugadas
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink3)', marginTop: 3 }}>
                  {stats.matches_won} ganadas
                </div>
              </LCard>
            </div>

            {/* Construcciones */}
            <LSectionLabel right="construcciones · media">Catán puro</LSectionLabel>
            <LCard>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <ConstructionRow icon={faBuilding} label="Ciudades por partida" value={stats.avg_cities} max={4} hint="máx tablero · 4" />
                <ConstructionRow icon={faHouse} label="Aldeas por partida" value={stats.avg_villages} max={5} hint="máx tablero · 5" />
                <ConstructionRow icon={faRoad} label="Carreteras por partida" value={stats.avg_roads_built} max={15} hint="máx · 15" />
                <ConstructionRow icon={faUserSecret} label="Mov. de ladrón" value={stats.avg_thief_moves} max={6} hint="media por partida" />
              </div>
            </LCard>

            {/* Bonus de victoria */}
            <LSectionLabel right="% de tus partidas">Bonus de victoria</LSectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <BonusCard label="Ruta más larga" value={stats.longest_road_rate} />
              <BonusCard label="Ejército más grande" value={stats.largest_army_rate} />
            </div>
          </>
        )}
      </div>
    </>
  )
}
