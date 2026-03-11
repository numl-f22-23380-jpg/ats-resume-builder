// Step7Certifications.jsx
// Add certifications with name, issuer, date, link

import useResumeStore from '../../../store/resumeStore'

export default function Step7Certifications() {
  const certifications       = useResumeStore((s) => s.resumeData.certifications)
  const updateCertifications = useResumeStore((s) => s.updateCertifications)

  function handleChange(id, field, value) {
    const updated = certifications.map((c) =>
      c.id === id ? { ...c, [field]: value } : c
    )
    updateCertifications(updated)
  }

  function handleAdd() {
    updateCertifications([...certifications, {
      id:     Date.now(),
      name:   '',
      issuer: '',
      date:   '',
      link:   '',
    }])
  }

  function handleRemove(id) {
    if (certifications.length === 1) return
    updateCertifications(certifications.filter((c) => c.id !== id))
  }

  return (
    <div style={wrapper}>
      <h2 style={title}>Certifications</h2>
      <p style={subtitle}>
        Add any relevant certifications or courses you have completed.
      </p>

      {certifications.map((cert, index) => (
        <div key={cert.id} style={card}>

          {/* CARD HEADER */}
          <div style={cardHeader}>
            <p style={cardTitle}>
              {cert.name || `Certification ${index + 1}`}
            </p>
            {certifications.length > 1 && (
              <button
                onClick={() => handleRemove(cert.id)}
                style={removeBtn}
              >
                ✕ Remove
              </button>
            )}
          </div>

          <div style={grid}>

            {/* CERT NAME */}
            <div style={fieldGroup}>
              <label style={label}>Certification Name *</label>
              <input
                placeholder="AWS Certified Developer"
                value={cert.name}
                onChange={(e) => handleChange(cert.id, 'name', e.target.value)}
                style={input}
              />
            </div>

            {/* ISSUER */}
            <div style={fieldGroup}>
              <label style={label}>Issued By</label>
              <input
                placeholder="Amazon Web Services"
                value={cert.issuer}
                onChange={(e) => handleChange(cert.id, 'issuer', e.target.value)}
                style={input}
              />
            </div>

            {/* DATE */}
            <div style={fieldGroup}>
              <label style={label}>Date Earned</label>
              <input
                placeholder="March 2024"
                value={cert.date}
                onChange={(e) => handleChange(cert.id, 'date', e.target.value)}
                style={input}
              />
            </div>

            {/* LINK */}
            <div style={fieldGroup}>
              <label style={label}>Certificate Link (optional)</label>
              <input
                placeholder="https://credly.com/badges/..."
                value={cert.link}
                onChange={(e) => handleChange(cert.id, 'link', e.target.value)}
                style={input}
              />
            </div>

          </div>

        </div>
      ))}

      <button onClick={handleAdd} style={addBtn}>
        + Add Another Certification
      </button>

      {/* FINISH NOTE */}
      <div style={finishNote}>
        <span style={{ fontSize: 20 }}>🎉</span>
        <p style={finishText}>
          You are on the last step! Click Finish to save your resume.
        </p>
      </div>

    </div>
  )
}

const wrapper    = { padding: '32px' }
const title      = { fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 6 }
const subtitle   = { fontSize: 14, color: '#64748B', marginBottom: 24 }
const card       = { background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: '20px', marginBottom: 16 }
const cardHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }
const cardTitle  = { fontSize: 15, fontWeight: 700, color: '#0F172A' }
const removeBtn  = { background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }
const grid       = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }
const fieldGroup = { display: 'flex', flexDirection: 'column' }
const label      = { fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }
const input      = { padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#334155', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }
const addBtn     = { width: '100%', padding: '13px 0', background: '#F8FAFC', color: '#2563EB', border: '2px dashed #BFDBFE', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 20 }
const finishNote = { display: 'flex', alignItems: 'center', gap: 12, padding: '16px', background: '#F0FDF4', borderRadius: 10, border: '1px solid #DCFCE7' }
const finishText = { fontSize: 14, color: '#16A34A', fontWeight: 600 }