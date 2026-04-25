import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LButton, LField, LWordmark } from '../components/Ledger/index.jsx'
import { login, register } from '../api/auth.js'
import { useAuth } from '../auth/AuthContext.jsx'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { refresh } = useAuth()
  const [form, setForm] = useState({
    username: '',
    email: '',
    display_name: '',
    password: '',
  })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await register(form)
      await login(form.email, form.password)
      await refresh()
      navigate('/', { replace: true })
    } catch (err) {
      const detail = err.response?.data?.detail || 'No pudimos crear la cuenta'
      setError(typeof detail === 'string' ? detail : 'Datos inválidos')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '48px 24px 24px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <LWordmark size={28} />
      </div>

      <h1 className="disp" style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.5, marginBottom: 6 }}>
        Crea tu cuenta
      </h1>
      <p className="muted" style={{ fontSize: 14, marginBottom: 28 }}>
        Crea o únete a una peña y empieza a registrar partidas.
      </p>

      <form onSubmit={onSubmit} className="stack" style={{ gap: 16 }}>
        <LField label="Usuario">
          <input value={form.username} onChange={update('username')} required minLength={3} placeholder="alice" />
        </LField>
        <LField label="Email">
          <input type="email" value={form.email} onChange={update('email')} required placeholder="alice@catan.app" />
        </LField>
        <LField label="Nombre visible (opcional)">
          <input value={form.display_name} onChange={update('display_name')} placeholder="Alice Builder" />
        </LField>
        <LField label="Contraseña">
          <input
            type="password"
            value={form.password}
            onChange={update('password')}
            required
            minLength={6}
            placeholder="al menos 6 caracteres"
          />
        </LField>

        {error && <div className="error-text">{error}</div>}

        <LButton type="submit" full size="lg" variant="primary" disabled={submitting}>
          {submitting ? 'Creando…' : 'Crear cuenta'}
        </LButton>
      </form>

      <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: 32 }}>
        <span className="muted" style={{ fontSize: 13 }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>
            Inicia sesión
          </Link>
        </span>
      </div>
    </div>
  )
}
