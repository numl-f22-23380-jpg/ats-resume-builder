// StepIndicator.jsx
// Shows step dots at top of resume builder
// Completed steps = blue filled
// Current step = blue outlined
// Future steps = gray

export default function StepIndicator({ currentStep, totalSteps, onGoToStep }) {

  const steps = [
    'Personal',
    'Summary',
    'Experience',
    'Education',
    'Skills',
    'Projects',
    'Certifications',
  ]

  return (
    <div style={wrapper}>
      {steps.map((label, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isCurrent   = stepNumber === currentStep

        return (
          <div key={stepNumber} style={stepWrapper}>

            {/* LINE before step (not for first step) */}
            {index > 0 && (
              <div style={{
                ...line,
                background: isCompleted ? '#2563EB' : '#E2E8F0',
              }} />
            )}

            {/* STEP DOT */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                onClick={() => isCompleted && onGoToStep(stepNumber)}
                style={{
                  ...dot,
                  background:   isCompleted ? '#2563EB' : isCurrent ? '#fff' : '#F1F5F9',
                  border:       isCurrent ? '2px solid #2563EB' : isCompleted ? 'none' : '2px solid #E2E8F0',
                  cursor:       isCompleted ? 'pointer' : 'default',
                  color:        isCompleted ? '#fff' : isCurrent ? '#2563EB' : '#94A3B8',
                }}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>

              {/* LABEL */}
              <p style={{
                ...stepLabel,
                color: isCurrent ? '#2563EB' : isCompleted ? '#0F172A' : '#94A3B8',
                fontWeight: isCurrent ? 700 : 500,
              }}>
                {label}
              </p>
            </div>

          </div>
        )
      })}
    </div>
  )
}

const wrapper = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '24px 32px',
  background: '#fff',
  borderBottom: '1px solid #F1F5F9',
  overflowX: 'auto',
}
const stepWrapper = {
  display: 'flex',
  alignItems: 'center',
}
const line = {
  width: 60,
  height: 2,
  marginBottom: 22,
}
const dot = {
  width: 32,
  height: 32,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 13,
  fontWeight: 700,
  transition: 'all 0.2s',
}
const stepLabel = {
  fontSize: 11,
  textAlign: 'center',
  whiteSpace: 'nowrap',
}