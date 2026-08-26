const Phase = require("../models/Phase");
const Career = require("../models/Career");

// Create a phase for a career
const createPhase = async (req, res) => {
  try {
    const { career, title, description, order, isActive } = req.body;

    const careerExists = await Career.findById(career);

    if (!careerExists) {
      return res.status(404).json({
        message: "Career not found",
      });
    }

    const existingPhase = await Phase.findOne({ career, order });

    if (existingPhase) {
      return res.status(400).json({
        message: "A phase with this order already exists for this career",
      });
    }

    const newPhase = await Phase.create({
      career,
      title,
      description,
      order,
      isActive,
    });

    res.status(201).json({
      message: "Phase created successfully",
      phase: newPhase,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create phase",
      error: error.message,
    });
  }
};

// Get all active phases of a career
const getPhasesByCareer = async (req, res) => {
  try {
    const phases = await Phase.find({
      career: req.params.careerId,
      isActive: true,
    }).sort({ order: 1 });

    res.status(200).json({
      count: phases.length,
      phases,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch phases",
      error: error.message,
    });
  }
};

// Get single phase by ID
const getPhaseById = async (req, res) => {
  try {
    const phase = await Phase.findById(req.params.id).populate("career");

    if (!phase) {
      return res.status(404).json({
        message: "Phase not found",
      });
    }

    res.status(200).json({
      phase,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch phase details",
      error: error.message,
    });
  }
};

module.exports = {
  createPhase,
  getPhasesByCareer,
  getPhaseById,
};
