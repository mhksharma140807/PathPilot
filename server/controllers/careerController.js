const Career = require("../models/Career");

// Create a new career
const createCareer = async (req, res) => {
  try {
    const { title, slug, description, overview, skills, estimatedDuration } =
      req.body;

    const existingCareer = await Career.findOne({ slug });

    if (existingCareer) {
      return res.status(400).json({
        message: "Career with this slug already exists",
      });
    }

    const career = await Career.create({
      title,
      slug,
      description,
      overview,
      skills,
      estimatedDuration,
    });

    res.status(201).json({
      message: "Career created successfully",
      career,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create career",
      error: error.message,
    });
  }
};

// Get all active careers
const getCareers = async (req, res) => {
  try {
    const careers = await Career.find({ isActive: true }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      count: careers.length,
      careers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch careers",
      error: error.message,
    });
  }
};

// Get one career by slug
const getCareerBySlug = async (req, res) => {
  try {
    const career = await Career.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!career) {
      return res.status(404).json({
        message: "Career not found",
      });
    }

    res.status(200).json({
      career,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch career",
      error: error.message,
    });
  }
};

module.exports = {
  createCareer,
  getCareers,
  getCareerBySlug,
};