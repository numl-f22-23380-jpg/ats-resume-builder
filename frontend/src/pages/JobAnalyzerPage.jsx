import { useState, useEffect } from 'react'
import Layout            from '../components/shared/Layout'
import MatchScore        from '../components/jobanalyzer/MatchScore'
import ExtractedKeywords from '../components/jobanalyzer/ExtractedKeywords'
import Improvements      from '../components/jobanalyzer/Improvements'
import { jobMatch, getUserResumes } from '../api'

export default function JobAnalyzerPage() {

  const [jobDesc,  setJobDesc]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [result,   setResult]   = useState(null)
  const [error,    setError]    = useState('')
  const [resumes,  setResumes]  = useState([])
  const [resumeId, setResumeId] = useState('')

  // Load user resumes for dropdown
  useEffect(() => {
    async function fetchResumes() {
      try {
        const res = await getUserResumes()
        setResumes(res.data)
        if (res.data.length > 0) {
          setResumeId(res.data[0]._id)
        }
      } catch (err) {
        console.error('Failed to load resumes')
      }
    }
    fetchResumes()
  }, [])

  async function handleAnalyze() {
    if (!jobDesc.trim()) return
    if (!resumeId) {
      setError('Please create a resume first.')
      return
    }

    setLoading(true)
    setResult(null)
    setError('')

    try {
      const res = await jobMatch({
        resumeId:       resumeId,
        jobDescription: jobDesc,
      })
      setResult(res.data)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>

      {/* PAGE HEADER */}
      <h1 style={styles.title}>Job Description Analyzer</h1>
      <p style={styles.subtitle}>
        Select your resume, paste a job description
        and see how well you match.
      </p>

      {/* TWO COLUMN GRID */}
      <div style={styles.grid}>

        {/* LEFT */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Job Description</h2>

          {/* RESUME SELECTOR */}
          <label style={styles.label}>Select Resume</label>
          {resumes.length === 0 ? (
            <div style={styles.noResume}>
              ⚠️ No resumes found. Please create a resume first.
            </div>
          ) : (
            <select
              value={resumeId}
              onChange={(e) => setResumeId(e.target.value)}
              style={styles.select}
            >
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.title || 'Untitled Resume'}
                </option>
              ))}
            </select>
          )}

          {/* JOB DESCRIPTION */}
          <label style={{ ...styles.label, marginTop: 16 }}>
            Paste the job description below
          </label>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the full job description here..."
            style={styles.textarea}
            onFocus={(e) => e.target.style.borderColor = '#2563EB'}
            onBlur={(e)  => e.target.style.borderColor = '#E2E8F0'}
          />

          {/* Character count */}
          <p style={styles.charCount}>
            {jobDesc.length} characters
          </p>

          {/* Error */}
          {error && (
            <p style={{ color: '#EF4444', fontSize: 13, marginTop: 8 }}>
              {error}
            </p>
          )}

          {/* Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading || !jobDesc.trim() || !resumeId}
            style={{
              ...styles.btn,
              background: (loading || !jobDesc.trim() || !resumeId)
                ? '#93C5FD' : '#2563EB',
              cursor: (loading || !jobDesc.trim() || !resumeId)
                ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Analyzing…' : 'Analyze Job Description'}
          </button>

          {/* Loading skeleton */}
          {loading && (
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 10 }}>
                Extracting keywords...
              </p>
              {[80, 55, 90, 45, 70].map((w, i) => (
                <div key={i} style={{
                  height: 10,
                  borderRadius: 6,
                  marginBottom: 10,
                  width: `${w}%`,
                  background: '#E2E8F0',
                  animation: 'pulse 1.4s infinite',
                  animationDelay: `${i * 0.1}s`,
                }} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div>

          {/* Empty state */}
          {!result && !loading && (
            <div style={{
              ...styles.card,
              textAlign: 'center',
              padding: '70px 40px',
            }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>🔍</div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#CBD5E1' }}>
                Results will appear here
              </p>
              <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 8 }}>
                Select a resume, paste a job description
                and click Analyze
              </p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div>
              <MatchScore
                percentage={
                  result.matchPercentage ||
                  result.score ||
                  0
                }
              />
              <ExtractedKeywords
                keywords={
                  result.keywords ||
                  result.matchedKeywords ||
                  []
                }
                matchedKeywords={result.matchedKeywords || []}
              />
              {result.improvements &&
               result.improvements.length > 0 && (
                <Improvements
                  improvements={result.improvements}
                />
              )}
            </div>
          )}

        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>

    </Layout>
  )
}

const styles = {
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 28,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.7fr',
    gap: 24,
    alignItems: 'start',
  },
  card: {
    background: '#fff',
    borderRadius: 14,
    padding: 24,
    border: '1px solid #F1F5F9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#475569',
    display: 'block',
    marginBottom: 8,
  },
  select: {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid #E2E8F0',
    borderRadius: 10,
    fontSize: 14,
    color: '#334155',
    fontFamily: 'inherit',
    outline: 'none',
    background: '#fff',
    cursor: 'pointer',
  },
  noResume: {
    padding: '12px 14px',
    background: '#FEF9C3',
    borderRadius: 10,
    fontSize: 13,
    color: '#CA8A04',
    border: '1px solid #FEF08A',
  },
  textarea: {
    width: '100%',
    height: 240,
    padding: '12px 14px',
    border: '1.5px solid #E2E8F0',
    borderRadius: 10,
    fontSize: 14,
    color: '#334155',
    fontFamily: 'inherit',
    lineHeight: 1.6,
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  charCount: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'right',
    marginTop: 6,
  },
  btn: {
    marginTop: 12,
    width: '100%',
    padding: '13px 0',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    fontFamily: 'inherit',
  },
}
