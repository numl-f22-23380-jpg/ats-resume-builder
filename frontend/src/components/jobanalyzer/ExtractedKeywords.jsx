export default function ExtractedKeywords({ keywords, matchedKeywords }) {

  return (
    <div style={card}>

      {/* HEADER */}
      <div style={row}>
        <span style={{ fontSize: 22 }}>🔑</span>
        <h2 style={title}>Extracted Keywords</h2>
        <span style={countBadge}>{keywords.length} found</span>
      </div>

      <p style={subtitle}>
        Keywords extracted from the job description.
        Green means your resume has it. Red means it is missing.
      </p>

      {/* KEYWORDS */}
      <div style={{ marginTop: 16 }}>
        {keywords.map((word) => {

          // Check if this keyword exists in matched list
          const isMatched = matchedKeywords.includes(word)

          return (
            <span
              key={word}
              style={{
                display: 'inline-block',
                padding: '5px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                marginRight: 8,
                marginBottom: 8,
                border: `1.5px solid ${isMatched ? '#22C55E' : '#EF4444'}`,
                color:      isMatched ? '#16A34A' : '#DC2626',
                background: isMatched ? '#F0FDF4' : '#FFF5F5',
              }}
            >
              {/* Show checkmark or x based on match */}
              {isMatched ? '✓' : '✗'} {word}
            </span>
          )
        })}
      </div>

      {/* SUMMARY ROW */}
      <div style={summaryRow}>
        <div style={summaryBox}>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#22C55E' }}>
            {matchedKeywords.length}
          </p>
          <p style={{ fontSize: 13, color: '#64748B' }}>Matched</p>
        </div>
        <div style={summaryBox}>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#EF4444' }}>
            {keywords.length - matchedKeywords.length}
          </p>
          <p style={{ fontSize: 13, color: '#64748B' }}>Missing</p>
        </div>
        <div style={summaryBox}>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#2563EB' }}>
            {keywords.length}
          </p>
          <p style={{ fontSize: 13, color: '#64748B' }}>Total</p>
        </div>
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
  flex: 1,
}
const countBadge = {
  background: '#EFF6FF',
  color: '#2563EB',
  fontSize: 12,
  fontWeight: 700,
  padding: '4px 10px',
  borderRadius: 20,
}
const subtitle = {
  fontSize: 13,
  color: '#64748B',
  lineHeight: 1.6,
}
const summaryRow = {
  display: 'flex',
  gap: 12,
  marginTop: 20,
}
const summaryBox = {
  flex: 1,
  background: '#F8FAFC',
  borderRadius: 10,
  padding: '12px 16px',
  border: '1px solid #E2E8F0',
  textAlign: 'center',
}
