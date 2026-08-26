const express = require("express");

const {
  createModule,
  getModulesByCareer,
  getModulesByPhase,
  getModuleById,
} = require("../controllers/moduleController");

const router = express.Router();

// Get modules belonging to a career
router.get("/career/:careerId", getModulesByCareer);

// Get modules belonging to a phase
router.get("/phase/:phaseId", getModulesByPhase);

// Get single module by ID
router.get("/:id", getModuleById);

// Create a module
router.post("/", createModule);

module.exports = router;