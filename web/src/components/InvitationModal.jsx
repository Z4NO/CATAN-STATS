import { useState } from 'react'
import { LAvatar, LButton } from './Ledger/index.jsx'

const EXPANSION_LABELS = {
  base: 'Base',
  seafarers: 'Navegantes',
  cities_and_knights: 'Ciudades & Caballeros',
  traders_and_barbarians: 'Mercaderes & Bárbaros',
}

export default function InvitationModal({ notification, onAccept, onDecline }) {
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState(null)

  if (!notification) return null

  const expansionLabel = EXPANSION_LABELS[notification.ruleset] ?? notification.ruleset ?? '—'
  const vp = notification.lobby?.ruleset?.victory_points ?? '—'

  async function handleAccept() {
    setJoining(true)
    setError(null)
    try {
      await onAccept(notification.lobby_id)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Error al unirse')
      setJoining(false)
    }
  }

  const rows = [
    { l: 'Expansión', v: expansionLabel },
    { l: 'Puntos',    v: String(vp) },
    { l: 'Jugadores', v: notification.players?.join(', ') ?? '—' },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(28, 26, 22, 0.55)', backdropFilter: 'blur(2px)' }}
        onClick={() => !joining && onDecline(notification.lobby_id)}
      />

      <div style={{
        position: 'absolute',
        left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% - 32px)',
        maxWidth: 440,
        background: 'var(--paper)',
        borderRadius: 18,
        padding: 22,
        border: '1px solid var(--rule)',
        boxShadow: '0 20px 40px -12px rgba(28,26,22,.45)',
        zIndex: 1,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)',
            letterSpacing: 1.2, textTransform: 'uppercase',
          }}>── Invitación a partida</span>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--accent)', display: 'inline-block' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <LAvatar name={notification.from_user} size={40} color="var(--accent)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-disp)', fontSize: 18, color: 'var(--ink)', lineHeight: 1.2 }}>
              <em>{notification.from_user}</em> te invita a jugar
            </div>
          </div>
        </div>

        <div style={{
          padding: '10px 12px', background: 'var(--card)', borderRadius: 10,
          border: '1px solid var(--rule-soft)', marginBottom: 14,
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          {rows.map((r) => (
            <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, lineHeight: 1.4 }}>
              <span style={{
                color: 'var(--ink3)', fontFamily: 'var(--font-mono)',
                letterSpacing: 0.4, textTransform: 'uppercase',
              }}>{r.l}</span>
              <span style={{ color: 'var(--ink)', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{r.v}</span>
            </div>
          ))}
        </div>

        {error && (
          <p className="error-text" style={{ fontSize: 11, textAlign: 'center', margin: '0 0 10px' }}>{error}</p>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <LButton
            variant="secondary"
            style={{ flex: 1 }}
            disabled={joining}
            onClick={() => onDecline(notification.lobby_id)}
          >
            Ahora no
          </LButton>
          <LButton
            variant="primary"
            style={{ flex: 2 }}
            disabled={joining}
            onClick={handleAccept}
          >
            {joining ? 'Uniéndome…' : 'Unirme ✓'}
          </LButton>
        </div>
      </div>
    </div>
  )
}
