const Phase = require("../models/Phase");
const Career = require("../models/Career");
const Module = require("../models/Module");
const CurriculumRequirement = require("../models/CurriculumRequirement");

/**
 * GET /api/admin/phases
 * Fetch all phases (active & inactive) with career populated and module counts
 */
const getAdminPhases = async (req, res) => {
  try {
    const { career: careerId } = req.query;

    const query = {};
    if (careerId) {
      query.career = careerId;
    }

    const phases = await Phase.find(query)
      .populate("career", "_id title slug isActive")
      .sort({ career: 1, order: 1 });

    const phasesWithCounts = await Promise.all(
      phases.map(async (phase) => {
        const [moduleCount, activeModuleCount, requirementCount] =
          await Promise.all([
            Module.countDocuments({ phase: phase._id }),
            Module.countDocuments({ phase: phase._id, isActive: true }),
            CurriculumRequirement.countDocuments({ phase: phase._id }),
          ]);

        return {
          ...phase.toObject(),
          moduleCount,
          activeModuleCount,
          requirementCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: phasesWithCounts.length,
      phases: phasesWithCounts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin phases",
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/phases/:id
 * Fetch single phase details with career & metrics
 */
const getAdminPhaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const phase = await Phase.findById(id).populate(
      "career",
      "_id title slug isActive"
    );

    if (!phase) {
      return res.status(404).json({
        success: false,
        message: "Phase not found",
      });
    }

    const [moduleCount, requirementCount] = await Promise.all([
      Module.countDocuments({ phase: phase._id }),
      CurriculumRequirement.countDocuments({ phase: phase._id }),
    ]);

    return res.status(200).json({
      success: true,
      phase: {
        ...phase.toObject(),
        moduleCount,
        requirementCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch phase details",
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/phases
 * Create a new phase for a career
 */
const createAdminPhase = async (req, res) => {
  try {
    const {
      career,
      title,
      description,
      order,
      isActive,
      prerequisitePhases,
    } = req.body;

    if (!career) {
      return res.status(400).json({
        success: false,
        message: "Career is required",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phase title is required",
      });
    }

    const orderNum = Number(order);
    if (isNaN(orderNum) || orderNum < 1) {
      return res.status(400).json({
        success: false,
        message: "Phase order must be a positive integer (minimum 1)",
      });
    }

    const careerExists = await Career.findById(career);
    if (!careerExists) {
      return res.status(404).json({
        success: false,
        message: "Associated career not found",
      });
    }

    // Check order uniqueness within the specified career
    const existingOrderPhase = await Phase.findOne({
      career,
      order: orderNum,
    });

    if (existingOrderPhase) {
      return res.status(409).json({
        success: false,
        message: `Phase with order #${orderNum} already exists for career "${careerExists.title}"`,
      });
    }

    const newPhase = await Phase.create({
      career,
      title: title.trim(),
      description: (description || "").trim(),
      order: orderNum,
      isActive: typeof isActive === "boolean" ? isActive : true,
      prerequisitePhases: Array.isArray(prerequisitePhases)
        ? prerequisitePhases
        : [],
    });

    const populatedPhase = await Phase.findById(newPhase._id).populate(
      "career",
      "_id title slug isActive"
    );

    return res.status(201).json({
      success: true,
      message: "Phase created successfully",
      phase: {
        ...populatedPhase.toObject(),
        moduleCount: 0,
        requirementCount: 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create phase",
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/phases/:id
 * Update an existing phase
 */
const updateAdminPhase = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      career,
      title,
      description,
      order,
      isActive,
      prerequisitePhases,
    } = req.body;

    const phase = await Phase.findById(id);
    if (!phase) {
      return res.status(404).json({
        success: false,
        message: "Phase not found",
      });
    }

    const targetCareerId = career || phase.career;
    const targetOrder = order !== undefined ? Number(order) : phase.order;

    if (isNaN(targetOrder) || targetOrder < 1) {
      return res.status(400).json({
        success: false,
        message: "Phase order must be a positive integer (minimum 1)",
      });
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phase title cannot be empty",
      });
    }

    if (career && String(career) !== String(phase.career)) {
      const careerExists = await Career.findById(career);
      if (!careerExists) {
        return res.status(404).json({
          success: false,
          message: "Associated career not found",
        });
      }
    }

    // Check order uniqueness if career or order is changing
    if (
      String(targetCareerId) !== String(phase.career) ||
      targetOrder !== phase.order
    ) {
      const orderExists = await Phase.findOne({
        career: targetCareerId,
        order: targetOrder,
        _id: { $ne: id },
      });

      if (orderExists) {
        return res.status(409).json({
          success: false,
          message: `Phase with order #${targetOrder} already exists for this career`,
        });
      }
    }

    phase.career = targetCareerId;
    if (title !== undefined) phase.title = title.trim();
    if (description !== undefined) phase.description = description.trim();
    phase.order = targetOrder;
    if (typeof isActive === "boolean") phase.isActive = isActive;
    if (Array.isArray(prerequisitePhases))
      phase.prerequisitePhases = prerequisitePhases;

    await phase.save();

    const updatedPhase = await Phase.findById(phase._id).populate(
      "career",
      "_id title slug isActive"
    );

    const [moduleCount, requirementCount] = await Promise.all([
      Module.countDocuments({ phase: phase._id }),
      CurriculumRequirement.countDocuments({ phase: phase._id }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Phase updated successfully",
      phase: {
        ...updatedPhase.toObject(),
        moduleCount,
        requirementCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update phase",
      error: error.message,
    });
  }
};

/**
 * PATCH /api/admin/phases/:id/status
 * Toggle phase active status
 */
const toggleAdminPhaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const phase = await Phase.findById(id);

    if (!phase) {
      return res.status(404).json({
        success: false,
        message: "Phase not found",
      });
    }

    if (typeof req.body.isActive === "boolean") {
      phase.isActive = req.body.isActive;
    } else {
      phase.isActive = !phase.isActive;
    }

    await phase.save();

    const updatedPhase = await Phase.findById(phase._id).populate(
      "career",
      "_id title slug isActive"
    );

    return res.status(200).json({
      success: true,
      message: `Phase "${phase.title}" ${
        phase.isActive ? "activated" : "deactivated"
      } successfully`,
      phase: updatedPhase,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update phase status",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/phases/:id
 * Relationship-aware delete for phases (checks modules and curriculum requirements)
 */
const deleteAdminPhase = async (req, res) => {
  try {
    const { id } = req.params;
    const phase = await Phase.findById(id);

    if (!phase) {
      return res.status(404).json({
        success: false,
        message: "Phase not found",
      });
    }

    // Check dependent records
    const [moduleCount, requirementCount] = await Promise.all([
      Module.countDocuments({ phase: id }),
      CurriculumRequirement.countDocuments({ phase: id }),
    ]);

    if (moduleCount > 0 || requirementCount > 0) {
      return res.status(409).json({
        success: false,
        message: `Cannot delete phase "${phase.title}" because it contains dependent curriculum data (${moduleCount} modules, ${requirementCount} curriculum requirements). Please remove or reassign dependent records first, or deactivate the phase instead.`,
        dependencies: {
          modules: moduleCount,
          requirements: requirementCount,
        },
      });
    }

    await Phase.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `Phase "${phase.title}" deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete phase",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminPhases,
  getAdminPhaseById,
  createAdminPhase,
  updateAdminPhase,
  toggleAdminPhaseStatus,
  deleteAdminPhase,
};
