const router = require("express").Router()
const auth   = require("../middlewares/authMiddleware")
const admin  = require("../middlewares/adminMiddleware")
const ctrl   = require("../controllers/adminController")

router.get("/admin/users",     auth, admin, ctrl.getUsers)
router.get("/admin/templates", auth, admin, ctrl.getTemplates)
router.get("/admin/stats",     auth, admin, ctrl.getStats)

module.exports = router