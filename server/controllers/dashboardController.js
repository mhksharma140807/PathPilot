const CareerEnrollment = require("../models/CareerEnrollment");
const Module = require("../models/Module");
const ModuleProgress = require("../models/ModuleProgress");

const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id || req.user.id;

    const enrollment = await CareerEnrollment.findOne({
      student: studentId,
      status: "active",
    }).populate("career");

    if (!enrollment) {
      return res.status(200).json({
        hasEnrollment: false,
        career: null,
        summary: {
          totalModules: 0,
          completedModules: 0,
          overallProgress: 0,
        },
        modules: [],
      });
    }

    const modules = await Module.find({
      career: enrollment.career._id,
      isActive: true,
    }).sort({ order: 1 });

    const progressRecords = await ModuleProgress.find({
      student: studentId,
      career: enrollment.career._id,
    });

    const progressMap = new Map(
      progressRecords.map((item) => [
        item.module.toString(),
        item,
      ])
    );

    const moduleData = modules.map((module) => {
      const progress = progressMap.get(module._id.toString());

      return {
        moduleId: module._id,
        title: module.title,
        description: module.description,
        order: module.order,
        estimatedHours: module.estimatedHours,
        status: progress?.status || "not_started",
        progressPercentage: progress?.progressPercentage || 0,
      };
    });

    const totalModules = moduleData.length;

    const completedModules = moduleData.filter(
      (module) => module.status === "completed"
    ).length;

    const overallProgress =
      totalModules > 0
        ? Math.round(
            moduleData.reduce(
              (total, module) => total + module.progressPercentage,
              0
            ) / totalModules
          )
        : 0;

    res.status(200).json({
      hasEnrollment: true,
      career: enrollment.career,
      summary: {
        totalModules,
        completedModules,
        overallProgress,
      },
      modules: moduleData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load student dashboard",
      error: error.message,
    });
  }
};

module.exports = {
  getStudentDashboard,
};