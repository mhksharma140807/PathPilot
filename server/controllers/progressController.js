const ModuleProgress = require("../models/ModuleProgress");
const CareerEnrollment = require("../models/CareerEnrollment");
const Module = require("../models/Module");

const getMyProgress = async (req, res) => {
  try {
    const studentId = req.user._id || req.user.id;

    const enrollment = await CareerEnrollment.findOne({
      student: studentId,
      status: "active",
    });

    if (!enrollment) {
      return res.status(200).json({
        career: null,
        totalModules: 0,
        progress: [],
        message: "No active career selected",
      });
    }

    const modules = await Module.find({
      career: enrollment.career,
      isActive: true,
    }).sort({ order: 1 });

    const progress = await ModuleProgress.find({
      student: studentId,
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
    const studentId = req.user._id || req.user.id;
    const { moduleId, status: inputStatus, progressPercentage: inputPercentage, progress: inputProgress } = req.body;

    const computedPercentage = typeof inputPercentage === "number" ? inputPercentage : (typeof inputProgress === "number" ? inputProgress : 0);
    const computedStatus = inputStatus || (computedPercentage >= 100 ? "completed" : computedPercentage > 0 ? "in_progress" : "not_started");

    const enrollment = await CareerEnrollment.findOne({
      student: studentId,
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
        student: studentId,
        module: moduleId,
      },
      {
        student: studentId,
        career: enrollment.career,
        module: moduleId,
        status: computedStatus,
        progressPercentage: computedPercentage,
        completedAt: computedStatus === "completed" ? new Date() : null,
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