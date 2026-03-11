// ResultDisplay.jsx
// Shows original text vs AI improved text side by side
//
// PROPS:
//   original  → the text user typed
//   improved  → the AI generated better version
//   onRewrite → function that runs when user clicks Rewrite

import { useState } from 'react'

export default function ResultDisplay({ original, improved, onRewrite }) {

  // copied state — shows "Copied!" message when user copies text
  const [copied, setCopied] = useState(false)

  // Copy improved text to clipboard
  function handleCopy() {
    navigator.clipboard.writeText(improved)
    setCopied(true)
    // After 2 seconds reset back to "Copy" button
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={wrapper}>

      {/* HEADER ROW */}
      <div style={headerRow}>
        <h3 style={title}>AI Suggestion Result</h3>

        {/* BUTTONS */}
        <div style={{ display: 'flex', gap: 10 }}>

          {/* Rewrite button — generates again */}
          <button onClick={onRewrite} style={rewriteBtn}>
            🔄 Rewrite
          </button>

          {/* Copy button */}
          <button onClick={handleCopy} style={copyBtn}>
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>

        </div>
      </div>

      {/* TWO COLUMN — original vs improved */}
      <div style={grid}>

        {/* LEFT — original text */}
        <div style={textBox}>
          <p style={boxLabel}>Original</p>
          <p style={boxText}>{original}</p>
        </div>

        {/* ARROW in middle */}
        <div style={arrow}>→</div>

        {/* RIGHT — improved text */}
        <div style={{ ...textBox, border: '2px solid #22C55E' }}>
          <p style={{ ...boxLabel, color: '#22C55E' }}>
            ✨ AI Improved
          </p>
          <p style={boxText}>{improved}</p>
        </div>

      </div>

      {/* IMPROVEMENT NOTE */}
      <div style={note}>
        <span style={{ fontSize: 16 }}>💡</span>
        <p style={{ fontSize: 13, color: '#64748B' }}>
          The improved version is optimized for ATS systems
          and uses stronger action words.
        </p>
      </div>

    </div>
  )
}

// ─── Styles ──────────────────────────────
const wrapper = {
  background: '#fff',
  borderRadius: 14,
  padding: '24px',
  border: '1px solid #F1F5F9',
  boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
  marginTop: 20,
}
const headerRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20,
}
const title = {
  fontSize: 16,
  fontWeight: 700,
  color: '#0F172A',
}
const rewriteBtn = {
  padding: '8px 16px',
  borderRadius: 8,
  border: '1.5px solid #E2E8F0',
  background: '#fff',
  fontSize: 13,
  fontWeight: 600,
  color: '#475569',
  cursor: 'pointer',
  fontFamily: 'inherit',
}
const copyBtn = {
  padding: '8px 16px',
  borderRadius: 8,
  border: 'none',
  background: '#2563EB',
  fontSize: 13,
  fontWeight: 600,
  color: '#fff',
  cursor: 'pointer',
  fontFamily: 'inherit',
}
const grid = {
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  gap: 16,
  alignItems: 'center',
}
const textBox = {
  background: '#F8FAFC',
  borderRadius: 10,
  padding: '16px',
  border: '1.5px solid #E2E8F0',
  minHeight: 140,
}
const boxLabel = {
  fontSize: 12,
  fontWeight: 700,
  color: '#94A3B8',
  marginBottom: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}
const boxText = {
  fontSize: 14,
  color: '#334155',
  lineHeight: 1.7,
}
const arrow = {
  fontSize: 24,
  color: '#CBD5E1',
  fontWeight: 700,
}
const note = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginTop: 16,
  padding: '12px 16px',
  background: '#F0FDF4',
  borderRadius: 10,
  border: '1px solid #DCFCE7',
}
