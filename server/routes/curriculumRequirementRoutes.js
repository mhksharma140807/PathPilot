const express = require("express");
const {
  createRequirement,
  getRequirementsByPhase,
  getRequirementById,
  updateRequirement,
  deleteRequirement,
} = require("../controllers/curriculumRequirementController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public read routes
router.get("/phase/:phaseId", getRequirementsByPhase);
router.get("/:id", getRequirementById);

// Admin-only mutation routes
router.post("/", authenticateUser, authorizeRoles("admin"), createRequirement);
router.put("/:id", authenticateUser, authorizeRoles("admin"), updateRequirement);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("admin"),
  deleteRequirement
);

module.exports = router;
