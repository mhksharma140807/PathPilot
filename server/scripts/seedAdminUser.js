const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

async function seedAdminUser() {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      "mongodb://localhost:27017/pathpilot";

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for Admin Seed...");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@pathpilot.dev";
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "System Admin";

    let existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`User with email "${adminEmail}" already exists.`);
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await existingAdmin.save();
        console.log(`Promoted user "${adminEmail}" to admin role.`);
      } else {
        console.log(`User "${adminEmail}" is already an admin.`);
      }
    } else {
      if (!adminPassword) {
        throw new Error(
          "ADMIN_PASSWORD environment variable is required to create a new admin user."
        );
      }

      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      existingAdmin = await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isVerified: true,
        isActive: true,
      });

      console.log("Admin user created successfully!");
    }

    console.log("\n=========================================");
    console.log("ADMIN ACCOUNT DETAILS:");
    console.log("Email:   ", adminEmail);
    console.log("Role:    ", existingAdmin.role);
    console.log("=========================================\n");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  }
}

seedAdminUser();
