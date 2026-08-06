const mongoose = require("mongoose");
const dns = require("dns");

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const connectDB = async () => {
  try {
    console.log("Connecting to:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;