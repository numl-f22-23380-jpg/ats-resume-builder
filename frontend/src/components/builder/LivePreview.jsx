// LivePreview.jsx
import useResumeStore from '../../store/resumeStore'

export default function LivePreview({ templateId = 'classic' }) {
  const resumeData = useResumeStore((state) => state.resumeData)

  const templates = {
    classic:   <ClassicTemplate   data={resumeData} />,
    modern:    <ModernTemplate    data={resumeData} />,
    minimal:   <MinimalTemplate   data={resumeData} />,
    tech:      <TechTemplate      data={resumeData} />,
    executive: <ExecutiveTemplate data={resumeData} />,
    bold:      <BoldTemplate      data={resumeData} />,
    fresh:     <FreshTemplate     data={resumeData} />,
    elegant:   <ElegantTemplate   data={resumeData} />,
  }

  return (
    <div style={wrapper}>
      <div style={header}>
        <p style={previewLabel}>Live Preview</p>
        <span style={templateBadge}>
          {templateId.charAt(0).toUpperCase() + templateId.slice(1)}
        </span>
      </div>
      <div style={paper}>
        {templates[templateId] || templates.classic}
      </div>
    </div>
  )
}

// ─── CLASSIC ─────────────────────────────────────────────
function ClassicTemplate({ data }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = data
  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '2.5px solid #0F172A' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, fontSize: 10, color: '#64748B' }}>
          {personalInfo.email    && <span>{personalInfo.email}</span>}
          {personalInfo.phone    && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
        </div>
      </div>
      {summary && <ClassicSection title="SUMMARY"><p style={body}>{summary}</p></ClassicSection>}
      {experience?.some(e => e.jobTitle) && (
        <ClassicSection title="EXPERIENCE">
          {experience.map((e, i) => e.jobTitle && <ExpItem key={i} exp={e} />)}
        </ClassicSection>
      )}
      {education?.some(e => e.degree) && (
        <ClassicSection title="EDUCATION">
          {education.map((e, i) => e.degree && <EduItem key={i} edu={e} />)}
        </ClassicSection>
      )}
      {skills?.length > 0 && (
        <ClassicSection title="SKILLS">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {skills.map((s, i) => <span key={i} style={skillTag}>{s}</span>)}
          </div>
        </ClassicSection>
      )}
      {projects?.some(p => p.name) && (
        <ClassicSection title="PROJECTS">
          {projects.map((p, i) => p.name && <ProjItem key={i} proj={p} />)}
        </ClassicSection>
      )}
      {certifications?.some(c => c.name) && (
        <ClassicSection title="CERTIFICATIONS">
          {certifications.map((c, i) => c.name && <CertItem key={i} cert={c} />)}
        </ClassicSection>
      )}
    </div>
  )
}

function ClassicSection({ title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', letterSpacing: 1, marginBottom: 3 }}>{title}</p>
      <div style={{ height: 1.5, background: '#0F172A', marginBottom: 8 }} />
      {children}
    </div>
  )
}

// ─── MODERN ──────────────────────────────────────────────
function ModernTemplate({ data }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = data
  const BLUE = '#2563EB'
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: BLUE, padding: '18px 16px', marginBottom: 16, borderRadius: 6 }}>
        <h1 style={{ fontSize: 21, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 10, color: 'rgba(255,255,255,0.85)' }}>
          {personalInfo.email    && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone    && <span>📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
        </div>
      </div>
      {summary && <ModernSection title="SUMMARY" color={BLUE}><p style={body}>{summary}</p></ModernSection>}
      {experience?.some(e => e.jobTitle) && (
        <ModernSection title="EXPERIENCE" color={BLUE}>
          {experience.map((e, i) => e.jobTitle && <ExpItem key={i} exp={e} accentColor={BLUE} />)}
        </ModernSection>
      )}
      {education?.some(e => e.degree) && (
        <ModernSection title="EDUCATION" color={BLUE}>
          {education.map((e, i) => e.degree && <EduItem key={i} edu={e} />)}
        </ModernSection>
      )}
      {skills?.length > 0 && (
        <ModernSection title="SKILLS" color={BLUE}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {skills.map((s, i) => (
              <span key={i} style={{ fontSize: 9, padding: '3px 10px', background: '#EFF6FF', color: BLUE, border: `1px solid ${BLUE}`, borderRadius: 20, fontWeight: 600 }}>
                {s}
              </span>
            ))}
          </div>
        </ModernSection>
      )}
      {projects?.some(p => p.name) && (
        <ModernSection title="PROJECTS" color={BLUE}>
          {projects.map((p, i) => p.name && <ProjItem key={i} proj={p} accentColor={BLUE} />)}
        </ModernSection>
      )}
      {certifications?.some(c => c.name) && (
        <ModernSection title="CERTIFICATIONS" color={BLUE}>
          {certifications.map((c, i) => c.name && <CertItem key={i} cert={c} accentColor={BLUE} />)}
        </ModernSection>
      )}
    </div>
  )
}

function ModernSection({ title, color, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: 1, marginBottom: 3 }}>{title}</p>
      <div style={{ height: 1.5, background: color, marginBottom: 8 }} />
      {children}
    </div>
  )
}

// ─── MINIMAL ─────────────────────────────────────────────
function MinimalTemplate({ data }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = data
  const GRAY = '#94A3B8'
  return (
    <div style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 300, color: '#0F172A', letterSpacing: 1, marginBottom: 6 }}>
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        <div style={{ fontSize: 10, color: GRAY, letterSpacing: 0.5, marginBottom: 10 }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin]
            .filter(Boolean).join('   ')}
        </div>
        <div style={{ height: 0.5, background: GRAY }} />
      </div>
      {summary && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: GRAY, letterSpacing: 2, marginBottom: 6 }}>SUMMARY</p>
          <p style={{ fontSize: 10, color: '#475569', lineHeight: 1.7 }}>{summary}</p>
          <div style={{ height: 0.5, background: '#E2E8F0', marginTop: 12 }} />
        </div>
      )}
      {experience?.some(e => e.jobTitle) && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: GRAY, letterSpacing: 2, marginBottom: 8 }}>EXPERIENCE</p>
          {experience.map((e, i) => e.jobTitle && (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#0F172A' }}>{e.jobTitle}</p>
                <p style={{ fontSize: 10, color: GRAY }}>{e.startDate}{e.current ? ' — Present' : e.endDate ? ` — ${e.endDate}` : ''}</p>
              </div>
              <p style={{ fontSize: 10, color: GRAY }}>{e.company}{e.location ? ` • ${e.location}` : ''}</p>
              {e.description && <p style={{ fontSize: 10, color: '#475569', marginTop: 3 }}>{e.description}</p>}
            </div>
          ))}
          <div style={{ height: 0.5, background: '#E2E8F0', marginTop: 4 }} />
        </div>
      )}
      {education?.some(e => e.degree) && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: GRAY, letterSpacing: 2, marginBottom: 8 }}>EDUCATION</p>
          {education.map((e, i) => e.degree && (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#0F172A' }}>{e.degree}</p>
                <p style={{ fontSize: 10, color: GRAY }}>{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</p>
              </div>
              <p style={{ fontSize: 10, color: GRAY }}>{e.school}</p>
            </div>
          ))}
          <div style={{ height: 0.5, background: '#E2E8F0', marginTop: 4 }} />
        </div>
      )}
      {skills?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: GRAY, letterSpacing: 2, marginBottom: 6 }}>SKILLS</p>
          <p style={{ fontSize: 10, color: '#475569' }}>{skills.join('   •   ')}</p>
          <div style={{ height: 0.5, background: '#E2E8F0', marginTop: 10 }} />
        </div>
      )}
      {projects?.some(p => p.name) && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: GRAY, letterSpacing: 2, marginBottom: 8 }}>PROJECTS</p>
          {projects.map((p, i) => p.name && (
            <div key={i} style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#0F172A' }}>{p.name}</p>
              {p.tech && <p style={{ fontSize: 10, color: GRAY }}>{p.tech}</p>}
              {p.description && <p style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{p.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── TECH ────────────────────────────────────────────────
function TechTemplate({ data }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = data
  const CYAN = '#06B6D4'
  const DARK = '#0F172A'
  return (
    <div style={{ fontFamily: "'Courier New', monospace" }}>
      <div style={{ background: DARK, padding: '16px', marginBottom: 16, borderRadius: 6 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 9, color: CYAN }}>
          {personalInfo.email    && <span>@ {personalInfo.email}</span>}
          {personalInfo.phone    && <span># {personalInfo.phone}</span>}
          {personalInfo.location && <span>~ {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
        </div>
      </div>
      {summary && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: CYAN }}>// SUMMARY</p>
          <div style={{ height: 1, background: CYAN, marginBottom: 6 }} />
          <p style={{ fontSize: 10, color: '#475569', lineHeight: 1.6 }}>{summary}</p>
        </div>
      )}
      {experience?.some(e => e.jobTitle) && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: CYAN }}>// EXPERIENCE</p>
          <div style={{ height: 1, background: CYAN, marginBottom: 6 }} />
          {experience.map((e, i) => e.jobTitle && (
            <div key={i} style={{ marginBottom: 10, paddingLeft: 8, borderLeft: `2px solid ${CYAN}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: DARK }}>{e.jobTitle}</p>
                <p style={{ fontSize: 9, color: '#94A3B8' }}>{e.startDate}{e.current ? ' — Present' : e.endDate ? ` — ${e.endDate}` : ''}</p>
              </div>
              <p style={{ fontSize: 10, color: CYAN }}>{e.company}{e.location ? ` • ${e.location}` : ''}</p>
              {e.description && <p style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{e.description}</p>}
            </div>
          ))}
        </div>
      )}
      {skills?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: CYAN }}>// SKILLS</p>
          <div style={{ height: 1, background: CYAN, marginBottom: 6 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {skills.map((s, i) => (
              <span key={i} style={{ fontSize: 9, padding: '2px 8px', background: DARK, color: CYAN, borderRadius: 3, border: `1px solid ${CYAN}` }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      {education?.some(e => e.degree) && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: CYAN }}>// EDUCATION</p>
          <div style={{ height: 1, background: CYAN, marginBottom: 6 }} />
          {education.map((e, i) => e.degree && (
            <div key={i} style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: DARK }}>{e.degree}</p>
              <p style={{ fontSize: 10, color: '#475569' }}>{e.school}{e.startDate ? ` • ${e.startDate}` : ''}</p>
            </div>
          ))}
        </div>
      )}
      {projects?.some(p => p.name) && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: CYAN }}>// PROJECTS</p>
          <div style={{ height: 1, background: CYAN, marginBottom: 6 }} />
          {projects.map((p, i) => p.name && (
            <div key={i} style={{ marginBottom: 8, paddingLeft: 8, borderLeft: `2px solid ${CYAN}` }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: DARK }}>{p.name}</p>
              {p.tech && <p style={{ fontSize: 9, color: CYAN }}>{p.tech}</p>}
              {p.description && <p style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{p.description}</p>}
            </div>
          ))}
        </div>
      )}
      {certifications?.some(c => c.name) && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: CYAN }}>// CERTIFICATIONS</p>
          <div style={{ height: 1, background: CYAN, marginBottom: 6 }} />
          {certifications.map((c, i) => c.name && (
            <div key={i} style={{ marginBottom: 6 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: DARK }}>{c.name}</p>
              <p style={{ fontSize: 10, color: '#475569' }}>{c.issuer}{c.date ? ` • ${c.date}` : ''}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── EXECUTIVE ───────────────────────────────────────────
function ExecutiveTemplate({ data }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = data
  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ height: 2, background: '#0F172A', marginBottom: 10 }} />
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', letterSpacing: 3, marginBottom: 6 }}>
          {(personalInfo.fullName || 'YOUR NAME').toUpperCase()}
        </h1>
        <div style={{ fontSize: 10, color: '#64748B', letterSpacing: 1 }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join('   |   ')}
        </div>
        <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>
          {[personalInfo.linkedin, personalInfo.website].filter(Boolean).join('   |   ')}
        </div>
        <div style={{ height: 2, background: '#0F172A', marginTop: 10 }} />
      </div>
      {summary && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#0F172A', marginBottom: 4 }}>PROFESSIONAL SUMMARY</p>
          <div style={{ height: 1, background: '#0F172A', marginBottom: 6 }} />
          <p style={{ fontSize: 10, color: '#334155', lineHeight: 1.7, fontStyle: 'italic' }}>{summary}</p>
        </div>
      )}
      {experience?.some(e => e.jobTitle) && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#0F172A', marginBottom: 4 }}>PROFESSIONAL EXPERIENCE</p>
          <div style={{ height: 1, background: '#0F172A', marginBottom: 8 }} />
          {experience.map((e, i) => e.jobTitle && (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{e.jobTitle}</p>
                <p style={{ fontSize: 10, color: '#64748B', fontStyle: 'italic' }}>{e.startDate}{e.current ? ' — Present' : e.endDate ? ` — ${e.endDate}` : ''}</p>
              </div>
              <p style={{ fontSize: 10, color: '#475569', fontWeight: 600 }}>{e.company}{e.location ? `, ${e.location}` : ''}</p>
              {e.description && <p style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>{e.description}</p>}
            </div>
          ))}
        </div>
      )}
      {education?.some(e => e.degree) && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#0F172A', marginBottom: 4 }}>EDUCATION</p>
          <div style={{ height: 1, background: '#0F172A', marginBottom: 8 }} />
          {education.map((e, i) => e.degree && (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>{e.degree}</p>
                <p style={{ fontSize: 10, color: '#64748B' }}>{e.school}{e.gpa ? ` • GPA: ${e.gpa}` : ''}</p>
              </div>
              <p style={{ fontSize: 10, color: '#64748B', fontStyle: 'italic' }}>{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</p>
            </div>
          ))}
        </div>
      )}
      {skills?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#0F172A', marginBottom: 4 }}>CORE COMPETENCIES</p>
          <div style={{ height: 1, background: '#0F172A', marginBottom: 6 }} />
          <p style={{ fontSize: 10, color: '#334155', letterSpacing: 0.5, lineHeight: 1.8 }}>{skills.join('   •   ')}</p>
        </div>
      )}
      {projects?.some(p => p.name) && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#0F172A', marginBottom: 4 }}>KEY PROJECTS</p>
          <div style={{ height: 1, background: '#0F172A', marginBottom: 8 }} />
          {projects.map((p, i) => p.name && (
            <div key={i} style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', fontStyle: 'italic' }}>{p.name}</p>
              {p.tech && <p style={{ fontSize: 10, color: '#64748B' }}>{p.tech}</p>}
              {p.description && <p style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{p.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── BOLD ────────────────────────────────────────────────
function BoldTemplate({ data }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = data
  const RED = '#EF4444'
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: RED, padding: '20px 16px', marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 4 }}>
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.9)' }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join('  |  ')}
        </div>
        {(personalInfo.linkedin || personalInfo.website) && (
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
            {[personalInfo.linkedin, personalInfo.website].filter(Boolean).join('  |  ')}
          </div>
        )}
      </div>
      {summary && (
        <div style={{ marginBottom: 14, padding: '0 4px' }}>
          <p style={{ fontSize: 12, fontWeight: 900, color: RED, marginBottom: 4 }}>SUMMARY</p>
          <div style={{ height: 2, background: RED, marginBottom: 6 }} />
          <p style={{ fontSize: 10, color: '#334155', lineHeight: 1.6 }}>{summary}</p>
        </div>
      )}
      {experience?.some(e => e.jobTitle) && (
        <div style={{ marginBottom: 14, padding: '0 4px' }}>
          <p style={{ fontSize: 12, fontWeight: 900, color: RED, marginBottom: 4 }}>EXPERIENCE</p>
          <div style={{ height: 2, background: RED, marginBottom: 8 }} />
          {experience.map((e, i) => e.jobTitle && (
            <div key={i} style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{e.jobTitle}</p>
              <p style={{ fontSize: 10, color: RED, fontWeight: 600 }}>{e.company}{e.location ? ` • ${e.location}` : ''}</p>
              <p style={{ fontSize: 9, color: '#94A3B8', marginBottom: 3 }}>{e.startDate}{e.current ? ' — Present' : e.endDate ? ` — ${e.endDate}` : ''}</p>
              {e.description && <p style={{ fontSize: 10, color: '#475569' }}>{e.description}</p>}
            </div>
          ))}
        </div>
      )}
      {skills?.length > 0 && (
        <div style={{ marginBottom: 14, padding: '0 4px' }}>
          <p style={{ fontSize: 12, fontWeight: 900, color: RED, marginBottom: 4 }}>SKILLS</p>
          <div style={{ height: 2, background: RED, marginBottom: 6 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {skills.map((s, i) => (
              <span key={i} style={{ fontSize: 9, padding: '3px 8px', background: '#FEF2F2', color: RED, borderRadius: 4, fontWeight: 700 }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      {education?.some(e => e.degree) && (
        <div style={{ marginBottom: 14, padding: '0 4px' }}>
          <p style={{ fontSize: 12, fontWeight: 900, color: RED, marginBottom: 4 }}>EDUCATION</p>
          <div style={{ height: 2, background: RED, marginBottom: 6 }} />
          {education.map((e, i) => e.degree && (
            <div key={i} style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>{e.degree}</p>
              <p style={{ fontSize: 10, color: '#64748B' }}>{e.school}{e.startDate ? ` • ${e.startDate}` : ''}</p>
            </div>
          ))}
        </div>
      )}
      {projects?.some(p => p.name) && (
        <div style={{ marginBottom: 14, padding: '0 4px' }}>
          <p style={{ fontSize: 12, fontWeight: 900, color: RED, marginBottom: 4 }}>PROJECTS</p>
          <div style={{ height: 2, background: RED, marginBottom: 6 }} />
          {projects.map((p, i) => p.name && (
            <div key={i} style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>{p.name}</p>
              {p.tech && <p style={{ fontSize: 10, color: RED, fontWeight: 600 }}>{p.tech}</p>}
              {p.description && <p style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{p.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── FRESH ───────────────────────────────────────────────
function FreshTemplate({ data }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = data
  const GREEN = '#22C55E'
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: `3px solid ${GREEN}` }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: GREEN, marginBottom: 4 }}>
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        <div style={{ fontSize: 10, color: '#64748B', marginBottom: 2 }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join('  •  ')}
        </div>
        {(personalInfo.linkedin || personalInfo.website) && (
          <div style={{ fontSize: 10, color: GREEN }}>
            {[personalInfo.linkedin, personalInfo.website].filter(Boolean).join('  •  ')}
          </div>
        )}
      </div>
      {summary && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: GREEN, marginBottom: 4 }}>About Me</p>
          <p style={{ fontSize: 10, color: '#475569', lineHeight: 1.7, background: '#F0FDF4', padding: '8px 10px', borderRadius: 6, borderLeft: `3px solid ${GREEN}` }}>{summary}</p>
        </div>
      )}
      {experience?.some(e => e.jobTitle) && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: GREEN, marginBottom: 4 }}>Experience</p>
          <div style={{ height: 1, background: '#DCFCE7', marginBottom: 8 }} />
          {experience.map((e, i) => e.jobTitle && (
            <div key={i} style={{ marginBottom: 10, paddingLeft: 8, borderLeft: `3px solid #DCFCE7` }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>{e.jobTitle}</p>
              <p style={{ fontSize: 10, color: GREEN, fontWeight: 600 }}>{e.company}{e.location ? ` • ${e.location}` : ''}</p>
              <p style={{ fontSize: 9, color: '#94A3B8', marginBottom: 2 }}>{e.startDate}{e.current ? ' — Present' : e.endDate ? ` — ${e.endDate}` : ''}</p>
              {e.description && <p style={{ fontSize: 10, color: '#475569' }}>{e.description}</p>}
            </div>
          ))}
        </div>
      )}
      {education?.some(e => e.degree) && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: GREEN, marginBottom: 4 }}>Education</p>
          <div style={{ height: 1, background: '#DCFCE7', marginBottom: 8 }} />
          {education.map((e, i) => e.degree && (
            <div key={i} style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>{e.degree}</p>
              <p style={{ fontSize: 10, color: '#64748B' }}>{e.school}{e.gpa ? ` • GPA: ${e.gpa}` : ''}</p>
              {e.startDate && <p style={{ fontSize: 9, color: '#94A3B8' }}>{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</p>}
            </div>
          ))}
        </div>
      )}
      {skills?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: GREEN, marginBottom: 6 }}>Skills</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {skills.map((s, i) => (
              <span key={i} style={{ fontSize: 9, padding: '3px 10px', background: '#DCFCE7', color: '#16A34A', borderRadius: 20, fontWeight: 600 }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      {projects?.some(p => p.name) && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: GREEN, marginBottom: 4 }}>Projects</p>
          <div style={{ height: 1, background: '#DCFCE7', marginBottom: 8 }} />
          {projects.map((p, i) => p.name && (
            <div key={i} style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>{p.name}</p>
              {p.tech && <p style={{ fontSize: 10, color: GREEN, fontWeight: 600 }}>{p.tech}</p>}
              {p.description && <p style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{p.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── ELEGANT ─────────────────────────────────────────────
function ElegantTemplate({ data }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = data
  const GOLD = '#D97706'
  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      <div style={{ height: 1, background: GOLD, marginBottom: 14 }} />
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <h1 style={{ fontSize: 23, fontWeight: 400, color: '#0F172A', letterSpacing: 4, marginBottom: 6 }}>
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        <div style={{ fontSize: 10, color: GOLD, letterSpacing: 1, marginBottom: 2 }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join('   ·   ')}
        </div>
        {(personalInfo.linkedin || personalInfo.website) && (
          <div style={{ fontSize: 10, color: '#94A3B8', letterSpacing: 1 }}>
            {[personalInfo.linkedin, personalInfo.website].filter(Boolean).join('   ·   ')}
          </div>
        )}
      </div>
      <div style={{ height: 1, background: GOLD, marginBottom: 16 }} />
      {summary && (
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: 3, marginBottom: 8 }}>PROFILE</p>
          <p style={{ fontSize: 10, color: '#475569', lineHeight: 1.8, fontStyle: 'italic' }}>{summary}</p>
          <div style={{ height: 0.5, background: '#E2E8F0', marginTop: 12 }} />
        </div>
      )}
      {experience?.some(e => e.jobTitle) && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: 3, marginBottom: 8 }}>EXPERIENCE</p>
          {experience.map((e, i) => e.jobTitle && (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', fontStyle: 'italic' }}>{e.jobTitle}</p>
                <p style={{ fontSize: 10, color: GOLD }}>{e.startDate}{e.current ? ' — Present' : e.endDate ? ` — ${e.endDate}` : ''}</p>
              </div>
              <p style={{ fontSize: 10, color: '#64748B' }}>{e.company}{e.location ? `, ${e.location}` : ''}</p>
              {e.description && <p style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>{e.description}</p>}
            </div>
          ))}
          <div style={{ height: 0.5, background: '#E2E8F0', marginTop: 4 }} />
        </div>
      )}
      {education?.some(e => e.degree) && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: 3, marginBottom: 8 }}>EDUCATION</p>
          {education.map((e, i) => e.degree && (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', fontStyle: 'italic' }}>{e.degree}</p>
                <p style={{ fontSize: 10, color: '#64748B' }}>{e.school}</p>
              </div>
              <p style={{ fontSize: 10, color: GOLD }}>{e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}</p>
            </div>
          ))}
          <div style={{ height: 0.5, background: '#E2E8F0', marginTop: 4 }} />
        </div>
      )}
      {skills?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: 3, marginBottom: 8 }}>EXPERTISE</p>
          <p style={{ fontSize: 10, color: '#475569', letterSpacing: 1, lineHeight: 1.8 }}>{skills.join('   ·   ')}</p>
          <div style={{ height: 0.5, background: '#E2E8F0', marginTop: 10 }} />
        </div>
      )}
      {projects?.some(p => p.name) && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: 3, marginBottom: 8 }}>PROJECTS</p>
          {projects.map((p, i) => p.name && (
            <div key={i} style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', fontStyle: 'italic' }}>{p.name}</p>
              {p.tech && <p style={{ fontSize: 10, color: GOLD }}>{p.tech}</p>}
              {p.description && <p style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{p.description}</p>}
            </div>
          ))}
        </div>
      )}
      {certifications?.some(c => c.name) && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: 3, marginBottom: 8 }}>CERTIFICATIONS</p>
          {certifications.map((c, i) => c.name && (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', fontStyle: 'italic' }}>{c.name}</p>
                {c.issuer && <p style={{ fontSize: 10, color: '#64748B' }}>{c.issuer}</p>}
              </div>
              {c.date && <p style={{ fontSize: 10, color: GOLD }}>{c.date}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── SHARED SUBCOMPONENTS ────────────────────────────────
function ExpItem({ exp, accentColor = '#64748B' }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>{exp.jobTitle}</p>
        <p style={{ fontSize: 10, color: '#94A3B8' }}>{exp.startDate}{exp.current ? ' — Present' : exp.endDate ? ` — ${exp.endDate}` : ''}</p>
      </div>
      <p style={{ fontSize: 10, color: accentColor }}>{exp.company}{exp.location ? ` • ${exp.location}` : ''}</p>
      {exp.description && <p style={{ fontSize: 10, color: '#475569', marginTop: 3, lineHeight: 1.5 }}>{exp.description}</p>}
    </div>
  )
}

function EduItem({ edu }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>{edu.degree}</p>
        <p style={{ fontSize: 10, color: '#94A3B8' }}>{edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}</p>
      </div>
      <p style={{ fontSize: 10, color: '#64748B' }}>{edu.school}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</p>
    </div>
  )
}

function ProjItem({ proj, accentColor = '#64748B' }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>{proj.name}</p>
      {proj.tech && <p style={{ fontSize: 10, color: accentColor }}>{proj.tech}</p>}
      {proj.description && <p style={{ fontSize: 10, color: '#475569', marginTop: 2, lineHeight: 1.5 }}>{proj.description}</p>}
    </div>
  )
}

function CertItem({ cert, accentColor = '#64748B' }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>{cert.name}</p>
        {cert.date && <p style={{ fontSize: 10, color: '#94A3B8' }}>{cert.date}</p>}
      </div>
      {cert.issuer && <p style={{ fontSize: 10, color: accentColor }}>{cert.issuer}</p>}
    </div>
  )
}

const body     = { fontSize: 10, color: '#475569', lineHeight: 1.6 }
const skillTag = { fontSize: 9, padding: '2px 8px', background: '#F1F5F9', borderRadius: 4, color: '#334155' }
const wrapper  = { display: 'flex', flexDirection: 'column', height: '100%' }
const header   = { padding: '10px 16px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
const previewLabel  = { fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }
const templateBadge = { fontSize: 11, fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '3px 10px', borderRadius: 20 }
const paper    = { flex: 1, background: '#fff', padding: '24px 20px', overflowY: 'auto' }