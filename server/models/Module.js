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

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

moduleSchema.index({ career: 1, order: 1 }, { unique: true });

module.exports = mongoose.model("Module", moduleSchema);