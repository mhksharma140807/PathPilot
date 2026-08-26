const express = require("express");

const {
  getMyProgress,
  updateModuleProgress,
  markLessonComplete,
} = require("../controllers/progressController");

const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", authenticateUser, getMyProgress);

router.put("/module", authenticateUser, updateModuleProgress);

router.post("/lesson", authenticateUser, markLessonComplete);

module.exports = router;