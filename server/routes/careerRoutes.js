const express = require("express");

const {
  createCareer,
  getCareers,
  getCareerBySlug,
} = require("../controllers/careerController");


const router = express.Router();

// Get all available careers
router.get("/", getCareers);

// Get a single career
router.get("/:slug", getCareerBySlug);

// Create career
router.post("/", createCareer);

module.exports = router;