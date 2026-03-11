// SectionSelector.jsx
// Shows two buttons: Summary and Bullet Points
// User clicks one to select which section to improve
//
// PROPS:
//   selected  → which section is currently selected
//   onSelect  → function that runs when user clicks a button

export default function SectionSelector({ selected, onSelect }) {

  const sections = [
    {
      id: 'summary',
      label: 'Summary',
      icon: '📝',
      description: 'Improve your resume intro paragraph'
    },
    {
      id: 'bullets',
      label: 'Bullet Points',
      icon: '✏️',
      description: 'Improve your work experience points'
    },
  ]

  return (
    <div style={wrapper}>

      <p style={label}>Select Section to Improve</p>

      <div style={btnRow}>
        {sections.map((section) => {

          const isSelected = selected === section.id

          return (
            <button
              key={section.id}
              onClick={() => onSelect(section.id)}
              style={{
                ...btn,
                background:   isSelected ? '#EFF6FF' : '#fff',
                border:       isSelected
                  ? '2px solid #2563EB'
                  : '2px solid #E2E8F0',
                color: isSelected ? '#2563EB' : '#475569',
              }}
            >
              <span style={{ fontSize: 24 }}>{section.icon}</span>
              <p style={{
                fontSize: 14,
                fontWeight: isSelected ? 700 : 500,
                marginTop: 6,
              }}>
                {section.label}
              </p>
              <p style={{
                fontSize: 12,
                color: isSelected ? '#2563EB' : '#94A3B8',
                marginTop: 4,
                lineHeight: 1.4,
              }}>
                {section.description}
              </p>
            </button>
          )
        })}
      </div>

    </div>
  )
}

// ─── Styles ──────────────────────────────
const wrapper = {
  marginBottom: 20,
}
const label = {
  fontSize: 13,
  fontWeight: 600,
  color: '#475569',
  marginBottom: 10,
}
const btnRow = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
}
const btn = {
  padding: '16px 12px',
  borderRadius: 12,
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'all 0.15s',
  fontFamily: 'inherit',
}