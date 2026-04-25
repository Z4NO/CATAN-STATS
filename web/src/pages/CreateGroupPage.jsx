import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LButton, LField, LTopBar } from '../components/Ledger/index.jsx'
import { createGroup } from '../api/groups.js'

export default function CreateGroupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [privacy, setPrivacy] = useState('private')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const group = await createGroup({ name, description, privacy })
      navigate(`/groups/${group.id}`, { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'No se pudo crear el grupo')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <LTopBar title="Nuevo grupo" onBack={() => navigate(-1)} />
      <main style={{ padding: 22 }}>
        <form onSubmit={onSubmit} className="stack" style={{ gap: 16 }}>
          <LField label="Nombre">
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Peña del Domingo" />
          </LField>
          <LField label="Descripción (opcional)">
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Qué define a este grupo" />
          </LField>
          <LField label="Privacidad">
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              style={{ width: '100%', background: 'transparent' }}
            >
              <option value="private">Privado · solo invitados</option>
              <option value="restricted">Restringido · únete con código</option>
              <option value="public">Público</option>
            </select>
          </LField>

          {error && <div className="error-text">{error}</div>}

          <LButton type="submit" full size="lg" variant="primary" disabled={submitting}>
            {submitting ? 'Creando…' : 'Crear grupo'}
          </LButton>
        </form>
      </main>
    </>
  )
}
