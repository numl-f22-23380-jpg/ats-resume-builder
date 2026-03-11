import { useState, useEffect }            from 'react'
import { createResume, updateResume, getResume } from '../api'
import { useNavigate, useSearchParams }   from 'react-router-dom'
import useResumeStore                     from '../store/resumeStore'
import useAuthStore                       from '../store/authStore'
import StepIndicator                      from '../components/builder/StepIndicator'
import LivePreview                        from '../components/builder/LivePreview'
import Step1Personal                      from '../components/builder/steps/Step1Personal'
import Step2Summary                       from '../components/builder/steps/Step2Summary'
import Step3Experience                    from '../components/builder/steps/Step3Experience'
import Step4Education                     from '../components/builder/steps/Step4Education'
import Step5Skills                        from '../components/builder/steps/Step5Skills'
import Step6Projects                      from '../components/builder/steps/Step6Projects'
import Step7Certifications                from '../components/builder/steps/Step7Certifications'
import toast, { Toaster }                 from 'react-hot-toast'

const TEMPLATE_OPTIONS = [
  { id: 'classic',   label: 'Classic',   premium: false },
  { id: 'modern',    label: 'Modern',    premium: true  },
  { id: 'minimal',   label: 'Minimal',   premium: false },
  { id: 'tech',      label: 'Tech',      premium: true  },
  { id: 'executive', label: 'Executive', premium: true  },
  { id: 'bold',      label: 'Bold',      premium: true  },
  { id: 'fresh',     label: 'Fresh',     premium: false },
  { id: 'elegant',   label: 'Elegant',   premium: true  },
]

export default function ResumeBuilderPage() {
  const navigate           = useNavigate()
  const [searchParams]     = useSearchParams()
  const editId             = searchParams.get('id')
  const [saving, setSaving]           = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('classic')
  const [showTemplates, setShowTemplates]       = useState(false)

  const user = useAuthStore((s) => s.user)

  const currentStep   = useResumeStore((s) => s.currentStep)
  const nextStep      = useResumeStore((s) => s.nextStep)
  const prevStep      = useResumeStore((s) => s.prevStep)
  const goToStep      = useResumeStore((s) => s.goToStep)
  const setResumeData = useResumeStore((s) => s.setResumeData)
  const resetResume   = useResumeStore((s) => s.resetResume)

  // Load resume if editing
  useEffect(() => {
    if (editId) {
      async function loadResume() {
        try {
          const res = await getResume(editId)
          const r   = res.data
          setResumeData({
            personalInfo:   r.personalInfo   || {},
            summary:        r.summary        || '',
            experience:     r.experience     || [],
            education:      r.education      || [],
            skills:         r.skills         || [],
            projects:       r.projects       || [],
            certifications: r.certifications || [],
          })
          if (r.templateId) setSelectedTemplate(r.templateId)
          toast.success('Resume loaded for editing.')
        } catch (err) {
          toast.error('Failed to load resume.')
        }
      }
      loadResume()
    } else {
      resetResume && resetResume()
      setSelectedTemplate('classic')
    }
  }, [editId])

  function handleTemplateSelect(tmpl) {
    if (tmpl.premium && user?.subscriptionPlan !== 'pro' && user?.subscriptionPlan !== 'enterprise') {
      toast.error('🔒 This is a Pro template. Upgrade to use it.')
      setShowTemplates(false)
      navigate('/subscription')
      return
    }
    setSelectedTemplate(tmpl.id)
    setShowTemplates(false)
    toast.success(`${tmpl.label} template selected!`)
  }

  function renderStep() {
    switch (currentStep) {
      case 1: return <Step1Personal />
      case 2: return <Step2Summary />
      case 3: return <Step3Experience />
      case 4: return <Step4Education />
      case 5: return <Step5Skills />
      case 6: return <Step6Projects />
      case 7: return <Step7Certifications />
      default: return <Step1Personal />
    }
  }

  async function saveResume() {
    setSaving(true)
    try {
      const resumeData = useResumeStore.getState().resumeData
      const payload = {
        title:          resumeData.personalInfo?.fullName
                          ? `${resumeData.personalInfo.fullName}'s Resume`
                          : 'My Resume',
        templateId:     selectedTemplate,
        personalInfo:   resumeData.personalInfo,
        summary:        resumeData.summary,
        experience:     resumeData.experience,
        education:      resumeData.education,
        skills:         resumeData.skills,
        projects:       resumeData.projects,
        certifications: resumeData.certifications,
      }
      if (editId) {
        await updateResume(editId, payload)
        toast.success('Resume updated successfully!')
      } else {
        await createResume(payload)
        toast.success('Resume saved successfully!')
      }
    navigate('/templates?after_create=1')

    } catch (err) {
      toast.error('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleNext() {
    if (currentStep === 7) {
      await saveResume()
      return
    }
    nextStep()
  }

  async function handleSaveDraft() {
    setSaving(true)
    try {
      const resumeData = useResumeStore.getState().resumeData
      const payload = {
        title:          resumeData.personalInfo?.fullName
                          ? `${resumeData.personalInfo.fullName}'s Resume`
                          : 'My Resume',
        templateId:     selectedTemplate,
        personalInfo:   resumeData.personalInfo,
        summary:        resumeData.summary,
        experience:     resumeData.experience,
        education:      resumeData.education,
        skills:         resumeData.skills,
        projects:       resumeData.projects,
        certifications: resumeData.certifications,
      }
      if (editId) {
        await updateResume(editId, payload)
        toast.success('Draft updated!')
      } else {
        await createResume(payload)
        toast.success('Draft saved!')
      }
    } catch (err) {
      toast.error('Failed to save draft.')
    } finally {
      setSaving(false)
    }
  }

  const currentTmpl = TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate)
  const isPro = user?.subscriptionPlan === 'pro' || user?.subscriptionPlan === 'enterprise'

  return (
    <div style={styles.wrapper}>
      <Toaster position="top-right" />

      {/* TOP BAR */}
      <div style={styles.topBar}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          ← Dashboard
        </button>
        <p style={styles.topTitle}>
          {editId ? 'Edit Resume' : 'Resume Builder'}
        </p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* TEMPLATE PICKER */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              style={styles.templatePickerBtn}
            >
              🎨 {currentTmpl?.label || 'Classic'} ▾
            </button>
            {showTemplates && (
              <div style={styles.templateDropdown}>
                <p style={styles.dropdownTitle}>Choose Template</p>
                {TEMPLATE_OPTIONS.map(tmpl => (
                  <div
                    key={tmpl.id}
                    onClick={() => handleTemplateSelect(tmpl)}
                    style={{
                      ...styles.dropdownItem,
                      background: selectedTemplate === tmpl.id ? '#EFF6FF' : '#fff',
                      color:      selectedTemplate === tmpl.id ? '#2563EB' : '#0F172A',
                    }}
                  >
                    <span>{tmpl.label}</span>
                    {tmpl.premium && !isPro && (
                      <span style={styles.proBadge}>👑 PRO</span>
                    )}
                    {selectedTemplate === tmpl.id && (
                      <span style={{ color: '#2563EB', fontSize: 12 }}>✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSaveDraft}
            disabled={saving}
            style={styles.saveBtn}
          >
            💾 {saving ? 'Saving...' : 'Save Draft'}
          </button>
        </div>
      </div>

      {/* STEP INDICATOR */}
      <StepIndicator
        currentStep={currentStep}
        totalSteps={7}
        onGoToStep={goToStep}
      />

      {/* MAIN CONTENT */}
      <div style={styles.content}>

        {/* LEFT — FORM */}
        <div style={styles.formPanel}>
          <div style={styles.stepContent}>
            {renderStep()}
          </div>

          {/* NAVIGATION */}
          <div style={styles.navButtons}>
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              style={{
                ...styles.prevBtn,
                opacity: currentStep === 1 ? 0.4 : 1,
                cursor:  currentStep === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              ← Back
            </button>

            <p style={styles.stepCounter}>Step {currentStep} of 7</p>

            <button
              onClick={handleNext}
              disabled={saving}
              style={{
                ...styles.nextBtn,
                background: saving ? '#93C5FD' : '#2563EB',
                cursor:     saving ? 'not-allowed' : 'pointer',
              }}
            >
              {currentStep === 7
                ? (saving ? 'Saving...' : editId ? '✓ Update' : '✓ Finish')
                : 'Next →'}
            </button>
          </div>
        </div>

        {/* RIGHT — LIVE PREVIEW */}
        <div style={styles.previewPanel}>
          <LivePreview templateId={selectedTemplate} />
        </div>

      </div>

      {/* CLOSE DROPDOWN ON OUTSIDE CLICK */}
      {showTemplates && (
        <div
          onClick={() => setShowTemplates(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 9 }}
        />
      )}
    </div>
  )
}

const styles = {
  wrapper:      { display: 'flex', flexDirection: 'column', height: '100vh', background: '#F8FAFC' },
  topBar:       { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: '#fff', borderBottom: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'relative', zIndex: 20 },
  backBtn:      { background: 'transparent', border: 'none', fontSize: 14, fontWeight: 600, color: '#64748B', cursor: 'pointer', fontFamily: 'inherit' },
  topTitle:     { fontSize: 16, fontWeight: 800, color: '#0F172A' },
  saveBtn:      { background: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#16A34A', cursor: 'pointer', fontFamily: 'inherit' },
  templatePickerBtn: { background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer', fontFamily: 'inherit' },
  templateDropdown:  { position: 'absolute', top: '110%', right: 0, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.12)', width: 200, zIndex: 100, overflow: 'hidden' },
  dropdownTitle:     { fontSize: 11, fontWeight: 700, color: '#94A3B8', padding: '10px 14px 6px', textTransform: 'uppercase', letterSpacing: 1 },
  dropdownItem:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', borderTop: '1px solid #F8FAFC' },
  proBadge:          { fontSize: 10, fontWeight: 700, color: '#F59E0B', background: '#FFFBEB', padding: '2px 6px', borderRadius: 10 },
  content:      { display: 'flex', flex: 1, overflow: 'hidden' },
  formPanel:    { width: '55%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #F1F5F9', background: '#fff' },
  stepContent:  { flex: 1, overflowY: 'auto' },
  navButtons:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderTop: '1px solid #F1F5F9', background: '#fff' },
  prevBtn:      { padding: '11px 24px', background: '#fff', color: '#475569', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, fontWeight: 600, fontFamily: 'inherit' },
  stepCounter:  { fontSize: 13, color: '#94A3B8', fontWeight: 600 },
  nextBtn:      { padding: '11px 24px', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: 'inherit' },
  previewPanel: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
}