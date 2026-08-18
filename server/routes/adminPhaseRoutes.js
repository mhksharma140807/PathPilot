const express = require("express");
const {
  getAdminPhases,
  getAdminPhaseById,
  createAdminPhase,
  updateAdminPhase,
  toggleAdminPhaseStatus,
  deleteAdminPhase,
} = require("../controllers/adminPhaseController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Protect ALL admin phase management routes
router.use(authenticateUser);
router.use(authorizeRoles("admin"));

// Admin Phase Routes
router.get("/", getAdminPhases);
router.get("/:id", getAdminPhaseById);
router.post("/", createAdminPhase);
router.put("/:id", updateAdminPhase);
router.patch("/:id/status", toggleAdminPhaseStatus);
router.delete("/:id", deleteAdminPhase);

module.exports = router;
