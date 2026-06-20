import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LAvatar, LButton, LChip, LSectionLabel, LTopBar } from '../components/Ledger/index.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { getGroupDetail, listGroupMembers } from '../api/groups.js'
import { listRulesets } from '../api/rulesets.js'
import { createLobby, inviteToLobby } from '../api/lobby.js'

const MIN_PLAYERS = 3
const VP_MIN = 8
const VP_MAX = 15

const EXPANSION_LABELS = {
  base: 'Base',
  seafarers: 'Navegantes',
  cities_and_knights: 'Ciudades & Caballeros',
  traders_and_barbarians: 'Mercaderes & Bárbaros',
  explorers_and_pirates: 'Exploradores & Piratas',
}

const ENABLED_EXPANSIONS = ['base', 'seafarers']
const DISABLED_EXPANSION_NAMES = ['cities_and_knights', 'traders_and_barbarians']

function playerCountLabel(maxPlayers) {
  return maxPlayers <= 4 ? '3-4j' : '5-6j'
}

function StepperButton({ onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 32, height: 32, borderRadius: 16,
        border: '1px solid var(--rule)',
        background: disabled ? 'transparent' : 'var(--paper)',
        color: disabled ? 'var(--ink3)' : 'var(--ink)',
        fontSize: 18, fontFamily: 'var(--font-text)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
      }}
    >
      {children}
    </button>
  )
}

export default function ConfigureMatchPage() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [members, setMembers] = useState([])
  const [rulesets, setRulesets] = useState([])
  const [groupName, setGroupName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedExpansion, setSelectedExpansion] = useState(null)
  const [selectedRulesetId, setSelectedRulesetId] = useState(null)
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([])
  const [vp, setVp] = useState(10)
  const [longestRoad, setLongestRoad] = useState(true)
  const [largestArmy, setLargestArmy] = useState(true)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([listGroupMembers(groupId), listRulesets(), getGroupDetail(groupId)])
      .then(([mems, rs, grp]) => {
        if (cancelled) return
        setMembers(mems)
        setRulesets(rs)
        setGroupName(grp.name)

        const defaultRuleset = rs.find(r => r.name === 'base' && r.max_players === 4) || rs[0]
        if (defaultRuleset) {
          setSelectedExpansion(defaultRuleset.name)
          setSelectedRulesetId(defaultRuleset.id)
          setVp(defaultRuleset.victory_points)
        }
      })
      .catch(err => !cancelled && setError(err.response?.data?.detail || 'Error cargando datos'))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [groupId])

  // Pre-select host once user and members are available
  useEffect(() => {
    if (user && members.length > 0) {
      setSelectedPlayerIds(prev => prev.includes(user.id) ? prev : [user.id])
    }
  }, [user, members])

  const expansionGroups = useMemo(() => {
    const groups = {}
    for (const r of rulesets) {
      if (!groups[r.name]) groups[r.name] = []
      groups[r.name].push(r)
    }
    return groups
  }, [rulesets])

  const selectedRuleset = useMemo(
    () => rulesets.find(r => r.id === selectedRulesetId),
    [rulesets, selectedRulesetId]
  )

  const maxPlayers = selectedRuleset?.max_players ?? 4

  function pickExpansion(expansionName) {
    const variants = expansionGroups[expansionName] || []
    if (variants.length === 0) return
    const default4j = variants.find(r => r.max_players === 4) || variants[0]
    setSelectedExpansion(expansionName)
    setSelectedRulesetId(default4j.id)
    setVp(default4j.victory_points)
    // Drop players over the new max
    setSelectedPlayerIds(prev => prev.slice(0, default4j.max_players))
  }

  function pickPlayerCount(ruleset) {
    setSelectedRulesetId(ruleset.id)
    setVp(ruleset.victory_points)
    setSelectedPlayerIds(prev => prev.slice(0, ruleset.max_players))
  }

  function togglePlayer(userId) {
    if (userId === user?.id) return
    setSelectedPlayerIds(prev => {
      if (prev.includes(userId)) return prev.filter(id => id !== userId)
      if (prev.length >= maxPlayers) return prev
      return [...prev, userId]
    })
  }

  // For button label only — host always excluded from invites
  const invitedCount = selectedPlayerIds.filter(id => user?.id != null && id !== user.id).length
  const canSend = !!selectedRulesetId && selectedPlayerIds.length >= MIN_PLAYERS && !sending

  async function handleSend() {
    // Capture hostId inside the handler so it's never stale or undefined
    const hostId = user?.id
    if (hostId == null) {
      setSendError('Sesión no válida, recarga la página')
      return
    }

    setSending(true)
    setSendError(null)
    try {
      const { lobby } = await createLobby({
        groupId: parseInt(groupId),
        rulesetId: selectedRulesetId,
      })

      // Invite everyone except the host (host is already in the lobby)
      const idsToInvite = selectedPlayerIds.filter(id => id !== hostId)
      await Promise.all(idsToInvite.map(uid => inviteToLobby(lobby.id, uid)))

      navigate(`/play/lobby/${lobby.id}`)
    } catch (err) {
      setSendError(err.response?.data?.detail || 'Error creando la partida')
    } finally {
      setSending(false)
    }
  }

  if (loading) return (
    <>
      <LTopBar title="Configurar partida" onBack={() => navigate('/play')} />
      <main style={{ padding: 22 }}><p className="muted">Cargando…</p></main>
    </>
  )

  if (error) return (
    <>
      <LTopBar title="Configurar partida" onBack={() => navigate('/play')} />
      <main style={{ padding: 22 }}><p className="error-text">{error}</p></main>
    </>
  )

  const expansionVariants = selectedExpansion ? (expansionGroups[selectedExpansion] || []) : []

  return (
    <>
      <LTopBar
        title="Configurar partida"
        subtitle={groupName ? `${groupName} · host` : undefined}
        onBack={() => navigate('/play')}
      />

      <main style={{ padding: '14px 22px', paddingBottom: 110, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* BLOQUE 1: EXPANSIÓN */}
        <div>
          <LSectionLabel>Expansión del juego</LSectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            {ENABLED_EXPANSIONS.map(expName => {
              const variants = expansionGroups[expName] || []
              const isSelected = selectedExpansion === expName
              const vpDisplay = variants[0]?.victory_points
              return (
                <div
                  key={expName}
                  onClick={() => pickExpansion(expName)}
                  style={{
                    padding: 12, borderRadius: 12, cursor: 'pointer',
                    background: isSelected ? 'var(--card)' : 'transparent',
                    border: `1.5px solid ${isSelected ? 'var(--ink)' : 'var(--rule)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span className="disp" style={{ fontSize: 15, color: 'var(--ink)' }}>
                      {EXPANSION_LABELS[expName]}
                    </span>
                    {isSelected && <span style={{ color: 'var(--accent)', fontSize: 10 }}>●</span>}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--ink3)', letterSpacing: 0.3 }}>
                    {vpDisplay != null ? `${vpDisplay} pts` : ''}
                  </div>
                </div>
              )
            })}
            {DISABLED_EXPANSION_NAMES.map(expName => (
              <div
                key={expName}
                style={{
                  padding: 12, borderRadius: 12, opacity: 0.4,
                  background: 'transparent', border: '1px dashed var(--rule)',
                }}
              >
                <div className="disp" style={{ fontSize: 13, color: 'var(--ink2)' }}>
                  {EXPANSION_LABELS[expName]}
                </div>
                <div className="mono" style={{ fontSize: 9, color: 'var(--ink3)', letterSpacing: 0.3, marginTop: 2 }}>
                  próximamente
                </div>
              </div>
            ))}
          </div>

          {/* Sub-selección de nº de jugadores dentro de la expansión */}
          {expansionVariants.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {expansionVariants.map(r => {
                const isActive = selectedRulesetId === r.id
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => pickPlayerCount(r)}
                    style={{
                      flex: 1, padding: '8px 12px', borderRadius: 10, cursor: 'pointer',
                      background: isActive ? 'var(--ink)' : 'transparent',
                      border: `1px solid ${isActive ? 'var(--ink)' : 'var(--rule)'}`,
                      color: isActive ? 'var(--paper)' : 'var(--ink2)',
                      fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 0.4,
                    }}
                  >
                    {playerCountLabel(r.max_players)}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* BLOQUE 2: JUGADORES */}
        <div>
          <LSectionLabel right={`${selectedPlayerIds.length} / ${maxPlayers} seleccionados`}>
            Jugadores
          </LSectionLabel>
          <div className="stack" style={{ gap: 6, marginTop: 8 }}>
            {members.map(m => {
              const u = m.user
              if (!u) return null
              const name = u.display_name || u.username
              const isHost = u.id === user?.id
              const sel = selectedPlayerIds.includes(u.id)
              const atMax = !sel && selectedPlayerIds.length >= maxPlayers
              return (
                <div
                  key={u.id}
                  onClick={() => !isHost && !atMax && togglePlayer(u.id)}
                  style={{
                    padding: '8px 12px', borderRadius: 10,
                    border: `1px solid ${sel ? 'var(--ink)' : 'var(--rule-soft)'}`,
                    background: sel ? 'var(--card)' : 'transparent',
                    display: 'flex', alignItems: 'center', gap: 10,
                    opacity: atMax ? 0.45 : 1,
                    cursor: isHost ? 'default' : atMax ? 'not-allowed' : 'pointer',
                  }}
                >
                  <LAvatar name={name} size={28} />
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="disp" style={{ fontSize: 14, color: 'var(--ink)' }}>{name}</span>
                    {isHost && <LChip tone="accent">tú · host</LChip>}
                  </div>
                  <div style={{
                    width: 18, height: 18, borderRadius: 9,
                    border: `1.5px solid ${sel ? 'var(--ink)' : 'var(--rule)'}`,
                    background: sel ? 'var(--ink)' : 'transparent',
                    color: 'var(--paper)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
                  }}>
                    {sel && '✓'}
                  </div>
                </div>
              )
            })}
          </div>
          {selectedPlayerIds.length < MIN_PLAYERS && (
            <p className="mono" style={{ fontSize: 10, color: 'var(--ink3)', marginTop: 8, textAlign: 'center', letterSpacing: 0.4 }}>
              Mínimo {MIN_PLAYERS} jugadores para empezar
            </p>
          )}
        </div>

        {/* BLOQUE 3: REGLAS BÁSICAS */}
        <div>
          <LSectionLabel>Reglas básicas</LSectionLabel>
          <div style={{
            background: 'var(--card)', border: '1px solid var(--rule-soft)',
            borderRadius: 12, overflow: 'hidden', marginTop: 8,
          }}>
            <div style={{ padding: '11px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: 'var(--ink2)' }}>Puntos para ganar</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StepperButton onClick={() => setVp(v => Math.max(VP_MIN, v - 1))} disabled={vp <= VP_MIN}>−</StepperButton>
                <span className="mono" style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 600, minWidth: 22, textAlign: 'center' }}>{vp}</span>
                <StepperButton onClick={() => setVp(v => Math.min(VP_MAX, v + 1))} disabled={vp >= VP_MAX}>+</StepperButton>
              </div>
            </div>

            <div style={{ padding: '11px 14px', borderTop: '1px solid var(--rule-soft)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: 'var(--ink2)' }}>Carretera más larga</span>
              <button
                type="button"
                onClick={() => setLongestRoad(v => !v)}
                className={`l-chip l-chip--${longestRoad ? 'soft' : 'neutral'}`}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                {longestRoad ? 'Activa' : 'Inactiva'}
              </button>
            </div>

            <div style={{ padding: '11px 14px', borderTop: '1px solid var(--rule-soft)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: 'var(--ink2)' }}>Ejército más grande</span>
              <button
                type="button"
                onClick={() => setLargestArmy(v => !v)}
                className={`l-chip l-chip--${largestArmy ? 'soft' : 'neutral'}`}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                {largestArmy ? 'Activo' : 'Inactivo'}
              </button>
            </div>
          </div>
        </div>

      </main>

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '12px 22px 28px',
        background: 'var(--paper)', borderTop: '1px solid var(--rule-soft)',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {sendError && <p className="error-text" style={{ fontSize: 12, margin: 0, textAlign: 'center' }}>{sendError}</p>}
        <LButton variant="primary" size="lg" full disabled={!canSend} onClick={handleSend}>
          {sending
            ? 'Creando partida…'
            : canSend
              ? `Enviar invitaciones · ${invitedCount} jugador${invitedCount !== 1 ? 'es' : ''}`
              : 'Selecciona al menos 3 jugadores'}
        </LButton>
      </div>
    </>
  )
}
