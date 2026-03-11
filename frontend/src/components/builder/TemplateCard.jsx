import { useState } from 'react'

// Full realistic sample data
const SAMPLE = {
  personalInfo: {
    fullName:  'Christopher Carter',
    jobTitle:  'Senior Software Engineer',
    email:     'chris@email.com',
    phone:     '+1 (415) 555-0182',
    location:  'San Francisco, CA',
    linkedin:  'linkedin.com/in/chriscarter',
  },
  summary: 'Results-driven software engineer with 8+ years of experience building scalable web applications. Led teams of 10+ engineers delivering products used by 2M+ users. Expert in React, Node.js, and cloud architecture.',
  experience: [
    {
      jobTitle:    'Senior Software Engineer',
      company:     'Google LLC',
      location:    'San Francisco, CA',
      startDate:   'Mar 2021',
      endDate:     '',
      current:     true,
      description: 'Led development of core search infrastructure serving 5B+ daily queries. Reduced latency by 40% through algorithmic optimization. Mentored team of 8 junior engineers.',
    },
    {
      jobTitle:    'Software Engineer',
      company:     'Airbnb Inc.',
      location:    'San Francisco, CA',
      startDate:   'Jun 2018',
      endDate:     'Feb 2021',
      current:     false,
      description: 'Built booking platform features used by 150M+ users. Implemented real-time availability system reducing double-bookings by 95%.',
    },
  ],
  education: [
    {
      degree:    'B.Sc. Computer Science',
      school:    'Stanford University',
      location:  'Stanford, CA',
      startDate: '2013',
      endDate:   '2017',
      gpa:       '3.9',
    },
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'GraphQL', 'MongoDB', 'Docker'],
  certifications: [
    { name: 'AWS Solutions Architect', issuer: 'Amazon', date: '2023' },
  ],
}

// ─── TEMPLATE CARD ───────────────────────────────────────
export default function TemplateCard({ template, selected, onSelect, onPreview }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   '#fff',
        borderRadius: 10,
        overflow:     'hidden',
        position:     'relative',
        cursor:       'pointer',
        border:       selected ? '2.5px solid #2563EB' : '1.5px solid #E2E8F0',
        boxShadow:    selected
          ? '0 0 0 4px rgba(37,99,235,0.12), 0 4px 16px rgba(0,0,0,0.1)'
          : hovered
            ? '0 12px 32px rgba(0,0,0,0.14)'
            : '0 2px 8px rgba(0,0,0,0.06)',
        transform:    hovered && !selected ? 'translateY(-4px)' : 'none',
        transition:   'all 0.2s ease',
      }}
    >
      {/* SELECTED BADGE */}
      {selected && (
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 10,
          background: '#2563EB', color: '#fff',
          fontSize: 10, fontWeight: 800,
          padding: '3px 10px', borderRadius: 20,
          boxShadow: '0 2px 6px rgba(37,99,235,0.4)',
        }}>
          ✓ Selected
        </div>
      )}

      {/* ── PREVIEW AREA — uses CSS scale trick like resume.io ── */}
      <div style={{
        position:   'relative',
        height:     320,
        background: '#F1F5F9',
        overflow:   'hidden',
      }}>
        {/* White paper shadow */}
        <div style={{
          position:     'absolute',
          top:          16, left: '50%',
          transform:    'translateX(-50%)',
          width:        '85%',
          height:       '95%',
          background:   '#fff',
          borderRadius: 4,
          boxShadow:    '0 4px 20px rgba(0,0,0,0.12)',
          overflow:     'hidden',
        }}>
          {/* Scale container — render full size, scale down */}
          <div style={{
            width:           '794px',   // A4 width in px at 96dpi
            transformOrigin: 'top left',
            transform:       'scale(0.268)', // 213px / 794px ≈ 0.268
            pointerEvents:   'none',
            userSelect:      'none',
          }}>
            <FullTemplate templateId={template.id} />
          </div>
        </div>

        {/* HOVER OVERLAY */}
        <div style={{
          position:       'absolute', inset: 0,
          background:     'rgba(15,23,42,0.72)',
          display:        'flex', flexDirection: 'column',
          alignItems:     'center', justifyContent: 'center',
          gap:            12,
          opacity:        hovered ? 1 : 0,
          transition:     'opacity 0.2s',
          zIndex:         5,
        }}>
          <button
            onClick={e => { e.stopPropagation(); onPreview(template) }}
            style={{
              padding:    '11px 32px',
              background: '#fff',
              color:      '#0F172A',
              border:     'none',
              borderRadius: 8,
              fontSize:   14, fontWeight: 700,
              cursor:     'pointer',
              fontFamily: 'inherit',
              width:      180,
            }}
          >
            👁 Preview
          </button>
          <button
            onClick={e => { e.stopPropagation(); onSelect(template) }}
            style={{
              padding:    '11px 32px',
              background: selected ? '#16A34A' : '#2563EB',
              color:      '#fff',
              border:     'none',
              borderRadius: 8,
              fontSize:   14, fontWeight: 700,
              cursor:     'pointer',
              fontFamily: 'inherit',
              width:      180,
            }}
          >
            {selected ? '✓ Selected' : 'Use This Template'}
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        padding:        '12px 14px 14px',
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        borderTop:      '1px solid #F1F5F9',
      }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>
            {template.name}
          </p>
          <p style={{ fontSize: 11, color: '#94A3B8' }}>{template.category}</p>
        </div>
        <span style={{
          fontSize:   11, fontWeight: 700,
          padding:    '3px 10px', borderRadius: 20, flexShrink: 0,
          background: template.atsScore >= 90 ? '#DCFCE7' : '#FEF9C3',
          color:      template.atsScore >= 90 ? '#16A34A' : '#CA8A04',
        }}>
          ATS {template.atsScore}%
        </span>
      </div>
    </div>
  )
}

// ─── FULL SIZE TEMPLATE RENDERERS (rendered at 794px, scaled down) ──────

function FullTemplate({ templateId }) {
  const d = SAMPLE
  switch (templateId) {
    case 'modern':    return <FullModern    d={d} />
    case 'minimal':   return <FullMinimal   d={d} />
    case 'tech':      return <FullTech      d={d} />
    case 'executive': return <FullExecutive d={d} />
    case 'bold':      return <FullBold      d={d} />
    case 'fresh':     return <FullFresh     d={d} />
    case 'elegant':   return <FullElegant   d={d} />
    default:          return <FullClassic   d={d} />
  }
}

// shared section helper
function S({ title, color = '#0F172A', children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 5 }}>{title}</p>
      <div style={{ height: 1.5, background: color, marginBottom: 12 }} />
      {children}
    </div>
  )
}

function ExpBlock({ exp, titleColor = '#0F172A', companyColor = '#64748B' }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: titleColor }}>{exp.jobTitle}</p>
        <p style={{ fontSize: 11, color: '#94A3B8' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</p>
      </div>
      <p style={{ fontSize: 12, color: companyColor, marginBottom: 5 }}>{exp.company} • {exp.location}</p>
      <p style={{ fontSize: 11.5, color: '#475569', lineHeight: 1.65 }}>{exp.description}</p>
    </div>
  )
}

// ── CLASSIC ──────────────────────────────────────────────
function FullClassic({ d }) {
  return (
    <div style={{ padding: '48px 52px', fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100%' }}>
      <div style={{ borderBottom: '2.5px solid #0F172A', paddingBottom: 18, marginBottom: 26 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>{d.personalInfo.fullName}</h1>
        <p style={{ fontSize: 14, color: '#2563EB', fontWeight: 600, marginBottom: 8 }}>{d.personalInfo.jobTitle}</p>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[d.personalInfo.email, d.personalInfo.phone, d.personalInfo.location].map((v, i) => (
            <span key={i} style={{ fontSize: 12, color: '#64748B' }}>{v}</span>
          ))}
        </div>
      </div>
      <S title="Professional Summary">
        <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.7 }}>{d.summary}</p>
      </S>
      <S title="Experience">
        {d.experience.map((e, i) => <ExpBlock key={i} exp={e} />)}
      </S>
      <S title="Education">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{d.education[0].degree}</p>
            <p style={{ fontSize: 12, color: '#64748B' }}>{d.education[0].school}</p>
          </div>
          <p style={{ fontSize: 12, color: '#94A3B8' }}>{d.education[0].startDate} – {d.education[0].endDate}</p>
        </div>
      </S>
      <S title="Skills">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {d.skills.map((s, i) => <span key={i} style={{ fontSize: 12, padding: '4px 12px', background: '#F1F5F9', borderRadius: 4, color: '#334155' }}>{s}</span>)}
        </div>
      </S>
    </div>
  )
}

// ── MODERN ────────────────────────────────────────────────
function FullModern({ d }) {
  const C = '#2563EB'
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#fff', minHeight: '100%' }}>
      <div style={{ background: C, padding: '40px 52px 32px' }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{d.personalInfo.fullName}</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: 500, marginBottom: 14 }}>{d.personalInfo.jobTitle}</p>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            ['✉', d.personalInfo.email],
            ['📞', d.personalInfo.phone],
            ['📍', d.personalInfo.location],
          ].map(([icon, val], i) => (
            <span key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.88)' }}>{icon} {val}</span>
          ))}
        </div>
      </div>
      <div style={{ padding: '32px 52px' }}>
        <S title="Summary" color={C}>
          <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.7 }}>{d.summary}</p>
        </S>
        <S title="Experience" color={C}>
          {d.experience.map((e, i) => <ExpBlock key={i} exp={e} companyColor={C} />)}
        </S>
        <S title="Education" color={C}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{d.education[0].degree}</p>
              <p style={{ fontSize: 12, color: '#64748B' }}>{d.education[0].school}</p>
            </div>
            <p style={{ fontSize: 12, color: '#94A3B8' }}>{d.education[0].startDate} – {d.education[0].endDate}</p>
          </div>
        </S>
        <S title="Skills" color={C}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {d.skills.map((s, i) => (
              <span key={i} style={{ fontSize: 12, padding: '5px 14px', background: '#EFF6FF', color: C, border: `1px solid ${C}`, borderRadius: 20 }}>{s}</span>
            ))}
          </div>
        </S>
      </div>
    </div>
  )
}

// ── MINIMAL ───────────────────────────────────────────────
function FullMinimal({ d }) {
  const G = '#94A3B8'
  return (
    <div style={{ padding: '52px 60px', fontFamily: 'Helvetica, sans-serif', background: '#fff', minHeight: '100%' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 300, color: '#0F172A', letterSpacing: 2, marginBottom: 8 }}>{d.personalInfo.fullName}</h1>
        <p style={{ fontSize: 14, color: G, letterSpacing: 1, marginBottom: 10 }}>{d.personalInfo.jobTitle}</p>
        <div style={{ display: 'flex', gap: 24 }}>
          {[d.personalInfo.email, d.personalInfo.phone, d.personalInfo.location].map((v, i) => (
            <span key={i} style={{ fontSize: 12, color: G }}>{v}</span>
          ))}
        </div>
        <div style={{ height: 1, background: '#CBD5E1', marginTop: 20 }} />
      </div>
      {[
        { title: 'PROFILE', content: <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.7 }}>{d.summary}</p> },
      ].map(({ title, content }, i) => (
        <div key={i} style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: 3, marginBottom: 12 }}>{title}</p>
          {content}
        </div>
      ))}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: 3, marginBottom: 12 }}>EXPERIENCE</p>
        {d.experience.map((e, i) => <ExpBlock key={i} exp={e} titleColor='#0F172A' companyColor={G} />)}
      </div>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: 3, marginBottom: 12 }}>EDUCATION</p>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{d.education[0].degree}</p>
        <p style={{ fontSize: 12, color: G }}>{d.education[0].school} • {d.education[0].startDate}–{d.education[0].endDate}</p>
      </div>
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color: G, letterSpacing: 3, marginBottom: 12 }}>SKILLS</p>
        <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 2.2 }}>{d.skills.join('   ·   ')}</p>
      </div>
    </div>
  )
}

// ── TECH ──────────────────────────────────────────────────
function FullTech({ d }) {
  const C = '#06B6D4'; const BG = '#0F172A'
  return (
    <div style={{ fontFamily: 'Courier New, monospace', background: '#fff', minHeight: '100%' }}>
      <div style={{ background: BG, padding: '40px 52px 32px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{d.personalInfo.fullName}</h1>
        <p style={{ fontSize: 14, color: C, marginBottom: 14 }}>{d.personalInfo.jobTitle}</p>
        <div style={{ display: 'flex', gap: 24 }}>
          {[`@ ${d.personalInfo.email}`, `~ ${d.personalInfo.location}`].map((v, i) => (
            <span key={i} style={{ fontSize: 12, color: C }}>{v}</span>
          ))}
        </div>
      </div>
      <div style={{ padding: '32px 52px' }}>
        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C, marginBottom: 6 }}>// SUMMARY</p>
          <div style={{ height: 1, background: C, marginBottom: 12 }} />
          <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.7, borderLeft: `3px solid ${C}`, paddingLeft: 14 }}>{d.summary}</p>
        </div>
        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C, marginBottom: 6 }}>// EXPERIENCE</p>
          <div style={{ height: 1, background: C, marginBottom: 12 }} />
          {d.experience.map((e, i) => <ExpBlock key={i} exp={e} companyColor={C} />)}
        </div>
        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C, marginBottom: 6 }}>// SKILLS</p>
          <div style={{ height: 1, background: C, marginBottom: 12 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {d.skills.map((s, i) => (
              <span key={i} style={{ fontSize: 12, padding: '5px 14px', background: BG, color: C, border: `1px solid ${C}`, borderRadius: 4 }}>{s}</span>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: C, marginBottom: 6 }}>// EDUCATION</p>
          <div style={{ height: 1, background: C, marginBottom: 12 }} />
          <p style={{ fontSize: 13, fontWeight: 700, color: BG }}>{d.education[0].degree}</p>
          <p style={{ fontSize: 12, color: '#64748B' }}>{d.education[0].school} • {d.education[0].startDate}–{d.education[0].endDate}</p>
        </div>
      </div>
    </div>
  )
}

// ── EXECUTIVE ─────────────────────────────────────────────
function FullExecutive({ d }) {
  return (
    <div style={{ padding: '52px 60px', fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ height: 2, background: '#0F172A', marginBottom: 16 }} />
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', letterSpacing: 4, marginBottom: 8 }}>
          {d.personalInfo.fullName.toUpperCase()}
        </h1>
        <p style={{ fontSize: 13, color: '#64748B', letterSpacing: 2, marginBottom: 10 }}>{d.personalInfo.jobTitle}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
          {[d.personalInfo.email, d.personalInfo.phone, d.personalInfo.location].map((v, i) => (
            <span key={i} style={{ fontSize: 12, color: '#64748B' }}>{v}</span>
          ))}
        </div>
        <div style={{ height: 2, background: '#0F172A', marginTop: 16 }} />
      </div>
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: '#0F172A', marginBottom: 8 }}>EXECUTIVE SUMMARY</p>
        <div style={{ height: 1, background: '#0F172A', marginBottom: 14 }} />
        <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.8, fontStyle: 'italic' }}>{d.summary}</p>
      </div>
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: '#0F172A', marginBottom: 8 }}>PROFESSIONAL EXPERIENCE</p>
        <div style={{ height: 1, background: '#0F172A', marginBottom: 14 }} />
        {d.experience.map((e, i) => <ExpBlock key={i} exp={e} />)}
      </div>
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: '#0F172A', marginBottom: 8 }}>EDUCATION</p>
        <div style={{ height: 1, background: '#0F172A', marginBottom: 14 }} />
        <p style={{ fontSize: 13, fontWeight: 700 }}>{d.education[0].degree}</p>
        <p style={{ fontSize: 12, color: '#64748B' }}>{d.education[0].school} • GPA {d.education[0].gpa}</p>
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: '#0F172A', marginBottom: 8 }}>CORE COMPETENCIES</p>
        <div style={{ height: 1, background: '#0F172A', marginBottom: 14 }} />
        <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 2.2 }}>{d.skills.join('   •   ')}</p>
      </div>
    </div>
  )
}

// ── BOLD ──────────────────────────────────────────────────
function FullBold({ d }) {
  const R = '#EF4444'
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#fff', minHeight: '100%' }}>
      <div style={{ background: R, padding: '40px 52px 32px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 6 }}>{d.personalInfo.fullName}</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.88)', fontWeight: 600, marginBottom: 14 }}>{d.personalInfo.jobTitle}</p>
        <div style={{ display: 'flex', gap: 24 }}>
          {[d.personalInfo.email, d.personalInfo.phone, d.personalInfo.location].map((v, i) => (
            <span key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>{v}</span>
          ))}
        </div>
      </div>
      <div style={{ padding: '32px 52px' }}>
        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 16, fontWeight: 900, color: R, marginBottom: 6 }}>SUMMARY</p>
          <div style={{ height: 2.5, background: R, marginBottom: 14 }} />
          <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.7 }}>{d.summary}</p>
        </div>
        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 16, fontWeight: 900, color: R, marginBottom: 6 }}>EXPERIENCE</p>
          <div style={{ height: 2.5, background: R, marginBottom: 14 }} />
          {d.experience.map((e, i) => <ExpBlock key={i} exp={e} companyColor={R} />)}
        </div>
        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 16, fontWeight: 900, color: R, marginBottom: 6 }}>SKILLS</p>
          <div style={{ height: 2.5, background: R, marginBottom: 14 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {d.skills.map((s, i) => (
              <span key={i} style={{ fontSize: 12, padding: '5px 14px', background: '#FEF2F2', color: R, borderRadius: 4, fontWeight: 700 }}>{s}</span>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 900, color: R, marginBottom: 6 }}>EDUCATION</p>
          <div style={{ height: 2.5, background: R, marginBottom: 14 }} />
          <p style={{ fontSize: 13, fontWeight: 700 }}>{d.education[0].degree}</p>
          <p style={{ fontSize: 12, color: '#64748B' }}>{d.education[0].school}</p>
        </div>
      </div>
    </div>
  )
}

// ── FRESH ─────────────────────────────────────────────────
function FullFresh({ d }) {
  const G = '#22C55E'
  return (
    <div style={{ padding: '48px 52px', fontFamily: 'Arial, sans-serif', background: '#fff', minHeight: '100%' }}>
      <div style={{ textAlign: 'center', borderBottom: `3px solid ${G}`, paddingBottom: 22, marginBottom: 28 }}>
        <h1 style={{ fontSize: 30, fontWeight: 700, color: G, marginBottom: 6 }}>{d.personalInfo.fullName}</h1>
        <p style={{ fontSize: 14, color: '#64748B', marginBottom: 10 }}>{d.personalInfo.jobTitle}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
          {[d.personalInfo.email, d.personalInfo.phone, d.personalInfo.location].map((v, i) => (
            <span key={i} style={{ fontSize: 12, color: '#64748B' }}>{v}</span>
          ))}
        </div>
      </div>
      {[
        { title: 'About Me', content: <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.7 }}>{d.summary}</p> },
      ].map(({ title, content }, i) => (
        <div key={i} style={{ marginBottom: 22, paddingLeft: 16, borderLeft: `3px solid ${G}` }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: G, marginBottom: 10 }}>{title}</p>
          {content}
        </div>
      ))}
      <div style={{ marginBottom: 22, paddingLeft: 16, borderLeft: `3px solid ${G}` }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: G, marginBottom: 12 }}>Experience</p>
        {d.experience.map((e, i) => <ExpBlock key={i} exp={e} companyColor={G} />)}
      </div>
      <div style={{ marginBottom: 22, paddingLeft: 16, borderLeft: `3px solid ${G}` }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: G, marginBottom: 12 }}>Education</p>
        <p style={{ fontSize: 13, fontWeight: 700 }}>{d.education[0].degree}</p>
        <p style={{ fontSize: 12, color: '#64748B' }}>{d.education[0].school}</p>
      </div>
      <div style={{ paddingLeft: 16, borderLeft: `3px solid ${G}` }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: G, marginBottom: 12 }}>Skills</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {d.skills.map((s, i) => (
            <span key={i} style={{ fontSize: 12, padding: '5px 14px', background: '#DCFCE7', color: '#16A34A', borderRadius: 20, fontWeight: 600 }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── ELEGANT ───────────────────────────────────────────────
function FullElegant({ d }) {
  const Au = '#B45309'
  return (
    <div style={{ padding: '52px 60px', fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100%' }}>
      <div style={{ height: 1.5, background: Au, marginBottom: 22 }} />
      <div style={{ textAlign: 'center', marginBottom: 22 }}>
        <h1 style={{ fontSize: 30, fontWeight: 400, color: '#0F172A', letterSpacing: 5, marginBottom: 8 }}>{d.personalInfo.fullName}</h1>
        <p style={{ fontSize: 13, color: Au, letterSpacing: 2, marginBottom: 10 }}>{d.personalInfo.jobTitle}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
          {[d.personalInfo.email, d.personalInfo.phone, d.personalInfo.location].map((v, i) => (
            <span key={i} style={{ fontSize: 12, color: '#64748B' }}>{v}</span>
          ))}
        </div>
      </div>
      <div style={{ height: 1.5, background: Au, marginBottom: 28 }} />
      {[
        {
          title: 'Profile',
          content: <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.8, fontStyle: 'italic' }}>{d.summary}</p>,
        },
      ].map(({ title, content }, i) => (
        <div key={i} style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: Au, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>{title}</p>
          <div style={{ height: 0.5, background: Au, marginBottom: 14 }} />
          {content}
        </div>
      ))}
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: Au, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>Experience</p>
        <div style={{ height: 0.5, background: Au, marginBottom: 14 }} />
        {d.experience.map((e, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 13, fontWeight: 700, fontStyle: 'italic', color: '#0F172A' }}>{e.jobTitle}</p>
              <p style={{ fontSize: 11, color: '#94A3B8' }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</p>
            </div>
            <p style={{ fontSize: 12, color: Au, marginBottom: 5 }}>{e.company}</p>
            <p style={{ fontSize: 11.5, color: '#475569', lineHeight: 1.65 }}>{e.description}</p>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: Au, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>Education</p>
        <div style={{ height: 0.5, background: Au, marginBottom: 14 }} />
        <p style={{ fontSize: 13, fontWeight: 700, fontStyle: 'italic' }}>{d.education[0].degree}</p>
        <p style={{ fontSize: 12, color: '#64748B' }}>{d.education[0].school}</p>
      </div>
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color: Au, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>Expertise</p>
        <div style={{ height: 0.5, background: Au, marginBottom: 14 }} />
        <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 2.2, letterSpacing: 1 }}>{d.skills.join('   ·   ')}</p>
      </div>
    </div>
  )
}