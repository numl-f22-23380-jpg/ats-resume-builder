const User         = require("../models/User")
const Resume       = require("../models/Resume")
const Subscription = require("../models/Subscription")

// Real templates data
const TEMPLATES = [
  { id: 'classic',   name: 'Classic',   category: 'Professional', active: true  },
  { id: 'modern',    name: 'Modern',    category: 'Creative',     active: true  },
  { id: 'minimal',   name: 'Minimal',   category: 'Simple',       active: true  },
  { id: 'bold',      name: 'Bold',      category: 'Creative',     active: false },
  { id: 'executive', name: 'Executive', category: 'Professional', active: true  },
  { id: 'fresh',     name: 'Fresh',     category: 'Modern',       active: true  },
  { id: 'elegant',   name: 'Elegant',   category: 'Luxury',       active: false },
  { id: 'tech',      name: 'Tech',      category: 'Modern',       active: true  },
]

exports.getUsers = async (req, res) => {
  try {
    // Never return passwords
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })

    res.json(users)

  } catch (err) {
    res.status(500).json({ msg: "Failed to get users" })
  }
}

exports.getTemplates = async (req, res) => {
  try {
    res.json(TEMPLATES)
  } catch (err) {
    res.status(500).json({ msg: "Failed to get templates" })
  }
}

exports.getStats = async (req, res) => {
  try {
    const totalUsers  = await User.countDocuments()
    const proUsers    = await User.countDocuments({
      subscriptionPlan: { $in: ["pro", "enterprise"] }
    })
    const totalResumes = await Resume.countDocuments()

    // Active today — users created or updated in last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const activeToday = await User.countDocuments({
      updatedAt: { $gte: yesterday }
    })

    res.json({
      totalUsers,
      proUsers,
      totalResumes,
      activeToday,
      revenue: `$${proUsers * 9}`,
    })

  } catch (err) {
    res.status(500).json({ msg: "Failed to get stats" })
  }
}