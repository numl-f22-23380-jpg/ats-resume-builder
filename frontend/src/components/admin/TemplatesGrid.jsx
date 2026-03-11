// TemplatesGrid.jsx
// Shows resume templates in a grid
// Each card has: preview, name, category, active toggle

export default function TemplatesGrid({ templates }) {
  return (
    <div style={card}>

      {/* HEADER */}
      <div style={headerRow}>
        <h3 style={title}>Resume Templates</h3>
        <span style={countBadge}>{templates.length} templates</span>
      </div>

      {/* GRID */}
      <div style={grid}>
        {templates.map((template, index) => (
          <div key={index} style={templateCard}>

            {/* PREVIEW BOX */}
            <div style={{
              ...previewBox,
              background: template.color,
            }}>
              <span style={{ fontSize: 32 }}>{template.icon}</span>
              <p style={previewLabel}>{template.name}</p>
            </div>

            {/* INFO */}
            <div style={infoRow}>
              <div>
                <p style={templateName}>{template.name}</p>
                <p style={templateCategory}>{template.category}</p>
              </div>

              {/* ACTIVE TOGGLE */}
              <div style={{
                ...toggle,
                background: template.active
                  ? '#22C55E' : '#E2E8F0',
              }}>
                <div style={{
                  ...toggleDot,
                  transform: template.active
                    ? 'translateX(20px)'
                    : 'translateX(2px)',
                }} />
              </div>
            </div>

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
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
}
const headerRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 20,
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
const grid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr',
  gap: 16,
}
const templateCard = {
  borderRadius: 12,
  border: '1px solid #F1F5F9',
  overflow: 'hidden',
}
const previewBox = {
  height: 120,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
}
const previewLabel = {
  fontSize: 12,
  fontWeight: 700,
  color: '#fff',
}
const infoRow = {
  padding: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}
const templateName = {
  fontSize: 13,
  fontWeight: 700,
  color: '#0F172A',
  marginBottom: 2,
}
const templateCategory = {
  fontSize: 11,
  color: '#94A3B8',
}
const toggle = {
  width: 44,
  height: 24,
  borderRadius: 99,
  position: 'relative',
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'background 0.2s',
}
const toggleDot = {
  position: 'absolute',
  top: 2,
  width: 20,
  height: 20,
  borderRadius: '50%',
  background: '#fff',
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  transition: 'transform 0.2s',
}