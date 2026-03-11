export default function ScoreCard({ score, matched, missing }) {

  const radius        = 70
  const circumference = 2 * Math.PI * radius
  const filled        = (score / 100) * circumference

  const color =
    score >= 70 ? '#22C55E' :
    score >= 45 ? '#F59E0B' :
                  '#EF4444'

  const message =
    score >= 70 ? 'Great match! Your resume is well-optimized.' :
    score >= 45 ? 'Good start. Add more keywords to improve your chances.' :
                  'Needs improvement. Review the missing keywords.'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>

      {/* RING */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width={170} height={170} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={85} cy={85} r={radius}
            fill="none" stroke="#E2E8F0" strokeWidth={13} />
          <circle cx={85} cy={85} r={radius}
            fill="none" stroke={color} strokeWidth={13}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference - filled}`}
            style={{ transition: 'stroke-dasharray 1.2s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: 34, fontWeight: 800, color }}>{score}%</span>
        </div>
      </div>

      {/* TEXT */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
          Overall Match Score
        </h2>
        <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, maxWidth: 260 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <span style={greenPill}>✓ {matched} Matched</span>
          <span style={redPill}>✗ {missing} Missing</span>
        </div>
      </div>

    </div>
  )
}

const greenPill = {
  background: '#DCFCE7', color: '#16A34A',
  fontSize: 13, fontWeight: 700, padding: '5px 14px', borderRadius: 20,
}
const redPill = {
  background: '#FEE2E2', color: '#DC2626',
  fontSize: 13, fontWeight: 700, padding: '5px 14px', borderRadius: 20,
}