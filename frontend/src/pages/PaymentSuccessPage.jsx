import { useNavigate, useLocation } from 'react-router-dom'
import Layout from '../components/shared/Layout'

export default function PaymentSuccessPage() {
  const navigate  = useNavigate()
  const location  = useLocation()

  // Get plan name passed from SubscriptionPage
  const planName  = location.state?.plan || 'Pro'
  const planUpper = planName.charAt(0).toUpperCase() + planName.slice(1)

  // Features based on plan
  const proFeatures = [
    { icon: '🤖', label: 'AI Suggestions'      },
    { icon: '📊', label: 'Advanced ATS'        },
    { icon: '📄', label: 'Unlimited Resumes'   },
    { icon: '🎨', label: 'Premium Templates'   },
    { icon: '📥', label: 'Unlimited Downloads' },
    { icon: '⚡', label: 'Priority Support'    },
  ]

  const enterpriseFeatures = [
    { icon: '🤖', label: 'AI Suggestions'      },
    { icon: '👥', label: 'Team Management'     },
    { icon: '🎨', label: 'Custom Templates'    },
    { icon: '🔌', label: 'API Access'          },
    { icon: '🛡️', label: 'Dedicated Support'   },
    { icon: '📈', label: 'Analytics Dashboard' },
  ]

  const features = planName === 'enterprise'
    ? enterpriseFeatures
    : proFeatures

  return (
    <Layout>
      <div style={wrapper}>

        {/* SUCCESS ICON */}
        <div style={iconCircle}>✓</div>

        {/* TITLE */}
        <h1 style={title}>Payment Successful!</h1>
        <p style={subtitle}>
          Welcome to {planUpper}. Your account has been upgraded.
        </p>

        {/* WHAT YOU GET BOX */}
        <div style={box}>
          <h3 style={boxTitle}>You now have access to:</h3>
          <div style={featureGrid}>
            {features.map((item, index) => (
              <div key={index} style={featureItem}>
                <span style={{ fontSize: 24 }}>{item.icon}</span>
                <p style={featureLabel}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div style={btnRow}>
          <button
            onClick={() => navigate('/ats')}
            style={primaryBtn}
          >
            Go to ATS Analyzer
          </button>
          <button
            onClick={() => navigate('/subscription')}
            style={secondaryBtn}
          >
            View My Plan
          </button>
        </div>

        <p style={note}>
          A confirmation email has been sent to your inbox.
        </p>

      </div>
    </Layout>
  )
}

const wrapper    = { maxWidth: 560, margin: '40px auto', textAlign: 'center' }
const iconCircle = {
  width: 72, height: 72, background: '#22C55E',
  borderRadius: '50%', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
  fontSize: 32, color: '#fff', fontWeight: 800,
  margin: '0 auto 24px',
}
const title       = { fontSize: 28, fontWeight: 800, color: '#0F172A', marginBottom: 10 }
const subtitle    = { fontSize: 16, color: '#64748B', marginBottom: 32 }
const box         = {
  background: '#fff', borderRadius: 14, padding: '24px',
  border: '1px solid #F1F5F9',
  boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
  marginBottom: 28, textAlign: 'left',
}
const boxTitle    = { fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 16 }
const featureGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }
const featureItem = {
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', gap: 8,
  padding: '16px 8px', background: '#F8FAFC',
  borderRadius: 10, border: '1px solid #E2E8F0',
}
const featureLabel = { fontSize: 12, fontWeight: 600, color: '#475569', textAlign: 'center' }
const btnRow       = { display: 'flex', gap: 12, marginBottom: 20 }
const primaryBtn   = {
  flex: 1, padding: '13px 0', background: '#2563EB',
  color: '#fff', border: 'none', borderRadius: 10,
  fontSize: 15, fontWeight: 700, cursor: 'pointer',
  fontFamily: 'inherit',
}
const secondaryBtn = {
  flex: 1, padding: '13px 0', background: '#fff',
  color: '#2563EB', border: '2px solid #2563EB',
  borderRadius: 10, fontSize: 15, fontWeight: 700,
  cursor: 'pointer', fontFamily: 'inherit',
}
const note = { fontSize: 13, color: '#94A3B8' }