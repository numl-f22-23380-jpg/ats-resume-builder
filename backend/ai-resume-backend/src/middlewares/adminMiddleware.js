const User = require("../models/User")

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(403).json({ msg: "User not found" })
    }

    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Admin access required" })
    }

    next()

  } catch (err) {
    res.status(500).json({ msg: "Authorization failed" })
  }
}
