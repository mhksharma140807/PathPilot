const express = require("express");
const {
  getAdminRequirements,
  getAdminRequirementById,
  createAdminRequirement,
  updateAdminRequirement,
  deleteAdminRequirement,
} = require("../controllers/adminCurriculumRequirementController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Protect ALL admin curriculum requirement routes
router.use(authenticateUser);
router.use(authorizeRoles("admin"));

// Admin Curriculum Requirement Routes
router.get("/", getAdminRequirements);
router.get("/:id", getAdminRequirementById);
router.post("/", createAdminRequirement);
router.put("/:id", updateAdminRequirement);
router.delete("/:id", deleteAdminRequirement);

module.exports = router;
