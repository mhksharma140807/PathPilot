const mongoose = require("mongoose");

const careerEnrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    career: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Career",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CareerEnrollment",
  careerEnrollmentSchema
);