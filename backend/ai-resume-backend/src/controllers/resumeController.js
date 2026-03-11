const Resume = require("../models/Resume");

exports.createResume = async (req, res) => {
  try {
    const resume = await Resume.create({
      ...req.body,
      userId: req.user.id,
    })
    res.json(resume)
  } catch (err) {
    res.status(500).json({ msg: "Failed to create resume" })
  }
}

exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id:    req.params.id,
      userId: req.user.id,
    })
    if (!resume) return res.status(404).json({ msg: "Resume not found" })
    res.json(resume)
  } catch (err) {
    res.status(500).json({ msg: "Failed to get resume" })
  }
}

exports.getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
    res.json(resumes)
  } catch (err) {
    res.status(500).json({ msg: "Failed to get resumes" })
  }
}

exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    )
    if (!resume) return res.status(404).json({ msg: "Resume not found" })
    res.json(resume)
  } catch (err) {
    res.status(500).json({ msg: "Failed to update resume" })
  }
}

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id:    req.params.id,
      userId: req.user.id,
    })
    if (!resume) return res.status(404).json({ msg: "Resume not found" })
    res.json({ message: "Deleted successfully" })
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete resume" })
  }
}