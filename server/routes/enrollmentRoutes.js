const express = require("express");

const {
  selectCareer,
  getMyCareer,
} = require("../controllers/enrollmentController");

const {
  authenticateUser,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Select a career
router.post("/", authenticateUser, selectCareer);

// Get currently selected career
router.get("/me", authenticateUser, getMyCareer);

module.exports = router;