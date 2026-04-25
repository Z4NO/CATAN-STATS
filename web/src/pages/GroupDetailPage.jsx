import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LButton, LCard, LSectionLabel, LTopBar } from '../components/Ledger/index.jsx'
import { getGroupDetail, listGroupMembers } from '../api/groups.js'
import { listGroupMatches } from '../api/matches.js'
import { getGroupStats } from '../api/stats.js'

export default function GroupDetailPage() {
  const navigate = useNavigate()
  const { groupId } = useParams()
  const [group, setGroup] = useState(null)
  const [matches, setMatches] = useState({ items: [], total: 0 })
  const [members, setMembers] = useState([])
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([
      getGroupDetail(groupId),
      listGroupMatches(groupId, { limit: 10 }),
      listGroupMembers(groupId).catch(() => []),
      getGroupStats(groupId).catch(() => null),
    ])
      .then(([g, m, mem, s]) => {
        if (cancelled) return
        setGroup(g)
        setMatches(m)
        setMembers(mem)
        setStats(s)
      })
      .catch((err) => !cancelled && setError(err.response?.data?.detail || 'Error cargando grupo'))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [groupId])

  if (loading) {
    return (
      <>
        <LTopBar title="Cargando…" onBack={() => navigate('/')} />
        <main style={{ padding: 22 }}>
          <p className="muted">Cargando grupo…</p>
        </main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <LTopBar title="Error" onBack={() => navigate('/')} />
        <main style={{ padding: 22 }}>
          <p className="error-text">{error}</p>
        </main>
      </>
    )
  }

  return (
    <>
      <LTopBar
        title={group?.name || 'Grupo'}
        subtitle={`${members.length} miembros · ${matches.total} partidas`}
        onBack={() => navigate('/')}
      />
      <main style={{ padding: 22, paddingBottom: 100 }}>
        {group?.join_code && (
          <LCard style={{ marginBottom: 18 }}>
            <div className="section-label">
              <span>── código de invitación</span>
            </div>
            <div className="mono" style={{ fontSize: 22, letterSpacing: 2, color: 'var(--ink)' }}>
              {group.join_code}
            </div>
          </LCard>
        )}

        <LButton
          size="lg"
          variant="accent"
          full
          onClick={() => navigate(`/groups/${groupId}/matches/new`)}
        >
          + Nueva partida
        </LButton>

        <div style={{ marginTop: 24 }}>
          <LSectionLabel right={`${stats?.total_matches ?? 0} partidas`}>Stats rápidas</LSectionLabel>
          <LCard>
            {stats && stats.total_matches > 0 ? (
              <div className="stack" style={{ gap: 8 }}>
                {stats.players.slice(0, 5).map((p) => (
                  <div
                    key={p.user_id}
                    style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}
                  >
                    <span>{p.display_name || p.username || `#${p.user_id}`}</span>
                    <span className="mono" style={{ color: 'var(--ink2)' }}>
                      {p.wins} W · {(p.win_rate * 100).toFixed(0)}% · {p.avg_points} pts
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted" style={{ fontSize: 13 }}>Aún no hay partidas registradas.</p>
            )}
          </LCard>
        </div>

        <div style={{ marginTop: 24 }}>
          <LSectionLabel>Partidas recientes</LSectionLabel>
          {matches.items.length === 0 ? (
            <LCard>
              <p className="muted" style={{ fontSize: 13 }}>Sin partidas aún.</p>
            </LCard>
          ) : (
            <div className="stack" style={{ gap: 10 }}>
              {matches.items.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => navigate(`/matches/${m.id}`)}
                  style={{
                    padding: 0,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <LCard style={{ padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span className="disp" style={{ fontSize: 15 }}>
                        {new Date(m.date).toLocaleDateString()}
                      </span>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--ink3)', textTransform: 'uppercase' }}>
                        {m.ruleset?.name || '—'}
                      </span>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 13, color: 'var(--ink2)' }}>
                      Ganador: {m.winner?.display_name || m.winner?.username || `#${m.winner_id}`}
                    </div>
                  </LCard>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
