const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true,
    },

    otpHash: {
      type: String,
      required: [true, "OTP hash is required"],
    },

    expiresAt: {
      type: Date,
      required: [true, "Expiration time is required"],
      index: { expires: 0 },
    },

    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Otp", otpSchema);
