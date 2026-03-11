import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import Layout                  from '../components/shared/Layout'
import { subscribe, getSubscription } from '../api'
import useAuthStore            from '../store/authStore'
import toast, { Toaster }      from 'react-hot-toast'

const PLANS = [
  {
    id:         'free',
    name:       'Free',
    price:      0,
    priceLabel: '$0',
    period:     '',
    color:      '#64748B',
    description:'Perfect for getting started.',
    popular:    false,
    features: [
      { text: '1 resume only',                       included: true  },
      { text: '3 templates (Classic, Minimal, Fresh)',included: true  },
      { text: 'Basic ATS score',                     included: true  },
      { text: 'Basic keyword analysis',              included: true  },
      { text: 'PDF download',                        included: false },
      { text: 'All 8 templates',                     included: false },
      { text: 'Advanced ATS + Job Match',            included: false },
      { text: 'AI suggestions',                      included: false },
      { text: 'Unlimited resumes',                   included: false },
    ],
  },
  {
    id:         'pro',
    name:       'Pro',
    price:      9.99,
    priceLabel: '$9.99',
    period:     '/month',
    color:      '#2563EB',
    description:'Everything you need to land your dream job.',
    popular:    true,
    features: [
      { text: 'Unlimited resumes',        included: true  },
      { text: 'All 8 templates',          included: true  },
      { text: 'PDF download',             included: true  },
      { text: 'Advanced ATS + Job Match', included: true  },
      { text: 'AI suggestions',           included: true  },
      { text: 'Priority support',         included: true  },
      { text: 'Custom branding',          included: false },
      { text: 'Team management',          included: false },
      { text: 'API access',               included: false },
    ],
  },
  {
    id:         'enterprise',
    name:       'Enterprise',
    price:      29.99,
    priceLabel: '$29.99',
    period:     '/month',
    color:      '#7C3AED',
    description:'For teams and organizations hiring at scale.',
    popular:    false,
    features: [
      { text: 'Everything in Pro',        included: true },
      { text: 'Team management',          included: true },
      { text: 'Custom branding',          included: true },
      { text: 'API access',               included: true },
      { text: 'Analytics dashboard',      included: true },
      { text: 'Dedicated support',        included: true },
      { text: 'Unlimited team members',   included: true },
      { text: 'Custom integrations',      included: true },
      { text: 'SLA guarantee',            included: true },
    ],
  },
]

const PLAN_RANK = { free: 0, pro: 1, enterprise: 2 }

const DOWNGRADE_LOSSES = {
  free: [
    'Access to Pro/Enterprise templates',
    'PDF download',
    'AI suggestions',
    'Advanced ATS analysis',
    'Resumes beyond your first one will become read-only',
  ],
  pro: [
    'Team management features',
    'Custom branding',
    'API access',
    'Dedicated support & SLA',
  ],
}

const EMPTY_FORM = {
  cardName: '', cardNumber: '', expiry: '', cvv: '', email: '',
}

export default function SubscriptionPage() {
  const navigate   = useNavigate()
  const user       = useAuthStore((s) => s.user)
  const loginStore = useAuthStore((s) => s.login)

  const [currentPlan,     setCurrentPlan]     = useState('free')
  const [loading,         setLoading]         = useState(true)
  const [selectedPlan,    setSelectedPlan]    = useState(null)
  const [paymentStep,     setPaymentStep]     = useState(false)
  const [downgradeModal,  setDowngradeModal]  = useState(false)
  const [processing,      setProcessing]      = useState(false)
  const [form,            setForm]            = useState(EMPTY_FORM)
  const [errors,          setErrors]          = useState({})
  const [billingCycle,    setBillingCycle]    = useState('monthly')

  useEffect(() => {
    async function fetchSub() {
      try {
        const res = await getSubscription()
        setCurrentPlan(res.data.plan || 'free')
      } catch {
        setCurrentPlan('free')
      } finally {
        setLoading(false)
      }
    }
    fetchSub()
  }, [])

  function handleSelectPlan(plan) {
    if (plan.id === currentPlan) {
      toast('You are already on this plan.', { icon: '💡' })
      return
    }

    const isDowngrade = PLAN_RANK[plan.id] < PLAN_RANK[currentPlan]

    if (isDowngrade) {
      setSelectedPlan(plan)
      setDowngradeModal(true)
      return
    }

    // Upgrade flow
    setSelectedPlan(plan)
    setPaymentStep(true)
    setForm(EMPTY_FORM)
    setErrors({})
  }

  async function handleDowngradeConfirm() {
    setProcessing(true)
    try {
      await subscribe({ plan: selectedPlan.id, paymentId: 'downgrade_' + Date.now() })
      setCurrentPlan(selectedPlan.id)
      setDowngradeModal(false)
      setSelectedPlan(null)
      toast.success(`Downgraded to ${selectedPlan.name} plan.`)
      navigate('/dashboard')
    } catch {
      toast.error('Failed to change plan. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  function handleFormChange(field, value) {
    let v = value
    if (field === 'cardNumber') {
      v = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    }
    if (field === 'expiry') {
      v = value.replace(/\D/g, '').slice(0, 4)
      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2)
    }
    if (field === 'cvv') {
      v = value.replace(/\D/g, '').slice(0, 4)
    }
    setForm(prev => ({ ...prev, [field]: v }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.cardName.trim())
      e.cardName = 'Cardholder name is required'
    if (form.cardNumber.replace(/\s/g, '').length !== 16)
      e.cardNumber = 'Enter a valid 16-digit card number'
    if (!/^\d{2}\/\d{2}$/.test(form.expiry))
      e.expiry = 'Enter expiry as MM/YY'
    else {
      const [mm, yy] = form.expiry.split('/')
      if (new Date(2000 + parseInt(yy), parseInt(mm) - 1) < new Date())
        e.expiry = 'Card has expired'
    }
    if (form.cvv.length < 3) e.cvv = 'CVV must be 3–4 digits'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Valid email is required'
    return e
  }

  async function handlePayment() {
    const e = validate()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      toast.error('Please fix the errors below.')
      return
    }
    setProcessing(true)
    try {
      await new Promise(r => setTimeout(r, 2000))
      await subscribe({ plan: selectedPlan.id, paymentId: 'card_' + Date.now() })
      setCurrentPlan(selectedPlan.id)
      const planName = selectedPlan.id
      setPaymentStep(false)
      setSelectedPlan(null)
      toast.success('🎉 Payment successful! Welcome to ' + selectedPlan.name + '!')
      navigate('/payment-success', { state: { plan: planName } })
    } catch {
      toast.error('Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  // ─── DOWNGRADE MODAL ─────────────────────
  if (downgradeModal && selectedPlan) {
    const losses = DOWNGRADE_LOSSES[selectedPlan.id] || []
    return (
      <Layout>
        <Toaster position="top-right" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={dm.box}>
            <div style={dm.iconRow}>
              <span style={{ fontSize: 40 }}>⚠️</span>
            </div>
            <h2 style={dm.title}>Downgrade to {selectedPlan.name}?</h2>
            <p style={dm.subtitle}>
              You are currently on <strong>{currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</strong>.
              Downgrading will remove the following features immediately:
            </p>
            <div style={dm.lossList}>
              {losses.map((loss, i) => (
                <div key={i} style={dm.lossRow}>
                  <span style={{ color: '#EF4444', fontSize: 14, flexShrink: 0 }}>✗</span>
                  <p style={{ fontSize: 13, color: '#334155' }}>{loss}</p>
                </div>
              ))}
            </div>
            <div style={dm.noteBox}>
              <p style={{ fontSize: 12, color: '#92400E' }}>
                ⚠️ This change takes effect immediately. You will not receive a refund for the
                remaining days of your current billing period.
              </p>
            </div>
            <div style={dm.btnRow}>
              <button
                onClick={() => { setDowngradeModal(false); setSelectedPlan(null) }}
                style={dm.cancelBtn}
              >
                Keep {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
              </button>
              <button
                onClick={handleDowngradeConfirm}
                disabled={processing}
                style={{
                  ...dm.confirmBtn,
                  background: processing ? '#FCA5A5' : '#EF4444',
                  cursor: processing ? 'not-allowed' : 'pointer',
                }}
              >
                {processing ? 'Downgrading...' : `Yes, downgrade to ${selectedPlan.name}`}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // ─── PAYMENT FORM ────────────────────────
  if (paymentStep && selectedPlan) {
    const yearly = billingCycle === 'yearly'
    const total  = yearly
      ? (selectedPlan.price * 12 * 0.83).toFixed(2)
      : selectedPlan.price.toFixed(2)

    return (
      <Layout>
        <Toaster position="top-right" />
        <div style={ps.wrapper}>

          {/* LEFT — ORDER SUMMARY */}
          <div style={ps.summary}>
            <button onClick={() => setPaymentStep(false)} style={ps.backBtn}>
              ← Back to Plans
            </button>
            <div style={{ marginTop: 24 }}>
              <p style={ps.summaryLabel}>Order Summary</p>

              <div style={{ ...ps.planBadge, background: selectedPlan.color }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{selectedPlan.name}</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{selectedPlan.description}</p>
              </div>

              {/* Billing toggle */}
              <div style={ps.billingToggle}>
                <button
                  onClick={() => setBillingCycle('monthly')}
                  style={{ ...ps.toggleBtn, background: !yearly ? '#2563EB' : '#F1F5F9', color: !yearly ? '#fff' : '#475569' }}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  style={{ ...ps.toggleBtn, background: yearly ? '#2563EB' : '#F1F5F9', color: yearly ? '#fff' : '#475569' }}
                >
                  Yearly
                  <span style={{ fontSize: 10, marginLeft: 4, background: '#DCFCE7', color: '#16A34A', padding: '1px 6px', borderRadius: 10 }}>
                    Save 17%
                  </span>
                </button>
              </div>

              {/* Price breakdown */}
              <div style={ps.priceBox}>
                <div style={ps.priceRow}>
                  <span style={{ fontSize: 13, color: '#64748B' }}>{selectedPlan.name} Plan</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    ${yearly ? (selectedPlan.price * 12).toFixed(2) : selectedPlan.price.toFixed(2)}
                  </span>
                </div>
                {yearly && (
                  <div style={ps.priceRow}>
                    <span style={{ fontSize: 12, color: '#16A34A' }}>Yearly discount (17%)</span>
                    <span style={{ fontSize: 12, color: '#16A34A' }}>
                      -${(selectedPlan.price * 12 * 0.17).toFixed(2)}
                    </span>
                  </div>
                )}
                <div style={{ height: 1, background: '#E2E8F0', margin: '10px 0' }} />
                <div style={ps.priceRow}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>
                    Total {yearly ? '/ year' : '/ month'}
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: selectedPlan.color }}>
                    ${total}
                  </span>
                </div>
              </div>

              {/* What you get */}
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 10, letterSpacing: 1 }}>
                WHAT YOU GET
              </p>
              {selectedPlan.features.filter(f => f.included).map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ color: '#22C55E', fontSize: 13, flexShrink: 0 }}>✓</span>
                  <p style={{ fontSize: 12, color: '#334155' }}>{f.text}</p>
                </div>
              ))}

              <div style={ps.secureNote}>
                🔒 256-bit SSL &nbsp;|&nbsp; Cancel anytime &nbsp;|&nbsp; 30-day refund
              </div>
            </div>
          </div>

          {/* RIGHT — PAYMENT FORM */}
          <div style={ps.formBox}>
            <h2 style={ps.formTitle}>Payment Details</h2>
            <p style={ps.formSubtitle}>
              Enter your card information to complete the purchase.
            </p>

            <FormField
              label="Email Address"
              placeholder="you@example.com"
              value={form.email}
              onChange={v => handleFormChange('email', v)}
              error={errors.email}
              type="email"
            />

            <div style={{ height: 1, background: '#F1F5F9', margin: '18px 0' }} />
            <p style={ps.sectionLabel}>Card Information</p>

            <FormField
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={form.cardNumber}
              onChange={v => handleFormChange('cardNumber', v)}
              error={errors.cardNumber}
              maxLength={19}
              suffix={
                <div style={{ display: 'flex', gap: 4 }}>
                  <span style={{ fontSize: 18 }}>💳</span>
                </div>
              }
            />

            <FormField
              label="Cardholder Name"
              placeholder="Name as it appears on card"
              value={form.cardName}
              onChange={v => handleFormChange('cardName', v)}
              error={errors.cardName}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <FormField
                label="Expiry Date"
                placeholder="MM/YY"
                value={form.expiry}
                onChange={v => handleFormChange('expiry', v)}
                error={errors.expiry}
                maxLength={5}
              />
              <FormField
                label="CVV"
                placeholder="•••"
                value={form.cvv}
                onChange={v => handleFormChange('cvv', v)}
                error={errors.cvv}
                type="password"
                maxLength={4}
              />
            </div>

            <button
              onClick={handlePayment}
              disabled={processing}
              style={{
                ...ps.payBtn,
                background: processing ? '#93C5FD' : selectedPlan.color,
                cursor: processing ? 'not-allowed' : 'pointer',
              }}
            >
              {processing ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={ps.spinner} /> Processing payment...
                </span>
              ) : (
                `🔒 Pay $${total} ${yearly ? '/ year' : '/ month'}`
              )}
            </button>

            <p style={ps.terms}>
              By completing this purchase you agree to our Terms of Service and Privacy Policy.
              Your subscription will auto-renew. Cancel anytime from your account settings.
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  // ─── PLANS PAGE ──────────────────────────
  return (
    <Layout>
      <Toaster position="top-right" />

      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={pl.title}>Choose Your Plan</h1>
        <p style={pl.subtitle}>Start free. Upgrade anytime. Downgrade anytime.</p>
        {!loading && (
          <div style={pl.currentBadge}>
            Current Plan:
            <span style={pl.planName}>
              {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
            </span>
          </div>
        )}
      </div>

      <div style={pl.grid}>
        {PLANS.map((plan) => {
          const isDowngrade = PLAN_RANK[plan.id] < PLAN_RANK[currentPlan]
          const isUpgrade   = PLAN_RANK[plan.id] > PLAN_RANK[currentPlan]
          const isCurrent   = plan.id === currentPlan
          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={isCurrent}
              isDowngrade={isDowngrade}
              isUpgrade={isUpgrade}
              onSelect={() => handleSelectPlan(plan)}
            />
          )
        })}
      </div>

      <p style={pl.note}>
        🔒 Secure payment &nbsp;|&nbsp; Cancel anytime &nbsp;|&nbsp; 30-day money back guarantee
      </p>
    </Layout>
  )
}

// ─── PLAN CARD ───────────────────────────────────────────
function PlanCard({ plan, isCurrent, isDowngrade, isUpgrade, onSelect }) {
  return (
    <div style={{
      ...pc.card,
      border: isCurrent
        ? '2px solid #22C55E'
        : plan.popular
          ? `2px solid ${plan.color}`
          : '1px solid #E2E8F0',
      transform: plan.popular && !isCurrent ? 'scale(1.02)' : 'scale(1)',
    }}>

      {/* BADGES */}
      {isCurrent && (
        <div style={{ ...pc.badge, background: '#22C55E' }}>✓ Current Plan</div>
      )}
      {plan.popular && !isCurrent && (
        <div style={{ ...pc.badge, background: plan.color }}>⭐ Most Popular</div>
      )}

      <div style={{ ...pc.colorBar, background: plan.color }} />

      <div style={pc.body}>
        <p style={pc.planName}>{plan.name}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
          <span style={{ ...pc.price, color: plan.color }}>{plan.priceLabel}</span>
          <span style={pc.period}>{plan.period}</span>
        </div>
        <p style={pc.desc}>{plan.description}</p>

        <div style={{ height: 1, background: '#F1F5F9', margin: '16px 0' }} />

        <div style={pc.featureList}>
          {plan.features.map((f, i) => (
            <div key={i} style={pc.featureRow}>
              <span style={{ color: f.included ? '#22C55E' : '#CBD5E1', fontSize: 13, flexShrink: 0 }}>
                {f.included ? '✓' : '✗'}
              </span>
              <p style={{ fontSize: 12, color: f.included ? '#334155' : '#CBD5E1' }}>
                {f.text}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onSelect}
          disabled={isCurrent}
          style={{
            ...pc.btn,
            background: isCurrent  ? '#F1F5F9'
                      : isDowngrade ? '#FEF2F2'
                      : plan.id === 'free' ? '#F8FAFC'
                      : plan.color,
            color: isCurrent   ? '#94A3B8'
                 : isDowngrade ? '#EF4444'
                 : plan.id === 'free' ? '#475569'
                 : '#fff',
            cursor: isCurrent ? 'not-allowed' : 'pointer',
            border: isDowngrade ? '1.5px solid #FECACA'
                  : plan.id === 'free' && !isCurrent ? '1.5px solid #E2E8F0'
                  : 'none',
          }}
        >
          {isCurrent    ? '✓ Current Plan'
         : isDowngrade  ? `↓ Downgrade to ${plan.name}`
         : plan.id === 'free' ? 'Get Started Free'
         : `↑ Upgrade to ${plan.name} →`}
        </button>
      </div>
    </div>
  )
}

// ─── FORM FIELD ──────────────────────────────────────────
function FormField({ label, placeholder, value, onChange, error, type = 'text', maxLength, suffix }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: suffix ? '11px 48px 11px 14px' : '11px 14px',
            border: `1.5px solid ${error ? '#EF4444' : '#E2E8F0'}`,
            borderRadius: 10,
            fontSize: 14,
            fontFamily: 'inherit',
            outline: 'none',
            boxSizing: 'border-box',
            background: '#FAFAFA',
          }}
          onFocus={e  => e.target.style.borderColor = error ? '#EF4444' : '#2563EB'}
          onBlur={e   => e.target.style.borderColor = error ? '#EF4444' : '#E2E8F0'}
        />
        {suffix && (
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
            {suffix}
          </div>
        )}
      </div>
      {error && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{error}</p>}
    </div>
  )
}

// ─── STYLES ──────────────────────────────────────────────

const dm = {
  box:        { background: '#fff', borderRadius: 20, padding: 40, maxWidth: 500, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', border: '1px solid #F1F5F9' },
  iconRow:    { textAlign: 'center', marginBottom: 16 },
  title:      { fontSize: 22, fontWeight: 800, color: '#0F172A', textAlign: 'center', marginBottom: 8 },
  subtitle:   { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 1.6, marginBottom: 20 },
  lossList:   { background: '#FEF2F2', borderRadius: 12, padding: '16px', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 },
  lossRow:    { display: 'flex', alignItems: 'flex-start', gap: 10 },
  noteBox:    { background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '12px 14px', marginBottom: 24 },
  btnRow:     { display: 'flex', gap: 12 },
  cancelBtn:  { flex: 1, padding: '12px 0', background: '#fff', color: '#0F172A', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  confirmBtn: { flex: 1, padding: '12px 0', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: 'inherit' },
}

const ps = {
  wrapper:      { display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 32, maxWidth: 900, margin: '0 auto', alignItems: 'start' },
  summary:      { background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  backBtn:      { background: 'none', border: 'none', fontSize: 14, fontWeight: 600, color: '#64748B', cursor: 'pointer', fontFamily: 'inherit', padding: 0 },
  summaryLabel: { fontSize: 12, fontWeight: 700, color: '#94A3B8', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 },
  planBadge:    { borderRadius: 12, padding: '16px', marginBottom: 16, textAlign: 'center' },
  billingToggle:{ display: 'flex', background: '#F1F5F9', borderRadius: 10, padding: 3, marginBottom: 16 },
  toggleBtn:    { flex: 1, padding: '8px 0', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 },
  priceBox:     { background: '#F8FAFC', borderRadius: 10, padding: '14px', border: '1px solid #E2E8F0', marginBottom: 20 },
  priceRow:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  secureNote:   { fontSize: 11, color: '#94A3B8', textAlign: 'center', marginTop: 20, padding: '8px', background: '#F8FAFC', borderRadius: 8 },
  formBox:      { background: '#fff', borderRadius: 16, padding: 32, border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  formTitle:    { fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 6 },
  formSubtitle: { fontSize: 14, color: '#64748B', marginBottom: 24 },
  sectionLabel: { fontSize: 12, fontWeight: 700, color: '#94A3B8', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 },
  payBtn:       { width: '100%', padding: '14px 0', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: 'inherit', marginTop: 8, marginBottom: 16 },
  terms:        { fontSize: 11, color: '#94A3B8', textAlign: 'center', lineHeight: 1.6 },
  spinner:      { width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' },
}

const pl = {
  title:       { fontSize: 32, fontWeight: 800, color: '#0F172A', marginBottom: 10 },
  subtitle:    { fontSize: 16, color: '#64748B' },
  currentBadge:{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '6px 16px', background: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: 20, fontSize: 13, color: '#64748B' },
  planName:    { fontWeight: 700, color: '#16A34A', marginLeft: 4 },
  grid:        { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, alignItems: 'start', marginBottom: 32 },
  note:        { textAlign: 'center', fontSize: 14, color: '#94A3B8' },
}

const pc = {
  card:        { background: '#fff', borderRadius: 16, overflow: 'hidden', position: 'relative', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  badge:       { position: 'absolute', top: 16, right: 16, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20 },
  colorBar:    { height: 5 },
  body:        { padding: '20px 22px 24px' },
  planName:    { fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 6 },
  price:       { fontSize: 36, fontWeight: 800 },
  period:      { fontSize: 14, color: '#94A3B8' },
  desc:        { fontSize: 13, color: '#64748B', lineHeight: 1.5 },
  featureList: { marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 },
  featureRow:  { display: 'flex', alignItems: 'flex-start', gap: 8 },
  btn:         { width: '100%', padding: '12px 0', borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: 'inherit' },
}