// Step6Projects.jsx
// Add multiple projects with name, description, tech, link

import useResumeStore from '../../../store/resumeStore'

export default function Step6Projects() {
  const projects       = useResumeStore((s) => s.resumeData.projects)
  const updateProjects = useResumeStore((s) => s.updateProjects)

  function handleChange(id, field, value) {
    const updated = projects.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    )
    updateProjects(updated)
  }

  function handleAdd() {
    updateProjects([...projects, {
      id:          Date.now(),
      name:        '',
      description: '',
      link:        '',
      tech:        '',
    }])
  }

  function handleRemove(id) {
    if (projects.length === 1) return
    updateProjects(projects.filter((p) => p.id !== id))
  }

  return (
    <div style={wrapper}>
      <h2 style={title}>Projects</h2>
      <p style={subtitle}>
        Showcase your best work. Include links where possible.
      </p>

      {projects.map((project, index) => (
        <div key={project.id} style={card}>

          {/* CARD HEADER */}
          <div style={cardHeader}>
            <p style={cardTitle}>
              {project.name || `Project ${index + 1}`}
            </p>
            {projects.length > 1 && (
              <button
                onClick={() => handleRemove(project.id)}
                style={removeBtn}
              >
                ✕ Remove
              </button>
            )}
          </div>

          <div style={grid}>

            {/* PROJECT NAME */}
            <div style={fieldGroup}>
              <label style={label}>Project Name *</label>
              <input
                placeholder="Resume AI App"
                value={project.name}
                onChange={(e) => handleChange(project.id, 'name', e.target.value)}
                style={input}
              />
            </div>

            {/* TECH STACK */}
            <div style={fieldGroup}>
              <label style={label}>Technologies Used</label>
              <input
                placeholder="React, Node.js, MongoDB"
                value={project.tech}
                onChange={(e) => handleChange(project.id, 'tech', e.target.value)}
                style={input}
              />
            </div>

            {/* PROJECT LINK */}
            <div style={{ ...fieldGroup, gridColumn: '1 / -1' }}>
              <label style={label}>Project Link (GitHub / Live)</label>
              <input
                placeholder="https://github.com/bushra/resume-ai"
                value={project.link}
                onChange={(e) => handleChange(project.id, 'link', e.target.value)}
                style={input}
              />
            </div>

          </div>

          {/* DESCRIPTION */}
          <div style={{ marginTop: 12 }}>
            <label style={label}>Description</label>
            <textarea
              placeholder="Built a full stack resume builder with ATS optimization and AI suggestions..."
              value={project.description}
              onChange={(e) => handleChange(project.id, 'description', e.target.value)}
              style={textarea}
            />
          </div>

        </div>
      ))}

      <button onClick={handleAdd} style={addBtn}>
        + Add Another Project
      </button>

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
const textarea   = { width: '100%', height: 100, padding: '12px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#334155', fontFamily: 'inherit', lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }
const addBtn     = { width: '100%', padding: '13px 0', background: '#F8FAFC', color: '#2563EB', border: '2px dashed #BFDBFE', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }