const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/resumeController");

router.post("/", auth, ctrl.createResume);
router.get("/", auth, ctrl.getUserResumes);
router.get("/:id", auth, ctrl.getResume);
router.put("/:id", auth, ctrl.updateResume);
router.delete("/:id", auth, ctrl.deleteResume);

module.exports = router;