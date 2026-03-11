// api.js
// All axios calls to backend in one place

import axios from 'axios'

// ─── BASE URL ────────────────────────────
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
})

// ─── TOKEN INJECTION ─────────────────────
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── AUTH ────────────────────────────────
export const registerUser    = (data) => API.post('/register', data)
export const loginUser       = (data) => API.post('/login', data)
export const resetPassword   = (data) => API.post('/reset-password', data)

// ─── RESUME ──────────────────────────────
export const createResume    = (data) => API.post('/resume', data)
export const getResume       = (id)   => API.get(`/resume/${id}`)
export const updateResume    = (id, data) => API.put(`/resume/${id}`, data)
export const deleteResume    = (id)   => API.delete(`/resume/${id}`)
export const getUserResumes  = ()     => API.get('/resume')

// ─── ATS ─────────────────────────────────
export const analyzeATS      = (data) => API.post('/analyze', data)
export const jobMatch        = (data) => API.post('/job-match', data)

// ─── AI SUGGESTIONS ──────────────────────
export const aiSuggest       = (data) => API.post('/ai/suggest', data)
export const improveSummary  = (data) => API.post('/ai/improve-summary', data)
export const improveBullets  = (data) => API.post('/ai/improve-bullets', data)
export const rewriteText     = (data) => API.post('/ai/rewrite', data)

// ─── PDF ─────────────────────────────────
export const generatePDF     = (data) => API.post('/generate-pdf', data)

// ─── SUBSCRIPTION ────────────────────────
export const subscribe        = (data) => API.post('/subscribe', data)
export const getSubscription  = ()     => API.get('/subscription')
export const getPlanLimits    = ()     => API.get('/subscription/limits')

// ─── ADMIN ───────────────────────────────
export const getAdminUsers     = ()    => API.get('/admin/users')
export const getAdminTemplates = ()    => API.get('/admin/templates')
export const getAdminStats     = ()    => API.get('/admin/stats')

export default API