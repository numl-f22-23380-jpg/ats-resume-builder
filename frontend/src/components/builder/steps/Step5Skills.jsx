// Step5Skills.jsx
// User types a skill and presses Enter or clicks Add
// Skills show as removable badges

import { useState }   from 'react'
import useResumeStore from '../../../store/resumeStore'

export default function Step5Skills() {
  const skills       = useResumeStore((s) => s.resumeData.skills)
  const updateSkills = useResumeStore((s) => s.updateSkills)

  const [input, setInput] = useState('')

  // Add skill when user presses Enter or clicks Add
  function handleAdd() {
    const trimmed = input.trim()
    if (!trimmed) return
    if (skills.includes(trimmed)) return  // no duplicates
    updateSkills([...skills, trimmed])
    setInput('')
  }

  // Remove skill when user clicks ✕
  function handleRemove(skill) {
    updateSkills(skills.filter((s) => s !== skill))
  }

  // Add on Enter key press
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  // Suggested skills to click quickly
  const suggestions = [
    'React', 'JavaScript', 'TypeScript', 'HTML', 'CSS',
    'Node.js', 'Git', 'REST API', 'Redux', 'Figma',
    'Python', 'Docker', 'AWS', 'MongoDB', 'SQL',
  ]

  return (
    <div style={wrapper}>
      <h2 style={title}>Skills</h2>
      <p style={subtitle}>
        Add your technical and professional skills.
        Press Enter or click Add after each skill.
      </p>

      {/* INPUT ROW */}
      <div style={inputRow}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill e.g. React"
          style={skillInput}
        />
        <button onClick={handleAdd} style={addBtn}>
          + Add
        </button>
      </div>

      {/* ADDED SKILLS */}
      {skills.length > 0 && (
        <div style={section}>
          <p style={sectionLabel}>Your Skills ({skills.length})</p>
          <div style={tagsRow}>
            {skills.map((skill) => (
              <span key={skill} style={tag}>
                {skill}
                <button
                  onClick={() => handleRemove(skill)}
                  style={removeBtn}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SUGGESTIONS */}
      <div style={section}>
        <p style={sectionLabel}>Quick Add — Click to add:</p>
        <div style={tagsRow}>
          {suggestions
            .filter((s) => !skills.includes(s))
            .map((skill) => (
              <span
                key={skill}
                onClick={() => updateSkills([...skills, skill])}
                style={suggestion}
              >
                + {skill}
              </span>
            ))}
        </div>
      </div>

    </div>
  )
}

const wrapper    = { padding: '32px' }
const title      = { fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 6 }
const subtitle   = { fontSize: 14, color: '#64748B', marginBottom: 24, lineHeight: 1.6 }
const inputRow   = { display: 'flex', gap: 10, marginBottom: 24 }
const skillInput = {
  flex: 1,
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
  padding: '11px 20px',
  background: '#2563EB',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  fontSize: 14,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  flexShrink: 0,
}
const section      = { marginBottom: 24 }
const sectionLabel = { fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 10 }
const tagsRow      = { display: 'flex', flexWrap: 'wrap', gap: 8 }
const tag          = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  background: '#EFF6FF',
  color: '#2563EB',
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 600,
  border: '1.5px solid #BFDBFE',
}
const removeBtn = {
  background: 'transparent',
  border: 'none',
  color: '#93C5FD',
  cursor: 'pointer',
  fontSize: 12,
  padding: 0,
  lineHeight: 1,
}
const suggestion = {
  display: 'inline-block',
  padding: '6px 12px',
  background: '#F8FAFC',
  color: '#64748B',
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 500,
  border: '1.5px solid #E2E8F0',
  cursor: 'pointer',
}