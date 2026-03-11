const Resume             = require("../models/Resume")
const { generateResumePDF } = require("../services/pdfservice")

exports.generatePDF = async (req, res) => {
  try {
    const { resumeId } = req.body

    if (!resumeId) {
      return res.status(400).json({ msg: "Resume ID is required" })
    }

    const resume = await Resume.findOne({
      _id:    resumeId,
      userId: req.user.id,
    })

    if (!resume) {
      return res.status(404).json({ msg: "Resume not found" })
    }

    generateResumePDF(resume, res)

  } catch (err) {
    res.status(500).json({ msg: "Failed to generate PDF" })
  }
}