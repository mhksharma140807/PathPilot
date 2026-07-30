const Module = require("../models/Module");
const Career = require("../models/Career");

// Create a module for a career
const createModule = async (req, res) => {
  try {
    const { career, title, description, order, estimatedHours } = req.body;

    const careerExists = await Career.findById(career);

    if (!careerExists) {
      return res.status(404).json({
        message: "Career not found",
      });
    }

    const existingModule = await Module.findOne({ career, order });

    if (existingModule) {
      return res.status(400).json({
        message: "A module with this order already exists for this career",
      });
    }

    const newModule = await Module.create({
      career,
      title,
      description,
      order,
      estimatedHours,
    });

    res.status(201).json({
      message: "Module created successfully",
      module: newModule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create module",
      error: error.message,
    });
  }
};

// Get all modules of a career
const getModulesByCareer = async (req, res) => {
  try {
    const modules = await Module.find({
      career: req.params.careerId,
      isActive: true,
    }).sort({ order: 1 });

    res.status(200).json({
      count: modules.length,
      modules,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch modules",
      error: error.message,
    });
  }
};

module.exports = {
  createModule,
  getModulesByCareer,
};