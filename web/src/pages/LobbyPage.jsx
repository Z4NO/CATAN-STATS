import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LAvatar, LButton, LChip, LSectionLabel, LTopBar } from '../components/Ledger/index.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { getLobby, setReady, startLobby } from '../api/lobby.js'

const POLL_INTERVAL = 3000

const EXPANSION_LABELS = {
  base: 'Base',
  seafarers: 'Navegantes',
  cities_and_knights: 'Ciudades & Caballeros',
  traders_and_barbarians: 'Mercaderes & Bárbaros',
}

function formatElapsed(createdAt) {
  if (!createdAt) return ''
  const secs = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)
  const m = String(Math.floor(secs / 60)).padStart(2, '0')
  const s = String(secs % 60).padStart(2, '0')
  return `${m}:${s}`
}

export default function LobbyPage() {
  const { lobbyId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [lobby, setLobby] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [starting, setStarting] = useState(false)
  const [elapsed, setElapsed] = useState('')

  const intervalRef = useRef(null)

  const fetchLobby = useCallback(async () => {
    try {
      const data = await getLobby(lobbyId)
      setLobby(data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error cargando lobby')
    } finally {
      setLoading(false)
    }
  }, [lobbyId])

  // Initial fetch + polling
  useEffect(() => {
    fetchLobby()
    intervalRef.current = setInterval(fetchLobby, POLL_INTERVAL)
    return () => clearInterval(intervalRef.current)
  }, [fetchLobby])

  // Elapsed timer
  useEffect(() => {
    if (!lobby?.created_at) return
    const tick = setInterval(() => setElapsed(formatElapsed(lobby.created_at)), 1000)
    setElapsed(formatElapsed(lobby.created_at))
    return () => clearInterval(tick)
  }, [lobby?.created_at])

  // Redirect when lobby starts
  useEffect(() => {
    if (lobby?.status === 'in_progress') {
      clearInterval(intervalRef.current)
      // In-game page not yet implemented — navigate home for now
      navigate('/', { replace: true })
    }
  }, [lobby?.status, navigate])

  async function handleToggleReady(currentReady) {
    try {
      await setReady(lobbyId, !currentReady)
      fetchLobby()
    } catch (err) {
      setError(err.response?.data?.detail || 'Error actualizando estado')
    }
  }

  async function handleStart() {
    setStarting(true)
    try {
      await startLobby(lobbyId)
      // Status will change to in_progress; polling will pick it up
    } catch (err) {
      setError(err.response?.data?.detail || 'Error iniciando partida')
    } finally {
      setStarting(false)
    }
  }

  if (loading) return (
    <>
      <LTopBar title="Lobby" onBack={() => navigate('/play')} />
      <main style={{ padding: 22 }}><p className="muted">Conectando…</p></main>
    </>
  )

  if (error && !lobby) return (
    <>
      <LTopBar title="Lobby" onBack={() => navigate('/play')} />
      <main style={{ padding: 22 }}><p className="error-text">{error}</p></main>
    </>
  )

  const players = lobby?.players ?? []
  const myPlayer = players.find(p => p.user_id === user?.id)
  const isHost = myPlayer?.is_host ?? false
  const readyCount = players.filter(p => p.is_ready).length
  const allReady = players.length > 0 && readyCount === players.length
  const notReadyPlayers = players.filter(p => !p.is_ready)
  const expansionName = EXPANSION_LABELS[lobby?.ruleset?.name] ?? lobby?.ruleset?.name ?? '—'

  return (
    <>
      <LTopBar
        title="Lobby"
        subtitle={expansionName}
        onBack={() => navigate('/play')}
      />

      <main style={{ padding: '18px 22px', paddingBottom: 110, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Hero */}
        <div style={{
          padding: 16, borderRadius: 14, background: 'var(--card)',
          border: `1px solid ${allReady ? 'var(--win)' : 'var(--rule)'}`,
        }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: 1, color: 'var(--accent)', marginBottom: 6 }}>
            ── PARTIDA · {expansionName.toUpperCase()}
          </div>
          <div className="disp" style={{ fontSize: 24, color: 'var(--ink)', letterSpacing: -0.6, lineHeight: 1.05 }}>
            {allReady
              ? 'Todos listos'
              : notReadyPlayers.length === 1
                ? <>Esperando a <em>{notReadyPlayers[0]?.user?.display_name ?? notReadyPlayers[0]?.user?.username}…</em></>
                : `Esperando a ${notReadyPlayers.length} jugadores…`}
          </div>
          <div style={{
            marginTop: 12, height: 4, borderRadius: 2, background: 'var(--rule-soft)', overflow: 'hidden',
          }}>
            <div style={{
              width: `${players.length ? (readyCount / players.length) * 100 : 0}%`,
              height: '100%', background: 'var(--accent)', borderRadius: 2,
              transition: 'width 0.4s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span className="mono" style={{ fontSize: 10, color: 'var(--ink3)', letterSpacing: 0.4 }}>
              {readyCount} / {players.length} LISTOS
            </span>
            {elapsed && (
              <span className="mono" style={{ fontSize: 10, color: 'var(--ink3)', letterSpacing: 0.4 }}>
                {elapsed} ESPERANDO
              </span>
            )}
          </div>
        </div>

        {/* Players */}
        <div>
          <LSectionLabel>Jugadores</LSectionLabel>
          <div className="stack" style={{ gap: 6, marginTop: 8 }}>
            {players.map(p => {
              const name = p.user?.display_name ?? p.user?.username ?? `#${p.user_id}`
              const isMe = p.user_id === user?.id
              return (
                <div
                  key={p.id}
                  style={{
                    padding: '10px 12px', borderRadius: 12, background: 'var(--card)',
                    border: '1px solid var(--rule-soft)',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <LAvatar name={name} size={32} />
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="disp" style={{ fontSize: 15, color: 'var(--ink)' }}>{name}</span>
                    {p.is_host && <LChip tone="accent">host</LChip>}
                    {isMe && !p.is_host && <LChip tone="neutral">tú</LChip>}
                  </div>
                  {p.is_ready
                    ? <span className="mono" style={{ fontSize: 11, color: 'var(--win)', letterSpacing: 0.3 }}>● LISTO</span>
                    : <span className="mono" style={{ fontSize: 11, color: 'var(--ink3)', letterSpacing: 0.3 }}>◐ ESPERANDO</span>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Rules */}
        <div>
          <LSectionLabel>Reglas</LSectionLabel>
          <div style={{
            background: 'var(--card)', border: '1px solid var(--rule-soft)', borderRadius: 12,
            padding: '10px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 14px',
            marginTop: 8,
          }}>
            {[
              ['Expansión', expansionName],
              ['Para ganar', lobby?.ruleset?.victory_points ? `${lobby.ruleset.victory_points} pts` : '—'],
              ['Jugadores', `hasta ${lobby?.ruleset?.max_players ?? '?'}`],
              ['En sala', `${players.length} jugadores`],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="mono" style={{ color: 'var(--ink3)', letterSpacing: 0.4, textTransform: 'uppercase', fontSize: 9 }}>{l}</span>
                <span style={{ color: 'var(--ink)', fontWeight: 500, fontSize: 11 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="error-text" style={{ fontSize: 12 }}>{error}</p>}
      </main>

      {/* Footer actions */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '12px 22px 28px',
        background: 'var(--paper)', borderTop: '1px solid var(--rule-soft)',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {isHost ? (
          <>
            <LButton
              variant="primary"
              size="lg"
              full
              disabled={!allReady || starting}
              onClick={handleStart}
            >
              {starting
                ? 'Iniciando…'
                : allReady
                  ? 'Comenzar partida'
                  : `Comenzar partida · ${players.length - readyCount} falta${players.length - readyCount !== 1 ? 'n' : ''}`}
            </LButton>
            <p className="mono" style={{ fontSize: 10, color: 'var(--ink3)', textAlign: 'center', letterSpacing: 0.4, margin: 0 }}>
              El host arranca cuando todos estén listos
            </p>
          </>
        ) : (
          <LButton
            variant={myPlayer?.is_ready ? 'secondary' : 'primary'}
            size="lg"
            full
            onClick={() => handleToggleReady(myPlayer?.is_ready ?? false)}
          >
            {myPlayer?.is_ready ? 'Cancelar listo' : 'Estoy listo ✓'}
          </LButton>
        )}
      </div>
    </>
  )
}
