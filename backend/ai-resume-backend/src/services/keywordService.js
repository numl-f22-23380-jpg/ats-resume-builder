const natural = require("natural")

const tokenizer = new natural.WordTokenizer()

// Common stop words to ignore
const stopWords = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all",
  "can", "her", "was", "one", "our", "out", "day", "get",
  "has", "him", "his", "how", "its", "may", "new", "now",
  "old", "see", "two", "way", "who", "boy", "did", "she",
  "use", "her", "now", "air", "oil", "sit", "set", "run",
  "with", "that", "this", "have", "from", "they", "will",
  "been", "were", "said", "each", "which", "their", "time",
  "about", "would", "there", "could", "other", "after",
  "first", "well", "also", "into", "than", "then", "some",
  "these", "want", "look", "more", "very", "just", "come",
  "over", "think", "know", "take", "year", "your", "good",
  "much", "before", "right", "too", "any", "same", "tell",
  "does", "what", "when", "make", "like", "him", "into",
  "must", "here", "such", "even", "back", "because", "while",
  "should", "through", "work", "life", "need", "only", "able",
  "experience", "using", "strong", "proven", "within", "across",
  "including", "related", "relevant", "required", "preferred",
  "responsibilities", "qualifications", "requirements", "ability",
  "excellent", "skills", "skill", "knowledge", "understanding",
  "working", "minimum", "least", "years", "plus", "bonus",
  "nice", "have", "great", "role", "team", "join", "help",
  "build", "develop", "create", "design", "implement", "manage",
  "support", "provide", "ensure", "maintain", "deliver", "drive",
])

// Tech keywords to always keep even if short
const techKeywords = new Set([
  "aws", "gcp", "sql", "css", "html", "git", "api", "sdk",
  "ios", "ui", "ux", "ml", "ai", "db", "qa", "ci", "cd",
  "js", "ts", "go", "php", "c", "r",
])

exports.extractKeywords = (text = "") => {
  const tokens = tokenizer.tokenize(text.toLowerCase())

  const keywords = tokens.filter(w => {
    // Keep tech keywords even if short
    if (techKeywords.has(w)) return true
    // Remove stop words
    if (stopWords.has(w)) return false
    // Remove very short words
    if (w.length < 3) return false
    // Remove pure numbers
    if (/^\d+$/.test(w)) return false
    return true
  })

  return [...new Set(keywords)]
}