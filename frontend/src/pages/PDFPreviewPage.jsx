import { useEffect, useState }  from 'react'
import { useNavigate }          from 'react-router-dom'
import Layout                   from '../components/shared/Layout'
import { getUserResumes }       from '../api'
import useAuthStore             from '../store/authStore'
import toast, { Toaster }       from 'react-hot-toast'

export default function PDFPreviewPage() {
  const navigate    = useNavigate()
  const user        = useAuthStore((s) => s.user)

  const [resumes,     setResumes]     = useState([])
  const [resumeId,    setResumeId]    = useState('')
  const [resume,      setResume]      = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)

  // Determine plan — check user object first, fallback to localStorage
  const currentPlan = user?.subscriptionPlan || localStorage.getItem('plan') || 'free'
  const isPro       = currentPlan === 'pro' || currentPlan === 'enterprise'

  useEffect(() => {
    async function fetchResumes() {
      try {
        const res = await getUserResumes()
        setResumes(res.data)
        if (res.data.length > 0) {
          setResumeId(res.data[0]._id)
          setResume(res.data[0])
        }
      } catch {
        toast.error('Failed to load resumes.')
      } finally {
        setLoading(false)
      }
    }
    fetchResumes()
  }, [])

  function handleResumeChange(id) {
    setResumeId(id)
    setResume(resumes.find(r => r._id === id) || null)
  }

  async function handleDownload() {
    if (!resumeId) {
      toast.error('Please select a resume first.')
      return
    }

    // ── PAYWALL: free users cannot download PDF ──
    if (!isPro) {
      setShowPaywall(true)
      return
    }

    setDownloading(true)
    const loadingToast = toast.loading('Generating PDF...')
    try {
      const response = await fetch('http://localhost:5000/api/generate-pdf', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ resumeId }),
      })
      if (!response.ok) throw new Error('Failed')
      const blob = await response.blob()
      const url  = window.URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `${resume?.title || 'resume'}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.dismiss(loadingToast)
      toast.success('Resume downloaded!')
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Failed to generate PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const personalInfo   = resume?.personalInfo   || {}
  const summary        = resume?.summary        || ''
  const experience     = resume?.experience     || []
  const education      = resume?.education      || []
  const skills         = resume?.skills         || []
  const projects       = resume?.projects       || []
  const certifications = resume?.certifications || []
  const atsScore       = resume?.atsScore       || 0
  const templateId     = resume?.templateId     || 'classic'

  return (
    <Layout>
      <Toaster position="top-right" />

      {/* PAGE HEADER */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Resume Preview</h1>
          <p style={s.subtitle}>Review your resume before downloading.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => navigate('/builder')} style={s.editBtn}>
            ✏️ Edit Resume
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading || !resumeId}
            style={{
              ...s.downloadBtn,
              background: downloading || !resumeId ? '#93C5FD' : '#2563EB',
              cursor:     downloading || !resumeId ? 'not-allowed' : 'pointer',
            }}
          >
            {downloading ? 'Generating…' : isPro ? '⬇️ Download PDF' : '🔒 Download PDF'}
          </button>
        </div>
      </div>

      {/* FREE USER BANNER */}
      {!isPro && (
        <div style={s.freeBanner}>
          <span style={{ fontSize: 16 }}>🔒</span>
          <p style={{ fontSize: 13, color: '#92400E', fontWeight: 500 }}>
            You're on the <strong>Free plan</strong>. Upgrade to Pro to download your resume as a PDF.
          </p>
          <button onClick={() => navigate('/subscription')} style={s.bannerBtn}>
            Upgrade to Pro →
          </button>
        </div>
      )}

      {/* RESUME SELECTOR */}
      {resumes.length > 0 && (
        <div style={s.selectorCard}>
          <label style={s.selectorLabel}>Select Resume</label>
          <select
            value={resumeId}
            onChange={e => handleResumeChange(e.target.value)}
            style={s.select}
          >
            {resumes.map(r => (
              <option key={r._id} value={r._id}>
                {r.title || 'Untitled Resume'}
              </option>
            ))}
          </select>
          {/* Template badge */}
          <div style={s.templateBadge}>
            🎨 {(templateId.charAt(0).toUpperCase() + templateId.slice(1))} template
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div style={s.centerBox}>
          <p style={{ color: '#94A3B8', fontSize: 14 }}>Loading resumes...</p>
        </div>
      )}

      {/* NO RESUMES */}
      {!loading && resumes.length === 0 && (
        <div style={{ ...s.centerBox, textAlign: 'center' }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>📄</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#CBD5E1', marginBottom: 8 }}>No resumes yet</p>
          <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 20 }}>
            Create a resume first to preview and download it.
          </p>
          <button onClick={() => navigate('/builder')} style={s.downloadBtn}>
            + Create Resume
          </button>
        </div>
      )}

      {/* MAIN CONTENT */}
      {!loading && resume && (
        <div style={s.grid}>

          {/* LEFT SIDEBAR */}
          <div>

            {/* ATS SCORE */}
            <div style={s.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 22 }}>📊</span>
                <h3 style={s.cardTitle}>ATS Score</h3>
              </div>
              <p style={{
                fontSize: 48, fontWeight: 800, lineHeight: 1, marginBottom: 8,
                color: atsScore >= 70 ? '#22C55E' : atsScore >= 45 ? '#F59E0B' : '#EF4444',
              }}>
                {atsScore}%
              </p>
              <p style={{ fontSize: 13, color: '#64748B', marginBottom: 14, lineHeight: 1.5 }}>
                {atsScore >= 70
                  ? '✅ Great! Your resume is well optimized.'
                  : atsScore > 0
                    ? '⚠️ Consider adding more keywords.'
                    : 'Run ATS Analyzer to get your score.'}
              </p>
              <div style={{ width: '100%', height: 8, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 99, transition: 'width 1s ease',
                  width: `${atsScore}%`,
                  background: atsScore >= 70 ? '#22C55E' : atsScore >= 45 ? '#F59E0B' : '#EF4444',
                }} />
              </div>
            </div>

            {/* RESUME STATS */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>Resume Summary</h3>
              {[
                ['Skills Added',       skills.length],
                ['Experience Entries', experience.filter(e => e.jobTitle).length],
                ['Education Entries',  education.filter(e => e.degree).length],
                ['Projects',           projects.filter(p => p.name).length],
                ['Certifications',     certifications.filter(c => c.name).length],
              ].map(([label, val], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < 4 ? '1px solid #F8FAFC' : 'none' }}>
                  <p style={{ fontSize: 13, color: '#64748B' }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{val}</p>
                </div>
              ))}
            </div>

            {/* QUICK ACTIONS */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>Quick Actions</h3>
              {[
                { label: '📊 Check ATS Score',   path: '/ats' },
                { label: '✨ Improve with AI',    path: '/ai-suggestions' },
                { label: '🎨 Change Template',    path: '/templates' },
                { label: '📋 Subscription',       path: '/subscription' },
              ].map((a, i) => (
                <button
                  key={i}
                  onClick={() => navigate(a.path)}
                  style={s.actionBtn}
                >
                  {a.label}
                </button>
              ))}
            </div>

          </div>

          {/* RIGHT — RESUME PAPER */}
          <div style={s.paper}>
            <ResumeRenderer
              templateId={templateId}
              personalInfo={personalInfo}
              summary={summary}
              experience={experience}
              education={education}
              skills={skills}
              projects={projects}
              certifications={certifications}
            />
          </div>

        </div>
      )}

      {/* ── PDF PAYWALL MODAL ──────────────────────── */}
      {showPaywall && (
        <>
          <div
            onClick={() => setShowPaywall(false)}
            style={s.modalOverlay}
          />
          <div style={s.modal}>
            <button onClick={() => setShowPaywall(false)} style={s.modalClose}>✕</button>

            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>📄</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
                Download Your Resume
              </h2>
              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7 }}>
                Upgrade to <strong>Pro</strong> to download your resume as a PDF and unlock all features.
              </p>
            </div>

            {/* Benefits list */}
            <div style={s.benefitsBox}>
              {[
                '⬇️  Unlimited PDF downloads',
                '🎨  All 8 premium templates',
                '✨  AI resume suggestions',
                '📊  Advanced ATS analysis',
                '🔄  Unlimited resumes',
                '🏆  Priority support',
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < 5 ? 10 : 0 }}>
                  <p style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>{f}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setShowPaywall(false)}
                style={s.modalCancelBtn}
              >
                Maybe later
              </button>
              <button
                onClick={() => { setShowPaywall(false); navigate('/subscription') }}
                style={s.modalUpgradeBtn}
              >
                🚀 Upgrade to Pro — $9.99/mo
              </button>
            </div>

            <p style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center', marginTop: 14 }}>
              Cancel anytime • 30-day money back guarantee
            </p>
          </div>
        </>
      )}

    </Layout>
  )
}

// ─── RESUME RENDERER — switches style based on templateId ──
function ResumeRenderer({ templateId, personalInfo, summary, experience, education, skills, projects, certifications }) {
  switch (templateId) {
    case 'modern':    return <ModernResume    {...{ personalInfo, summary, experience, education, skills, projects, certifications }} />
    case 'minimal':   return <MinimalResume   {...{ personalInfo, summary, experience, education, skills, projects, certifications }} />
    case 'tech':      return <TechResume      {...{ personalInfo, summary, experience, education, skills, projects, certifications }} />
    case 'executive': return <ExecutiveResume {...{ personalInfo, summary, experience, education, skills, projects, certifications }} />
    case 'bold':      return <BoldResume      {...{ personalInfo, summary, experience, education, skills, projects, certifications }} />
    case 'fresh':     return <FreshResume     {...{ personalInfo, summary, experience, education, skills, projects, certifications }} />
    case 'elegant':   return <ElegantResume   {...{ personalInfo, summary, experience, education, skills, projects, certifications }} />
    default:          return <ClassicResume   {...{ personalInfo, summary, experience, education, skills, projects, certifications }} />
  }
}

// ─── SHARED SUB-COMPONENTS ────────────────────────────────
function ExpItems({ experience }) {
  return experience.map((exp, i) => exp.jobTitle && (
    <div key={i} style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{exp.jobTitle}</p>
        <p style={{ fontSize: 11, color: '#64748B', flexShrink: 0 }}>
          {exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : exp.current ? ' — Present' : ''}
        </p>
      </div>
      <p style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>
        {exp.company}{exp.location ? ` • ${exp.location}` : ''}
      </p>
      {exp.description && <p style={{ fontSize: 12, color: '#334155', lineHeight: 1.6 }}>{exp.description}</p>}
    </div>
  ))
}

function EduItems({ education }) {
  return education.map((edu, i) => edu.degree && (
    <div key={i} style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{edu.degree}</p>
        <p style={{ fontSize: 11, color: '#64748B', flexShrink: 0 }}>
          {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
        </p>
      </div>
      <p style={{ fontSize: 12, color: '#64748B' }}>
        {edu.school}{edu.location ? ` • ${edu.location}` : ''}
      </p>
      {edu.gpa && <p style={{ fontSize: 12, color: '#334155' }}>GPA: {edu.gpa}</p>}
    </div>
  ))
}

function ProjItems({ projects }) {
  return projects.map((proj, i) => proj.name && (
    <div key={i} style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{proj.name}</p>
        {proj.link && <p style={{ fontSize: 11, color: '#2563EB', flexShrink: 0 }}>{proj.link}</p>}
      </div>
      {proj.tech && <p style={{ fontSize: 12, color: '#2563EB', marginBottom: 4 }}>{proj.tech}</p>}
      {proj.description && <p style={{ fontSize: 12, color: '#334155', lineHeight: 1.6 }}>{proj.description}</p>}
    </div>
  ))
}

function CertItems({ certifications }) {
  return certifications.map((cert, i) => cert.name && (
    <div key={i} style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{cert.name}</p>
        {cert.date && <p style={{ fontSize: 11, color: '#64748B' }}>{cert.date}</p>}
      </div>
      {cert.issuer && <p style={{ fontSize: 12, color: '#64748B' }}>{cert.issuer}</p>}
    </div>
  ))
}

// ─── CLASSIC ─────────────────────────────────────────────
function ClassicResume({ personalInfo, summary, experience, education, skills, projects, certifications }) {
  return (
    <div style={{ padding: '40px 36px', fontFamily: 'Georgia, serif' }}>
      <div style={{ borderBottom: '2px solid #0F172A', paddingBottom: 16, marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {personalInfo.email    && <span style={{ fontSize: 12, color: '#64748B' }}>{personalInfo.email}</span>}
          {personalInfo.phone    && <span style={{ fontSize: 12, color: '#64748B' }}>• {personalInfo.phone}</span>}
          {personalInfo.location && <span style={{ fontSize: 12, color: '#64748B' }}>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span style={{ fontSize: 12, color: '#64748B' }}>• {personalInfo.linkedin}</span>}
        </div>
      </div>
      {summary && <Sect title="Summary"><p style={{ fontSize: 13, color: '#334155', lineHeight: 1.7 }}>{summary}</p></Sect>}
      {experience.some(e => e.jobTitle) && <Sect title="Experience"><ExpItems experience={experience} /></Sect>}
      {education.some(e => e.degree)   && <Sect title="Education"><EduItems education={education} /></Sect>}
      {skills.length > 0 && (
        <Sect title="Skills">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {skills.map((sk, i) => <span key={i} style={{ fontSize: 12, padding: '3px 10px', background: '#F1F5F9', borderRadius: 4, color: '#334155' }}>{sk}</span>)}
          </div>
        </Sect>
      )}
      {projects.some(p => p.name)             && <Sect title="Projects"><ProjItems projects={projects} /></Sect>}
      {certifications.some(c => c.name)       && <Sect title="Certifications"><CertItems certifications={certifications} /></Sect>}
    </div>
  )
}

// ─── MODERN ──────────────────────────────────────────────
function ModernResume({ personalInfo, summary, experience, education, skills, projects, certifications }) {
  const C = '#2563EB'
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: C, padding: '32px 36px', marginBottom: 0 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {personalInfo.email    && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>✉ {personalInfo.email}</span>}
          {personalInfo.phone    && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>📍 {personalInfo.location}</span>}
          {personalInfo.linkedin && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>🔗 {personalInfo.linkedin}</span>}
        </div>
      </div>
      <div style={{ padding: '28px 36px' }}>
        {summary && <Sect title="Summary" color={C}><p style={{ fontSize: 13, color: '#334155', lineHeight: 1.7 }}>{summary}</p></Sect>}
        {experience.some(e => e.jobTitle) && <Sect title="Experience" color={C}><ExpItems experience={experience} /></Sect>}
        {education.some(e => e.degree)   && <Sect title="Education" color={C}><EduItems education={education} /></Sect>}
        {skills.length > 0 && (
          <Sect title="Skills" color={C}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {skills.map((sk, i) => <span key={i} style={{ fontSize: 12, padding: '4px 12px', background: '#EFF6FF', color: C, border: `1px solid ${C}`, borderRadius: 20 }}>{sk}</span>)}
            </div>
          </Sect>
        )}
        {projects.some(p => p.name)       && <Sect title="Projects" color={C}><ProjItems projects={projects} /></Sect>}
        {certifications.some(c => c.name) && <Sect title="Certifications" color={C}><CertItems certifications={certifications} /></Sect>}
      </div>
    </div>
  )
}

// ─── MINIMAL ─────────────────────────────────────────────
function MinimalResume({ personalInfo, summary, experience, education, skills, projects, certifications }) {
  const G = '#94A3B8'
  return (
    <div style={{ padding: '40px 36px', fontFamily: 'Helvetica, sans-serif' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 30, fontWeight: 300, color: '#0F172A', letterSpacing: 1, marginBottom: 8 }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {personalInfo.email    && <span style={{ fontSize: 12, color: G }}>{personalInfo.email}</span>}
          {personalInfo.phone    && <span style={{ fontSize: 12, color: G }}>{personalInfo.phone}</span>}
          {personalInfo.location && <span style={{ fontSize: 12, color: G }}>{personalInfo.location}</span>}
        </div>
        <div style={{ height: 1, background: G, marginTop: 16 }} />
      </div>
      {summary && (
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: 3, marginBottom: 10 }}>PROFILE</p>
          <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.7 }}>{summary}</p>
        </div>
      )}
      {experience.some(e => e.jobTitle) && <MinSect title="EXPERIENCE" color={G}><ExpItems experience={experience} /></MinSect>}
      {education.some(e => e.degree)   && <MinSect title="EDUCATION" color={G}><EduItems education={education} /></MinSect>}
      {skills.length > 0 && (
        <MinSect title="SKILLS" color={G}>
          <p style={{ fontSize: 13, color: '#334155', lineHeight: 2 }}>{skills.join('   •   ')}</p>
        </MinSect>
      )}
      {projects.some(p => p.name)       && <MinSect title="PROJECTS" color={G}><ProjItems projects={projects} /></MinSect>}
      {certifications.some(c => c.name) && <MinSect title="CERTIFICATIONS" color={G}><CertItems certifications={certifications} /></MinSect>}
    </div>
  )
}

function MinSect({ title, color, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: 3, marginBottom: 10 }}>{title}</p>
      <div style={{ height: 0.5, background: color, marginBottom: 12 }} />
      {children}
    </div>
  )
}

// ─── TECH ─────────────────────────────────────────────────
function TechResume({ personalInfo, summary, experience, education, skills, projects, certifications }) {
  const C = '#06B6D4'; const BG = '#0F172A'
  return (
    <div style={{ fontFamily: 'Courier New, monospace' }}>
      <div style={{ background: BG, padding: '32px 36px', marginBottom: 0 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {personalInfo.email    && <span style={{ fontSize: 12, color: C }}>@ {personalInfo.email}</span>}
          {personalInfo.phone    && <span style={{ fontSize: 12, color: C }}>📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span style={{ fontSize: 12, color: C }}>~ {personalInfo.location}</span>}
        </div>
      </div>
      <div style={{ padding: '28px 36px' }}>
        {summary && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C, marginBottom: 4 }}>// SUMMARY</p>
            <div style={{ height: 1, background: C, marginBottom: 10 }} />
            <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.7, borderLeft: `3px solid ${C}`, paddingLeft: 12 }}>{summary}</p>
          </div>
        )}
        {experience.some(e => e.jobTitle) && <TechSect title="EXPERIENCE" color={C}><ExpItems experience={experience} /></TechSect>}
        {education.some(e => e.degree)   && <TechSect title="EDUCATION" color={C}><EduItems education={education} /></TechSect>}
        {skills.length > 0 && (
          <TechSect title="SKILLS" color={C}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {skills.map((sk, i) => <span key={i} style={{ fontSize: 12, padding: '4px 12px', background: BG, color: C, borderRadius: 4, border: `1px solid ${C}` }}>{sk}</span>)}
            </div>
          </TechSect>
        )}
        {projects.some(p => p.name)       && <TechSect title="PROJECTS" color={C}><ProjItems projects={projects} /></TechSect>}
        {certifications.some(c => c.name) && <TechSect title="CERTIFICATIONS" color={C}><CertItems certifications={certifications} /></TechSect>}
      </div>
    </div>
  )
}

function TechSect({ title, color, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 4 }}>// {title}</p>
      <div style={{ height: 1, background: color, marginBottom: 12 }} />
      {children}
    </div>
  )
}

// ─── EXECUTIVE ───────────────────────────────────────────
function ExecutiveResume({ personalInfo, summary, experience, education, skills, projects, certifications }) {
  return (
    <div style={{ padding: '40px 36px', fontFamily: 'Georgia, serif' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ height: 2, background: '#0F172A', marginBottom: 14 }} />
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', letterSpacing: 3, marginBottom: 8 }}>
          {(personalInfo.fullName || 'Your Name').toUpperCase()}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
          {personalInfo.email    && <span style={{ fontSize: 12, color: '#64748B' }}>{personalInfo.email}</span>}
          {personalInfo.phone    && <span style={{ fontSize: 12, color: '#64748B' }}>|  {personalInfo.phone}</span>}
          {personalInfo.location && <span style={{ fontSize: 12, color: '#64748B' }}>|  {personalInfo.location}</span>}
        </div>
        <div style={{ height: 2, background: '#0F172A', marginTop: 14 }} />
      </div>
      {summary && <ExecSect title="Executive Summary"><p style={{ fontSize: 13, color: '#334155', lineHeight: 1.7, fontStyle: 'italic' }}>{summary}</p></ExecSect>}
      {experience.some(e => e.jobTitle) && <ExecSect title="Professional Experience"><ExpItems experience={experience} /></ExecSect>}
      {education.some(e => e.degree)   && <ExecSect title="Education"><EduItems education={education} /></ExecSect>}
      {skills.length > 0 && (
        <ExecSect title="Core Competencies">
          <p style={{ fontSize: 13, color: '#334155', lineHeight: 2 }}>{skills.join('   •   ')}</p>
        </ExecSect>
      )}
      {projects.some(p => p.name)       && <ExecSect title="Notable Projects"><ProjItems projects={projects} /></ExecSect>}
      {certifications.some(c => c.name) && <ExecSect title="Certifications"><CertItems certifications={certifications} /></ExecSect>}
    </div>
  )
}

function ExecSect({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{title}</p>
      <div style={{ height: 1, background: '#0F172A', marginBottom: 14 }} />
      {children}
    </div>
  )
}

// ─── BOLD ─────────────────────────────────────────────────
function BoldResume({ personalInfo, summary, experience, education, skills, projects, certifications }) {
  const R = '#EF4444'
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: R, padding: '32px 36px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 8 }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {personalInfo.email    && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.92)' }}>{personalInfo.email}</span>}
          {personalInfo.phone    && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.92)' }}>|  {personalInfo.phone}</span>}
          {personalInfo.location && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.92)' }}>|  {personalInfo.location}</span>}
        </div>
      </div>
      <div style={{ padding: '28px 36px' }}>
        {summary && <BoldSect title="SUMMARY" color={R}><p style={{ fontSize: 13, color: '#334155', lineHeight: 1.7 }}>{summary}</p></BoldSect>}
        {experience.some(e => e.jobTitle) && <BoldSect title="EXPERIENCE" color={R}><ExpItems experience={experience} /></BoldSect>}
        {education.some(e => e.degree)   && <BoldSect title="EDUCATION" color={R}><EduItems education={education} /></BoldSect>}
        {skills.length > 0 && (
          <BoldSect title="SKILLS" color={R}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {skills.map((sk, i) => <span key={i} style={{ fontSize: 12, padding: '4px 12px', background: '#FEF2F2', color: R, borderRadius: 4, fontWeight: 700 }}>{sk}</span>)}
            </div>
          </BoldSect>
        )}
        {projects.some(p => p.name)       && <BoldSect title="PROJECTS" color={R}><ProjItems projects={projects} /></BoldSect>}
        {certifications.some(c => c.name) && <BoldSect title="CERTIFICATIONS" color={R}><CertItems certifications={certifications} /></BoldSect>}
      </div>
    </div>
  )
}

function BoldSect({ title, color, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <p style={{ fontSize: 15, fontWeight: 900, color, marginBottom: 6 }}>{title}</p>
      <div style={{ height: 2, background: color, marginBottom: 14 }} />
      {children}
    </div>
  )
}

// ─── FRESH ───────────────────────────────────────────────
function FreshResume({ personalInfo, summary, experience, education, skills, projects, certifications }) {
  const G = '#22C55E'
  return (
    <div style={{ padding: '40px 36px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center', borderBottom: `3px solid ${G}`, paddingBottom: 20, marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: G, marginBottom: 8 }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14 }}>
          {personalInfo.email    && <span style={{ fontSize: 12, color: '#64748B' }}>{personalInfo.email}</span>}
          {personalInfo.phone    && <span style={{ fontSize: 12, color: '#64748B' }}>• {personalInfo.phone}</span>}
          {personalInfo.location && <span style={{ fontSize: 12, color: '#64748B' }}>• {personalInfo.location}</span>}
        </div>
      </div>
      {summary && <FreshSect title="About Me" color={G}><p style={{ fontSize: 13, color: '#334155', lineHeight: 1.7 }}>{summary}</p></FreshSect>}
      {experience.some(e => e.jobTitle) && <FreshSect title="Experience" color={G}><ExpItems experience={experience} /></FreshSect>}
      {education.some(e => e.degree)   && <FreshSect title="Education" color={G}><EduItems education={education} /></FreshSect>}
      {skills.length > 0 && (
        <FreshSect title="Skills" color={G}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {skills.map((sk, i) => <span key={i} style={{ fontSize: 12, padding: '4px 14px', background: '#DCFCE7', color: '#16A34A', borderRadius: 20, fontWeight: 600 }}>{sk}</span>)}
          </div>
        </FreshSect>
      )}
      {projects.some(p => p.name)       && <FreshSect title="Projects" color={G}><ProjItems projects={projects} /></FreshSect>}
      {certifications.some(c => c.name) && <FreshSect title="Certifications" color={G}><CertItems certifications={certifications} /></FreshSect>}
    </div>
  )
}

function FreshSect({ title, color, children }) {
  return (
    <div style={{ marginBottom: 22, paddingLeft: 14, borderLeft: `3px solid ${color}` }}>
      <p style={{ fontSize: 15, fontWeight: 700, color, marginBottom: 10 }}>{title}</p>
      {children}
    </div>
  )
}

// ─── ELEGANT ─────────────────────────────────────────────
function ElegantResume({ personalInfo, summary, experience, education, skills, projects, certifications }) {
  const Au = '#D97706'
  return (
    <div style={{ padding: '40px 36px', fontFamily: 'Georgia, serif' }}>
      <div style={{ height: 1, background: Au, marginBottom: 20 }} />
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 400, color: '#0F172A', letterSpacing: 4, marginBottom: 10 }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14 }}>
          {personalInfo.email    && <span style={{ fontSize: 12, color: Au }}>{personalInfo.email}</span>}
          {personalInfo.phone    && <span style={{ fontSize: 12, color: Au }}>·  {personalInfo.phone}</span>}
          {personalInfo.location && <span style={{ fontSize: 12, color: Au }}>·  {personalInfo.location}</span>}
        </div>
      </div>
      <div style={{ height: 1, background: Au, marginBottom: 28 }} />
      {summary && <ElegSect title="Profile" color={Au}><p style={{ fontSize: 13, color: '#334155', lineHeight: 1.8, fontStyle: 'italic' }}>{summary}</p></ElegSect>}
      {experience.some(e => e.jobTitle) && <ElegSect title="Experience" color={Au}><ExpItems experience={experience} /></ElegSect>}
      {education.some(e => e.degree)   && <ElegSect title="Education" color={Au}><EduItems education={education} /></ElegSect>}
      {skills.length > 0 && (
        <ElegSect title="Expertise" color={Au}>
          <p style={{ fontSize: 13, color: '#334155', lineHeight: 2, letterSpacing: 1 }}>{skills.join('   ·   ')}</p>
        </ElegSect>
      )}
      {projects.some(p => p.name)       && <ElegSect title="Projects" color={Au}><ProjItems projects={projects} /></ElegSect>}
      {certifications.some(c => c.name) && <ElegSect title="Certifications" color={Au}><CertItems certifications={certifications} /></ElegSect>}
    </div>
  )
}

function ElegSect({ title, color, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>{title}</p>
      <div style={{ height: 0.5, background: color, marginBottom: 14 }} />
      {children}
    </div>
  )
}

// ─── SHARED SECTION (Classic) ─────────────────────────────
function Sect({ title, color = '#0F172A', children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{title}</h2>
      <div style={{ height: 1.5, background: color, marginBottom: 12 }} />
      {children}
    </div>
  )
}

// ─── STYLES ──────────────────────────────────────────────
const s = {
  header:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  title:       { fontSize: 26, fontWeight: 800, color: '#0F172A', marginBottom: 6 },
  subtitle:    { fontSize: 15, color: '#64748B' },
  editBtn:     { padding: '11px 20px', background: '#fff', color: '#475569', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  downloadBtn: { padding: '11px 20px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  freeBanner:  { display: 'flex', alignItems: 'center', gap: 12, background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '12px 20px', marginBottom: 16 },
  bannerBtn:   { marginLeft: 'auto', padding: '8px 16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 },
  selectorCard:{ background: '#fff', borderRadius: 12, padding: '14px 20px', border: '1px solid #F1F5F9', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 },
  selectorLabel:{ fontSize: 13, fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' },
  select:      { flex: 1, padding: '9px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#334155', fontFamily: 'inherit', outline: 'none', background: '#fff' },
  templateBadge:{ fontSize: 12, fontWeight: 600, color: '#2563EB', background: '#EFF6FF', padding: '6px 12px', borderRadius: 8, whiteSpace: 'nowrap' },
  centerBox:   { padding: '60px', background: '#fff', borderRadius: 14, border: '1px solid #F1F5F9', textAlign: 'center' },
  grid:        { display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' },
  card:        { background: '#fff', borderRadius: 14, padding: 22, border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', marginBottom: 16 },
  cardTitle:   { fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 14 },
  actionBtn:   { width: '100%', padding: '10px 14px', background: '#F8FAFC', color: '#334155', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', marginBottom: 8 },
  paper:       { background: '#fff', borderRadius: 14, border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', overflow: 'hidden' },
  // Modal
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 100 },
  modal:        { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', borderRadius: 20, padding: '40px 36px', maxWidth: 480, width: '90%', zIndex: 101, boxShadow: '0 24px 80px rgba(0,0,0,0.18)' },
  modalClose:   { position: 'absolute', top: 16, right: 16, background: '#F1F5F9', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  benefitsBox:  { background: '#F8FAFC', borderRadius: 12, padding: '18px 20px', border: '1px solid #E2E8F0' },
  modalCancelBtn:  { flex: 1, padding: '13px 0', background: '#fff', color: '#64748B', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  modalUpgradeBtn: { flex: 2, padding: '13px 0', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
}
