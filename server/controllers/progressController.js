const ModuleProgress = require("../models/ModuleProgress");
const CareerEnrollment = require("../models/CareerEnrollment");
const Module = require("../models/Module");

const getMyProgress = async (req, res) => {
  try {
    const enrollment = await CareerEnrollment.findOne({
      student: req.user._id,
      status: "active",
    });

    if (!enrollment) {
      return res.status(404).json({
        message: "No active career selected",
      });
    }

    const modules = await Module.find({
      career: enrollment.career,
      isActive: true,
    }).sort({ order: 1 });

    const progress = await ModuleProgress.find({
      student: req.user._id,
      career: enrollment.career,
    }).populate("module", "title description order estimatedHours");

    res.status(200).json({
      career: enrollment.career,
      totalModules: modules.length,
      progress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch progress",
      error: error.message,
    });
  }
};

const updateModuleProgress = async (req, res) => {
  try {
    const { moduleId, status, progressPercentage } = req.body;

    const enrollment = await CareerEnrollment.findOne({
      student: req.user._id,
      status: "active",
    });

    if (!enrollment) {
      return res.status(404).json({
        message: "No active career selected",
      });
    }

    const module = await Module.findOne({
      _id: moduleId,
      career: enrollment.career,
      isActive: true,
    });

    if (!module) {
      return res.status(404).json({
        message: "Module not found in your selected career",
      });
    }

    const progress = await ModuleProgress.findOneAndUpdate(
      {
        student: req.user._id,
        module: moduleId,
      },
      {
        student: req.user._id,
        career: enrollment.career,
        module: moduleId,
        status,
        progressPercentage,
        completedAt: status === "completed" ? new Date() : null,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).populate("module", "title description order estimatedHours");

    res.status(200).json({
      message: "Module progress updated successfully",
      progress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update module progress",
      error: error.message,
    });
  }
};

module.exports = {
  getMyProgress,
  updateModuleProgress,
};