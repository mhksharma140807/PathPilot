const mongoose = require("mongoose");

const curriculumRequirementSchema = new mongoose.Schema(
  {
    phase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phase",
      required: true,
    },

    type: {
      type: String,
      enum: ["required", "optional", "choice_group"],
      required: true,
    },

    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
        required: true,
      },
    ],

    minRequired: {
      type: Number,
      default: 1,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

curriculumRequirementSchema.index({ phase: 1, type: 1 });

module.exports = mongoose.model(
  "CurriculumRequirement",
  curriculumRequirementSchema
);
