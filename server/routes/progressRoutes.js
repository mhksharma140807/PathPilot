const express = require("express");

const {
  getMyProgress,
  updateModuleProgress,
} = require("../controllers/progressController");

const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", authenticateUser, getMyProgress);

router.put("/module", authenticateUser, updateModuleProgress);

module.exports = router;