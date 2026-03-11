// ToneSelector.jsx
// Shows three tone options for AI rewriting
//
// PROPS:
//   selected  → which tone is currently selected
//   onSelect  → function that runs when user clicks a tone

export default function ToneSelector({ selected, onSelect }) {

  const tones = [
    {
      id: 'professional',
      label: 'Professional',
      icon: '💼',
      description: 'Formal and business appropriate',
    },
    {
      id: 'casual',
      label: 'Casual',
      icon: '😊',
      description: 'Friendly and conversational',
    },
    {
      id: 'creative',
      label: 'Creative',
      icon: '🎨',
      description: 'Unique and imaginative',
    },
  ]

  return (
    <div style={wrapper}>

      <p style={label}>Select Tone</p>

      <div style={btnRow}>
        {tones.map((tone) => {

          const isSelected = selected === tone.id

          return (
            <button
              key={tone.id}
              onClick={() => onSelect(tone.id)}
              style={{
                ...btn,
                background: isSelected ? '#EFF6FF' : '#fff',
                border: isSelected
                  ? '2px solid #2563EB'
                  : '2px solid #E2E8F0',
              }}
            >
              {/* Icon */}
              <span style={{ fontSize: 20 }}>{tone.icon}</span>

              {/* Label */}
              <p style={{
                fontSize: 13,
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? '#2563EB' : '#0F172A',
                marginTop: 6,
              }}>
                {tone.label}
              </p>

              {/* Description */}
              <p style={{
                fontSize: 11,
                color: isSelected ? '#2563EB' : '#94A3B8',
                marginTop: 3,
                lineHeight: 1.4,
              }}>
                {tone.description}
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
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: 10,
}
const btn = {
  padding: '14px 10px',
  borderRadius: 12,
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'all 0.15s',
  fontFamily: 'inherit',
}
