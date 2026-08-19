const Module = require("../models/Module");
const Career = require("../models/Career");
const Phase = require("../models/Phase");
const ModuleProgress = require("../models/ModuleProgress");
const CurriculumRequirement = require("../models/CurriculumRequirement");
const mongoose = require("mongoose");

/**
 * GET /api/admin/modules
 * Fetch all modules with career/phase populated, optional filtering, and relationship metrics
 */
const getAdminModules = async (req, res) => {
  try {
    const { career: careerId, phase: phaseId, status, search } = req.query;

    const filter = {};

    if (careerId) {
      filter.career = careerId;
    }

    if (phaseId) {
      filter.phase = phaseId === "null" ? null : phaseId;
    }

    if (status === "active") {
      filter.isActive = true;
    } else if (status === "inactive") {
      filter.isActive = false;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { "lessons.title": searchRegex },
      ];
    }

    const modules = await Module.find(filter)
      .populate("career", "_id title slug isActive")
      .populate("phase", "_id title order isActive")
      .sort({ career: 1, phase: 1, order: 1 });

    const modulesWithMetrics = await Promise.all(
      modules.map(async (mod) => {
        const [
          progressCount,
          requirementCount,
          dependentPrerequisiteCount,
        ] = await Promise.all([
          ModuleProgress.countDocuments({ module: mod._id }),
          CurriculumRequirement.countDocuments({ modules: mod._id }),
          Module.countDocuments({ prerequisites: mod._id }),
        ]);

        return {
          ...mod.toObject(),
          metrics: {
            progressCount,
            requirementCount,
            prerequisiteCount: mod.prerequisites ? mod.prerequisites.length : 0,
            dependentPrerequisiteCount,
          },
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: modulesWithMetrics.length,
      modules: modulesWithMetrics,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin modules",
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/modules/:id
 * Fetch single module details with career, phase, prerequisites, and metrics
 */
const getAdminModuleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID format",
      });
    }

    const module = await Module.findById(id)
      .populate("career", "_id title slug isActive")
      .populate("phase", "_id title order isActive")
      .populate("prerequisites", "_id title order");

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const [
      progressCount,
      requirementCount,
      dependentPrerequisiteCount,
    ] = await Promise.all([
      ModuleProgress.countDocuments({ module: id }),
      CurriculumRequirement.countDocuments({ modules: id }),
      Module.countDocuments({ prerequisites: id }),
    ]);

    return res.status(200).json({
      success: true,
      module: {
        ...module.toObject(),
        metrics: {
          progressCount,
          requirementCount,
          prerequisiteCount: module.prerequisites ? module.prerequisites.length : 0,
          dependentPrerequisiteCount,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch module details",
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/modules
 * Create a new module
 */
const createAdminModule = async (req, res) => {
  try {
    const {
      career,
      title,
      description,
      order,
      estimatedHours,
      objectives,
      lessons,
      phase,
      prerequisites,
      isActive,
    } = req.body;

    if (!career || !mongoose.Types.ObjectId.isValid(career)) {
      return res.status(400).json({
        success: false,
        message: "A valid career ID is required",
      });
    }

    const careerExists = await Career.findById(career);
    if (!careerExists) {
      return res.status(404).json({
        success: false,
        message: "Associated career not found",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Module title is required",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Module description is required",
      });
    }

    const orderNum = Number(order);
    if (isNaN(orderNum) || orderNum < 1) {
      return res.status(400).json({
        success: false,
        message: "Module order must be a positive integer (minimum 1)",
      });
    }

    const hoursNum = estimatedHours !== undefined ? Number(estimatedHours) : 0;
    if (isNaN(hoursNum) || hoursNum < 0) {
      return res.status(400).json({
        success: false,
        message: "Estimated hours must be a non-negative number",
      });
    }

    // Phase validation and Career matching
    let phaseId = null;
    if (phase) {
      if (!mongoose.Types.ObjectId.isValid(phase)) {
        return res.status(400).json({
          success: false,
          message: "Invalid phase ID format",
        });
      }

      const phaseExists = await Phase.findById(phase);
      if (!phaseExists) {
        return res.status(404).json({
          success: false,
          message: "Associated phase not found",
        });
      }

      if (phaseExists.career.toString() !== career.toString()) {
        return res.status(400).json({
          success: false,
          message: `Selected phase "${phaseExists.title}" does not belong to the specified career "${careerExists.title}"`,
        });
      }

      phaseId = phase;

      // Check order uniqueness within the phase
      const existingOrderModule = await Module.findOne({
        phase: phaseId,
        order: orderNum,
      });

      if (existingOrderModule) {
        return res.status(409).json({
          success: false,
          message: `A module with order #${orderNum} already exists in phase "${phaseExists.title}"`,
        });
      }
    }

    // Objectives processing
    let parsedObjectives = [];
    if (Array.isArray(objectives)) {
      parsedObjectives = objectives
        .map((obj) => String(obj).trim())
        .filter(Boolean);
    }

    // Lessons validation & processing
    let parsedLessons = [];
    if (Array.isArray(lessons)) {
      for (let i = 0; i < lessons.length; i++) {
        const les = lessons[i];
        if (!les.title || !les.title.trim()) {
          return res.status(400).json({
            success: false,
            message: `Lesson #${i + 1} is missing a title`,
          });
        }
        if (!les.content || !les.content.trim()) {
          return res.status(400).json({
            success: false,
            message: `Lesson #${i + 1} ("${les.title.trim()}") is missing content`,
          });
        }

        parsedLessons.push({
          title: les.title.trim(),
          duration: (les.duration || "15 mins").trim(),
          content: les.content.trim(),
          keyTakeaway: (les.keyTakeaway || "").trim(),
        });
      }
    }

    // Prerequisites processing
    let parsedPrerequisites = [];
    if (Array.isArray(prerequisites) && prerequisites.length > 0) {
      const validPrereqIds = prerequisites.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      if (validPrereqIds.length > 0) {
        const existingPrereqs = await Module.find({
          _id: { $in: validPrereqIds },
        }).select("_id");
        parsedPrerequisites = existingPrereqs.map((p) => p._id);
      }
    }

    const newModule = await Module.create({
      career,
      title: title.trim(),
      description: description.trim(),
      order: orderNum,
      estimatedHours: hoursNum,
      objectives: parsedObjectives,
      lessons: parsedLessons,
      phase: phaseId,
      prerequisites: parsedPrerequisites,
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    const populatedModule = await Module.findById(newModule._id)
      .populate("career", "_id title slug isActive")
      .populate("phase", "_id title order isActive")
      .populate("prerequisites", "_id title order");

    return res.status(201).json({
      success: true,
      message: "Module created successfully",
      module: {
        ...populatedModule.toObject(),
        metrics: {
          progressCount: 0,
          requirementCount: 0,
          prerequisiteCount: parsedPrerequisites.length,
          dependentPrerequisiteCount: 0,
        },
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A module with this order already exists in the selected phase",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create module",
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/modules/:id
 * Update an existing module
 */
const updateAdminModule = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      career,
      title,
      description,
      order,
      estimatedHours,
      objectives,
      lessons,
      phase,
      prerequisites,
      isActive,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID format",
      });
    }

    const module = await Module.findById(id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const targetCareerId = career || module.career;
    if (!mongoose.Types.ObjectId.isValid(targetCareerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid career ID format",
      });
    }

    const careerExists = await Career.findById(targetCareerId);
    if (!careerExists) {
      return res.status(404).json({
        success: false,
        message: "Associated career not found",
      });
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Module title cannot be empty",
      });
    }

    if (description !== undefined && !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Module description cannot be empty",
      });
    }

    const targetOrder = order !== undefined ? Number(order) : module.order;
    if (isNaN(targetOrder) || targetOrder < 1) {
      return res.status(400).json({
        success: false,
        message: "Module order must be a positive integer (minimum 1)",
      });
    }

    const targetHours =
      estimatedHours !== undefined
        ? Number(estimatedHours)
        : module.estimatedHours;
    if (isNaN(targetHours) || targetHours < 0) {
      return res.status(400).json({
        success: false,
        message: "Estimated hours must be a non-negative number",
      });
    }

    // Target Phase validation
    let targetPhaseId = module.phase;
    if (phase !== undefined) {
      targetPhaseId = phase ? phase : null;
    }

    if (targetPhaseId) {
      if (!mongoose.Types.ObjectId.isValid(targetPhaseId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid phase ID format",
        });
      }

      const phaseExists = await Phase.findById(targetPhaseId);
      if (!phaseExists) {
        return res.status(404).json({
          success: false,
          message: "Associated phase not found",
        });
      }

      if (phaseExists.career.toString() !== targetCareerId.toString()) {
        return res.status(400).json({
          success: false,
          message: `Selected phase "${phaseExists.title}" does not belong to career "${careerExists.title}"`,
        });
      }

      // Check order uniqueness within phase (excluding current module)
      if (
        String(targetPhaseId) !== String(module.phase) ||
        targetOrder !== module.order
      ) {
        const orderExists = await Module.findOne({
          phase: targetPhaseId,
          order: targetOrder,
          _id: { $ne: id },
        });

        if (orderExists) {
          return res.status(409).json({
            success: false,
            message: `A module with order #${targetOrder} already exists in phase "${phaseExists.title}"`,
          });
        }
      }
    }

    // Objectives processing
    if (objectives !== undefined) {
      if (Array.isArray(objectives)) {
        module.objectives = objectives
          .map((obj) => String(obj).trim())
          .filter(Boolean);
      }
    }

    // Lessons processing
    if (lessons !== undefined) {
      if (Array.isArray(lessons)) {
        const parsedLessons = [];
        for (let i = 0; i < lessons.length; i++) {
          const les = lessons[i];
          if (!les.title || !les.title.trim()) {
            return res.status(400).json({
              success: false,
              message: `Lesson #${i + 1} is missing a title`,
            });
          }
          if (!les.content || !les.content.trim()) {
            return res.status(400).json({
              success: false,
              message: `Lesson #${i + 1} ("${les.title.trim()}") is missing content`,
            });
          }

          parsedLessons.push({
            title: les.title.trim(),
            duration: (les.duration || "15 mins").trim(),
            content: les.content.trim(),
            keyTakeaway: (les.keyTakeaway || "").trim(),
          });
        }
        module.lessons = parsedLessons;
      }
    }

    // Prerequisites processing (exclude self and validate existence)
    if (prerequisites !== undefined) {
      if (Array.isArray(prerequisites)) {
        const validIds = prerequisites
          .filter((pId) => mongoose.Types.ObjectId.isValid(pId))
          .filter((pId) => String(pId) !== String(id));

        if (validIds.length > 0) {
          const existingPrereqs = await Module.find({
            _id: { $in: validIds },
          }).select("_id");
          module.prerequisites = existingPrereqs.map((p) => p._id);
        } else {
          module.prerequisites = [];
        }
      }
    }

    module.career = targetCareerId;
    if (title !== undefined) module.title = title.trim();
    if (description !== undefined) module.description = description.trim();
    module.order = targetOrder;
    module.estimatedHours = targetHours;
    module.phase = targetPhaseId;
    if (typeof isActive === "boolean") module.isActive = isActive;

    await module.save();

    const updatedModule = await Module.findById(module._id)
      .populate("career", "_id title slug isActive")
      .populate("phase", "_id title order isActive")
      .populate("prerequisites", "_id title order");

    const [
      progressCount,
      requirementCount,
      dependentPrerequisiteCount,
    ] = await Promise.all([
      ModuleProgress.countDocuments({ module: id }),
      CurriculumRequirement.countDocuments({ modules: id }),
      Module.countDocuments({ prerequisites: id }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Module updated successfully",
      module: {
        ...updatedModule.toObject(),
        metrics: {
          progressCount,
          requirementCount,
          prerequisiteCount: updatedModule.prerequisites
            ? updatedModule.prerequisites.length
            : 0,
          dependentPrerequisiteCount,
        },
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A module with this order already exists in the target phase",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update module",
      error: error.message,
    });
  }
};

/**
 * PATCH /api/admin/modules/:id/status
 * Toggle module active status
 */
const toggleAdminModuleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID format",
      });
    }

    const module = await Module.findById(id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    if (typeof req.body.isActive === "boolean") {
      module.isActive = req.body.isActive;
    } else {
      module.isActive = !module.isActive;
    }

    await module.save();

    const updatedModule = await Module.findById(module._id)
      .populate("career", "_id title slug isActive")
      .populate("phase", "_id title order isActive")
      .populate("prerequisites", "_id title order");

    return res.status(200).json({
      success: true,
      message: `Module "${module.title}" ${
        module.isActive ? "activated" : "deactivated"
      } successfully`,
      module: updatedModule,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update module status",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/modules/:id
 * Safely delete a module (strictly checks dependent student progress, curriculum requirements, and dependent module prerequisites)
 */
const deleteAdminModule = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID format",
      });
    }

    const module = await Module.findById(id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const [
      progressCount,
      requirementCount,
      prerequisiteDependents,
    ] = await Promise.all([
      ModuleProgress.countDocuments({ module: id }),
      CurriculumRequirement.countDocuments({ modules: id }),
      Module.countDocuments({ prerequisites: id }),
    ]);

    if (progressCount > 0 || requirementCount > 0 || prerequisiteDependents > 0) {
      return res.status(409).json({
        success: false,
        message: `Cannot delete module "${module.title}" because it has active data dependencies (${progressCount} student progress records, ${requirementCount} curriculum requirements, ${prerequisiteDependents} dependent module prerequisites). Please remove or reassign dependent records first, or deactivate the module instead.`,
        dependencies: {
          progress: progressCount,
          requirements: requirementCount,
          prerequisiteDependents,
        },
      });
    }

    await Module.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `Module "${module.title}" deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete module",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminModules,
  getAdminModuleById,
  createAdminModule,
  updateAdminModule,
  toggleAdminModuleStatus,
  deleteAdminModule,
};
