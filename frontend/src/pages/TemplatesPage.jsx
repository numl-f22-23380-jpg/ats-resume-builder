import { useState, useEffect }          from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout                           from '../components/shared/Layout'
import TemplateCard                     from '../components/builder/TemplateCard'
import TemplatePreview                  from '../components/builder/TemplatePreview'
import { getUserResumes, updateResume } from '../api'
import useAuthStore                     from '../store/authStore'
import toast, { Toaster }               from 'react-hot-toast'

const TEMPLATES = [
  {
    id: 'classic', name: 'Classic', category: 'Professional',
    color: '#1E293B', atsScore: 98, premium: false,
    description: 'A clean traditional layout trusted by Fortune 500 recruiters.',
    features: ['Single column', 'ATS optimized', 'Works everywhere', 'Serif typography'],
  },
  {
    id: 'modern', name: 'Modern', category: 'Creative',
    color: '#2563EB', atsScore: 92, premium: false,
    description: 'Bold blue header with modern typography. Stands out while remaining professional.',
    features: ['Color header', 'Pill skill badges', 'Icon contacts', 'Clean sections'],
  },
  {
    id: 'minimal', name: 'Minimal', category: 'Simple',
    color: '#64748B', atsScore: 96, premium: false,
    description: 'Less is more. Ultra clean design with maximum white space.',
    features: ['Lightweight', 'Max white space', 'Top ATS score', 'Letter spacing'],
  },
  {
    id: 'executive', name: 'Executive', category: 'Professional',
    color: '#0F172A', atsScore: 95, premium: false,
    description: 'Double rule header, centered layout. Conveys authority and seniority.',
    features: ['Double rule', 'All-caps name', 'Centered header', 'Formal spacing'],
  },
  {
    id: 'bold', name: 'Bold', category: 'Creative',
    color: '#EF4444', atsScore: 85, premium: false,
    description: 'Red header block with heavy typography. Perfect for creative and design roles.',
    features: ['Red header', 'Heavy type', 'Colored tags', 'High impact'],
  },
  {
    id: 'fresh', name: 'Fresh', category: 'Modern',
    color: '#22C55E', atsScore: 90, premium: false,
    description: 'Green accents, rounded skill pills, friendly style for graduates.',
    features: ['Green accents', 'Rounded pills', 'Left border sections', 'Friendly'],
  },
  {
    id: 'elegant', name: 'Elegant', category: 'Luxury',
    color: '#B45309', atsScore: 88, premium: false,
    description: 'Gold rules, centered header, serif fonts. A premium luxury feel.',
    features: ['Gold rules', 'Centered header', 'Serif fonts', 'Luxury'],
  },
  {
    id: 'tech', name: 'Tech', category: 'Modern',
    color: '#0E7490', atsScore: 94, premium: false,
    description: 'Dark header, monospace font, cyan accents. Built for developers.',
    features: ['Dark header', 'Monospace', 'Cyan accents', '// style sections'],
  },
]

const CATS = ['All', 'Professional', 'Creative', 'Modern', 'Simple']

export default function TemplatesPage() {
  const navigate               = useNavigate()
  const [searchParams]         = useSearchParams()
  const afterCreate            = searchParams.get('after_create') === '1'
  const user                   = useAuthStore((s) => s.user)
  const isPro                  = user?.subscriptionPlan === 'pro' || user?.subscriptionPlan === 'enterprise'

  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [previewTemplate,  setPreviewTemplate]  = useState(null)
  const [filter,           setFilter]           = useState('All')
  const [resumes,          setResumes]          = useState([])
  const [selectedResume,   setSelectedResume]   = useState('')
  const [applying,         setApplying]         = useState(false)
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(afterCreate)

  const filtered = filter === 'All' ? TEMPLATES : TEMPLATES.filter(t => t.category === filter)

  useEffect(() => {
    async function fetchResumes() {
      try {
        const res = await getUserResumes()
        setResumes(res.data)
        if (res.data.length > 0) {
          setSelectedResume(res.data[0]._id)
          // Pre-select their existing template
          const existingId = res.data[0].templateId
          const match = TEMPLATES.find(t => t.id === existingId)
          setSelectedTemplate(match || TEMPLATES[0])
        } else {
          setSelectedTemplate(TEMPLATES[0])
        }
      } catch {
        setSelectedTemplate(TEMPLATES[0])
      }
    }
    fetchResumes()
  }, [])

  function handleSelect(template) {
    setSelectedTemplate(template)
    toast.success(`${template.name} template selected!`)
  }

  async function handleApply() {
    if (!selectedResume) {
      toast.error('Please create a resume first.')
      navigate('/builder')
      return
    }
    if (!selectedTemplate) return
    setApplying(true)
    try {
      await updateResume(selectedResume, { templateId: selectedTemplate.id })
      toast.success(`${selectedTemplate.name} template applied!`)
      setTimeout(() => navigate('/pdf-preview'), 800)
    } catch {
      toast.error('Failed to apply template.')
    } finally {
      setApplying(false)
    }
  }

  return (
    <Layout>
      <Toaster position="top-right" />

      {/* ── AFTER-CREATE DOWNLOAD PROMPT ─────────────── */}
      {showDownloadPrompt && (
        <div style={s.promptBanner}>
          <div style={s.promptLeft}>
            <span style={{ fontSize: 32 }}>🎉</span>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
                Your resume is ready!
              </p>
              <p style={{ fontSize: 13, color: '#64748B' }}>
                Pick a template below, then download your resume as a PDF.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              onClick={() => { setShowDownloadPrompt(false); navigate('/pdf-preview') }}
              style={s.promptDownloadBtn}
            >
              ⬇️ Download PDF
            </button>
            <button
              onClick={() => setShowDownloadPrompt(false)}
              style={s.promptDismissBtn}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── PAGE HEADER ──────────────────────────────── */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Choose a Template</h1>
          <p style={s.subtitle}>All templates are free. Download requires Pro.</p>
        </div>

        {/* APPLY CONTROLS */}
        <div style={s.applyRow}>
          {resumes.length > 0 && (
            <select
              value={selectedResume}
              onChange={e => setSelectedResume(e.target.value)}
              style={s.select}
            >
              {resumes.map(r => (
                <option key={r._id} value={r._id}>{r.title || 'Untitled Resume'}</option>
              ))}
            </select>
          )}
          <button
            onClick={handleApply}
            disabled={applying || !selectedTemplate}
            style={{
              ...s.applyBtn,
              background: applying ? '#93C5FD' : '#2563EB',
              cursor:     applying ? 'not-allowed' : 'pointer',
            }}
          >
            {applying ? 'Applying...' : `Apply ${selectedTemplate?.name || ''} Template →`}
          </button>
        </div>
      </div>

      {/* ── SELECTED TEMPLATE STRIP ──────────────────── */}
      {selectedTemplate && (
        <div style={{ ...s.strip, borderLeft: `4px solid ${selectedTemplate.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
            <div style={{ width: 40, height: 50, background: selectedTemplate.color, borderRadius: 4, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginBottom: 2 }}>
                {selectedTemplate.name} Template selected
              </p>
              <p style={{ fontSize: 12, color: '#64748B' }}>{selectedTemplate.description}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
              background: selectedTemplate.atsScore >= 90 ? '#DCFCE7' : '#FEF9C3',
              color:      selectedTemplate.atsScore >= 90 ? '#16A34A' : '#CA8A04',
            }}>
              ATS {selectedTemplate.atsScore}%
            </span>
            <button onClick={handleApply} disabled={applying} style={s.stripApplyBtn}>
              {applying ? 'Applying...' : 'Apply & Preview →'}
            </button>
          </div>
        </div>
      )}

      {/* ── CATEGORY FILTERS ─────────────────────────── */}
      <div style={s.filterRow}>
        {CATS.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              ...s.filterBtn,
              background: filter === cat ? '#0F172A' : '#fff',
              color:      filter === cat ? '#fff' : '#64748B',
              border:     filter === cat ? 'none' : '1.5px solid #E2E8F0',
              fontWeight: filter === cat ? 700 : 500,
            }}
          >
            {cat}
          </button>
        ))}
        {/* PDF/DOCX badge group like resume.io */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={s.formatBadge}>PDF</span>
          <span style={{ ...s.formatBadge, background: '#DBEAFE', color: '#1D4ED8' }}>DOCX</span>
          <span style={{ fontSize: 12, color: '#94A3B8' }}>All formats supported</span>
        </div>
      </div>

      {/* ── TEMPLATE GRID ────────────────────────────── */}
      <div style={s.grid}>
        {filtered.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            selected={selectedTemplate?.id === template.id}
            locked={false}         // ALL templates free to preview
            onSelect={handleSelect}
            onPreview={setPreviewTemplate}
          />
        ))}
      </div>

      {/* ── BOTTOM CTA ───────────────────────────────── */}
      {!isPro && (
        <div style={s.bottomCta}>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
              Ready to download your resume?
            </p>
            <p style={{ fontSize: 13, color: '#64748B' }}>
              Upgrade to Pro to download as PDF, get AI suggestions, and unlock advanced ATS analysis.
            </p>
          </div>
          <button onClick={() => navigate('/subscription')} style={s.ctaBtn}>
            🚀 Upgrade to Pro — $9.99/mo
          </button>
        </div>
      )}

      {/* PREVIEW MODAL */}
      <TemplatePreview
        template={previewTemplate}
        isPro={true}                 // Never block preview — only block download
        onClose={() => setPreviewTemplate(null)}
        onSelect={handleSelect}
      />
    </Layout>
  )
}

// ─── STYLES ──────────────────────────────────────────────
const s = {
  // After-create download prompt
  promptBanner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    border: '1.5px solid #BFDBFE', borderRadius: 14,
    padding: '20px 24px', marginBottom: 24, gap: 16,
  },
  promptLeft:       { display: 'flex', alignItems: 'center', gap: 16 },
  promptDownloadBtn:{ padding: '12px 24px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  promptDismissBtn: { padding: '8px 12px', background: 'transparent', color: '#94A3B8', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', fontFamily: 'inherit' },

  header:    { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 16 },
  title:     { fontSize: 28, fontWeight: 800, color: '#0F172A', marginBottom: 4 },
  subtitle:  { fontSize: 14, color: '#64748B' },
  applyRow:  { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  select:    { padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 13, color: '#334155', fontFamily: 'inherit', outline: 'none', background: '#fff' },
  applyBtn:  { padding: '11px 22px', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: 'inherit', flexShrink: 0 },

  strip: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#fff', borderRadius: 12, padding: '14px 20px',
    marginBottom: 20, border: '1px solid #E2E8F0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)', gap: 16, flexWrap: 'wrap',
  },
  stripApplyBtn: {
    padding: '10px 20px', background: '#0F172A', color: '#fff',
    border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
  },

  filterRow:   { display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' },
  filterBtn:   { padding: '8px 18px', borderRadius: 20, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' },
  formatBadge: { fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: '#DCFCE7', color: '#16A34A' },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 20,
    marginBottom: 32,
  },

  bottomCta: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'linear-gradient(135deg, #0F172A 0%, #1E40AF 100%)',
    borderRadius: 16, padding: '28px 32px', gap: 20, flexWrap: 'wrap',
    color: '#fff',
  },
  ctaBtn: {
    padding: '13px 28px', background: '#fff', color: '#0F172A',
    border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 800,
    cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}