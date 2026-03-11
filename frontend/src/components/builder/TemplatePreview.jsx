// TemplatePreview.jsx
// Shows REAL rendered template layout in modal

const SAMPLE = {
  personalInfo: {
    fullName:  'Alex Johnson',
    email:     'alex@email.com',
    phone:     '+1 555 0123',
    location:  'New York, NY',
    linkedin:  'linkedin.com/in/alexj',
  },
  summary: 'Results-driven software engineer with 5 years of experience building scalable web applications. Passionate about clean code and great user experiences.',
  experience: [{
    id: 1, jobTitle: 'Senior Developer', company: 'TechCorp Inc.',
    location: 'New York', startDate: 'Jan 2021', endDate: '', current: true,
    description: 'Led development of core product features used by 500k+ users. Mentored junior developers.',
  }],
  education: [{
    id: 1, degree: 'B.Sc. Computer Science', school: 'NYU',
    location: 'New York', startDate: '2015', endDate: '2019', gpa: '3.8',
  }],
  skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
  projects: [{
    id: 1, name: 'OpenResume', tech: 'React, Node.js',
    description: 'Open source resume builder with 2k+ GitHub stars.',
    link: 'github.com/alex/openresume',
  }],
  certifications: [{
    id: 1, name: 'AWS Solutions Architect', issuer: 'Amazon', date: '2023',
  }],
}

export default function TemplatePreview({ template, isPro, onClose, onSelect }) {
  if (!template) return null
  const locked = template.premium && !isPro

  return (
    <>
      <div onClick={onClose} style={s.overlay} />
      <div style={s.modal}>
        <button onClick={onClose} style={s.closeBtn}>✕</button>

        {/* HEADER */}
        <div style={{ ...s.header, background: template.color }}>
          <div>
            <p style={s.headerName}>{template.name} Template</p>
            <p style={s.headerCat}>{template.category} • ATS {template.atsScore}%</p>
          </div>
          {template.premium && (
            <span style={s.proBadge}>👑 PRO</span>
          )}
          {locked && (
            <div style={s.lockBanner}>🔒 Pro Only</div>
          )}
        </div>

        {/* REAL TEMPLATE PREVIEW */}
        <div style={s.previewArea}>
          <p style={s.previewLabel}>Preview with sample resume data</p>
          <div style={s.previewScale}>
            <div style={s.previewInner}>
              <MiniTemplate templateId={template.id} />
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div style={s.details}>
          <p style={s.desc}>{template.description}</p>

          <div style={s.featuresGrid}>
            {template.features.map((f, i) => (
              <div key={i} style={s.featureItem}>
                <span style={{ color: '#22C55E', fontSize: 13, flexShrink: 0 }}>✓</span>
                <p style={{ fontSize: 12, color: '#334155' }}>{f}</p>
              </div>
            ))}
          </div>

          <div style={s.atsBox}>
            <div>
              <p style={s.atsTitle}>ATS Compatibility</p>
              <p style={s.atsDesc}>How well this template scans in ATS systems</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: template.atsScore >= 90 ? '#16A34A' : '#CA8A04' }}>
                {template.atsScore}%
              </p>
              <div style={{ width: 80, height: 5, background: '#E2E8F0', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${template.atsScore}%`, background: template.atsScore >= 90 ? '#22C55E' : '#F59E0B', borderRadius: 10 }} />
              </div>
            </div>
          </div>

          {locked && (
            <div style={s.lockNotice}>
              <span style={{ fontSize: 20 }}>🔒</span>
              <div>
                <p style={{ fontWeight: 700, color: '#D97706', fontSize: 13 }}>Pro Template</p>
                <p style={{ fontSize: 12, color: '#92400E' }}>
                  Upgrade to Pro to use this template in your resume and PDF downloads.
                </p>
              </div>
            </div>
          )}

          <div style={s.btnRow}>
            <button onClick={onClose} style={s.cancelBtn}>Cancel</button>
            <button
              onClick={() => { onSelect(template); onClose() }}
              style={{ ...s.selectBtn, background: locked ? '#F59E0B' : template.color }}
            >
              {locked ? '👑 Upgrade to Use' : 'Use This Template'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── MINI TEMPLATE RENDERER ──────────────────────────────
function MiniTemplate({ templateId }) {
  const d = SAMPLE
  switch (templateId) {
    case 'modern':    return <MiniModern    d={d} />
    case 'minimal':   return <MiniMinimal   d={d} />
    case 'tech':      return <MiniTech      d={d} />
    case 'executive': return <MiniExecutive d={d} />
    case 'bold':      return <MiniBold      d={d} />
    case 'fresh':     return <MiniFresh     d={d} />
    case 'elegant':   return <MiniElegant   d={d} />
    default:          return <MiniClassic   d={d} />
  }
}

function MiniClassic({ d }) {
  return (
    <div style={{ fontFamily: 'Georgia, serif', fontSize: 7 }}>
      <div style={{ borderBottom: '1.5px solid #0F172A', paddingBottom: 6, marginBottom: 8 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>{d.personalInfo.fullName}</p>
        <p style={{ fontSize: 7, color: '#64748B' }}>{d.personalInfo.email} • {d.personalInfo.phone} • {d.personalInfo.location}</p>
      </div>
      <MiniSection title="SUMMARY" color="#0F172A">
        <p style={{ fontSize: 7, color: '#475569', lineHeight: 1.5 }}>{d.summary.slice(0, 100)}...</p>
      </MiniSection>
      <MiniSection title="EXPERIENCE" color="#0F172A">
        <p style={{ fontSize: 8, fontWeight: 700 }}>{d.experience[0].jobTitle}</p>
        <p style={{ fontSize: 7, color: '#64748B' }}>{d.experience[0].company} • {d.experience[0].startDate} — Present</p>
      </MiniSection>
      <MiniSection title="SKILLS" color="#0F172A">
        <p style={{ fontSize: 7, color: '#475569' }}>{d.skills.join(' • ')}</p>
      </MiniSection>
    </div>
  )
}

function MiniModern({ d }) {
  const BLUE = '#2563EB'
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 7 }}>
      <div style={{ background: BLUE, padding: '10px 10px', marginBottom: 8, borderRadius: 4 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{d.personalInfo.fullName}</p>
        <p style={{ fontSize: 7, color: 'rgba(255,255,255,0.85)' }}>✉ {d.personalInfo.email} &nbsp; 📍 {d.personalInfo.location}</p>
      </div>
      <MiniSection title="SUMMARY" color={BLUE}>
        <p style={{ fontSize: 7, color: '#475569', lineHeight: 1.5 }}>{d.summary.slice(0, 100)}...</p>
      </MiniSection>
      <MiniSection title="EXPERIENCE" color={BLUE}>
        <p style={{ fontSize: 8, fontWeight: 700, color: '#0F172A' }}>{d.experience[0].jobTitle}</p>
        <p style={{ fontSize: 7, color: BLUE }}>{d.experience[0].company}</p>
      </MiniSection>
      <MiniSection title="SKILLS" color={BLUE}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {d.skills.map((s, i) => (
            <span key={i} style={{ fontSize: 6, padding: '1px 5px', background: '#EFF6FF', color: BLUE, border: `1px solid ${BLUE}`, borderRadius: 10 }}>{s}</span>
          ))}
        </div>
      </MiniSection>
    </div>
  )
}

function MiniMinimal({ d }) {
  const GRAY = '#94A3B8'
  return (
    <div style={{ fontFamily: 'Helvetica, sans-serif', fontSize: 7 }}>
      <div style={{ marginBottom: 10 }}>
        <p style={{ fontSize: 13, fontWeight: 300, color: '#0F172A', letterSpacing: 1, marginBottom: 4 }}>{d.personalInfo.fullName}</p>
        <p style={{ fontSize: 7, color: GRAY }}>{d.personalInfo.email}   {d.personalInfo.phone}   {d.personalInfo.location}</p>
        <div style={{ height: 0.5, background: GRAY, marginTop: 6 }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 6, fontWeight: 700, color: GRAY, letterSpacing: 2, marginBottom: 4 }}>EXPERIENCE</p>
        <p style={{ fontSize: 8, fontWeight: 600, color: '#0F172A' }}>{d.experience[0].jobTitle}</p>
        <p style={{ fontSize: 7, color: GRAY }}>{d.experience[0].company}</p>
      </div>
      <div style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 6, fontWeight: 700, color: GRAY, letterSpacing: 2, marginBottom: 4 }}>SKILLS</p>
        <p style={{ fontSize: 7, color: '#475569' }}>{d.skills.join('  •  ')}</p>
      </div>
    </div>
  )
}

function MiniTech({ d }) {
  const CYAN = '#06B6D4'
  const DARK = '#0F172A'
  return (
    <div style={{ fontFamily: 'Courier New, monospace', fontSize: 7 }}>
      <div style={{ background: DARK, padding: '10px', marginBottom: 8, borderRadius: 4 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{d.personalInfo.fullName}</p>
        <p style={{ fontSize: 7, color: CYAN }}>@ {d.personalInfo.email} &nbsp; ~ {d.personalInfo.location}</p>
      </div>
      <div style={{ marginBottom: 6 }}>
        <p style={{ fontSize: 7, fontWeight: 700, color: CYAN }}>// EXPERIENCE</p>
        <div style={{ height: 0.5, background: CYAN, marginBottom: 4 }} />
        <div style={{ paddingLeft: 6, borderLeft: `1.5px solid ${CYAN}` }}>
          <p style={{ fontSize: 8, fontWeight: 700, color: DARK }}>{d.experience[0].jobTitle}</p>
          <p style={{ fontSize: 7, color: CYAN }}>{d.experience[0].company}</p>
        </div>
      </div>
      <div style={{ marginBottom: 6 }}>
        <p style={{ fontSize: 7, fontWeight: 700, color: CYAN }}>// SKILLS</p>
        <div style={{ height: 0.5, background: CYAN, marginBottom: 4 }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {d.skills.map((s, i) => (
            <span key={i} style={{ fontSize: 6, padding: '1px 5px', background: DARK, color: CYAN, borderRadius: 2, border: `0.5px solid ${CYAN}` }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function MiniExecutive({ d }) {
  return (
    <div style={{ fontFamily: 'Georgia, serif', fontSize: 7 }}>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ height: 1.5, background: '#0F172A', marginBottom: 6 }} />
        <p style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', letterSpacing: 2 }}>{d.personalInfo.fullName.toUpperCase()}</p>
        <p style={{ fontSize: 7, color: '#64748B', letterSpacing: 1, marginTop: 3 }}>{d.personalInfo.email}   |   {d.personalInfo.phone}   |   {d.personalInfo.location}</p>
        <div style={{ height: 1.5, background: '#0F172A', marginTop: 6 }} />
      </div>
      <div style={{ marginBottom: 6 }}>
        <p style={{ fontSize: 7, fontWeight: 700, letterSpacing: 2, color: '#0F172A', marginBottom: 3 }}>PROFESSIONAL EXPERIENCE</p>
        <div style={{ height: 0.5, background: '#0F172A', marginBottom: 4 }} />
        <p style={{ fontSize: 8, fontWeight: 700 }}>{d.experience[0].jobTitle}</p>
        <p style={{ fontSize: 7, color: '#475569', fontStyle: 'italic' }}>{d.experience[0].company}</p>
      </div>
      <div style={{ marginBottom: 6 }}>
        <p style={{ fontSize: 7, fontWeight: 700, letterSpacing: 2, color: '#0F172A', marginBottom: 3 }}>CORE COMPETENCIES</p>
        <div style={{ height: 0.5, background: '#0F172A', marginBottom: 4 }} />
        <p style={{ fontSize: 7, color: '#334155' }}>{d.skills.join('   •   ')}</p>
      </div>
    </div>
  )
}

function MiniBold({ d }) {
  const RED = '#EF4444'
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 7 }}>
      <div style={{ background: RED, padding: '10px', marginBottom: 8 }}>
        <p style={{ fontSize: 11, fontWeight: 900, color: '#fff', marginBottom: 3 }}>{d.personalInfo.fullName}</p>
        <p style={{ fontSize: 7, color: 'rgba(255,255,255,0.9)' }}>{d.personalInfo.email}  |  {d.personalInfo.location}</p>
      </div>
      <div style={{ marginBottom: 6 }}>
        <p style={{ fontSize: 8, fontWeight: 900, color: RED, marginBottom: 3 }}>EXPERIENCE</p>
        <div style={{ height: 1.5, background: RED, marginBottom: 4 }} />
        <p style={{ fontSize: 8, fontWeight: 700 }}>{d.experience[0].jobTitle}</p>
        <p style={{ fontSize: 7, color: RED, fontWeight: 600 }}>{d.experience[0].company}</p>
      </div>
      <div style={{ marginBottom: 6 }}>
        <p style={{ fontSize: 8, fontWeight: 900, color: RED, marginBottom: 3 }}>SKILLS</p>
        <div style={{ height: 1.5, background: RED, marginBottom: 4 }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {d.skills.map((s, i) => (
            <span key={i} style={{ fontSize: 6, padding: '1px 5px', background: '#FEF2F2', color: RED, borderRadius: 3, fontWeight: 700 }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function MiniFresh({ d }) {
  const GREEN = '#22C55E'
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 7 }}>
      <div style={{ textAlign: 'center', borderBottom: `2px solid ${GREEN}`, paddingBottom: 8, marginBottom: 8 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: GREEN, marginBottom: 3 }}>{d.personalInfo.fullName}</p>
        <p style={{ fontSize: 7, color: '#64748B' }}>{d.personalInfo.email}  •  {d.personalInfo.location}</p>
      </div>
      <div style={{ marginBottom: 6 }}>
        <p style={{ fontSize: 8, fontWeight: 700, color: GREEN, marginBottom: 3 }}>Experience</p>
        <div style={{ paddingLeft: 6, borderLeft: `2px solid #DCFCE7` }}>
          <p style={{ fontSize: 8, fontWeight: 700 }}>{d.experience[0].jobTitle}</p>
          <p style={{ fontSize: 7, color: GREEN }}>{d.experience[0].company}</p>
        </div>
      </div>
      <div>
        <p style={{ fontSize: 8, fontWeight: 700, color: GREEN, marginBottom: 4 }}>Skills</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {d.skills.map((s, i) => (
            <span key={i} style={{ fontSize: 6, padding: '1px 6px', background: '#DCFCE7', color: '#16A34A', borderRadius: 10, fontWeight: 600 }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function MiniElegant({ d }) {
  const GOLD = '#D97706'
  return (
    <div style={{ fontFamily: 'Georgia, serif', fontSize: 7 }}>
      <div style={{ height: 0.5, background: GOLD, marginBottom: 8 }} />
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <p style={{ fontSize: 12, fontWeight: 400, color: '#0F172A', letterSpacing: 3, marginBottom: 4 }}>{d.personalInfo.fullName}</p>
        <p style={{ fontSize: 7, color: GOLD, letterSpacing: 1 }}>{d.personalInfo.email}   ·   {d.personalInfo.phone}</p>
      </div>
      <div style={{ height: 0.5, background: GOLD, marginBottom: 8 }} />
      <div style={{ marginBottom: 6 }}>
        <p style={{ fontSize: 6, fontWeight: 700, color: GOLD, letterSpacing: 2, marginBottom: 4 }}>EXPERIENCE</p>
        <p style={{ fontSize: 8, fontWeight: 700, color: '#0F172A', fontStyle: 'italic' }}>{d.experience[0].jobTitle}</p>
        <p style={{ fontSize: 7, color: '#64748B' }}>{d.experience[0].company}</p>
      </div>
      <div>
        <p style={{ fontSize: 6, fontWeight: 700, color: GOLD, letterSpacing: 2, marginBottom: 4 }}>EXPERTISE</p>
        <p style={{ fontSize: 7, color: '#475569', letterSpacing: 1 }}>{d.skills.join('  ·  ')}</p>
      </div>
    </div>
  )
}

function MiniSection({ title, color, children }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <p style={{ fontSize: 7, fontWeight: 700, color, letterSpacing: 0.5, marginBottom: 2 }}>{title}</p>
      <div style={{ height: 0.5, background: color, marginBottom: 4 }} />
      {children}
    </div>
  )
}

// ─── STYLES ──────────────────────────────────────────────
const s = {
  overlay:     { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 100 },
  modal:       { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', borderRadius: 20, width: 680, maxHeight: '92vh', overflowY: 'auto', zIndex: 101, boxShadow: '0 24px 80px rgba(0,0,0,0.18)' },
  closeBtn:    { position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '50%', width: 34, height: 34, fontSize: 16, cursor: 'pointer', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  header:      { padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' },
  headerName:  { fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 },
  headerCat:   { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  proBadge:    { background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.4)' },
  lockBanner:  { position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 16px', borderRadius: 20 },
  previewArea: { padding: '20px 28px 0', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' },
  previewLabel:{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  previewScale:{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, overflow: 'hidden', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  previewInner:{ padding: '16px', minHeight: 200, transform: 'scale(1)', transformOrigin: 'top left' },
  details:     { padding: '20px 28px 28px' },
  desc:        { fontSize: 13, color: '#64748B', lineHeight: 1.6, marginBottom: 16 },
  featuresGrid:{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 },
  featureItem: { display: 'flex', alignItems: 'center', gap: 8 },
  atsBox:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', borderRadius: 10, padding: '12px 16px', marginBottom: 16, border: '1px solid #E2E8F0' },
  atsTitle:    { fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 3 },
  atsDesc:     { fontSize: 11, color: '#94A3B8' },
  lockNotice:  { display: 'flex', gap: 12, alignItems: 'flex-start', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '12px 14px', marginBottom: 16 },
  btnRow:      { display: 'flex', gap: 12 },
  cancelBtn:   { flex: 1, padding: '12px 0', background: '#fff', color: '#64748B', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  selectBtn:   { flex: 1, padding: '12px 0', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
}
