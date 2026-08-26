const express = require("express");

const {
  createPhase,
  getPhasesByCareer,
  getPhaseById,
} = require("../controllers/phaseController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get phases belonging to a career
router.get("/career/:careerId", getPhasesByCareer);

// Get single phase by ID
router.get("/:id", getPhaseById);

// Create a phase (admin only)
router.post("/", authenticateUser, authorizeRoles("admin"), createPhase);

module.exports = router;
