// Step1Personal.jsx
// Personal info form — name, email, phone, location etc

import { useEffect } from 'react'
import { useForm }   from 'react-hook-form'
import useResumeStore from '../../../store/resumeStore'

export default function Step1Personal() {
  const personalInfo      = useResumeStore((s) => s.resumeData.personalInfo)
  const updatePersonalInfo = useResumeStore((s) => s.updatePersonalInfo)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: personalInfo
  })

  // Watch all fields and update store in real time
  const watched = watch()
  useEffect(() => {
    updatePersonalInfo(watched)
  }, [JSON.stringify(watched)])

  return (
    <div style={wrapper}>
      <h2 style={title}>Personal Information</h2>
      <p style={subtitle}>This appears at the top of your resume.</p>

      <div style={grid}>

        {/* FULL NAME */}
        <div style={fieldGroup}>
          <label style={label}>Full Name *</label>
          <input
            placeholder="Ahmed Khan"
            style={{ ...input, borderColor: errors.fullName ? '#EF4444' : '#E2E8F0' }}
            {...register('fullName', { required: 'Full name is required' })}
          />
          {errors.fullName && <p style={errorText}>{errors.fullName.message}</p>}
        </div>

        {/* EMAIL */}
        <div style={fieldGroup}>
          <label style={label}>Email Address *</label>
          <input
            type="email"
            placeholder="ahmed@example.com"
            style={{ ...input, borderColor: errors.email ? '#EF4444' : '#E2E8F0' }}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter valid email' }
            })}
          />
          {errors.email && <p style={errorText}>{errors.email.message}</p>}
        </div>

        {/* PHONE */}
        <div style={fieldGroup}>
          <label style={label}>Phone Number</label>
          <input
            placeholder="+92 300 1234567"
            style={input}
            {...register('phone')}
          />
        </div>

        {/* LOCATION */}
        <div style={fieldGroup}>
          <label style={label}>Location</label>
          <input
            placeholder="Islamabad, Pakistan"
            style={input}
            {...register('location')}
          />
        </div>

        {/* LINKEDIN */}
        <div style={fieldGroup}>
          <label style={label}>LinkedIn URL</label>
          <input
            placeholder="linkedin.com/in/ahmedkhan"
            style={input}
            {...register('linkedin')}
          />
        </div>

        {/* WEBSITE */}
        <div style={fieldGroup}>
          <label style={label}>Website / Portfolio</label>
          <input
            placeholder="ahmedkhan.dev"
            style={input}
            {...register('website')}
          />
        </div>

      </div>
    </div>
  )
}

const wrapper = { padding: '32px' }
const title   = { fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 6 }
const subtitle = { fontSize: 14, color: '#64748B', marginBottom: 28 }
const grid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
}
const fieldGroup = { display: 'flex', flexDirection: 'column' }
const label = { fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }
const input = {
  padding: '11px 14px',
  border: '1.5px solid #E2E8F0',
  borderRadius: 10,
  fontSize: 14,
  color: '#334155',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
}
const errorText = { fontSize: 12, color: '#EF4444', marginTop: 4 }