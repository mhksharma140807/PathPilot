const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const mongoose = require("mongoose");
const Module = require("../models/Module");

const getDefaultLessons = (modTitle) => [
  {
    title: `1. Core Overview of ${modTitle || "Module"}`,
    duration: "15 mins",
    content: `Welcome to this module on ${modTitle || "your track"}. In this lesson, we break down the primary principles, industry standards, and architectural blueprints required to excel in this topic. Review the core concepts thoroughly before moving into practical tasks.`,
    keyTakeaway: "Understanding fundamental principles ensures software reliability and scalability.",
    resources: [],
  },
  {
    title: "2. Deep-Dive & Key Concepts",
    duration: "25 mins",
    content: "Building on the foundation, this section explores advanced patterns, optimization routines, and practical workflows. Ensure you understand how data flows across components and how to diagnose common edge cases.",
    keyTakeaway: "Clean separation of concerns improves code readability and maintainability.",
    resources: [],
  },
  {
    title: "3. Practical Activity & Assessment",
    duration: "20 mins",
    content: "Put your knowledge to test! Create a practical prototype demonstrating the skills covered in the previous lessons. Verify error handling, edge cases, and user interface responsiveness.",
    keyTakeaway: "Empirical testing and practice build confidence for real-world projects.",
    resources: [],
  },
];

async function backfillModuleLessons() {
  try {
    console.log("Connecting to MongoDB for backfilling module lessons...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected.\n");

    const allModules = await Module.find({});
    console.log(`Found ${allModules.length} total module(s) in MongoDB.`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const mod of allModules) {
      if (!mod.lessons || mod.lessons.length === 0) {
        mod.lessons = getDefaultLessons(mod.title);
        await mod.save();
        updatedCount++;
        console.log(`  ✅ Populated lessons for Module: "${mod.title}" (ID: ${mod._id})`);
      } else {
        skippedCount++;
        console.log(`  ↩  Skipped Module: "${mod.title}" (ID: ${mod._id}) — already has ${mod.lessons.length} lesson(s).`);
      }
    }

    console.log("\n========================================");
    console.log(`Backfill Summary:`);
    console.log(`- Total modules inspected: ${allModules.length}`);
    console.log(`- Modules updated (populated lessons): ${updatedCount}`);
    console.log(`- Modules skipped (already had lessons): ${skippedCount}`);
    console.log("========================================\n");

    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error("❌ Backfill failed:", error.message);
    process.exit(1);
  }
}

backfillModuleLessons();
