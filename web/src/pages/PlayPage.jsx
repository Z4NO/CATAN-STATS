import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LAvatar,
  LButton,
  LChip,
  LSectionLabel,
  LTopBar,
} from '../components/Ledger/index.jsx'
import { listOwnedGroups } from '../api/groups.js'

function formatLastActive(dateStr) {
  if (!dateStr) return 'sin partidas'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

export default function PlayPage() {
  const navigate = useNavigate()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    listOwnedGroups()
      .then((data) => !cancelled && setGroups(data))
      .catch((err) => !cancelled && setError(err.response?.data?.detail || 'Error cargando grupos'))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <LTopBar title="Jugar" subtitle="Elige un grupo donde eres host" />

      <main style={{ padding: '18px 22px', paddingBottom: 100 }}>

        <div style={{
          padding: 14,
          background: 'var(--accent-bg)',
          borderRadius: 12,
          marginBottom: 16,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}>
          <div style={{ width: 3, alignSelf: 'stretch', background: 'var(--accent)', borderRadius: 2, flexShrink: 0 }} />
          <div>
            <div className="disp" style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.2 }}>
              Solo el host arranca la partida.
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink2)', marginTop: 4, lineHeight: 1.5 }}>
              Los demás reciben una invitación cuando configures las reglas.
            </div>
          </div>
        </div>

        {loading && <p className="muted">Cargando…</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && groups.length === 0 && (
          <div style={{
            padding: 24,
            background: 'transparent',
            borderRadius: 12,
            border: '1px dashed var(--rule)',
            textAlign: 'center',
            marginTop: 8,
          }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink3)', letterSpacing: 0.4 }}>
              No eres host de ningún grupo
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink2)', marginTop: 4, marginBottom: 16, lineHeight: 1.5 }}>
              Crea un grupo para poder arrancar partidas.
            </div>
            <LButton variant="primary" size="sm" onClick={() => navigate('/groups/new')}>
              Crear grupo
            </LButton>
          </div>
        )}

        {!loading && !error && groups.length > 0 && (
          <>
            <LSectionLabel right={`${groups.length} grupos`}>Grupos donde eres host</LSectionLabel>

            <div className="stack" style={{ gap: 8 }}>
              {groups.map((g, i) => (
                <div
                  key={g.id}
                  onClick={() => navigate(`/play/configure/${g.id}`)}
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    background: 'var(--card)',
                    border: `1px solid ${i === 0 ? 'var(--ink)' : 'var(--rule-soft)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    cursor: 'pointer',
                  }}
                >
                  <LAvatar name={g.name} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span className="disp" style={{ fontSize: 16, color: 'var(--ink)' }}>{g.name}</span>
                      <LChip tone="accent">host</LChip>
                    </div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ink3)', letterSpacing: 0.3 }}>
                      {g.number_of_members}j · {formatLastActive(g.last_active)}
                    </div>
                  </div>
                  <span style={{ color: 'var(--ink2)', fontSize: 18 }}>›</span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 14,
              padding: 12,
              background: 'transparent',
              borderRadius: 12,
              border: '1px dashed var(--rule)',
              textAlign: 'center',
            }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink3)', letterSpacing: 0.4 }}>
                ¿No eres host de un grupo?
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink2)', marginTop: 4 }}>
                Espera a que tu host inicie · llegará un aviso.
              </div>
            </div>
          </>
        )}
      </main>
    </>
  )
}
