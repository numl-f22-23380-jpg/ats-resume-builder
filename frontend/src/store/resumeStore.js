import { create } from 'zustand'

const INITIAL_RESUME = {
  personalInfo: {
    fullName: '', email: '', phone: '',
    location: '', linkedin: '', website: '',
  },
  summary: '',
  experience: [{
    id: 1, jobTitle: '', company: '',
    location: '', startDate: '', endDate: '',
    current: false, description: '',
  }],
  education: [{
    id: 1, degree: '', school: '',
    location: '', startDate: '', endDate: '', gpa: '',
  }],
  skills: [],
  projects: [{
    id: 1, name: '', description: '', link: '', tech: '',
  }],
  certifications: [{
    id: 1, name: '', issuer: '', date: '', link: '',
  }],
}

const useResumeStore = create((set) => ({

  // ─── CURRENT STEP ───────────────────────
  currentStep: 1,
  totalSteps:  7,

  // ─── RESUME DATA ────────────────────────
  resumeData: { ...INITIAL_RESUME },

  // ─── ACTIONS ────────────────────────────

  nextStep: () => set((state) => ({
    currentStep: Math.min(state.currentStep + 1, state.totalSteps)
  })),

  prevStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 1)
  })),

  goToStep: (step) => set({ currentStep: step }),

  updatePersonalInfo: (data) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      personalInfo: { ...state.resumeData.personalInfo, ...data }
    }
  })),

  updateSummary: (summary) => set((state) => ({
    resumeData: { ...state.resumeData, summary }
  })),

  updateExperience: (experience) => set((state) => ({
    resumeData: { ...state.resumeData, experience }
  })),

  updateEducation: (education) => set((state) => ({
    resumeData: { ...state.resumeData, education }
  })),

  updateSkills: (skills) => set((state) => ({
    resumeData: { ...state.resumeData, skills }
  })),

  updateProjects: (projects) => set((state) => ({
    resumeData: { ...state.resumeData, projects }
  })),

  updateCertifications: (certifications) => set((state) => ({
    resumeData: { ...state.resumeData, certifications }
  })),

  // ─── SET FULL RESUME DATA (for editing) ─
  setResumeData: (data) => set((state) => ({
    currentStep: 1,
    resumeData: {
      personalInfo:   data.personalInfo   || INITIAL_RESUME.personalInfo,
      summary:        data.summary        || '',
      experience:     data.experience?.length > 0
                        ? data.experience
                        : INITIAL_RESUME.experience,
      education:      data.education?.length > 0
                        ? data.education
                        : INITIAL_RESUME.education,
      skills:         data.skills         || [],
      projects:       data.projects?.length > 0
                        ? data.projects
                        : INITIAL_RESUME.projects,
      certifications: data.certifications?.length > 0
                        ? data.certifications
                        : INITIAL_RESUME.certifications,
    }
  })),

  // ─── RESET ──────────────────────────────
  resetResume: () => set({
    currentStep: 1,
    resumeData: { ...INITIAL_RESUME },
  }),

}))

export default useResumeStore