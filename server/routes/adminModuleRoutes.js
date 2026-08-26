const express = require("express");
const {
  getAdminModules,
  getAdminModuleById,
  createAdminModule,
  updateAdminModule,
  toggleAdminModuleStatus,
  deleteAdminModule,
} = require("../controllers/adminModuleController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Protect ALL admin module management routes
router.use(authenticateUser);
router.use(authorizeRoles("admin"));

// Admin Module Routes
router.get("/", getAdminModules);
router.get("/:id", getAdminModuleById);
router.post("/", createAdminModule);
router.put("/:id", updateAdminModule);
router.patch("/:id/status", toggleAdminModuleStatus);
router.delete("/:id", deleteAdminModule);

module.exports = router;
