const express = require("express");
const { getCurriculumState } = require("../controllers/curriculumController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateUser, getCurriculumState);

module.exports = router;
