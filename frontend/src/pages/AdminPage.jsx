import { useState, useEffect } from 'react'
import Layout        from '../components/shared/Layout'
import StatsCards    from '../components/admin/StatsCards'
import UsersTable    from '../components/admin/UsersTable'
import TemplatesGrid from '../components/admin/TemplatesGrid'
import { getAdminUsers } from '../api'
import toast, { Toaster } from 'react-hot-toast'

const MOCK_TEMPLATES = [
  { name: 'Classic',   category: 'Professional', icon: '📄', color: '#2563EB', active: true  },
  { name: 'Modern',    category: 'Creative',     icon: '✨', color: '#8B5CF6', active: true  },
  { name: 'Minimal',   category: 'Simple',       icon: '⬜', color: '#64748B', active: true  },
  { name: 'Bold',      category: 'Creative',     icon: '🎨', color: '#EF4444', active: false },
  { name: 'Executive', category: 'Professional', icon: '💼', color: '#0F172A', active: true  },
  { name: 'Fresh',     category: 'Modern',       icon: '🌿', color: '#22C55E', active: true  },
  { name: 'Elegant',   category: 'Luxury',       icon: '👑', color: '#F59E0B', active: false },
  { name: 'Tech',      category: 'Modern',       icon: '💻', color: '#06B6D4', active: true  },
]

export default function AdminPage() {
  const [users,     setUsers]     = useState([])
  const [stats,     setStats]     = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const res      = await getAdminUsers()
        const allUsers = res.data

        setUsers(allUsers)

        // Calculate real stats from real users
        const totalUsers  = allUsers.length
        const proUsers    = allUsers.filter(u =>
          u.subscriptionPlan === 'pro' ||
          u.subscriptionPlan === 'enterprise'
        ).length
        const activeToday = allUsers.filter(u => {
          const lastActive = new Date(u.updatedAt || u.createdAt)
          const diffHours  = (new Date() - lastActive) / (1000 * 60 * 60)
          return diffHours < 24
        }).length

        setStats({
          totalUsers,
          proUsers,
          revenue:     `$${proUsers * 9}`,
          activeToday,
        })

      } catch (err) {
        if (err.response?.status === 403) {
          setError('Admin access required.')
        } else {
          setError('Failed to load admin data.')
        }
        toast.error('Failed to load admin data.')
      } finally {
        setLoading(false)
      }
    }
    fetchAdminData()
  }, [])

  // Format users for table
  const formattedUsers = users.map(u => ({
    name:     u.name     || 'Unknown',
    email:    u.email    || '',
    plan:     u.subscriptionPlan   || 'free',
    joinDate: new Date(u.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day:   'numeric',
      year:  'numeric',
    }),
    status: u.subscriptionStatus === 'active' ? 'Active' : 'Active',
  }))

  return (
    <Layout>
      <Toaster position="top-right" />

      {/* PAGE HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Panel</h1>
          <p style={styles.subtitle}>
            Manage users, templates and subscriptions.
          </p>
        </div>
        <div style={styles.adminBadge}>
          ⚙️ Admin Access
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div style={styles.errorBox}>
          <p style={{ fontSize: 14, color: '#EF4444', fontWeight: 600 }}>
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div style={styles.loadingBox}>
          <p style={{ fontSize: 14, color: '#94A3B8' }}>
            Loading admin data...
          </p>
        </div>
      )}

      {/* CONTENT */}
      {!loading && !error && (
        <>
          {/* REAL STATS */}
          <StatsCards stats={stats || {
            totalUsers:  0,
            proUsers:    0,
            revenue:     '$0',
            activeToday: 0,
          }} />

          {/* REAL USERS */}
          <UsersTable users={formattedUsers} />

          {/* TEMPLATES — still mock until backend builds template management */}
          <TemplatesGrid templates={MOCK_TEMPLATES} />
        </>
      )}

    </Layout>
  )
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
  },
  adminBadge: {
    background: '#0F172A',
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    padding: '8px 16px',
    borderRadius: 10,
  },
  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FEE2E2',
    borderRadius: 12,
    padding: '20px 24px',
    marginBottom: 24,
  },
  loadingBox: {
    background: '#fff',
    border: '1px solid #F1F5F9',
    borderRadius: 12,
    padding: '40px',
    textAlign: 'center',
    marginBottom: 24,
  },
}