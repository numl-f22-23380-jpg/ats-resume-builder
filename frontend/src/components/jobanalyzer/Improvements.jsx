export default function Improvements({ improvements }) {
  return (
    <div style={card}>

      {/* HEADER */}
      <div style={row}>
        <span style={{ fontSize: 22 }}>📈</span>
        <h2 style={title}>Suggested Improvements</h2>
      </div>

      <p style={subtitle}>
        Make these changes to improve your match score.
      </p>

      {/* IMPROVEMENTS LIST */}
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {improvements.map((item, index) => (
          <div key={index} style={itemRow}>

            {/* NUMBER CIRCLE */}
            <span style={numberCircle}>{index + 1}</span>

            {/* TEXT CONTENT */}
            <div style={{ flex: 1 }}>
              <p style={itemTitle}>{item.title}</p>
              <p style={itemDesc}>{item.description}</p>
            </div>

            {/* PRIORITY BADGE */}
            <span style={{
              ...priorityBadge,
              background:
                item.priority === 'high'   ? '#FEE2E2' :
                item.priority === 'medium' ? '#FEF9C3' :
                                             '#DCFCE7',
              color:
                item.priority === 'high'   ? '#DC2626' :
                item.priority === 'medium' ? '#CA8A04' :
                                             '#16A34A',
            }}>
              {item.priority}
            </span>

          </div>
        ))}
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
  marginBottom: 8,
}
const title = {
  fontSize: 18,
  fontWeight: 700,
  color: '#0F172A',
}
const subtitle = {
  fontSize: 13,
  color: '#64748B',
  lineHeight: 1.6,
}
const itemRow = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 14,
  padding: '14px 16px',
  borderRadius: 10,
  background: '#F8FAFC',
  border: '1px solid #E2E8F0',
}
const numberCircle = {
  background: '#2563EB',
  color: '#fff',
  fontSize: 12,
  fontWeight: 700,
  width: 24,
  height: 24,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  marginTop: 2,
}
const itemTitle = {
  fontSize: 14,
  fontWeight: 600,
  color: '#0F172A',
  marginBottom: 4,
}
const itemDesc = {
  fontSize: 13,
  color: '#64748B',
  lineHeight: 1.6,
}
const priorityBadge = {
  fontSize: 11,
  fontWeight: 700,
  padding: '3px 10px',
  borderRadius: 20,
  flexShrink: 0,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}
