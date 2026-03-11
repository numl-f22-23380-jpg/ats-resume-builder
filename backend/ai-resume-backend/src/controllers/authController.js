const User   = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt    = require("jsonwebtoken")

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" })
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" })
    }

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ msg: "Email already exists" })

    const hash = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password:           hash,
      role:               "user",
      subscriptionPlan:   "free",
      subscriptionStatus: "active",
    })

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      token,
      user: {
        _id:                user._id,
        name:               user.name,
        email:              user.email,
        role:               user.role,
        subscriptionPlan:   user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
        createdAt:          user.createdAt,
      }
    })

  } catch (err) {
    res.status(500).json({ msg: "Registration failed" })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" })
    }

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ msg: "Invalid credentials" })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(400).json({ msg: "Invalid credentials" })

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      token,
      user: {
        _id:                user._id,
        name:               user.name,
        email:              user.email,
        role:               user.role,
        subscriptionPlan:   user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
        createdAt:          user.createdAt,
      }
    })

  } catch (err) {
    res.status(500).json({ msg: "Login failed" })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body

    if (!email || !newPassword) {
      return res.status(400).json({ msg: "Email and new password are required" })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ msg: "No account found with this email" })
    }

    const hash = await bcrypt.hash(newPassword, 10)

    await User.findByIdAndUpdate(user._id, { password: hash })

    res.json({ msg: "Password reset successfully" })

  } catch (err) {
    res.status(500).json({ msg: "Password reset failed" })
  }
}
