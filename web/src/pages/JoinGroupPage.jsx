import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LButton, LField, LTopBar } from '../components/Ledger/index.jsx'
import { joinGroupByCode } from '../api/groups.js'

export default function JoinGroupPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const group = await joinGroupByCode(code.trim())
      navigate(`/groups/${group.id}`, { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Código inválido')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <LTopBar title="Unirme a un grupo" onBack={() => navigate(-1)} />
      <main style={{ padding: 22 }}>
        <p className="muted" style={{ marginBottom: 20, fontSize: 14 }}>
          Pídele al admin del grupo el código de invitación.
        </p>
        <form onSubmit={onSubmit} className="stack" style={{ gap: 16 }}>
          <LField label="Código">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="abc123"
              required
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
          </LField>

          {error && <div className="error-text">{error}</div>}

          <LButton type="submit" full size="lg" variant="primary" disabled={submitting}>
            {submitting ? 'Uniendo…' : 'Unirme'}
          </LButton>
        </form>
      </main>
    </>
  )
}
