// PricingCard.jsx
export default function PricingCard({ plan, onUpgrade, isCurrentPlan }) {
  return (
    <div style={{
      ...card,
      border: isCurrentPlan
        ? '2px solid #22C55E'
        : plan.popular
          ? '2px solid #2563EB'
          : '1px solid #E2E8F0',
      position: 'relative',
    }}>

      {/* CURRENT PLAN BADGE */}
      {isCurrentPlan && (
        <div style={currentBadge}>
          ✓ Current Plan
        </div>
      )}

      {/* POPULAR BADGE — only show if not current plan */}
      {plan.popular && !isCurrentPlan && (
        <div style={popularBadge}>
          ⭐ Most Popular
        </div>
      )}

      {/* PLAN NAME */}
      <h3 style={planName}>{plan.name}</h3>

      {/* PRICE */}
      <div style={priceRow}>
        <span style={price}>{plan.price}</span>
        {plan.period && (
          <span style={period}>{plan.period}</span>
        )}
      </div>

      {/* DESCRIPTION */}
      <p style={description}>{plan.description}</p>

      {/* DIVIDER */}
      <div style={divider} />

      {/* FEATURES LIST */}
      <div style={{ marginBottom: 24 }}>
        {plan.features.map((feature, index) => (
          <div key={index} style={featureRow}>
            <span style={{ color: '#22C55E', fontSize: 16 }}>✓</span>
            <p style={featureText}>{feature}</p>
          </div>
        ))}
      </div>

      {/* BUTTON */}
      <button
        onClick={() => onUpgrade(plan)}
        disabled={isCurrentPlan}
        style={{
          ...btn,
          background: isCurrentPlan
            ? '#F0FDF4'
            : plan.popular
              ? '#2563EB'
              : '#fff',
          color: isCurrentPlan
            ? '#16A34A'
            : plan.popular
              ? '#fff'
              : '#2563EB',
          border: isCurrentPlan
            ? '2px solid #22C55E'
            : plan.popular
              ? 'none'
              : '2px solid #2563EB',
          cursor: isCurrentPlan ? 'default' : 'pointer',
        }}
      >
        {isCurrentPlan ? '✓ Current Plan' : plan.buttonLabel}
      </button>

    </div>
  )
}

const card = {
  background: '#fff',
  borderRadius: 16,
  padding: '28px 24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)',
  display: 'flex',
  flexDirection: 'column',
}
const currentBadge = {
  position: 'absolute',
  top: -14,
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#22C55E',
  color: '#fff',
  fontSize: 12,
  fontWeight: 700,
  padding: '4px 14px',
  borderRadius: 20,
  whiteSpace: 'nowrap',
}
const popularBadge = {
  position: 'absolute',
  top: -14,
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#2563EB',
  color: '#fff',
  fontSize: 12,
  fontWeight: 700,
  padding: '4px 14px',
  borderRadius: 20,
  whiteSpace: 'nowrap',
}
const planName = {
  fontSize: 20,
  fontWeight: 800,
  color: '#0F172A',
  marginBottom: 12,
}
const priceRow = {
  display: 'flex',
  alignItems: 'flex-end',
  gap: 4,
  marginBottom: 8,
}
const price = {
  fontSize: 36,
  fontWeight: 800,
  color: '#0F172A',
}
const period = {
  fontSize: 14,
  color: '#94A3B8',
  marginBottom: 6,
}
const description = {
  fontSize: 14,
  color: '#64748B',
  lineHeight: 1.6,
  marginBottom: 16,
}
const divider = {
  height: 1,
  background: '#F1F5F9',
  marginBottom: 16,
}
const featureRow = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  marginBottom: 10,
}
const featureText = {
  fontSize: 14,
  color: '#334155',
  lineHeight: 1.5,
}
const btn = {
  width: '100%',
  padding: '13px 0',
  borderRadius: 10,
  fontSize: 15,
  fontWeight: 700,
  fontFamily: 'inherit',
  transition: 'all 0.15s',
}