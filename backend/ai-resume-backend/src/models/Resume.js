const mongoose = require("mongoose")

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },

    title: {
      type:    String,
      default: "Untitled Resume",
    },

    templateId: {
      type:    String,
      default: "classic",
    },

    personalInfo: {
      fullName:  { type: String, default: "" },
      email:     { type: String, default: "" },
      phone:     { type: String, default: "" },
      location:  { type: String, default: "" },
      linkedin:  { type: String, default: "" },
      website:   { type: String, default: "" },
    },

    summary: {
      type:    String,
      default: "",
    },

    experience: {
      type:    Array,
      default: [],
    },

    education: {
      type:    Array,
      default: [],
    },

    skills: {
      type:    Array,
      default: [],
    },

    projects: {
      type:    Array,
      default: [],
    },

    certifications: {
      type:    Array,
      default: [],
    },

    atsScore: {
      type:    Number,
      default: 0,
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  }
)

module.exports = mongoose.model("Resume", resumeSchema)
