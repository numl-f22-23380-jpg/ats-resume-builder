// StatsCards.jsx
// Shows 4 stat cards at top of admin panel
// Total Users, Pro Users, Revenue, Active Today

export default function StatsCards({ stats }) {
  const cards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: '#2563EB',
      bg: '#EFF6FF',
    },
    {
      label: 'Pro Users',
      value: stats.proUsers,
      icon: '⭐',
      color: '#22C55E',
      bg: '#F0FDF4',
    },
    {
      label: 'Monthly Revenue',
      value: stats.revenue,
      icon: '💰',
      color: '#F59E0B',
      bg: '#FFFBEB',
    },
    {
      label: 'Active Today',
      value: stats.activeToday,
      icon: '🟢',
      color: '#8B5CF6',
      bg: '#F5F3FF',
    },
  ]

  return (
    <div style={grid}>
      {cards.map((card, index) => (
        <div key={index} style={cardBox}>

          {/* ICON */}
          <div style={{
            ...iconCircle,
            background: card.bg,
          }}>
            <span style={{ fontSize: 22 }}>{card.icon}</span>
          </div>

          {/* VALUE + LABEL */}
          <div>
            <p style={{
              ...value,
              color: card.color,
            }}>
              {card.value}
            </p>
            <p style={label}>{card.label}</p>
          </div>

        </div>
      ))}
    </div>
  )
}

// ─── Styles ──────────────────────────────
const grid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr',
  gap: 16,
  marginBottom: 24,
}
const cardBox = {
  background: '#fff',
  borderRadius: 14,
  padding: '20px',
  border: '1px solid #F1F5F9',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  display: 'flex',
  alignItems: 'center',
  gap: 16,
}
const iconCircle = {
  width: 48,
  height: 48,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}
const value = {
  fontSize: 24,
  fontWeight: 800,
  lineHeight: 1,
  marginBottom: 4,
}
const label = {
  fontSize: 13,
  color: '#64748B',
  fontWeight: 500,
}