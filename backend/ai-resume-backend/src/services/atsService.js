const { extractKeywords } = require("./keywordService")

function normalize(text = "") {
  return text.toLowerCase()
}

function flattenExperience(experience = []) {
  return experience.map(e => [
    e.jobTitle    || '',
    e.company     || '',
    e.location    || '',
    e.description || '',
  ].join(' ')).join(' ').toLowerCase()
}

function flattenEducation(education = []) {
  return education.map(e => [
    e.degree   || '',
    e.school   || '',
    e.location || '',
    e.field    || '',
  ].join(' ')).join(' ').toLowerCase()
}

function flattenProjects(projects = []) {
  return projects.map(p => [
    p.name        || '',
    p.description || '',
    p.tech        || '',
  ].join(' ')).join(' ').toLowerCase()
}

function flattenCertifications(certs = []) {
  return certs.map(c => [
    c.name   || '',
    c.issuer || '',
  ].join(' ')).join(' ').toLowerCase()
}

exports.analyzeATS = (resume, jobDescription) => {

  // Extract keywords from job description
  const jdKeywords = extractKeywords(jobDescription)

  if (jdKeywords.length === 0) {
    return {
      matchedKeywords: [],
      missingKeywords: [],
      score: 0,
    }
  }

  // Build full resume text from all sections
  const skillsText  = normalize((resume.skills || []).join(' '))
  const expText     = flattenExperience(resume.experience)
  const summaryText = normalize(resume.summary || '')
  const eduText     = flattenEducation(resume.education)
  const projText    = flattenProjects(resume.projects || [])
  const certText    = flattenCertifications(resume.certifications || [])
  const titleText   = normalize(resume.title || '')
  const nameText    = normalize(resume.personalInfo?.fullName || '')

  const fullResumeText = [
    skillsText,
    expText,
    summaryText,
    eduText,
    projText,
    certText,
    titleText,
    nameText,
  ].join(' ')

  const matchedKeywords = []
  const missingKeywords = []

  jdKeywords.forEach(k => {
    const keyword = k.toLowerCase()
    // Check if keyword exists anywhere in resume
    if (fullResumeText.includes(keyword)) {
      matchedKeywords.push(k)
    } else {
      missingKeywords.push(k)
    }
  })

  const total = jdKeywords.length
  const score = Math.round((matchedKeywords.length / total) * 100)

  return {
    matchedKeywords,
    missingKeywords,
    score,
  }
}