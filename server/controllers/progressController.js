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

const markLessonComplete = async (req, res) => {
  try {
    const studentId = req.user._id || req.user.id;
    const { moduleId, lessonId } = req.body;

    if (!moduleId || !lessonId) {
      return res.status(400).json({
        message: "moduleId and lessonId are required",
      });
    }

    const enrollment = await CareerEnrollment.findOne({
      student: studentId,
      status: "active",
    });

    if (!enrollment) {
      return res.status(404).json({
        message: "No active career selected",
      });
    }

    const targetModule = await Module.findOne({
      _id: moduleId,
      career: enrollment.career,
      isActive: true,
    });

    if (!targetModule) {
      return res.status(404).json({
        message: "Module not found in your selected career",
      });
    }

    const targetLesson = targetModule.lessons && targetModule.lessons.id
      ? targetModule.lessons.id(lessonId)
      : targetModule.lessons.find((l) => l._id && l._id.toString() === lessonId.toString());

    if (!targetLesson) {
      return res.status(404).json({
        message: "Lesson not found in this module",
      });
    }

    // Evaluate module prerequisites
    if (targetModule.prerequisites && targetModule.prerequisites.length > 0) {
      const prereqProgress = await ModuleProgress.find({
        student: studentId,
        career: enrollment.career,
        module: { $in: targetModule.prerequisites },
      });

      const completedPrereqSet = new Set(
        prereqProgress
          .filter(
            (p) =>
              p.status === "completed" ||
              (typeof p.progressPercentage === "number" &&
                p.progressPercentage >= 100)
          )
          .map((p) => p.module.toString())
      );

      const allPrereqsMet = targetModule.prerequisites.every((prereqId) =>
        completedPrereqSet.has(prereqId.toString())
      );

      if (!allPrereqsMet) {
        return res.status(403).json({
          message: "Module prerequisites are not completed",
        });
      }
    }

    let progress = await ModuleProgress.findOne({
      student: studentId,
      module: moduleId,
    });

    if (!progress) {
      progress = new ModuleProgress({
        student: studentId,
        career: enrollment.career,
        module: moduleId,
        status: "not_started",
        progressPercentage: 0,
        completedAt: null,
        completedLessons: [],
      });
    }

    if (!Array.isArray(progress.completedLessons)) {
      progress.completedLessons = [];
    }

    const alreadyCompleted = progress.completedLessons.some(
      (cl) => cl.lessonId && cl.lessonId.toString() === lessonId.toString()
    );

    if (!alreadyCompleted) {
      progress.completedLessons.push({
        lessonId: targetLesson._id,
        completedAt: new Date(),
      });
    }

    // Recalculate progress based on unique completed lessons that still belong to module
    const validLessonIdSet = new Set(
      targetModule.lessons.map((l) => l._id.toString())
    );

    const validCompletedCount = progress.completedLessons.filter(
      (cl) => cl.lessonId && validLessonIdSet.has(cl.lessonId.toString())
    ).length;

    const totalLessons = targetModule.lessons.length;
    let computedPercentage = 0;

    if (totalLessons > 0) {
      computedPercentage = Math.round(
        (validCompletedCount / totalLessons) * 100
      );
    }

    computedPercentage = Math.min(Math.max(computedPercentage, 0), 100);

    let computedStatus = "not_started";
    if (computedPercentage >= 100) {
      computedStatus = "completed";
    } else if (computedPercentage > 0) {
      computedStatus = "in_progress";
    }

    progress.status = computedStatus;
    progress.progressPercentage = computedPercentage;
    progress.completedAt = computedStatus === "completed" ? (progress.completedAt || new Date()) : null;

    await progress.save();

    res.status(200).json({
      message: "Lesson marked complete",
      progress: {
        _id: progress._id,
        student: progress.student,
        career: progress.career,
        module: progress.module,
        moduleId: progress.module,
        status: progress.status,
        progressPercentage: progress.progressPercentage,
        completedAt: progress.completedAt,
        completedLessons: progress.completedLessons,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark lesson complete",
      error: error.message,
    });
  }
};

module.exports = {
  getMyProgress,
  updateModuleProgress,
  markLessonComplete,
};