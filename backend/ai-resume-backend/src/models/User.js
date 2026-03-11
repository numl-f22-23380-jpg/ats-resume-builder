const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
    },
    email: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
      lowercase: true,
    },
    password: {
      type:     String,
      required: true,
    },
    role: {
      type:    String,
      enum:    ["user", "admin"],
      default: "user",
    },
    subscriptionPlan: {
      type:    String,
      enum:    ["free", "pro", "enterprise"],
      default: "free",
    },
    subscriptionStatus: {
      type:    String,
      enum:    ["active", "inactive", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  }
)

module.exports = mongoose.model("User", userSchema)