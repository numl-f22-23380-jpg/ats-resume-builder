// LoginPage.jsx
// Full screen login page
// No sidebar — centered layout
// Uses react-hook-form for form handling
// Uses zustand to store user after login
import { loginUser } from '../api'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import toast, { Toaster } from 'react-hot-toast'

export default function LoginPage() {
  const navigate    = useNavigate()
  const login       = useAuthStore((state) => state.login)
  const [loading, setLoading] = useState(false)

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // Runs when user clicks Login button
  async function onSubmit(data) {
    setLoading(true)

    try {
      // MOCK — replace with real axios when backend ready
      // const res = await axios.post('/api/login', {
      //   email:    data.email,
      //   password: data.password,
      // })
      // login(res.data.user, res.data.token)

      const res = await loginUser({
  email:    data.email,
  password: data.password,
})

login(res.data.user, res.data.token)
localStorage.setItem('token', res.data.token)
      toast.success('Login successful!')
      navigate('/dashboard')

    } catch (err) {
      toast.error('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={wrapper}>
      <Toaster position="top-right" />

      {/* CARD */}
      <div style={card}>

        {/* LOGO */}
        <div style={logoRow}>
          <div style={logoIcon}>📄</div>
          <p style={logoText}>ResumeAI</p>
        </div>

        {/* TITLE */}
        <h1 style={title}>Welcome back</h1>
        <p style={subtitle}>Sign in to your account to continue</p>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* EMAIL */}
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
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email',
                },
              })}
            />
            {errors.email && (
              <p style={errorText}>{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div style={fieldGroup}>
            <label style={label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              style={{
                ...input,
                borderColor: errors.password ? '#EF4444' : '#E2E8F0',
              }}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <p style={errorText}>{errors.password.message}</p>
            )}
          </div>

          {/* FORGOT PASSWORD LINK */}
          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <Link to="/forgot-password" style={link}>
              Forgot password?
            </Link>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...btn,
              background: loading ? '#93C5FD' : '#2563EB',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

        </form>

        {/* REGISTER LINK */}
        <p style={bottomText}>
          Don't have an account?{' '}
          <Link to="/register" style={link}>
            Create one
          </Link>
        </p>

      </div>
    </div>
  )
}

// ─── Styles ──────────────────────────────
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
const logoText = {
  fontSize: 20,
  fontWeight: 800,
  color: '#0F172A',
}
const title = {
  fontSize: 24,
  fontWeight: 800,
  color: '#0F172A',
  marginBottom: 6,
  textAlign: 'center',
}
const subtitle = {
  fontSize: 14,
  color: '#64748B',
  marginBottom: 28,
  textAlign: 'center',
}
const fieldGroup = {
  marginBottom: 16,
}
const label = {
  fontSize: 13,
  fontWeight: 600,
  color: '#475569',
  display: 'block',
  marginBottom: 6,
}
const input = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid #E2E8F0',
  borderRadius: 10,
  fontSize: 14,
  color: '#334155',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
}
const errorText = {
  fontSize: 12,
  color: '#EF4444',
  marginTop: 4,
}
const btn = {
  width: '100%',
  padding: '13px 0',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  fontSize: 15,
  fontWeight: 700,
  fontFamily: 'inherit',
  marginBottom: 20,
}
const bottomText = {
  fontSize: 14,
  color: '#64748B',
  textAlign: 'center',
}
const link = {
  color: '#2563EB',
  fontWeight: 600,
  textDecoration: 'none',
}