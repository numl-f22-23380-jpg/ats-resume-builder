// Step4Education.jsx
// Education history — add multiple entries

import useResumeStore from '../../../store/resumeStore'

export default function Step4Education() {
  const education       = useResumeStore((s) => s.resumeData.education)
  const updateEducation = useResumeStore((s) => s.updateEducation)

  function handleChange(id, field, value) {
    const updated = education.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    )
    updateEducation(updated)
  }

  function handleAdd() {
    const newEdu = {
      id:        Date.now(),
      degree:    '',
      school:    '',
      location:  '',
      startDate: '',
      endDate:   '',
      gpa:       '',
    }
    updateEducation([...education, newEdu])
  }

  function handleRemove(id) {
    if (education.length === 1) return
    updateEducation(education.filter((edu) => edu.id !== id))
  }

  return (
    <div style={wrapper}>
      <h2 style={title}>Education</h2>
      <p style={subtitle}>Add your educational background.</p>

      {education.map((edu, index) => (
        <div key={edu.id} style={card}>

          {/* CARD HEADER */}
          <div style={cardHeader}>
            <p style={cardTitle}>
              {edu.degree || `Education ${index + 1}`}
            </p>
            {education.length > 1 && (
              <button
                onClick={() => handleRemove(edu.id)}
                style={removeBtn}
              >
                ✕ Remove
              </button>
            )}
          </div>

          <div style={grid}>

            {/* DEGREE */}
            <div style={fieldGroup}>
              <label style={label}>Degree *</label>
              <input
                placeholder="BS Computer Science"
                value={edu.degree}
                onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                style={input}
              />
            </div>

            {/* SCHOOL */}
            <div style={fieldGroup}>
              <label style={label}>School / University *</label>
              <input
                placeholder="National university"
                value={edu.school}
                onChange={(e) => handleChange(edu.id, 'school', e.target.value)}
                style={input}
              />
            </div>

            {/* LOCATION */}
            <div style={fieldGroup}>
              <label style={label}>Location</label>
              <input
                placeholder="Islamabad, Pakistan"
                value={edu.location}
                onChange={(e) => handleChange(edu.id, 'location', e.target.value)}
                style={input}
              />
            </div>

            {/* GPA */}
            <div style={fieldGroup}>
              <label style={label}>GPA (optional)</label>
              <input
                placeholder="3.8 / 4.0"
                value={edu.gpa}
                onChange={(e) => handleChange(edu.id, 'gpa', e.target.value)}
                style={input}
              />
            </div>

            {/* START DATE */}
            <div style={fieldGroup}>
              <label style={label}>Start Date</label>
              <input
                placeholder="Sep 2019"
                value={edu.startDate}
                onChange={(e) => handleChange(edu.id, 'startDate', e.target.value)}
                style={input}
              />
            </div>

            {/* END DATE */}
            <div style={fieldGroup}>
              <label style={label}>End Date</label>
              <input
                placeholder="Jun 2023"
                value={edu.endDate}
                onChange={(e) => handleChange(edu.id, 'endDate', e.target.value)}
                style={input}
              />
            </div>

          </div>

        </div>
      ))}

      {/* ADD MORE BUTTON */}
      <button onClick={handleAdd} style={addBtn}>
        + Add Another Education
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