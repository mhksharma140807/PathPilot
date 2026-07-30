const mongoose = require("mongoose");

const moduleProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    career: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Career",
      required: true,
    },

    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },

    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
    },

    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
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

moduleProgressSchema.index(
  { student: 1, module: 1 },
  { unique: true }
);

module.exports = mongoose.model("ModuleProgress", moduleProgressSchema);