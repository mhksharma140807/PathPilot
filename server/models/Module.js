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
        resources: [
          {
            title: { type: String, required: true, trim: true },
            url: { type: String, required: true, trim: true },
            type: {
              type: String,
              enum: ["pdf", "document", "link", "code", "video", "other"],
              default: "link",
            },
          },
        ],
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

moduleSchema.index(
  { phase: 1, order: 1 },
  {
    unique: true,
    partialFilterExpression: { phase: { $type: "objectId" } },
  }
);

module.exports = mongoose.model("Module", moduleSchema);