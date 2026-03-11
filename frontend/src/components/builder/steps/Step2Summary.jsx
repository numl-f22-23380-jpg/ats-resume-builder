// Step2Summary.jsx
// Professional summary textarea

import { useEffect }  from 'react'
import { useForm }    from 'react-hook-form'
import useResumeStore from '../../../store/resumeStore'

export default function Step2Summary() {
  const summary       = useResumeStore((s) => s.resumeData.summary)
  const updateSummary = useResumeStore((s) => s.updateSummary)

  const { register, watch } = useForm({
    defaultValues: { summary }
  })

  const watched = watch('summary')
  useEffect(() => {
    updateSummary(watched)
  }, [watched])

  return (
    <div style={wrapper}>
      <h2 style={title}>Professional Summary</h2>
      <p style={subtitle}>
        Write 2-3 sentences about your experience and goals.
        This is the first thing recruiters read.
      </p>

      {/* TIPS */}
      <div style={tipsBox}>
        <p style={tipsTitle}>💡 Tips for a great summary:</p>
        <p style={tipText}>• Mention your years of experience and main skill</p>
        <p style={tipText}>• Include 1-2 key achievements</p>
        <p style={tipText}>• Match keywords from the job description</p>
        <p style={tipText}>• Keep it under 100 words</p>
      </div>

      {/* TEXTAREA */}
      <label style={label}>Your Summary</label>
      <textarea
        placeholder="Results-driven Frontend Developer with 3+ years of experience building scalable React applications..."
        style={textarea}
        {...register('summary')}
      />

      {/* CHARACTER COUNT */}
      <p style={charCount}>
        {watched?.length || 0} characters
      </p>
    </div>
  )
}

const wrapper  = { padding: '32px' }
const title    = { fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 6 }
const subtitle = { fontSize: 14, color: '#64748B', marginBottom: 20, lineHeight: 1.6 }
const tipsBox  = {
  background: '#F0FDF4',
  borderRadius: 10,
  padding: '16px',
  border: '1px solid #DCFCE7',
  marginBottom: 20,
}
const tipsTitle = { fontSize: 13, fontWeight: 700, color: '#16A34A', marginBottom: 8 }
const tipText   = { fontSize: 13, color: '#334155', marginBottom: 4 }
const label     = { fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }
const textarea  = {
  width: '100%',
  height: 180,
  padding: '12px 14px',
  border: '1.5px solid #E2E8F0',
  borderRadius: 10,
  fontSize: 14,
  color: '#334155',
  fontFamily: 'inherit',
  lineHeight: 1.6,
  resize: 'vertical',
  outline: 'none',
  boxSizing: 'border-box',
}
const charCount = { fontSize: 12, color: '#94A3B8', textAlign: 'right', marginTop: 6 }