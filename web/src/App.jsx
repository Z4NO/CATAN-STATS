import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { ProtectedRoute } from './auth/ProtectedRoute.jsx'
import MainLayout from './components/MainLayout.jsx'
import InvitationModal from './components/InvitationModal.jsx'
import { NotificationProvider, useNotifications } from './notifications/NotificationContext.jsx'
import { joinLobby } from './api/lobby.js'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import CreateGroupPage from './pages/CreateGroupPage.jsx'
import JoinGroupPage from './pages/JoinGroupPage.jsx'
import GroupDetailPage from './pages/GroupDetailPage.jsx'
import MatchWizardPage from './pages/MatchWizardPage.jsx'
import MatchDetailPage from './pages/MatchDetailPage.jsx'
import StatsPage from './pages/StatsPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import PlayPage from './pages/PlayPage.jsx'
import ConfigureMatchPage from './pages/ConfigureMatchPage.jsx'
import LobbyPage from './pages/LobbyPage.jsx'

function Protected({ children, tabbar = false }) {
  const content = tabbar ? <MainLayout>{children}</MainLayout> : children
  return <ProtectedRoute>{content}</ProtectedRoute>
}

// Renders invitation modal overlay for any pending LOBBY_INVITE
function GlobalInvitations() {
  const { invitations, removeInvitation } = useNotifications()
  const navigate = useNavigate()

  // Skip malformed notifications that somehow lack a lobby_id
  const current = invitations.find(inv => inv.lobby_id != null)
  if (!current) return null

  async function handleAccept(lobbyId) {
    await joinLobby(lobbyId)
    removeInvitation(lobbyId)
    navigate(`/play/lobby/${lobbyId}`)
  }

  function handleDecline(lobbyId) {
    removeInvitation(lobbyId)
  }

  return (
    <InvitationModal
      notification={current}
      onAccept={handleAccept}
      onDecline={handleDecline}
    />
  )
}

export default function App() {
  return (
    <NotificationProvider>
      <div className="app-shell">
        <GlobalInvitations />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <Protected tabbar>
                <DashboardPage />
              </Protected>
            }
          />
          <Route
            path="/play"
            element={
              <Protected tabbar>
                <PlayPage />
              </Protected>
            }
          />
          <Route
            path="/play/configure/:groupId"
            element={
              <Protected>
                <ConfigureMatchPage />
              </Protected>
            }
          />
          <Route
            path="/play/lobby/:lobbyId"
            element={
              <Protected>
                <LobbyPage />
              </Protected>
            }
          />
          <Route
            path="/stats"
            element={
              <Protected tabbar>
                <StatsPage />
              </Protected>
            }
          />
          <Route
            path="/me"
            element={
              <Protected tabbar>
                <SettingsPage />
              </Protected>
            }
          />
          <Route
            path="/groups/new"
            element={
              <Protected>
                <CreateGroupPage />
              </Protected>
            }
          />
          <Route
            path="/groups/join"
            element={
              <Protected>
                <JoinGroupPage />
              </Protected>
            }
          />
          <Route
            path="/groups/:groupId"
            element={
              <Protected tabbar>
                <GroupDetailPage />
              </Protected>
            }
          />
          <Route
            path="/groups/:groupId/matches/new"
            element={
              <Protected>
                <MatchWizardPage />
              </Protected>
            }
          />
          <Route
            path="/matches/:matchId"
            element={
              <Protected>
                <MatchDetailPage />
              </Protected>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </NotificationProvider>
  )
}
