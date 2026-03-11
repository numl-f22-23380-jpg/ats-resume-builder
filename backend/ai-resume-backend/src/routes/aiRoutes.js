const express    = require("express");
const router     = express.Router();
const auth       = require("../middlewares/authMiddleware");
const {
  improveSummary,
  improveBullets,
  rewriteText
} = require("../controllers/aiController");

router.post("/ai/improve-summary", auth, improveSummary);
router.post("/ai/improve-bullets", auth, improveBullets);
router.post("/ai/rewrite",         auth, rewriteText);

module.exports = router;