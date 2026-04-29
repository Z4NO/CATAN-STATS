import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { LAvatar, LButton, LCard, LSectionLabel, LTopBar } from '../components/Ledger/index.jsx'
import { useAuth } from '../auth/AuthContext.jsx'

function ComingSoon() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 0', gap: 8 }}>
      <FontAwesomeIcon icon={faClock} style={{ color: 'var(--ink3)', fontSize: 12 }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink3)', letterSpacing: 0.5 }}>
        Próximamente
      </span>
    </div>
  )
}

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const displayName = user?.display_name || user?.username || '?'

  return (
    <>
      <LTopBar title="Ajustes" />

      <div style={{ padding: '28px 22px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <LAvatar name={displayName} size={56} />
        <div>
          <div style={{ fontFamily: 'var(--font-disp)', fontSize: 20, fontWeight: 500, color: 'var(--ink)', letterSpacing: -0.3 }}>
            {displayName}
          </div>
          {user?.display_name && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>
              @{user.username}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 32 }}>
        <LSectionLabel>Cuenta</LSectionLabel>
        <LCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink2)' }}>
              {user?.email}
            </div>
            <div style={{ height: 1, background: 'var(--rule-soft)' }} />
            <LButton variant="danger" full onClick={handleLogout}>
              Cerrar sesión
            </LButton>
          </div>
        </LCard>

        <LSectionLabel>Preferencias</LSectionLabel>
        <LCard><ComingSoon /></LCard>

        <LSectionLabel>Privacidad</LSectionLabel>
        <LCard><ComingSoon /></LCard>

        <LSectionLabel>Notificaciones</LSectionLabel>
        <LCard><ComingSoon /></LCard>
      </div>
    </>
  )
}
