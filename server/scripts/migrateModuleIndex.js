require("dotenv").config();
const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const mongoose = require("mongoose");

const OLD_INDEX_NAME = "career_1_order_1";
const NEW_INDEX_NAME = "phase_1_order_1";

async function migrateModuleIndex() {
  try {
    console.log("Connecting to:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected.\n");

    const col = mongoose.connection.db.collection("modules");

    // --- Inspect current indexes ---
    const existingIndexes = await col.indexes();
    const indexNames = existingIndexes.map((i) => i.name);
    console.log("Current module indexes:", indexNames, "\n");

    // --- Drop old index if it exists ---
    if (indexNames.includes(OLD_INDEX_NAME)) {
      await col.dropIndex(OLD_INDEX_NAME);
      console.log(`✅ Dropped old index: "${OLD_INDEX_NAME}"`);
    } else {
      console.log(`  ↩  Old index "${OLD_INDEX_NAME}" not found — skipping drop.`);
    }

    // --- Create new partial unique index if it does not already exist ---
    if (indexNames.includes(NEW_INDEX_NAME)) {
      console.log(`  ↩  New index "${NEW_INDEX_NAME}" already exists — skipping creation.`);
    } else {
      await col.createIndex(
        { phase: 1, order: 1 },
        {
          name: NEW_INDEX_NAME,
          unique: true,
          partialFilterExpression: { phase: { $type: "objectId" } },
        }
      );
      console.log(`✅ Created new index: "${NEW_INDEX_NAME}"`);
    }

    // --- Verify final state ---
    const finalIndexes = await col.indexes();
    console.log("\nFinal module indexes:");
    finalIndexes.forEach((idx) => {
      console.log(
        `  key=${JSON.stringify(idx.key)}  name="${idx.name}"  unique=${!!idx.unique}  partial=${
          idx.partialFilterExpression ? JSON.stringify(idx.partialFilterExpression) : "none"
        }`
      );
    });

    const oldPresent = finalIndexes.some((i) => i.name === OLD_INDEX_NAME);
    const newPresent = finalIndexes.some((i) => i.name === NEW_INDEX_NAME);

    if (!oldPresent && newPresent) {
      console.log("\n✅ Index migration complete. State is correct.");
    } else {
      console.error(
        `\n❌ Unexpected final state — old present: ${oldPresent}, new present: ${newPresent}`
      );
      process.exit(1);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

migrateModuleIndex();
