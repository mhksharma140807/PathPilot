const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    career: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Career",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      required: true,
      min: 1,
    },

    estimatedHours: {
      type: Number,
      default: 0,
      min: 0,
    },

    objectives: [
      {
        type: String,
        trim: true,
      },
    ],

    lessons: [
      {
        title: { type: String, required: true, trim: true },
        duration: { type: String, default: "15 mins" },
        content: { type: String, required: true },
        keyTakeaway: { type: String, default: "" },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    phase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phase",
      default: null,
    },

    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
  },
  {
    timestamps: true,
  }
);

moduleSchema.index({ career: 1, order: 1 }, { unique: true });

module.exports = mongoose.model("Module", moduleSchema);