function improveSummary(summary, tone = "professional") {
  if (!summary) return "";
  let improved = summary.trim();
  if (tone === "confident") {
    improved = "Results-driven professional with proven expertise. " + improved;
  } else if (tone === "friendly") {
    improved = "Motivated and collaborative professional. " + improved;
  } else {
    improved = "Highly skilled and detail-oriented professional. " + improved;
  }
  return improved;
}

function improveBullets(bullets = [], tone = "professional") {
  return bullets.map(b => {
    let line = b.trim();
    if (tone === "confident") {
      return "Successfully " + line.charAt(0).toLowerCase() + line.slice(1);
    }
    if (tone === "friendly") {
      return "Worked closely with teams to " + line.charAt(0).toLowerCase() + line.slice(1);
    }
    return "Responsible for " + line.charAt(0).toLowerCase() + line.slice(1);
  });
}

function rewriteText(text, tone = "professional") {
  if (!text) return "";
  if (tone === "confident") {
    return "Demonstrated strong impact and ownership in: " + text;
  }
  if (tone === "friendly") {
    return "Enjoyed contributing and collaborating in: " + text;
  }
  return "Professional experience includes: " + text;
}

module.exports = { improveSummary, improveBullets, rewriteText };