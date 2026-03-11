const Subscription = require("../models/Subscription")
const User         = require("../models/User")

const VALID_PLANS = ["free", "pro", "enterprise"]

const PLAN_LIMITS = {
  free: {
    maxResumes:    1,
    templates:     ["classic", "minimal", "fresh"],
    pdfDownload:   false,
    aiSuggestions: false,
    advancedATS:   false,
  },
  pro: {
    maxResumes:    -1, // unlimited
    templates:     ["classic", "minimal", "fresh", "modern", "tech", "executive", "bold", "elegant"],
    pdfDownload:   true,
    aiSuggestions: true,
    advancedATS:   true,
  },
  enterprise: {
    maxResumes:    -1,
    templates:     ["classic", "minimal", "fresh", "modern", "tech", "executive", "bold", "elegant"],
    pdfDownload:   true,
    aiSuggestions: true,
    advancedATS:   true,
    teamFeatures:  true,
    customBranding:true,
    apiAccess:     true,
  },
}

exports.subscribe = async (req, res) => {
  try {
    const { plan, paymentId } = req.body

    if (!plan)                    return res.status(400).json({ msg: "Plan is required" })
    if (!VALID_PLANS.includes(plan)) return res.status(400).json({ msg: "Invalid plan" })

    const limits = PLAN_LIMITS[plan]

    const sub = await Subscription.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId:     req.user.id,
        plan,
        paymentId:  paymentId || "manual-" + Date.now(),
        status:     "active",
        limits,
        startDate:  new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      { upsert: true, new: true }
    )

    // Sync to User model so everywhere reads correct plan
    await User.findByIdAndUpdate(req.user.id, {
      subscriptionPlan:   plan,
      subscriptionStatus: "active",
    })

    res.json({ success: true, subscription: sub, limits })

  } catch (err) {
    console.error("Subscribe error:", err)
    res.status(500).json({ msg: "Subscription failed" })
  }
}

exports.getSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ userId: req.user.id })

    if (!sub) {
      return res.json({
        plan:   "free",
        status: "active",
        limits: PLAN_LIMITS.free,
      })
    }

    // Always attach latest limits in case they changed
    res.json({
      ...sub.toObject(),
      limits: PLAN_LIMITS[sub.plan] || PLAN_LIMITS.free,
    })

  } catch (err) {
    res.status(500).json({ msg: "Failed to get subscription" })
  }
}

exports.getPlanLimits = async (req, res) => {
  try {
    const sub  = await Subscription.findOne({ userId: req.user.id })
    const plan = sub?.plan || "free"
    res.json({ plan, limits: PLAN_LIMITS[plan] })
  } catch (err) {
    res.status(500).json({ msg: "Failed to get plan limits" })
  }
}