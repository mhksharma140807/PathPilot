const express = require("express");
const {
  getAdminCareers,
  getAdminCareerById,
  createAdminCareer,
  updateAdminCareer,
  toggleAdminCareerStatus,
  deleteAdminCareer,
} = require("../controllers/adminCareerController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Protect ALL admin career management routes
router.use(authenticateUser);
router.use(authorizeRoles("admin"));

// Admin Career Routes
router.get("/", getAdminCareers);
router.get("/:id", getAdminCareerById);
router.post("/", createAdminCareer);
router.put("/:id", updateAdminCareer);
router.patch("/:id/status", toggleAdminCareerStatus);
router.delete("/:id", deleteAdminCareer);

module.exports = router;
