import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './auth/ProtectedRoute.jsx'
import MainLayout from './components/MainLayout.jsx'
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

function Protected({ children, tabbar = false }) {
  const content = tabbar ? <MainLayout>{children}</MainLayout> : children
  return <ProtectedRoute>{content}</ProtectedRoute>
}

export default function App() {
  return (
    <div className="app-shell">
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
  )
}
