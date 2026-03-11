const {
  improveSummary,
  improveBullets,
  rewriteText
} = require("../services/aiService");

exports.improveSummary = async (req, res) => {
  const { summary, tone } = req.body;
  const result = improveSummary(summary, tone);
  res.json({ improvedSummary: result });
};

exports.improveBullets = async (req, res) => {
  const { bullets, tone } = req.body;
  const result = improveBullets(bullets, tone);
  res.json({ improvedBullets: result });
};

exports.rewriteText = async (req, res) => {
  const { text, tone } = req.body;
  const result = rewriteText(text, tone);
  res.json({ rewrittenText: result });
};