import { useLocation, useNavigate } from 'react-router-dom'
import { faUsers, faDiceD6, faChartBar, faGear } from '@fortawesome/free-solid-svg-icons'
import { LTabBar } from './Ledger/index.jsx'

const TABS = [
  { id: 'home', label: 'Grupos', path: '/', icon: faUsers },
  { id: 'play', label: 'Jugar', path: '/play', icon: faDiceD6 },
  { id: 'stats', label: 'Stats', path: '/stats', icon: faChartBar },
  { id: 'me', label: 'Ajustes', path: '/me', icon: faGear },
]

function activeTab(pathname) {
  if (pathname === '/' || pathname.startsWith('/groups')) return 'home'
  if (pathname.startsWith('/play')) return 'play'
  if (pathname === '/stats') return 'stats'
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
