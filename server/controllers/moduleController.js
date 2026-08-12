const Module = require("../models/Module");
const Career = require("../models/Career");
const Phase = require("../models/Phase");

// Create a module for a career
const createModule = async (req, res) => {
  try {
    const { career, title, description, order, estimatedHours, phase } = req.body;

    const careerExists = await Career.findById(career);

    if (!careerExists) {
      return res.status(404).json({
        message: "Career not found",
      });
    }

    if (phase) {
      const phaseExists = await Phase.findById(phase);

      if (!phaseExists) {
        return res.status(404).json({
          message: "Phase not found",
        });
      }

      if (phaseExists.career.toString() !== career.toString()) {
        return res.status(400).json({
          message: "Phase does not belong to the specified career",
        });
      }
    }

    if (phase) {
      const existingModule = await Module.findOne({ phase, order });

      if (existingModule) {
        return res.status(400).json({
          message: "A module with this order already exists for this phase",
        });
      }
    } else {
      const existingModule = await Module.findOne({ career, order });

      if (existingModule) {
        return res.status(400).json({
          message: "A module with this order already exists for this career",
        });
      }
    }

    const newModule = await Module.create({
      career,
      title,
      description,
      order,
      estimatedHours,
      phase: phase || null,
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

// Get all active modules belonging to a phase
const getModulesByPhase = async (req, res) => {
  try {
    const phaseExists = await Phase.findById(req.params.phaseId);

    if (!phaseExists) {
      return res.status(404).json({
        message: "Phase not found",
      });
    }

    const modules = await Module.find({
      phase: req.params.phaseId,
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

// Get single module by ID
const getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        message: "Module not found",
      });
    }

    res.status(200).json({
      module,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch module details",
      error: error.message,
    });
  }
};

module.exports = {
  createModule,
  getModulesByCareer,
  getModulesByPhase,
  getModuleById,
};