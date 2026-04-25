import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LButton, LField, LWordmark } from '../components/Ledger/index.jsx'
import { login } from '../api/auth.js'
import { useAuth } from '../auth/AuthContext.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { refresh } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(identifier, password)
      const me = await refresh()
      const redirectTo = location.state?.from || '/'
      navigate(me ? redirectTo : '/login', { replace: true })
    } catch (err) {
      const detail = err.response?.data?.detail || 'No pudimos iniciar sesión'
      setError(typeof detail === 'string' ? detail : 'Credenciales incorrectas')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '48px 24px 24px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <LWordmark size={28} />
      </div>

      <h1 className="disp" style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.5, marginBottom: 6 }}>
        Bienvenido de vuelta
      </h1>
      <p className="muted" style={{ fontSize: 14, marginBottom: 28 }}>
        Continúa tu peña. Estadísticas, partidas, todo en su sitio.
      </p>

      <form onSubmit={onSubmit} className="stack" style={{ gap: 18 }}>
        <LField label="Usuario o email">
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="alice o alice@catan.app"
            autoComplete="username"
            required
          />
        </LField>

        <LField label="Contraseña" hint={<Link to="/forgot" style={{ color: 'var(--ink3)' }}>¿Olvidaste?</Link>}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </LField>

        {error && <div className="error-text">{error}</div>}

        <LButton type="submit" full size="lg" variant="primary" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar'}
        </LButton>
      </form>

      <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: 32 }}>
        <span className="muted" style={{ fontSize: 13 }}>
          ¿Sin cuenta?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 500 }}>
            Regístrate
          </Link>
        </span>
      </div>
    </div>
  )
}
