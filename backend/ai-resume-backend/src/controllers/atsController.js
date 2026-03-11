const Resume = require("../models/Resume");
const JobAnalysis = require("../models/JobAnalysis");
const { analyzeATS } = require("../services/atsService");

exports.analyze = async (req, res) => {

  const { resumeId, jobDescription } = req.body;

  const resume = await Resume.findById(resumeId);

  if (!resume) return res.status(404).json({ msg: "Resume not found" });

  const result = analyzeATS(resume, jobDescription);

  const analysis = await JobAnalysis.create({
    userId: req.user.id,
    resumeId,
    jobDescription,
    matchedKeywords: result.matchedKeywords,
    missingKeywords: result.missingKeywords,
    score: result.score
  });

  resume.atsScore = result.score;
  await resume.save();

  res.json(analysis);
};

exports.jobMatch = async (req, res) => {

  const { resumeId, jobDescription } = req.body;

  
  const resume = await Resume.findOne({
  _id: resumeId,
  userId: req.user.id
});

  if (!resume) return res.status(404).json({ msg: "Resume not found" });

  const result = analyzeATS(resume, jobDescription);

  res.json(result);
};