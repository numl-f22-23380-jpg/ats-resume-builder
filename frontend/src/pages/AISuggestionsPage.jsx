import { useState } from 'react'
import Layout          from '../components/shared/Layout'
import SectionSelector from '../components/ai/SectionSelector'
import ToneSelector    from '../components/ai/ToneSelector'
import ResultDisplay   from '../components/ai/ResultDisplay'
import { improveSummary, improveBullets, rewriteText } from '../api'

export default function AISuggestionsPage() {

  const [section, setSection] = useState('summary')
  const [tone,    setTone]    = useState('professional')
  const [text,    setText]    = useState('')
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)
  const [error,   setError]   = useState('')

  async function handleImprove() {
    if (!text.trim()) return

    setLoading(true)
    setResult(null)
    setError('')

    try {
      let improved = ''

      if (section === 'summary') {
        // Call improve-summary endpoint
        const res = await improveSummary({
          summary: text,
          tone:    tone,
        })
        improved = res.data.improvedSummary

      } else if (section === 'bullets') {
        // Split text by newlines into array of bullets
        const bulletsArray = text
          .split('\n')
          .map(b => b.replace(/^[•\-\*]\s*/, '').trim())
          .filter(b => b.length > 0)

        const res = await improveBullets({
          bullets: bulletsArray,
          tone:    tone,
        })
        // Join improved bullets back into string
        improved = res.data.improvedBullets
          .map(b => '• ' + b)
          .join('\n')

      } else {
        // For any other section use rewrite endpoint
        const res = await rewriteText({
          text: text,
          tone: tone,
        })
        improved = res.data.rewrittenText
      }

      setResult(improved)

    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRewrite() {
    setResult(null)
    await handleImprove()
  }

  return (
    <Layout>

      {/* PAGE HEADER */}
      <h1 style={styles.title}>AI Suggestion Module</h1>
      <p style={styles.subtitle}>
        Select a section, paste your text, choose a tone
        and let AI improve it for you.
      </p>

      {/* TWO COLUMN GRID */}
      <div style={styles.grid}>

        {/* LEFT */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Improve Your Resume</h2>

          {/* SECTION SELECTOR */}
          <SectionSelector
            selected={section}
            onSelect={(val) => {
              setSection(val)
              setResult(null)
              setText('')
            }}
          />

          {/* TONE SELECTOR */}
          <ToneSelector
            selected={tone}
            onSelect={setTone}
          />

          {/* TEXT INPUT */}
          <label style={styles.label}>
            Paste Your Original Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              section === 'summary'
                ? 'Paste your current summary here...'
                : section === 'bullets'
                  ? 'Paste your bullet points here (one per line)...'
                  : 'Paste your text here...'
            }
            style={styles.textarea}
            onFocus={(e) => e.target.style.borderColor = '#2563EB'}
            onBlur={(e)  => e.target.style.borderColor = '#E2E8F0'}
          />

          {/* Error */}
          {error && (
            <p style={{ color: '#EF4444', fontSize: 13, marginTop: 8 }}>
              {error}
            </p>
          )}

          {/* IMPROVE BUTTON */}
          <button
            onClick={handleImprove}
            disabled={loading || !text.trim()}
            style={{
              ...styles.btn,
              background: (loading || !text.trim())
                ? '#93C5FD' : '#2563EB',
              cursor: (loading || !text.trim())
                ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Improving…' : '✨ Improve with AI'}
          </button>

          {/* Loading skeleton */}
          {loading && (
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 10 }}>
                AI is rewriting your text...
              </p>
              {[90, 60, 80, 40, 70].map((w, i) => (
                <div key={i} style={{
                  height: 10,
                  borderRadius: 6,
                  marginBottom: 10,
                  width: `${w}%`,
                  background: '#E2E8F0',
                  animation: 'pulse 1.4s infinite',
                  animationDelay: `${i * 0.15}s`,
                }} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div>
          {!result && !loading && (
            <div style={{
              ...styles.card,
              textAlign: 'center',
              padding: '70px 40px',
            }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>✨</div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#CBD5E1' }}>
                AI improved text will appear here
              </p>
              <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 8 }}>
                Select a section, paste your text
                and click Improve with AI
              </p>
            </div>
          )}

          {result && (
            <ResultDisplay
              original={text}
              improved={result}
              onRewrite={handleRewrite}
            />
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
    gridTemplateColumns: '1fr 1.4fr',
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
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#475569',
    display: 'block',
    marginBottom: 8,
  },
  textarea: {
    width: '100%',
    height: 160,
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
  btn: {
    marginTop: 16,
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
