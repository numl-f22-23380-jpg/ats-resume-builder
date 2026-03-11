// UpgradeModal.jsx
// Popup that appears when user clicks upgrade
// Confirms the plan before payment
//
// PROPS:
//   plan      → the plan user selected
//   onConfirm → function when user confirms
//   onClose   → function when user closes modal

export default function UpgradeModal({ plan, onConfirm, onClose }) {
  if (!plan) return null

  return (
    <>
      {/* DARK OVERLAY behind modal */}
      <div
        onClick={onClose}
        style={overlay}
      />

      {/* MODAL BOX */}
      <div style={modal}>

        {/* CLOSE BUTTON */}
        <button onClick={onClose} style={closeBtn}>✕</button>

        {/* ICON */}
        <div style={iconCircle}>💳</div>

        {/* TITLE */}
        <h2 style={title}>Upgrade to {plan.name}</h2>
        <p style={subtitle}>
          You are about to upgrade your plan.
        </p>

        {/* PLAN SUMMARY BOX */}
        <div style={summaryBox}>
          <div style={summaryRow}>
            <p style={summaryLabel}>Plan</p>
            <p style={summaryValue}>{plan.name}</p>
          </div>
          <div style={summaryRow}>
            <p style={summaryLabel}>Price</p>
            <p style={summaryValue}>{plan.price}{plan.period}</p>
          </div>
          <div style={summaryRow}>
            <p style={summaryLabel}>Billing</p>
            <p style={summaryValue}>Monthly</p>
          </div>
        </div>

        {/* FEATURES */}
        <div style={{ marginBottom: 24 }}>
          <p style={featuresTitle}>What you get:</p>
          {plan.features.map((feature, index) => (
            <div key={index} style={featureRow}>
              <span style={{ color: '#22C55E' }}>✓</span>
              <p style={featureText}>{feature}</p>
            </div>
          ))}
        </div>

        {/* BUTTONS */}
        <button onClick={onConfirm} style={confirmBtn}>
          Confirm Upgrade
        </button>
        <button onClick={onClose} style={cancelBtn}>
          Cancel
        </button>

      </div>
    </>
  )
}

// ─── Styles ──────────────────────────────
const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  zIndex: 100,
}
const modal = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: '#fff',
  borderRadius: 16,
  padding: '32px',
  width: 440,
  zIndex: 101,
  boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
}
const closeBtn = {
  position: 'absolute',
  top: 16,
  right: 16,
  background: 'transparent',
  border: 'none',
  fontSize: 18,
  color: '#94A3B8',
  cursor: 'pointer',
}
const iconCircle = {
  width: 56,
  height: 56,
  background: '#EFF6FF',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 24,
  margin: '0 auto 16px',
}
const title = {
  fontSize: 22,
  fontWeight: 800,
  color: '#0F172A',
  textAlign: 'center',
  marginBottom: 6,
}
const subtitle = {
  fontSize: 14,
  color: '#64748B',
  textAlign: 'center',
  marginBottom: 20,
}
const summaryBox = {
  background: '#F8FAFC',
  borderRadius: 10,
  padding: '16px',
  border: '1px solid #E2E8F0',
  marginBottom: 20,
}
const summaryRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 8,
}
const summaryLabel = {
  fontSize: 13,
  color: '#94A3B8',
}
const summaryValue = {
  fontSize: 13,
  fontWeight: 700,
  color: '#0F172A',
}
const featuresTitle = {
  fontSize: 13,
  fontWeight: 600,
  color: '#475569',
  marginBottom: 10,
}
const featureRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 8,
}
const featureText = {
  fontSize: 13,
  color: '#334155',
}
const confirmBtn = {
  width: '100%',
  padding: '13px 0',
  background: '#2563EB',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  fontSize: 15,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  marginBottom: 10,
}
const cancelBtn = {
  width: '100%',
  padding: '13px 0',
  background: '#fff',
  color: '#64748B',
  border: '1.5px solid #E2E8F0',
  borderRadius: 10,
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
}