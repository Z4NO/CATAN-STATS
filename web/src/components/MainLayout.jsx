import { useLocation, useNavigate } from 'react-router-dom'
import { LTabBar } from './Ledger/index.jsx'

const TABS = [
  { id: 'home', label: 'Grupos', path: '/' },
  { id: 'play', label: 'Jugar', path: null },
  { id: 'stats', label: 'Stats', path: null },
  { id: 'me', label: 'Yo', path: '/me' },
]

function activeTab(pathname) {
  if (pathname === '/' || pathname.startsWith('/groups')) return 'home'
  if (pathname === '/me') return 'me'
  return null
}

export default function MainLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const current = activeTab(location.pathname)

  function handleTabChange(id) {
    const tab = TABS.find((t) => t.id === id)
    if (tab?.path) navigate(tab.path)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
      <LTabBar active={current} onChange={handleTabChange} items={TABS} />
    </div>
  )
}
