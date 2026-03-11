export default function KeywordTags({ matched, missing }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* MATCHED */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 20 }}>✓</span>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#22C55E' }}>Matched Keywords</h3>
        </div>
        {matched.length === 0 ? (
          <p style={{ color: '#94A3B8', fontStyle: 'italic' }}>No keywords matched yet.</p>
        ) : (
          <div>
            {matched.map((word) => <Badge key={word} word={word} color="green" />)}
          </div>
        )}
      </div>

      {/* MISSING */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 20 }}>⊘</span>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#EF4444' }}>Missing Keywords</h3>
        </div>
        <div>
          {missing.map((word) => <Badge key={word} word={word} color="red" />)}
        </div>
        <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 12 }}>
          💡 Add these to your resume to improve your score.
        </p>
      </div>

    </div>
  )
}

function Badge({ word, color }) {
  const isGreen = color === 'green'
  return (
    <span style={{
      display: 'inline-block',
      padding: '5px 14px', borderRadius: 8,
      fontSize: 13, fontWeight: 600,
      marginRight: 8, marginBottom: 8,
      border:     `1.5px solid ${isGreen ? '#22C55E' : '#EF4444'}`,
      color:      isGreen ? '#16A34A' : '#DC2626',
      background: isGreen ? '#F0FDF4' : '#FFF5F5',
    }}>
      {word}
    </span>
  )
}

const card = {
  background: '#fff', borderRadius: 14,
  padding: '20px 22px', border: '1px solid #F1F5F9',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
}