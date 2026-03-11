const mongoose = require("mongoose")

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    plan: {
      type:    String,
      enum:    ["free", "pro", "enterprise"],
      default: "free",
    },
    status: {
      type:    String,
      enum:    ["active", "inactive", "cancelled"],
      default: "active",
    },
    paymentId: {
      type:    String,
      default: "",
    },
    startDate: {
      type:    Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Subscription", subscriptionSchema)
