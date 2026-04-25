import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LAvatar, LCard, LChip, LTopBar } from '../components/Ledger/index.jsx'
import { getMatchDetail } from '../api/matches.js'

const RULESET_LABELS = {
  base: 'Base',
  seafarers: 'Navegantes',
  cities_and_knights: 'Ciudades y caballeros',
  traders_and_barbarians: 'Mercaderes y bárbaros',
  explorers_and_pirates: 'Exploradores y piratas',
}

function rulesetLabel(rs) {
  if (!rs) return '—'
  return RULESET_LABELS[rs.name] || rs.name
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function formatDuration(mins) {
  if (mins == null) return null
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}

export default function MatchDetailPage() {
  const navigate = useNavigate()
  const { matchId } = useParams()
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getMatchDetail(matchId)
      .then((m) => !cancelled && setMatch(m))
      .catch(
        (err) =>
          !cancelled && setError(err.response?.data?.detail || 'Error cargando partida'),
      )
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [matchId])

  if (loading) {
    return (
      <>
        <LTopBar title="Partida" onBack={() => navigate(-1)} />
        <main style={{ padding: 22 }}>
          <p className="muted">Cargando…</p>
        </main>
      </>
    )
  }

  if (error || !match) {
    return (
      <>
        <LTopBar title="Partida" onBack={() => navigate(-1)} />
        <main style={{ padding: 22 }}>
          <p className="error-text">{error || 'Partida no encontrada'}</p>
        </main>
      </>
    )
  }

  const winner = match.match_players.find((mp) => mp.player_id === match.winner_id)
  const winnerName = winner?.player?.display_name || winner?.player?.username || `#${match.winner_id}`
  const winnerPoints = winner?.points_earned ?? 0
  const ordered = [...match.match_players].sort((a, b) => b.points_earned - a.points_earned)
  const duration = formatDuration(match.duration_mins)

  return (
    <>
      <LTopBar
        title="Partida"
        subtitle={`${formatDate(match.date)} · ${formatTime(match.date)}`}
        onBack={() => navigate(`/groups/${match.group_id}`)}
      />
      <main style={{ padding: '20px 22px 100px' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: 0.8,
            color: 'var(--ink3)',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          {formatDate(match.date)} · {formatTime(match.date)}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-disp)',
            fontSize: 26,
            letterSpacing: -0.6,
            lineHeight: 1.15,
            marginBottom: 4,
          }}
        >
          Ganó <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{winnerName}</span>{' '}
          con {winnerPoints} pts.
        </h1>
        <div style={{ fontSize: 13, color: 'var(--ink2)', marginBottom: 20 }}>
          {rulesetLabel(match.ruleset)} · {match.match_players.length} jugadores
          {duration ? ` · ${duration}` : ''}
          {match.has_player_extension ? ' · 5-6 jug.' : ''}
        </div>

        <LCard style={{ padding: 0, overflow: 'hidden' }}>
          <div
            style={{
              padding: '10px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: 0.6,
              color: 'var(--ink3)',
              textTransform: 'uppercase',
              display: 'flex',
              borderBottom: '1px solid var(--rule-soft)',
            }}
          >
            <span style={{ flex: 1 }}>Jugador</span>
            <span style={{ width: 90, textAlign: 'right' }}>Logros</span>
            <span style={{ width: 40, textAlign: 'right' }}>Pts</span>
          </div>
          {ordered.map((mp, i) => {
            const name = mp.player?.display_name || mp.player?.username || `#${mp.player_id}`
            const isWinner = mp.player_id === match.winner_id
            return (
              <div
                key={mp.id}
                style={{
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: i < ordered.length - 1 ? '1px solid var(--rule-soft)' : 'none',
                  background: isWinner ? 'var(--win-bg)' : 'transparent',
                }}
              >
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <LAvatar name={name} size={26} />
                  <span style={{ fontFamily: 'var(--font-disp)', fontSize: 15 }}>{name}</span>
                  {isWinner && <span style={{ color: 'var(--win)', fontSize: 11 }}>★</span>}
                </div>
                <div
                  style={{
                    width: 90,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 4,
                    flexWrap: 'wrap',
                  }}
                >
                  {mp.longest_road && <LChip tone="road">ruta</LChip>}
                  {mp.largest_army && <LChip tone="army">ejército</LChip>}
                </div>
                <span
                  style={{
                    width: 40,
                    textAlign: 'right',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  {mp.points_earned}
                </span>
              </div>
            )
          })}
        </LCard>

        {match.notes && (
          <div style={{ marginTop: 22 }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: 0.8,
                color: 'var(--ink3)',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              Notas
            </div>
            <div
              style={{
                fontFamily: 'var(--font-disp)',
                fontSize: 14,
                fontStyle: 'italic',
                color: 'var(--ink2)',
                lineHeight: 1.5,
                paddingLeft: 12,
                borderLeft: '2px solid var(--accent)',
              }}
            >
              “{match.notes}”
            </div>
          </div>
        )}
      </main>
    </>
  )
}
