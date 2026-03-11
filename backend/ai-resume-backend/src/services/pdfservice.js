const PDFDocument = require("pdfkit")

exports.generateResumePDF = (resume, res) => {
  const templateId = resume.templateId || "classic"
  const doc = new PDFDocument({ margin: 50 })

  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", `attachment; filename=resume.pdf`)

  doc.pipe(res)

  if (templateId === "modern") {
    generateModern(doc, resume)
  } else if (templateId === "minimal") {
    generateMinimal(doc, resume)
  } else if (templateId === "tech") {
    generateTech(doc, resume)
  } else if (templateId === "executive") {
    generateExecutive(doc, resume)
  } else if (templateId === "bold") {
    generateBold(doc, resume)
  } else if (templateId === "fresh") {
    generateFresh(doc, resume)
  } else if (templateId === "elegant") {
    generateElegant(doc, resume)
  } else {
    generateClassic(doc, resume)
  }

  doc.end()
}

// ─── HELPER: Common sections ─────────────────────────────

function addExperience(doc, resume, titleColor = "#000000") {
  const validExp = (resume.experience || []).filter(e => e.jobTitle)
  if (validExp.length === 0) return

  validExp.forEach(exp => {
    const dateStr = exp.startDate
      ? `${exp.startDate} — ${exp.current ? "Present" : exp.endDate || ""}`
      : ""

    doc.fontSize(11).font("Helvetica-Bold")
       .fillColor("#000000").text(exp.jobTitle || "", { continued: !!dateStr })
    if (dateStr) {
      doc.fontSize(10).font("Helvetica")
         .fillColor("#555555").text(dateStr, { align: "right" })
    }

    const companyLine = [exp.company, exp.location].filter(Boolean).join("  •  ")
    if (companyLine) {
      doc.fontSize(10).font("Helvetica")
         .fillColor("#555555").text(companyLine).fillColor("#000000")
    }
    if (exp.description) {
      doc.fontSize(10).font("Helvetica")
         .fillColor("#334155").text(exp.description).fillColor("#000000")
    }
    doc.moveDown(0.5)
  })
}

function addEducation(doc, resume) {
  const validEdu = (resume.education || []).filter(e => e.degree)
  if (validEdu.length === 0) return

  validEdu.forEach(edu => {
    const dateStr = edu.startDate
      ? `${edu.startDate} — ${edu.endDate || ""}`
      : ""

    doc.fontSize(11).font("Helvetica-Bold")
       .fillColor("#000000").text(edu.degree || "", { continued: !!dateStr })
    if (dateStr) {
      doc.fontSize(10).font("Helvetica")
         .fillColor("#555555").text(dateStr, { align: "right" })
    }

    const schoolLine = [edu.school, edu.location].filter(Boolean).join("  •  ")
    if (schoolLine) {
      doc.fontSize(10).font("Helvetica")
         .fillColor("#555555").text(schoolLine).fillColor("#000000")
    }
    if (edu.gpa) {
      doc.fontSize(10).text(`GPA: ${edu.gpa}`)
    }
    doc.moveDown(0.5)
  })
}

function addProjects(doc, resume) {
  const validProj = (resume.projects || []).filter(p => p.name)
  if (validProj.length === 0) return

  validProj.forEach(proj => {
    doc.fontSize(11).font("Helvetica-Bold")
       .fillColor("#000000").text(proj.name || "")
    if (proj.tech) {
      doc.fontSize(10).font("Helvetica")
         .fillColor("#2563EB").text(proj.tech).fillColor("#000000")
    }
    if (proj.description) {
      doc.fontSize(10).font("Helvetica")
         .fillColor("#334155").text(proj.description).fillColor("#000000")
    }
    if (proj.link) {
      doc.fontSize(10).fillColor("#2563EB").text(proj.link).fillColor("#000000")
    }
    doc.moveDown(0.5)
  })
}

function addCertifications(doc, resume) {
  const validCerts = (resume.certifications || []).filter(c => c.name)
  if (validCerts.length === 0) return

  validCerts.forEach(cert => {
    const dateStr = cert.date || ""
    doc.fontSize(11).font("Helvetica-Bold")
       .fillColor("#000000").text(cert.name || "", { continued: !!dateStr })
    if (dateStr) {
      doc.fontSize(10).font("Helvetica")
         .fillColor("#555555").text(dateStr, { align: "right" })
    }
    if (cert.issuer) {
      doc.fontSize(10).font("Helvetica")
         .fillColor("#555555").text(cert.issuer).fillColor("#000000")
    }
    doc.moveDown(0.5)
  })
}

// ─── TEMPLATE 1: Classic ─────────────────────────────────

function generateClassic(doc, resume) {
  const name = resume.personalInfo?.fullName || "Resume"

  doc.fontSize(22).font("Helvetica-Bold").fillColor("#000000")
     .text(name, { align: "center" })
  doc.moveDown(0.3)

  const contact = [
    resume.personalInfo?.email,
    resume.personalInfo?.phone,
    resume.personalInfo?.location,
  ].filter(Boolean).join("  •  ")

  if (contact) {
    doc.fontSize(10).font("Helvetica").text(contact, { align: "center" })
  }

  const links = [
    resume.personalInfo?.linkedin,
    resume.personalInfo?.website,
  ].filter(Boolean).join("  •  ")
  if (links) doc.fontSize(10).text(links, { align: "center" })

  doc.moveDown(0.5)
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("#000000")
  doc.moveDown(0.5)

  if (resume.summary) {
    doc.fontSize(13).font("Helvetica-Bold").text("SUMMARY")
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown(0.3)
    doc.fontSize(10).font("Helvetica").text(resume.summary)
    doc.moveDown(0.8)
  }

  const validExp = (resume.experience || []).filter(e => e.jobTitle)
  if (validExp.length > 0) {
    doc.fontSize(13).font("Helvetica-Bold").text("EXPERIENCE")
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown(0.3)
    addExperience(doc, resume)
  }

  const validEdu = (resume.education || []).filter(e => e.degree)
  if (validEdu.length > 0) {
    doc.fontSize(13).font("Helvetica-Bold").text("EDUCATION")
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown(0.3)
    addEducation(doc, resume)
  }

  const skills = resume.skills || []
  if (skills.length > 0) {
    doc.fontSize(13).font("Helvetica-Bold").text("SKILLS")
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown(0.3)
    doc.fontSize(10).font("Helvetica").text(skills.join(", "))
    doc.moveDown(0.8)
  }

  const validProj = (resume.projects || []).filter(p => p.name)
  if (validProj.length > 0) {
    doc.fontSize(13).font("Helvetica-Bold").text("PROJECTS")
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown(0.3)
    addProjects(doc, resume)
  }

  const validCerts = (resume.certifications || []).filter(c => c.name)
  if (validCerts.length > 0) {
    doc.fontSize(13).font("Helvetica-Bold").text("CERTIFICATIONS")
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown(0.3)
    addCertifications(doc, resume)
  }
}

// ─── TEMPLATE 2: Modern (Blue accents) ───────────────────

function generateModern(doc, resume) {
  const name = resume.personalInfo?.fullName || "Resume"
  const BLUE = "#2563EB"

  // Blue header bar
  doc.rect(0, 0, 612, 100).fill(BLUE)

  doc.fontSize(24).font("Helvetica-Bold").fillColor("#ffffff")
     .text(name, 50, 28, { align: "left" })

  const contact = [
    resume.personalInfo?.email,
    resume.personalInfo?.phone,
    resume.personalInfo?.location,
  ].filter(Boolean).join("  |  ")

  if (contact) {
    doc.fontSize(10).font("Helvetica").fillColor("rgba(255,255,255,0.85)")
       .text(contact, 50, 62)
  }

  doc.y = 115
  doc.fillColor("#000000")

  if (resume.summary) {
    doc.fontSize(13).font("Helvetica-Bold").fillColor(BLUE).text("SUMMARY")
    doc.moveDown(0.2)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(BLUE)
    doc.moveDown(0.3)
    doc.fontSize(10).font("Helvetica").fillColor("#334155").text(resume.summary)
    doc.moveDown(0.8)
  }

  const validExp = (resume.experience || []).filter(e => e.jobTitle)
  if (validExp.length > 0) {
    doc.fontSize(13).font("Helvetica-Bold").fillColor(BLUE).text("EXPERIENCE")
    doc.moveDown(0.2)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(BLUE)
    doc.moveDown(0.3)
    addExperience(doc, resume)
  }

  const validEdu = (resume.education || []).filter(e => e.degree)
  if (validEdu.length > 0) {
    doc.fontSize(13).font("Helvetica-Bold").fillColor(BLUE).text("EDUCATION")
    doc.moveDown(0.2)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(BLUE)
    doc.moveDown(0.3)
    addEducation(doc, resume)
  }

  const skills = resume.skills || []
  if (skills.length > 0) {
    doc.fontSize(13).font("Helvetica-Bold").fillColor(BLUE).text("SKILLS")
    doc.moveDown(0.2)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(BLUE)
    doc.moveDown(0.3)
    doc.fontSize(10).font("Helvetica").fillColor("#334155")
       .text(skills.join("  •  "))
    doc.moveDown(0.8)
  }

  const validProj = (resume.projects || []).filter(p => p.name)
  if (validProj.length > 0) {
    doc.fontSize(13).font("Helvetica-Bold").fillColor(BLUE).text("PROJECTS")
    doc.moveDown(0.2)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(BLUE)
    doc.moveDown(0.3)
    addProjects(doc, resume)
  }

  const validCerts = (resume.certifications || []).filter(c => c.name)
  if (validCerts.length > 0) {
    doc.fontSize(13).font("Helvetica-Bold").fillColor(BLUE).text("CERTIFICATIONS")
    doc.moveDown(0.2)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(BLUE)
    doc.moveDown(0.3)
    addCertifications(doc, resume)
  }
}

// ─── TEMPLATE 3: Minimal ─────────────────────────────────

function generateMinimal(doc, resume) {
  const name = resume.personalInfo?.fullName || "Resume"
  const GRAY = "#94A3B8"

  doc.fontSize(26).font("Helvetica-Bold").fillColor("#0F172A")
     .text(name, { align: "left" })
  doc.moveDown(0.2)

  const contact = [
    resume.personalInfo?.email,
    resume.personalInfo?.phone,
    resume.personalInfo?.location,
    resume.personalInfo?.linkedin,
  ].filter(Boolean).join("   ")

  if (contact) {
    doc.fontSize(9).font("Helvetica").fillColor(GRAY).text(contact)
  }

  doc.moveDown(0.8)
  doc.moveTo(50, doc.y).lineTo(550, doc.y).lineWidth(0.5).stroke(GRAY)
  doc.moveDown(0.5)

  if (resume.summary) {
    doc.fontSize(9).font("Helvetica-Bold").fillColor(GRAY)
       .text("SUMMARY", { characterSpacing: 2 })
    doc.moveDown(0.3)
    doc.fontSize(10).font("Helvetica").fillColor("#334155").text(resume.summary)
    doc.moveDown(0.8)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).lineWidth(0.5).stroke(GRAY)
    doc.moveDown(0.5)
  }

  const validExp = (resume.experience || []).filter(e => e.jobTitle)
  if (validExp.length > 0) {
    doc.fontSize(9).font("Helvetica-Bold").fillColor(GRAY)
       .text("EXPERIENCE", { characterSpacing: 2 })
    doc.moveDown(0.3)
    addExperience(doc, resume)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).lineWidth(0.5).stroke(GRAY)
    doc.moveDown(0.5)
  }

  const validEdu = (resume.education || []).filter(e => e.degree)
  if (validEdu.length > 0) {
    doc.fontSize(9).font("Helvetica-Bold").fillColor(GRAY)
       .text("EDUCATION", { characterSpacing: 2 })
    doc.moveDown(0.3)
    addEducation(doc, resume)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).lineWidth(0.5).stroke(GRAY)
    doc.moveDown(0.5)
  }

  const skills = resume.skills || []
  if (skills.length > 0) {
    doc.fontSize(9).font("Helvetica-Bold").fillColor(GRAY)
       .text("SKILLS", { characterSpacing: 2 })
    doc.moveDown(0.3)
    doc.fontSize(10).font("Helvetica").fillColor("#334155")
       .text(skills.join("   •   "))
    doc.moveDown(0.8)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).lineWidth(0.5).stroke(GRAY)
    doc.moveDown(0.5)
  }

  const validProj = (resume.projects || []).filter(p => p.name)
  if (validProj.length > 0) {
    doc.fontSize(9).font("Helvetica-Bold").fillColor(GRAY)
       .text("PROJECTS", { characterSpacing: 2 })
    doc.moveDown(0.3)
    addProjects(doc, resume)
  }
}

// ─── TEMPLATE 4: Tech ────────────────────────────────────

function generateTech(doc, resume) {
  const name = resume.personalInfo?.fullName || "Resume"
  const CYAN = "#06B6D4"
  const DARK = "#0F172A"

  // Dark header
  doc.rect(0, 0, 612, 110).fill(DARK)

  doc.fontSize(24).font("Helvetica-Bold").fillColor("#ffffff")
     .text(name, 50, 25)

  const contact = [
    resume.personalInfo?.email,
    resume.personalInfo?.phone,
    resume.personalInfo?.location,
  ].filter(Boolean).join("  |  ")

  if (contact) {
    doc.fontSize(9).font("Helvetica").fillColor(CYAN).text(contact, 50, 58)
  }

  const links = [
    resume.personalInfo?.linkedin,
    resume.personalInfo?.website,
  ].filter(Boolean).join("  |  ")

  if (links) {
    doc.fontSize(9).font("Helvetica").fillColor("rgba(255,255,255,0.6)")
       .text(links, 50, 78)
  }

  doc.y = 125
  doc.fillColor("#000000")

  if (resume.summary) {
    doc.fontSize(11).font("Helvetica-Bold").fillColor(CYAN).text("// SUMMARY")
    doc.moveDown(0.2)
    doc.fontSize(10).font("Helvetica").fillColor("#334155").text(resume.summary)
    doc.moveDown(0.8)
  }

  const validExp = (resume.experience || []).filter(e => e.jobTitle)
  if (validExp.length > 0) {
    doc.fontSize(11).font("Helvetica-Bold").fillColor(CYAN).text("// EXPERIENCE")
    doc.moveDown(0.2)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(CYAN)
    doc.moveDown(0.3)
    addExperience(doc, resume)
  }

  const skills = resume.skills || []
  if (skills.length > 0) {
    doc.fontSize(11).font("Helvetica-Bold").fillColor(CYAN).text("// SKILLS")
    doc.moveDown(0.2)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(CYAN)
    doc.moveDown(0.3)
    // Show skills as tags style
    doc.fontSize(10).font("Helvetica").fillColor("#334155")
       .text(skills.join("  ·  "))
    doc.moveDown(0.8)
  }

  const validEdu = (resume.education || []).filter(e => e.degree)
  if (validEdu.length > 0) {
    doc.fontSize(11).font("Helvetica-Bold").fillColor(CYAN).text("// EDUCATION")
    doc.moveDown(0.2)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(CYAN)
    doc.moveDown(0.3)
    addEducation(doc, resume)
  }

  const validProj = (resume.projects || []).filter(p => p.name)
  if (validProj.length > 0) {
    doc.fontSize(11).font("Helvetica-Bold").fillColor(CYAN).text("// PROJECTS")
    doc.moveDown(0.2)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(CYAN)
    doc.moveDown(0.3)
    addProjects(doc, resume)
  }

  const validCerts = (resume.certifications || []).filter(c => c.name)
  if (validCerts.length > 0) {
    doc.fontSize(11).font("Helvetica-Bold").fillColor(CYAN).text("// CERTIFICATIONS")
    doc.moveDown(0.2)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(CYAN)
    doc.moveDown(0.3)
    addCertifications(doc, resume)
  }
}

// ─── TEMPLATE 5: Executive ───────────────────────────────

function generateExecutive(doc, resume) {
  const name = resume.personalInfo?.fullName || "Resume"
  const DARK = "#0F172A"

  doc.fontSize(28).font("Helvetica-Bold").fillColor(DARK)
     .text(name.toUpperCase(), { align: "center", characterSpacing: 2 })
  doc.moveDown(0.2)

  const contact = [
    resume.personalInfo?.email,
    resume.personalInfo?.phone,
    resume.personalInfo?.location,
  ].filter(Boolean).join("   |   ")

  if (contact) {
    doc.fontSize(10).font("Helvetica").fillColor("#555555")
       .text(contact, { align: "center" })
  }

  doc.moveDown(0.4)
  doc.moveTo(50, doc.y).lineTo(550, doc.y).lineWidth(2).stroke(DARK)
  doc.moveDown(0.1)
  doc.moveTo(50, doc.y).lineTo(550, doc.y).lineWidth(0.5).stroke(DARK)
  doc.moveDown(0.6)

  function execSection(title) {
    doc.fontSize(11).font("Helvetica-Bold").fillColor(DARK)
       .text(title.toUpperCase(), { characterSpacing: 2 })
    doc.moveDown(0.2)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).lineWidth(1).stroke(DARK)
    doc.moveDown(0.3)
  }

  if (resume.summary) {
    execSection("Professional Summary")
    doc.fontSize(10).font("Helvetica").fillColor("#334155").text(resume.summary)
    doc.moveDown(0.8)
  }

  const validExp = (resume.experience || []).filter(e => e.jobTitle)
  if (validExp.length > 0) {
    execSection("Professional Experience")
    addExperience(doc, resume)
  }

  const validEdu = (resume.education || []).filter(e => e.degree)
  if (validEdu.length > 0) {
    execSection("Education")
    addEducation(doc, resume)
  }

  const skills = resume.skills || []
  if (skills.length > 0) {
    execSection("Core Competencies")
    doc.fontSize(10).font("Helvetica").fillColor("#334155")
       .text(skills.join("   •   "))
    doc.moveDown(0.8)
  }

  const validProj = (resume.projects || []).filter(p => p.name)
  if (validProj.length > 0) {
    execSection("Key Projects")
    addProjects(doc, resume)
  }

  const validCerts = (resume.certifications || []).filter(c => c.name)
  if (validCerts.length > 0) {
    execSection("Certifications")
    addCertifications(doc, resume)
  }
}

// ─── TEMPLATE 6: Bold ────────────────────────────────────

function generateBold(doc, resume) {
  const name = resume.personalInfo?.fullName || "Resume"
  const RED  = "#EF4444"

  doc.rect(0, 0, 612, 120).fill(RED)
  doc.fontSize(28).font("Helvetica-Bold").fillColor("#ffffff")
     .text(name, 50, 35, { align: "left" })

  const contact = [
    resume.personalInfo?.email,
    resume.personalInfo?.phone,
    resume.personalInfo?.location,
  ].filter(Boolean).join("  |  ")

  if (contact) {
    doc.fontSize(10).font("Helvetica").fillColor("rgba(255,255,255,0.85)")
       .text(contact, 50, 80)
  }

  doc.y = 135
  doc.fillColor("#000000")

  function boldSection(title) {
    doc.fontSize(13).font("Helvetica-Bold").fillColor(RED).text(title)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(RED)
    doc.moveDown(0.3)
  }

  if (resume.summary) {
    boldSection("SUMMARY")
    doc.fontSize(10).font("Helvetica").fillColor("#334155").text(resume.summary)
    doc.moveDown(0.8)
  }

  const validExp = (resume.experience || []).filter(e => e.jobTitle)
  if (validExp.length > 0) {
    boldSection("EXPERIENCE")
    addExperience(doc, resume)
  }

  const validEdu = (resume.education || []).filter(e => e.degree)
  if (validEdu.length > 0) {
    boldSection("EDUCATION")
    addEducation(doc, resume)
  }

  const skills = resume.skills || []
  if (skills.length > 0) {
    boldSection("SKILLS")
    doc.fontSize(10).font("Helvetica").fillColor("#334155")
       .text(skills.join(", "))
    doc.moveDown(0.8)
  }

  const validProj = (resume.projects || []).filter(p => p.name)
  if (validProj.length > 0) {
    boldSection("PROJECTS")
    addProjects(doc, resume)
  }
}

// ─── TEMPLATE 7: Fresh ───────────────────────────────────

function generateFresh(doc, resume) {
  const name  = resume.personalInfo?.fullName || "Resume"
  const GREEN = "#22C55E"

  doc.fontSize(24).font("Helvetica-Bold").fillColor(GREEN)
     .text(name, { align: "center" })
  doc.moveDown(0.2)

  const contact = [
    resume.personalInfo?.email,
    resume.personalInfo?.phone,
    resume.personalInfo?.location,
  ].filter(Boolean).join("  •  ")

  if (contact) {
    doc.fontSize(10).font("Helvetica").fillColor("#64748B")
       .text(contact, { align: "center" })
  }

  doc.moveDown(0.4)
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(GREEN)
  doc.moveDown(0.5)

  function freshSection(title) {
    doc.fontSize(12).font("Helvetica-Bold").fillColor(GREEN).text(title)
    doc.moveDown(0.2)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).lineWidth(0.5).stroke(GREEN)
    doc.moveDown(0.3)
  }

  if (resume.summary) {
    freshSection("About Me")
    doc.fontSize(10).font("Helvetica").fillColor("#334155").text(resume.summary)
    doc.moveDown(0.8)
  }

  const validExp = (resume.experience || []).filter(e => e.jobTitle)
  if (validExp.length > 0) {
    freshSection("Experience")
    addExperience(doc, resume)
  }

  const validEdu = (resume.education || []).filter(e => e.degree)
  if (validEdu.length > 0) {
    freshSection("Education")
    addEducation(doc, resume)
  }

  const skills = resume.skills || []
  if (skills.length > 0) {
    freshSection("Skills")
    doc.fontSize(10).font("Helvetica").fillColor("#334155")
       .text(skills.join("  •  "))
    doc.moveDown(0.8)
  }

  const validProj = (resume.projects || []).filter(p => p.name)
  if (validProj.length > 0) {
    freshSection("Projects")
    addProjects(doc, resume)
  }

  const validCerts = (resume.certifications || []).filter(c => c.name)
  if (validCerts.length > 0) {
    freshSection("Certifications")
    addCertifications(doc, resume)
  }
}

// ─── TEMPLATE 8: Elegant ─────────────────────────────────

function generateElegant(doc, resume) {
  const name  = resume.personalInfo?.fullName || "Resume"
  const GOLD  = "#D97706"

  doc.moveTo(50, 50).lineTo(550, 50).lineWidth(1).stroke(GOLD)
  doc.moveDown(0.5)

  doc.fontSize(26).font("Helvetica-Bold").fillColor("#0F172A")
     .text(name, { align: "center" })
  doc.moveDown(0.3)

  const contact = [
    resume.personalInfo?.email,
    resume.personalInfo?.phone,
    resume.personalInfo?.location,
  ].filter(Boolean).join("   ·   ")

  if (contact) {
    doc.fontSize(10).font("Helvetica").fillColor(GOLD)
       .text(contact, { align: "center" })
  }

  doc.moveDown(0.4)
  doc.moveTo(50, doc.y).lineTo(550, doc.y).lineWidth(1).stroke(GOLD)
  doc.moveDown(0.6)

  function elegantSection(title) {
    doc.fontSize(11).font("Helvetica-Bold").fillColor(GOLD)
       .text(title, { characterSpacing: 1 })
    doc.moveTo(50, doc.y).lineTo(550, doc.y).lineWidth(0.5).stroke(GOLD)
    doc.moveDown(0.3)
  }

  if (resume.summary) {
    elegantSection("PROFILE")
    doc.fontSize(10).font("Helvetica").fillColor("#334155").text(resume.summary)
    doc.moveDown(0.8)
  }

  const validExp = (resume.experience || []).filter(e => e.jobTitle)
  if (validExp.length > 0) {
    elegantSection("EXPERIENCE")
    addExperience(doc, resume)
  }

  const validEdu = (resume.education || []).filter(e => e.degree)
  if (validEdu.length > 0) {
    elegantSection("EDUCATION")
    addEducation(doc, resume)
  }

  const skills = resume.skills || []
  if (skills.length > 0) {
    elegantSection("EXPERTISE")
    doc.fontSize(10).font("Helvetica").fillColor("#334155")
       .text(skills.join("   ·   "))
    doc.moveDown(0.8)
  }

  const validProj = (resume.projects || []).filter(p => p.name)
  if (validProj.length > 0) {
    elegantSection("PROJECTS")
    addProjects(doc, resume)
  }

  const validCerts = (resume.certifications || []).filter(c => c.name)
  if (validCerts.length > 0) {
    elegantSection("CERTIFICATIONS")
    addCertifications(doc, resume)
  }
}