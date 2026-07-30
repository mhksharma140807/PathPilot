const express = require("express");

const {
  createModule,
  getModulesByCareer,
} = require("../controllers/moduleController");

const router = express.Router();

// Get modules belonging to a career
router.get("/career/:careerId", getModulesByCareer);

// Create a module
router.post("/", createModule);

module.exports = router;