const mongoose = require("mongoose");
const crypto = require("crypto");

const generateCertificateId = () => {
  const hexToken = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `PP-CERT-2026-${hexToken}`;
};

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      immutable: true,
      default: generateCertificateId,
    },

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

    issuedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },

    skillsMastered: [
      {
        type: String,
        trim: true,
      },
    ],

    completionTimeHours: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

certificateSchema.index(
  { student: 1, career: 1 },
  { unique: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);
