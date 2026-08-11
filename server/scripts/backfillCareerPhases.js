require("dotenv").config();
const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const mongoose = require("mongoose");

const Career = require("../models/Career");
const Phase = require("../models/Phase");
const Module = require("../models/Module");

async function backfill() {
  try {
    console.log("Connecting to:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected.\n");

    const careers = await Career.find({});

    if (careers.length === 0) {
      console.log("No careers found. Nothing to migrate.");
      await mongoose.connection.close();
      return;
    }

    console.log(`Found ${careers.length} career(s). Starting backfill...\n`);

    for (const career of careers) {
      // --- Find or create the default Phase for this Career ---
      let defaultPhase = await Phase.findOne({ career: career._id, order: 1 });

      if (defaultPhase) {
        console.log(
          `  ↩  Reused existing Phase for Career: "${career.title}" (Phase _id: ${defaultPhase._id})`
        );
      } else {
        defaultPhase = await Phase.create({
          career: career._id,
          title: "Phase 1: Complete Curriculum",
          description: `All modules for the ${career.title} career path, grouped as a single learning phase.`,
          order: 1,
          isActive: true,
        });
        console.log(
          `  ✅ Created Phase for Career: "${career.title}" (Phase _id: ${defaultPhase._id})`
        );
      }

      // --- Assign phase to all Modules belonging to this Career ---
      const result = await Module.updateMany(
        { career: career._id },
        { $set: { phase: defaultPhase._id } }
      );

      console.log(
        `     Updated ${result.modifiedCount} module(s) for Career: "${career.title}"\n`
      );
    }

    console.log("✅ Backfill complete.");
    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Backfill failed:", error.message);
    process.exit(1);
  }
}

backfill();
