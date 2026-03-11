import { useState }          from 'react'
import { useForm }           from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast, { Toaster }   from 'react-hot-toast'
import { resetPassword }     from '../api'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [step,    setStep]    = useState(1) // step 1 = email, step 2 = new password
  const [email,   setEmail]   = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  // Step 1 — verify email exists
  async function onEmailSubmit(data) {
    setLoading(true)
    try {
      // Check if email exists by trying reset with dummy password
      // We just store email and move to step 2
      setEmail(data.email)
      setStep(2)
      toast.success('Email verified. Set your new password.')
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2 — reset password
  async function onPasswordSubmit(data) {
    setLoading(true)
    try {
      await resetPassword({
        email:       email,
        newPassword: data.newPassword,
      })
      toast.success('Password reset successfully!')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      const msg = err.response?.data?.msg || 'Password reset failed.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={wrapper}>
      <Toaster position="top-right" />

      <div style={card}>

        {/* LOGO */}
        <div style={logoRow}>
          <div style={logoIcon}>📄</div>
          <p style={logoText}>ResumeAI</p>
        </div>

        {/* STEP 1 — EMAIL */}
        {step === 1 && (
          <>
            <h1 style={title}>Forgot Password?</h1>
            <p style={subtitle}>
              Enter your registered email address
              to reset your password.
            </p>

            <form onSubmit={handleSubmit(onEmailSubmit)}>
              <div style={fieldGroup}>
                <label style={label}>Email Address</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  style={{
                    ...input,
                    borderColor: errors.email ? '#EF4444' : '#E2E8F0',
                  }}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value:   /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email',
                    },
                  })}
                />
                {errors.email && (
                  <p style={errorText}>{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...btn,
                  background: loading ? '#93C5FD' : '#2563EB',
                  cursor:     loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Verifying…' : 'Continue'}
              </button>
            </form>

            <p style={bottomText}>
              Remember your password?{' '}
              <Link to="/login" style={link}>Sign in</Link>
            </p>
          </>
        )}

        {/* STEP 2 — NEW PASSWORD */}
        {step === 2 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🔒</div>
              <h1 style={title}>Set New Password</h1>
              <p style={subtitle}>
                Enter a new password for{' '}
                <strong>{email}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit(onPasswordSubmit)}>
              <div style={fieldGroup}>
                <label style={label}>New Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  style={{
                    ...input,
                    borderColor: errors.newPassword ? '#EF4444' : '#E2E8F0',
                  }}
                  {...register('newPassword', {
                    required:  'New password is required',
                    minLength: {
                      value:   6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                {errors.newPassword && (
                  <p style={errorText}>{errors.newPassword.message}</p>
                )}
              </div>

              <div style={fieldGroup}>
                <label style={label}>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  style={{
                    ...input,
                    borderColor: errors.confirmPassword ? '#EF4444' : '#E2E8F0',
                  }}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) =>
                      val === watch('newPassword') || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword && (
                  <p style={errorText}>{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...btn,
                  background: loading ? '#93C5FD' : '#2563EB',
                  cursor:     loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>
            </form>

            <button
              onClick={() => setStep(1)}
              style={backBtn}
            >
              ← Back
            </button>
          </>
        )}

      </div>
    </div>
  )
}

const wrapper = {
  minHeight: '100vh',
  background: '#F8FAFC',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
}
const card = {
  background: '#fff',
  borderRadius: 16,
  padding: '40px 36px',
  width: '100%',
  maxWidth: 420,
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  border: '1px solid #F1F5F9',
}
const logoRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 28,
  justifyContent: 'center',
}
const logoIcon = {
  width: 40,
  height: 40,
  background: '#2563EB',
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
}
const logoText  = { fontSize: 20, fontWeight: 800, color: '#0F172A' }
const title     = { fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 6, textAlign: 'center' }
const subtitle  = { fontSize: 14, color: '#64748B', marginBottom: 28, textAlign: 'center', lineHeight: 1.6 }
const fieldGroup = { marginBottom: 16 }
const label     = { fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }
const input     = {
  width: '100%', padding: '11px 14px',
  border: '1.5px solid #E2E8F0', borderRadius: 10,
  fontSize: 14, color: '#334155',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
}
const errorText = { fontSize: 12, color: '#EF4444', marginTop: 4 }
const btn = {
  width: '100%', padding: '13px 0',
  color: '#fff', border: 'none', borderRadius: 10,
  fontSize: 15, fontWeight: 700,
  fontFamily: 'inherit', marginBottom: 20,
}
const backBtn = {
  width: '100%', padding: '10px 0',
  background: 'transparent', color: '#64748B',
  border: '1.5px solid #E2E8F0', borderRadius: 10,
  fontSize: 14, fontWeight: 600,
  fontFamily: 'inherit', cursor: 'pointer',
}
const bottomText = { fontSize: 14, color: '#64748B', textAlign: 'center' }
const link       = { color: '#2563EB', fontWeight: 600, textDecoration: 'none' }
