import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  LAvatar,
  LButton,
  LCard,
  LChip,
  LField,
  LTopBar,
} from '../components/Ledger/index.jsx'
import { listGroupMembers } from '../api/groups.js'
import { listRulesets } from '../api/rulesets.js'
import { createMatch } from '../api/matches.js'

const MIN_PLAYERS = 2
const TOTAL_STEPS = 4

const RULESET_LABELS = {
  base: 'Base',
  seafarers: 'Navegantes',
  cities_and_knights: 'Ciudades y caballeros',
  traders_and_barbarians: 'Mercaderes y bárbaros',
  explorers_and_pirates: 'Exploradores y piratas',
}

function rulesetLabel(rs) {
  return RULESET_LABELS[rs.name] || rs.name
}

function StepDots({ step }) {
  return (
    <div style={{ padding: '14px 22px 0', display: 'flex', gap: 4 }}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
        const on = i < step
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: on ? 'var(--accent)' : 'var(--rule-soft)',
            }}
          />
        )
      })}
    </div>
  )
}

function StepperButton({ onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        border: '1px solid var(--rule)',
        background: disabled ? 'transparent' : 'var(--paper)',
        color: disabled ? 'var(--ink3)' : 'var(--ink)',
        fontSize: 18,
        fontFamily: 'var(--font-text)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}
    >
      {children}
    </button>
  )
}

export default function MatchWizardPage() {
  const navigate = useNavigate()
  const { groupId } = useParams()

  const [step, setStep] = useState(1)
  const [members, setMembers] = useState([])
  const [rulesets, setRulesets] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [rulesetId, setRulesetId] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [points, setPoints] = useState({})
  const [winnerId, setWinnerId] = useState(null)
  const [longestRoadId, setLongestRoadId] = useState(null)
  const [largestArmyId, setLargestArmyId] = useState(null)
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([listGroupMembers(groupId), listRulesets()])
      .then(([mems, rs]) => {
        if (cancelled) return
        setMembers(mems)
        setRulesets(rs)
        if (rs.length > 0) setRulesetId(rs[0].id)
      })
      .catch((err) => {
        if (cancelled) return
        setLoadError(err.response?.data?.detail || 'Error cargando datos')
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [groupId])

  const ruleset = useMemo(
    () => rulesets.find((r) => r.id === rulesetId),
    [rulesets, rulesetId],
  )
  const maxPoints = ruleset?.victory_points ?? 10
  const maxPlayers = ruleset?.max_players ?? 4

  const memberById = useMemo(() => {
    const map = {}
    for (const m of members) {
      if (m.user) map[m.user.id] = m.user
    }
    return map
  }, [members])

  const selectedPlayers = useMemo(
    () => selectedIds.map((id) => memberById[id]).filter(Boolean),
    [selectedIds, memberById],
  )

  const playerExtension = selectedIds.length > 4

  function togglePlayer(userId) {
    setSelectedIds((prev) => {
      if (prev.includes(userId)) {
        const next = prev.filter((id) => id !== userId)
        setPoints((p) => {
          const { [userId]: _drop, ...rest } = p
          return rest
        })
        if (winnerId === userId) setWinnerId(null)
        if (longestRoadId === userId) setLongestRoadId(null)
        if (largestArmyId === userId) setLargestArmyId(null)
        return next
      }
      if (prev.length >= maxPlayers) return prev
      return [...prev, userId]
    })
  }

  function adjustPoints(userId, delta) {
    setPoints((prev) => {
      const current = prev[userId] ?? 0
      const next = Math.min(maxPoints, Math.max(0, current + delta))
      return { ...prev, [userId]: next }
    })
  }

  function setBonus(kind, userId) {
    if (kind === 'longest_road') {
      setLongestRoadId((prev) => (prev === userId ? null : userId))
    } else if (kind === 'largest_army') {
      setLargestArmyId((prev) => (prev === userId ? null : userId))
    }
  }

  const step1Valid =
    rulesetId != null &&
    selectedIds.length >= MIN_PLAYERS &&
    selectedIds.length <= maxPlayers
  const step2Valid =
    selectedIds.length > 0 &&
    selectedIds.every((id) => {
      const v = points[id]
      return Number.isInteger(v) && v >= 0 && v <= maxPoints
    })
  const step3Valid =
    winnerId != null &&
    selectedIds.includes(winnerId) &&
    (points[winnerId] ?? 0) >= maxPoints
  const canGoNext = step === 1 ? step1Valid : step === 2 ? step2Valid : step3Valid

  function goNext() {
    if (step < TOTAL_STEPS) setStep(step + 1)
  }

  function goBack() {
    if (step > 1) setStep(step - 1)
    else navigate(`/groups/${groupId}`)
  }

  async function submit() {
    setSubmitError(null)
    setSubmitting(true)
    try {
      const payload = {
        date: new Date().toISOString(),
        ruleset_id: rulesetId,
        has_player_extension: playerExtension,
        duration_mins: duration ? parseInt(duration, 10) : null,
        notes: notes.trim() || null,
        winner_id: winnerId,
        players: selectedIds.map((id) => ({
          player_id: id,
          points_earned: points[id] ?? 0,
          longest_road: longestRoadId === id,
          largest_army: largestArmyId === id,
          thief_moves: 0,
          city_count: 0,
          village_count: 0,
          roads_built: 0,
        })),
      }
      const match = await createMatch(groupId, payload)
      navigate(`/matches/${match.id}`, { replace: true })
    } catch (err) {
      setSubmitError(err.response?.data?.detail || 'Error guardando la partida')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <LTopBar title="Nueva partida" onBack={() => navigate(`/groups/${groupId}`)} />
        <main style={{ padding: 22 }}>
          <p className="muted">Cargando…</p>
        </main>
      </>
    )
  }

  if (loadError) {
    return (
      <>
        <LTopBar title="Nueva partida" onBack={() => navigate(`/groups/${groupId}`)} />
        <main style={{ padding: 22 }}>
          <p className="error-text">{loadError}</p>
        </main>
      </>
    )
  }

  if (members.length < MIN_PLAYERS) {
    return (
      <>
        <LTopBar title="Nueva partida" onBack={() => navigate(`/groups/${groupId}`)} />
        <main style={{ padding: 22 }}>
          <LCard>
            <p style={{ color: 'var(--ink2)', fontSize: 14 }}>
              Necesitas al menos {MIN_PLAYERS} miembros activos en el grupo para registrar una
              partida.
            </p>
          </LCard>
        </main>
      </>
    )
  }

  return (
    <>
      <LTopBar
        title="Nueva partida"
        onBack={goBack}
        right={`${step} / ${TOTAL_STEPS}`}
      />
      <StepDots step={step} />
      <main style={{ padding: '20px 22px 100px' }}>
        {step === 1 && (
          <Step1Players
            members={members}
            rulesets={rulesets}
            rulesetId={rulesetId}
            setRulesetId={setRulesetId}
            ruleset={ruleset}
            selectedIds={selectedIds}
            togglePlayer={togglePlayer}
            maxPlayers={maxPlayers}
            maxPoints={maxPoints}
            playerExtension={playerExtension}
          />
        )}
        {step === 2 && (
          <Step2Points
            selectedPlayers={selectedPlayers}
            points={points}
            adjustPoints={adjustPoints}
            ruleset={ruleset}
            maxPoints={maxPoints}
          />
        )}
        {step === 3 && (
          <Step3Winner
            selectedPlayers={selectedPlayers}
            winnerId={winnerId}
            setWinnerId={setWinnerId}
            longestRoadId={longestRoadId}
            largestArmyId={largestArmyId}
            setBonus={setBonus}
            points={points}
            adjustPoints={adjustPoints}
            maxPoints={maxPoints}
            ruleset={ruleset}
          />
        )}
        {step === 4 && (
          <Step4Confirm
            selectedPlayers={selectedPlayers}
            points={points}
            winnerId={winnerId}
            longestRoadId={longestRoadId}
            largestArmyId={largestArmyId}
            ruleset={ruleset}
            duration={duration}
            setDuration={setDuration}
            notes={notes}
            setNotes={setNotes}
            submitError={submitError}
          />
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <LButton variant="secondary" onClick={goBack} style={{ flex: 1 }} disabled={submitting}>
            Atrás
          </LButton>
          {step < TOTAL_STEPS ? (
            <LButton
              variant="primary"
              onClick={goNext}
              disabled={!canGoNext}
              style={{ flex: 2 }}
            >
              Siguiente →
            </LButton>
          ) : (
            <LButton
              variant="primary"
              onClick={submit}
              disabled={submitting}
              style={{ flex: 2 }}
            >
              {submitting ? 'Guardando…' : 'Guardar partida ✓'}
            </LButton>
          )}
        </div>
      </main>
    </>
  )
}

function Step1Players({
  members,
  rulesets,
  rulesetId,
  setRulesetId,
  ruleset,
  selectedIds,
  togglePlayer,
  maxPlayers,
  maxPoints,
  playerExtension,
}) {
  return (
    <>
      <h1 className="disp" style={{ fontSize: 24, letterSpacing: -0.6, marginBottom: 4 }}>
        ¿Quién jugó?
      </h1>
      <p style={{ fontSize: 13, color: 'var(--ink2)', marginBottom: 16 }}>
        Elige expansión y entre {MIN_PLAYERS} y {maxPlayers} jugadores.
      </p>

      <div className="section-label" style={{ marginBottom: 8 }}>
        <span>── expansión</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
        {rulesets.map((r) => {
          const active = r.id === rulesetId
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setRulesetId(r.id)}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-pill)',
                border: `1px solid ${active ? 'var(--ink)' : 'var(--rule)'}`,
                background: active ? 'var(--ink)' : 'transparent',
                color: active ? 'var(--paper)' : 'var(--ink2)',
                fontSize: 13,
                fontFamily: 'var(--font-text)',
                cursor: 'pointer',
              }}
            >
              {rulesetLabel(r)} · {r.victory_points} pts · {r.max_players} jug
            </button>
          )
        })}
      </div>

      <div className="section-label" style={{ marginBottom: 8 }}>
        <span>── jugadores</span>
        <span style={{ fontSize: 11 }}>
          {selectedIds.length} / {maxPlayers}
        </span>
      </div>
      <div className="stack" style={{ gap: 8 }}>
        {members.map((m) => {
          const user = m.user
          if (!user) return null
          const sel = selectedIds.includes(user.id)
          const disabled = !sel && selectedIds.length >= maxPlayers
          const name = user.display_name || user.username
          return (
            <button
              key={user.id}
              type="button"
              onClick={() => togglePlayer(user.id)}
              disabled={disabled}
              style={{
                padding: '10px 14px',
                borderRadius: 14,
                border: `1px solid ${sel ? 'var(--ink)' : 'var(--rule)'}`,
                background: sel ? 'var(--card)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <LAvatar name={name} />
              <div style={{ flex: 1, fontFamily: 'var(--font-disp)', fontSize: 16 }}>{name}</div>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  border: `1.5px solid ${sel ? 'var(--ink)' : 'var(--rule)'}`,
                  background: sel ? 'var(--ink)' : 'transparent',
                  color: 'var(--paper)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                }}
              >
                {sel && '✓'}
              </div>
            </button>
          )
        })}
      </div>

      {ruleset && (
        <p
          style={{
            fontSize: 11,
            color: 'var(--ink3)',
            textAlign: 'center',
            marginTop: 16,
            fontFamily: 'var(--font-mono)',
          }}
        >
          {selectedIds.length} seleccionados · {rulesetLabel(ruleset)} hasta {maxPoints} pts
          {playerExtension ? ' · extensión 5-6 jug.' : ''}
        </p>
      )}
    </>
  )
}

function Step2Points({ selectedPlayers, points, adjustPoints, ruleset, maxPoints }) {
  return (
    <>
      <h1 className="disp" style={{ fontSize: 24, letterSpacing: -0.6, marginBottom: 4 }}>
        Puntuaciones finales
      </h1>
      <p style={{ fontSize: 13, color: 'var(--ink2)', marginBottom: 18 }}>
        {ruleset ? rulesetLabel(ruleset) : ''} · {selectedPlayers.length} jugadores · llega a{' '}
        {maxPoints} pts.
      </p>
      <div className="stack" style={{ gap: 10 }}>
        {selectedPlayers.map((u) => {
          const name = u.display_name || u.username
          const value = points[u.id] ?? 0
          return (
            <LCard key={u.id} style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <LAvatar name={name} />
                <div style={{ flex: 1, fontFamily: 'var(--font-disp)', fontSize: 16 }}>{name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StepperButton onClick={() => adjustPoints(u.id, -1)} disabled={value <= 0}>
                    −
                  </StepperButton>
                  <div
                    style={{
                      width: 38,
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 18,
                      fontWeight: 600,
                    }}
                  >
                    {value}
                  </div>
                  <StepperButton
                    onClick={() => adjustPoints(u.id, +1)}
                    disabled={value >= maxPoints}
                  >
                    +
                  </StepperButton>
                </div>
              </div>
            </LCard>
          )
        })}
      </div>
    </>
  )
}

function Step3Winner({
  selectedPlayers,
  winnerId,
  setWinnerId,
  longestRoadId,
  largestArmyId,
  setBonus,
  points,
  adjustPoints,
  maxPoints,
  ruleset,
}) {
  const winner = selectedPlayers.find((u) => u.id === winnerId)
  const winnerPoints = winner ? points[winner.id] ?? 0 : 0
  const winnerName = winner ? winner.display_name || winner.username : null

  return (
    <>
      <h1 className="disp" style={{ fontSize: 24, letterSpacing: -0.6, marginBottom: 4 }}>
        ¿Quién ganó y con cuántos puntos?
      </h1>
      <p style={{ fontSize: 13, color: 'var(--ink2)', marginBottom: 18 }}>
        Elige el ganador y marca sus bonus. El ganador debe llegar a {maxPoints} pts.
      </p>

      <div className="stack" style={{ gap: 8 }}>
        {selectedPlayers.map((u) => {
          const name = u.display_name || u.username
          const isWinner = u.id === winnerId
          const hasRoad = longestRoadId === u.id
          const hasArmy = largestArmyId === u.id
          return (
            <div
              key={u.id}
              style={{
                padding: '12px 14px',
                borderRadius: 14,
                border: `1px solid ${isWinner ? 'var(--win)' : 'var(--rule)'}`,
                background: isWinner ? 'var(--win-bg)' : 'var(--card)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setWinnerId(isWinner ? null : u.id)}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    border: `1.5px solid ${isWinner ? 'var(--win)' : 'var(--rule)'}`,
                    background: isWinner ? 'var(--win)' : 'transparent',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {isWinner && '★'}
                </button>
                <LAvatar name={name} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-disp)', fontSize: 16, lineHeight: 1.1 }}>
                    {name}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setBonus('longest_road', u.id)}
                      style={chipBtnStyle(hasRoad, 'road')}
                    >
                      ruta más larga
                    </button>
                    <button
                      type="button"
                      onClick={() => setBonus('largest_army', u.id)}
                      style={chipBtnStyle(hasArmy, 'army')}
                    >
                      ejército
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {winner && (
        <LCard
          style={{
            marginTop: 14,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 14,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--ink3)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: 0.4,
                textTransform: 'uppercase',
              }}
            >
              Puntos {winnerName}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-disp)',
                fontSize: 24,
                lineHeight: 1,
                marginTop: 2,
                color: winnerPoints >= maxPoints ? 'var(--win)' : 'var(--ink)',
              }}
            >
              {winnerPoints} / {maxPoints}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StepperButton
              onClick={() => adjustPoints(winner.id, -1)}
              disabled={winnerPoints <= 0}
            >
              −
            </StepperButton>
            <StepperButton
              onClick={() => adjustPoints(winner.id, +1)}
              disabled={winnerPoints >= maxPoints}
            >
              +
            </StepperButton>
          </div>
        </LCard>
      )}

      {winner && winnerPoints < maxPoints && (
        <p
          className="error-text"
          style={{ marginTop: 10, fontSize: 12 }}
        >
          El ganador debe alcanzar {maxPoints} puntos.
        </p>
      )}
    </>
  )
}

function chipBtnStyle(active, kind) {
  const palette = {
    road: { bg: '#e0e6cb', fg: 'var(--wood)' },
    army: { bg: '#f3dcd0', fg: 'var(--brick)' },
  }
  const c = palette[kind]
  return {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    padding: '3px 8px',
    borderRadius: 4,
    border: `1px solid ${active ? c.fg : 'var(--rule)'}`,
    background: active ? c.bg : 'transparent',
    color: active ? c.fg : 'var(--ink3)',
    cursor: 'pointer',
  }
}

function Step4Confirm({
  selectedPlayers,
  points,
  winnerId,
  longestRoadId,
  largestArmyId,
  ruleset,
  duration,
  setDuration,
  notes,
  setNotes,
  submitError,
}) {
  const winner = selectedPlayers.find((u) => u.id === winnerId)
  const winnerName = winner ? winner.display_name || winner.username : '—'
  const winnerPoints = winner ? points[winner.id] ?? 0 : 0
  const today = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const ordered = [...selectedPlayers].sort(
    (a, b) => (points[b.id] ?? 0) - (points[a.id] ?? 0),
  )

  return (
    <>
      <h1 className="disp" style={{ fontSize: 24, letterSpacing: -0.6, marginBottom: 4 }}>
        Revisa y guarda.
      </h1>
      <p style={{ fontSize: 13, color: 'var(--ink2)', marginBottom: 18 }}>
        ¿Todo correcto? También puedes añadir duración y notas.
      </p>

      <LCard style={{ marginBottom: 14 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 12,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--ink3)',
                letterSpacing: 0.6,
                textTransform: 'uppercase',
              }}
            >
              {today}
            </div>
            <div style={{ fontFamily: 'var(--font-disp)', fontSize: 18, marginTop: 2 }}>
              Ganó <i style={{ color: 'var(--accent)' }}>{winnerName}</i> con {winnerPoints} pts
            </div>
          </div>
          {ruleset && <LChip tone="soft">{rulesetLabel(ruleset).toLowerCase()}</LChip>}
        </div>

        <div className="stack">
          {ordered.map((u, i) => {
            const name = u.display_name || u.username
            const isWinner = u.id === winnerId
            const hasRoad = longestRoadId === u.id
            const hasArmy = largestArmyId === u.id
            return (
              <div
                key={u.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderTop: i === 0 ? '1px solid var(--rule-soft)' : 'none',
                  borderBottom:
                    i < ordered.length - 1 ? '1px solid var(--rule-soft)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <LAvatar name={name} size={24} />
                  <span style={{ fontFamily: 'var(--font-disp)', fontSize: 14 }}>{name}</span>
                  {isWinner && <span style={{ color: 'var(--win)' }}>★</span>}
                  {hasRoad && (
                    <span
                      style={{ fontSize: 10, color: 'var(--wood)', fontFamily: 'var(--font-mono)' }}
                    >
                      ruta
                    </span>
                  )}
                  {hasArmy && (
                    <span
                      style={{ fontSize: 10, color: 'var(--brick)', fontFamily: 'var(--font-mono)' }}
                    >
                      ejército
                    </span>
                  )}
                </div>
                <span
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600 }}
                >
                  {points[u.id] ?? 0}
                </span>
              </div>
            )
          })}
        </div>
      </LCard>

      <LField label="Duración (minutos, opcional)">
        <input
          type="number"
          min="0"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="p.ej. 90"
        />
      </LField>

      <div style={{ marginTop: 12 }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: 0.6,
            color: 'var(--ink3)',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          Notas (opcional)
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="¿Algo memorable?"
          style={{
            width: '100%',
            minHeight: 70,
            borderRadius: 12,
            border: '1px solid var(--rule)',
            background: 'var(--card)',
            padding: 12,
            fontSize: 13,
            color: 'var(--ink)',
            fontFamily: 'var(--font-disp)',
            fontStyle: 'italic',
            resize: 'vertical',
          }}
        />
      </div>

      {submitError && <p className="error-text" style={{ marginTop: 10 }}>{submitError}</p>}
    </>
  )
}
