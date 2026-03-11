// Step3Experience.jsx
// Work experience — add multiple jobs

import { useState }   from 'react'
import useResumeStore from '../../../store/resumeStore'

export default function Step3Experience() {
  const experience       = useResumeStore((s) => s.resumeData.experience)
  const updateExperience = useResumeStore((s) => s.updateExperience)

  // Update one field of one experience item
  function handleChange(id, field, value) {
    const updated = experience.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    )
    updateExperience(updated)
  }

  // Add new experience item
  function handleAdd() {
    const newExp = {
      id:          Date.now(),
      jobTitle:    '',
      company:     '',
      location:    '',
      startDate:   '',
      endDate:     '',
      current:     false,
      description: '',
    }
    updateExperience([...experience, newExp])
  }

  // Remove experience item
  function handleRemove(id) {
    if (experience.length === 1) return
    updateExperience(experience.filter((exp) => exp.id !== id))
  }

  return (
    <div style={wrapper}>
      <h2 style={title}>Work Experience</h2>
      <p style={subtitle}>
        Add your work history. Most recent job first.
      </p>

      {experience.map((exp, index) => (
        <div key={exp.id} style={card}>

          {/* CARD HEADER */}
          <div style={cardHeader}>
            <p style={cardTitle}>
              {exp.jobTitle || `Experience ${index + 1}`}
            </p>
            {experience.length > 1 && (
              <button
                onClick={() => handleRemove(exp.id)}
                style={removeBtn}
              >
                ✕ Remove
              </button>
            )}
          </div>

          <div style={grid}>

            {/* JOB TITLE */}
            <div style={fieldGroup}>
              <label style={label}>Job Title *</label>
              <input
                placeholder="Frontend Developer"
                value={exp.jobTitle}
                onChange={(e) => handleChange(exp.id, 'jobTitle', e.target.value)}
                style={input}
              />
            </div>

            {/* COMPANY */}
            <div style={fieldGroup}>
              <label style={label}>Company *</label>
              <input
                placeholder="Google"
                value={exp.company}
                onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                style={input}
              />
            </div>

            {/* LOCATION */}
            <div style={fieldGroup}>
              <label style={label}>Location</label>
              <input
                placeholder="ie. Islamabad, Pakistan"
                value={exp.location}
                onChange={(e) => handleChange(exp.id, 'location', e.target.value)}
                style={input}
              />
            </div>

            {/* START DATE */}
            <div style={fieldGroup}>
              <label style={label}>Start Date</label>
              <input
                placeholder="Jan 2022"
                value={exp.startDate}
                onChange={(e) => handleChange(exp.id, 'startDate', e.target.value)}
                style={input}
              />
            </div>

            {/* END DATE */}
            <div style={fieldGroup}>
              <label style={label}>End Date</label>
              <input
                placeholder="Dec 2023"
                value={exp.endDate}
                onChange={(e) => handleChange(exp.id, 'endDate', e.target.value)}
                disabled={exp.current}
                style={{
                  ...input,
                  background: exp.current ? '#F8FAFC' : '#fff',
                  color: exp.current ? '#94A3B8' : '#334155',
                }}
              />
            </div>

            {/* CURRENT JOB CHECKBOX */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 24 }}>
              <input
                type="checkbox"
                id={`current-${exp.id}`}
                checked={exp.current}
                onChange={(e) => handleChange(exp.id, 'current', e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor={`current-${exp.id}`} style={checkLabel}>
                I currently work here
              </label>
            </div>

          </div>

          {/* DESCRIPTION */}
          <div style={{ marginTop: 12 }}>
            <label style={label}>Description</label>
            <textarea
              placeholder="• Built React components that improved performance by 40%&#10;• Collaborated with backend team on REST API integration&#10;• Led code reviews and mentored junior developers"
              value={exp.description}
              onChange={(e) => handleChange(exp.id, 'description', e.target.value)}
              style={textarea}
            />
          </div>

        </div>
      ))}

      {/* ADD MORE BUTTON */}
      <button onClick={handleAdd} style={addBtn}>
        + Add Another Experience
      </button>

    </div>
  )
}

const wrapper  = { padding: '32px' }
const title    = { fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 6 }
const subtitle = { fontSize: 14, color: '#64748B', marginBottom: 24 }
const card     = {
  background: '#fff',
  borderRadius: 12,
  border: '1px solid #E2E8F0',
  padding: '20px',
  marginBottom: 16,
}
const cardHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
}
const cardTitle  = { fontSize: 15, fontWeight: 700, color: '#0F172A' }
const removeBtn  = {
  background: '#FEF2F2',
  color: '#EF4444',
  border: 'none',
  borderRadius: 8,
  padding: '6px 12px',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
}
const grid       = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }
const fieldGroup = { display: 'flex', flexDirection: 'column' }
const label      = { fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }
const checkLabel = { fontSize: 13, color: '#475569', cursor: 'pointer' }
const input      = {
  padding: '11px 14px',
  border: '1.5px solid #E2E8F0',
  borderRadius: 10,
  fontSize: 14,
  color: '#334155',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
}
const textarea   = {
  width: '100%',
  height: 120,
  padding: '12px 14px',
  border: '1.5px solid #E2E8F0',
  borderRadius: 10,
  fontSize: 14,
  color: '#334155',
  fontFamily: 'inherit',
  lineHeight: 1.6,
  resize: 'vertical',
  outline: 'none',
  boxSizing: 'border-box',
}
const addBtn = {
  width: '100%',
  padding: '13px 0',
  background: '#F8FAFC',
  color: '#2563EB',
  border: '2px dashed #BFDBFE',
  borderRadius: 10,
  fontSize: 14,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
}