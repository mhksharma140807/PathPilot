const express = require("express");
const {
  getAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
  toggleAdminUserStatus,
  deleteAdminUser,
} = require("../controllers/adminUserController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Protect ALL admin user management routes
router.use(authenticateUser);
router.use(authorizeRoles("admin"));

// Admin User Management Routes
router.get("/", getAdminUsers);
router.get("/:id", getAdminUserById);
router.post("/", createAdminUser);
router.put("/:id", updateAdminUser);
router.patch("/:id/status", toggleAdminUserStatus);
router.delete("/:id", deleteAdminUser);

module.exports = router;
