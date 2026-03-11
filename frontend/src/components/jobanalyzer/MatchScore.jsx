export default function MatchScore({ percentage }) {

  // Color changes based on percentage
  const color =
    percentage >= 70 ? '#22C55E' :
    percentage >= 45 ? '#F59E0B' :
                       '#EF4444'

  const message =
    percentage >= 70 ? 'Strong match! You are a good fit.' :
    percentage >= 45 ? 'Moderate match. Some improvements needed.' :
                       'Low match. Review missing keywords.'

  return (
    <div style={card}>

      {/* TOP ROW — icon + title */}
      <div style={row}>
        <span style={{ fontSize: 22 }}>🎯</span>
        <h2 style={title}>Job Match Score</h2>
      </div>

      {/* BIG PERCENTAGE NUMBER */}
      <p style={{ ...bigNumber, color }}>{percentage}%</p>

      {/* MESSAGE */}
      <p style={message_style}>{message}</p>

      {/* PROGRESS BAR */}
      {/* outer bar = gray background */}
      <div style={barBg}>
        {/* inner bar = colored fill based on percentage */}
        <div style={{
          ...barFill,
          width: `${percentage}%`,
          background: color,
        }} />
      </div>

    </div>
  )
}

// ─── Styles ──────────────────────────────
const card = {
  background: '#fff',
  borderRadius: 14,
  padding: '24px',
  border: '1px solid #F1F5F9',
  boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
  marginBottom: 16,
}
const row = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 16,
}
const title = {
  fontSize: 18,
  fontWeight: 700,
  color: '#0F172A',
}
const bigNumber = {
  fontSize: 52,
  fontWeight: 800,
  lineHeight: 1,
  marginBottom: 8,
}
const message_style = {
  fontSize: 14,
  color: '#64748B',
  marginBottom: 16,
}
const barBg = {
  width: '100%',
  height: 10,
  background: '#E2E8F0',
  borderRadius: 99,
  overflow: 'hidden',
}
const barFill = {
  height: '100%',
  borderRadius: 99,
  transition: 'width 1s ease',
}