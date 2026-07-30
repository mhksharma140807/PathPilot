const express = require("express");

const {
  getStudentDashboard,
} = require("../controllers/dashboardController");

const {
  authenticateUser,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/student",
  authenticateUser,
  getStudentDashboard
);

module.exports = router;