const express = require("express");
const { getAdminDashboardData } = require("../controllers/adminController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/admin/dashboard - Read-only admin dashboard stats
router.get(
  "/dashboard",
  authenticateUser,
  authorizeRoles("admin"),
  getAdminDashboardData
);

module.exports = router;
