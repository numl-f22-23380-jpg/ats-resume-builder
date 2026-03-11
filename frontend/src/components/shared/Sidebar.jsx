import { useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const NAV_ITEMS = [
  { path: '/dashboard',      label: 'Dashboard',      icon: '🏠', adminOnly: false },
  { path: '/builder',        label: 'Resume Builder', icon: '📝', adminOnly: false },
  { path: '/templates',      label: 'Templates',      icon: '🎨', adminOnly: false },
  { path: '/pdf-preview',    label: 'PDF Preview',    icon: '📄', adminOnly: false },
  { path: '/ats',            label: 'ATS Analyzer',   icon: '📊', adminOnly: false },
  { path: '/job-analyzer',   label: 'Job Analyzer',   icon: '🔍', adminOnly: false },
  { path: '/ai-suggestions', label: 'AI Suggestions', icon: '✨', adminOnly: false },
  { path: '/subscription',   label: 'Subscription',   icon: '💳', adminOnly: false },
  { path: '/admin',          label: 'Admin Panel',    icon: '⚙️', adminOnly: true  },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const user   = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  function handleLogout() {
    logout()
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <aside style={sidebar}>

      {/* LOGO */}
      <div style={logoArea}>
        <div style={logoIcon}>📄</div>
        <div>
          <p style={{ fontWeight: 800, fontSize: 15, color: '#0F172A' }}>
            ResumeAI
          </p>
          <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
            ATS Optimization
          </p>
        </div>
      </div>

      {/* NAV LINKS */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        <p style={sectionLabel}>MENU</p>
        {NAV_ITEMS
          .filter((item) => !item.adminOnly || user?.role === 'admin')
          .map((item) => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  ...navBtn,
                  background: isActive ? '#EFF6FF' : 'transparent',
                  color:      isActive ? '#2563EB' : '#475569',
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
      </nav>

      {/* USER at bottom */}
      <div style={userArea}>
        <div style={userRow}>
          <div style={avatar}>
            <span style={{ fontSize: 16 }}>👤</span>
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={userName}>{user?.name || 'User'}</p>
            <p style={userEmail}>{user?.email || ''}</p>
          </div>
        </div>

        <div style={divider} />

        <button
          onClick={handleLogout}
          style={signOutBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.color      = '#EF4444'
            e.currentTarget.style.background = '#FEF2F2'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color      = '#94A3B8'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          ↩ Sign Out
        </button>
      </div>

    </aside>
  )
}

const sidebar = {
  width: 220,
  background: '#fff',
  borderRight: '1px solid #E2E8F0',
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  position: 'sticky',
  top: 0,
  flexShrink: 0,
}
const logoArea = {
  padding: '20px 16px 16px',
  borderBottom: '1px solid #F1F5F9',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
}
const logoIcon = {
  width: 38,
  height: 38,
  background: '#2563EB',
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
  flexShrink: 0,
}
const sectionLabel = {
  fontSize: 11,
  fontWeight: 700,
  color: '#94A3B8',
  letterSpacing: '0.06em',
  padding: '0 8px',
  marginBottom: 8,
}
const navBtn = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 10px',
  borderRadius: 8,
  border: 'none',
  fontSize: 14,
  cursor: 'pointer',
  textAlign: 'left',
  marginBottom: 2,
  fontFamily: 'inherit',
  transition: 'all 0.15s',
}
const userArea = {
  padding: '12px 16px 16px',
  borderTop: '1px solid #F1F5F9',
}
const userRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 10,
}
const avatar = {
  width: 34,
  height: 34,
  borderRadius: '50%',
  background: '#EFF6FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}
const userName = {
  fontSize: 13,
  fontWeight: 700,
  color: '#0F172A',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}
const userEmail = {
  fontSize: 11,
  color: '#94A3B8',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}
const divider = {
  height: 1,
  background: '#F1F5F9',
  marginBottom: 10,
}
const signOutBtn = {
  width: '100%',
  padding: '8px 10px',
  border: 'none',
  background: 'transparent',
  color: '#94A3B8',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'inherit',
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  transition: 'all 0.15s',
}