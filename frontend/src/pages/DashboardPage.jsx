import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import Layout                  from '../components/shared/Layout'
import useAuthStore            from '../store/authStore'
import { getUserResumes, deleteResume, createResume } from '../api'
import toast, { Toaster }      from 'react-hot-toast'

const TEMPLATE_COLORS = {
  classic:   '#1E293B',
  modern:    '#2563EB',
  minimal:   '#64748B',
  bold:      '#EF4444',
  executive: '#0F172A',
  fresh:     '#22C55E',
  elegant:   '#D97706',
  tech:      '#0E7490',
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const user     = useAuthStore((state) => state.user)

  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  const isPro = user?.subscriptionPlan === 'pro' || user?.subscriptionPlan === 'enterprise'
  const plan  = user?.subscriptionPlan || 'free'

  useEffect(() => {
    async function fetchResumes() {
      try {
        const res = await getUserResumes()
        setResumes(res.data)
      } catch (err) {
        toast.error('Failed to load resumes.')
      } finally {
        setLoading(false)
      }
    }
    fetchResumes()
  }, [])

  // ─── Enforce free plan 1 resume limit ───
  function handleCreateResume() {
    if (!isPro && resumes.length >= 1) {
      toast.error('Free plan allows 1 resume only. Upgrade to Pro for unlimited resumes.')
      navigate('/subscription')
      return
    }
    navigate('/builder')
  }

  async function handleDelete(id) {
    try {
      await deleteResume(id)
      setResumes(resumes.filter((r) => r._id !== id))
      toast.success('Resume deleted.')
    } catch (err) {
      toast.error('Failed to delete resume.')
    }
  }

  async function handleDuplicate(resume) {
    if (!isPro && resumes.length >= 1) {
      toast.error('Free plan allows 1 resume only. Upgrade to Pro.')
      navigate('/subscription')
      return
    }
    try {
      const res = await createResume({
        title:          resume.title + ' (Copy)',
        templateId:     resume.templateId || 'classic',
        personalInfo:   resume.personalInfo,
        summary:        resume.summary,
        experience:     resume.experience,
        education:      resume.education,
        skills:         resume.skills,
        projects:       resume.projects,
        certifications: resume.certifications,
      })
      setResumes([...resumes, res.data])
      toast.success('Resume duplicated.')
    } catch (err) {
      toast.error('Failed to duplicate resume.')
    }
  }

  // ─── Plan config ─────────────────────────
  const planConfig = {
    free:       { label: 'Free',       color: '#64748B', bg: '#F8FAFC', border: '#E2E8F0' },
    pro:        { label: 'Pro',        color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
    enterprise: { label: 'Enterprise', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  }
  const pc = planConfig[plan] || planConfig.free

  return (
    <Layout>
      <Toaster position="top-right" />

      {/* PAGE HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={styles.subtitle}>
            Manage your resumes and track your ATS scores.
          </p>
        </div>
        <button onClick={handleCreateResume} style={styles.createBtn}>
          + Create New Resume
        </button>
      </div>

      {/* PLAN STATUS CARD */}
      <div style={{
        ...styles.subCard,
        background: pc.bg,
        border: `1px solid ${pc.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12,
            background: pc.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0,
          }}>
            {plan === 'enterprise' ? '🏢' : plan === 'pro' ? '⚡' : '🆓'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: pc.color }}>
                {pc.label} Plan
              </p>
              {isPro && (
                <span style={{ fontSize: 11, fontWeight: 700, background: pc.color, color: '#fff', padding: '2px 8px', borderRadius: 20 }}>
                  ACTIVE
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>
              {plan === 'free'
                ? `${resumes.length}/1 resume used. Upgrade to Pro for unlimited resumes, all templates & PDF downloads.`
                : plan === 'pro'
                  ? `${resumes.length} resume${resumes.length !== 1 ? 's' : ''} • All templates unlocked • PDF downloads enabled`
                  : `${resumes.length} resume${resumes.length !== 1 ? 's' : ''} • Full access • Team features enabled`}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          {!isPro && (
            <button onClick={() => navigate('/subscription')} style={styles.upgradeBtn}>
              ⚡ Upgrade to Pro
            </button>
          )}
          {isPro && (
            <button onClick={() => navigate('/subscription')} style={styles.manageBtn}>
              Manage Plan
            </button>
          )}
        </div>
      </div>

      {/* FREE PLAN LIMIT WARNING */}
      {!isPro && resumes.length >= 1 && (
        <div style={styles.limitBanner}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>
              Resume limit reached
            </p>
            <p style={{ fontSize: 12, color: '#B45309' }}>
              Free plan allows 1 resume. Delete the existing one or upgrade to Pro for unlimited resumes.
            </p>
          </div>
          <button onClick={() => navigate('/subscription')} style={styles.limitBtn}>
            Upgrade Now →
          </button>
        </div>
      )}

      {/* QUICK STATS ROW */}
      {resumes.length > 0 && (
        <div style={styles.statsRow}>
          <StatCard
            icon="📄"
            label="Total Resumes"
            value={resumes.length}
            color="#2563EB"
          />
          <StatCard
            icon="📊"
            label="Avg ATS Score"
            value={
              resumes.length > 0
                ? Math.round(resumes.reduce((a, r) => a + (r.atsScore || 0), 0) / resumes.length) + '%'
                : '—'
            }
            color="#22C55E"
          />
          <StatCard
            icon="🏆"
            label="Best Score"
            value={
              resumes.length > 0
                ? Math.max(...resumes.map(r => r.atsScore || 0)) + '%'
                : '—'
            }
            color="#F59E0B"
          />
          <StatCard
            icon="🎨"
            label="Templates Used"
            value={new Set(resumes.map(r => r.templateId || 'classic')).size}
            color="#8B5CF6"
          />
        </div>
      )}

      {/* RESUMES SECTION */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={styles.sectionTitle}>My Resumes</h2>
        {resumes.length > 0 && (
          <p style={{ fontSize: 13, color: '#94A3B8' }}>
            {isPro ? `${resumes.length} resume${resumes.length !== 1 ? 's' : ''}` : `${resumes.length} / 1`}
          </p>
        )}
      </div>

      {loading ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>⏳</div>
          <p style={styles.emptyTitle}>Loading resumes...</p>
        </div>

      ) : resumes.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>📄</div>
          <p style={styles.emptyTitle}>No resumes yet</p>
          <p style={styles.emptyDesc}>Create your first resume to get started.</p>
          <button onClick={handleCreateResume} style={styles.createBtn}>
            + Create Resume
          </button>
        </div>

      ) : (
        <div style={styles.grid}>
          {resumes.map((resume) => {
            const tmplColor = TEMPLATE_COLORS[resume.templateId] || '#1E293B'
            const score     = resume.atsScore || 0
            return (
              <div key={resume._id} style={styles.resumeCard}>

                {/* COLOR PREVIEW */}
                <div style={{ ...styles.preview, background: tmplColor }}>
                  {/* Mini mockup */}
                  <div style={styles.mockup}>
                    <div style={styles.mockupH} />
                    <div style={styles.mockupL} />
                    <div style={{ ...styles.mockupL, width: '60%' }} />
                    <div style={styles.mockupD} />
                    <div style={styles.mockupL} />
                    <div style={{ ...styles.mockupL, width: '75%' }} />
                  </div>
                  <div style={styles.templateTag}>
                    {(resume.templateId || 'classic').toUpperCase()}
                  </div>
                </div>

                {/* INFO */}
                <div style={styles.resumeInfo}>
                  <h3 style={styles.resumeTitle}>
                    {resume.title || 'Untitled Resume'}
                  </h3>
                  <p style={styles.resumeDate}>
                    Updated {new Date(resume.updatedAt || resume.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </p>

                  {/* ATS SCORE BAR */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>ATS Score</span>
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        color: score >= 70 ? '#16A34A' : score >= 45 ? '#CA8A04' : '#DC2626',
                      }}>
                        {score}%
                      </span>
                    </div>
                    <div style={{ height: 5, background: '#F1F5F9', borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${score}%`,
                        background: score >= 70 ? '#22C55E' : score >= 45 ? '#F59E0B' : '#EF4444',
                        borderRadius: 10,
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div style={styles.actionRow}>
                    <button
                      onClick={() => navigate(`/builder?id=${resume._id}`)}
                      style={styles.editBtn}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDuplicate(resume)}
                      style={styles.dupBtn}
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      style={styles.delBtn}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {/* CREATE NEW CARD — blocked if free + limit reached */}
          <div
            onClick={handleCreateResume}
            style={{
              ...styles.createCard,
              opacity: !isPro && resumes.length >= 1 ? 0.5 : 1,
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: '#F1F5F9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, marginBottom: 8,
            }}>
              {!isPro && resumes.length >= 1 ? '🔒' : '+'}
            </div>
            <p style={styles.createCardText}>
              {!isPro && resumes.length >= 1 ? 'Upgrade to Add More' : 'Create New Resume'}
            </p>
          </div>
        </div>
      )}

    </Layout>
  )
}

// ─── STAT CARD ───────────────────────────────────────────
function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: '16px 20px',
      border: '1px solid #F1F5F9',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: color + '15',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{value}</p>
        <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{label}</p>
      </div>
    </div>
  )
}

// ─── STYLES ──────────────────────────────────────────────
const styles = {
  header:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  title:       { fontSize: 26, fontWeight: 800, color: '#0F172A', marginBottom: 6 },
  subtitle:    { fontSize: 15, color: '#64748B' },
  createBtn:   { padding: '11px 20px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  subCard:     { borderRadius: 14, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 16, flexWrap: 'wrap' },
  upgradeBtn:  { padding: '10px 20px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  manageBtn:   { padding: '10px 20px', background: '#fff', color: '#64748B', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  limitBanner: { display: 'flex', alignItems: 'center', gap: 12, background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '12px 16px', marginBottom: 20 },
  limitBtn:    { padding: '8px 16px', background: '#F59E0B', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 },
  statsRow:    { display: 'flex', gap: 16, marginBottom: 24 },
  sectionTitle:{ fontSize: 18, fontWeight: 700, color: '#0F172A' },
  grid:        { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 },
  resumeCard:  { background: '#fff', borderRadius: 14, border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', overflow: 'hidden' },
  preview:     { height: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, position: 'relative' },
  mockup:      { background: 'rgba(255,255,255,0.15)', borderRadius: 6, padding: '8px 10px', width: 80, backdropFilter: 'blur(2px)' },
  mockupH:     { height: 6, background: 'rgba(255,255,255,0.8)', borderRadius: 2, marginBottom: 5, width: '65%' },
  mockupL:     { height: 3, background: 'rgba(255,255,255,0.5)', borderRadius: 2, marginBottom: 4, width: '100%' },
  mockupD:     { height: 1, background: 'rgba(255,255,255,0.3)', margin: '5px 0' },
  templateTag: { position: 'absolute', bottom: 8, right: 8, fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.8)', background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: 10, letterSpacing: 1 },
  resumeInfo:  { padding: '14px 16px' },
  resumeTitle: { fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 3 },
  resumeDate:  { fontSize: 11, color: '#94A3B8', marginBottom: 10 },
  actionRow:   { display: 'flex', gap: 8 },
  editBtn:     { flex: 1, padding: '8px 0', background: '#EFF6FF', color: '#2563EB', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  dupBtn:      { flex: 1, padding: '8px 0', background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  delBtn:      { padding: '8px 10px', background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' },
  createCard:  { background: '#fff', borderRadius: 14, border: '2px dashed #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer', minHeight: 260 },
  createCardText: { fontSize: 13, fontWeight: 600, color: '#CBD5E1' },
  emptyState:  { textAlign: 'center', padding: '60px 40px', background: '#fff', borderRadius: 14, border: '1px solid #F1F5F9' },
  emptyTitle:  { fontSize: 18, fontWeight: 700, color: '#CBD5E1', marginBottom: 8 },
  emptyDesc:   { fontSize: 14, color: '#94A3B8', marginBottom: 24 },
}
