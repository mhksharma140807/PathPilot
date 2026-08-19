const CurriculumRequirement = require("../models/CurriculumRequirement");
const Phase = require("../models/Phase");
const Module = require("../models/Module");
const Career = require("../models/Career");
const mongoose = require("mongoose");

/**
 * Helper function to validate curriculum requirement input parameters
 */
const validateRequirementInputs = async ({
  phaseId,
  type,
  modules,
  minRequired,
  excludeRequirementId = null,
}) => {
  // 1. Validate Phase
  if (!phaseId || !mongoose.Types.ObjectId.isValid(phaseId)) {
    return { valid: false, status: 400, message: "A valid phase ID is required" };
  }

  const phaseExists = await Phase.findById(phaseId);
  if (!phaseExists) {
    return { valid: false, status: 404, message: "Associated phase not found" };
  }

  // 2. Validate Type
  const allowedTypes = ["required", "optional", "choice_group"];
  if (!type || !allowedTypes.includes(type)) {
    return {
      valid: false,
      status: 400,
      message: "Requirement type must be one of: required, optional, choice_group",
    };
  }

  // 3. Validate Modules Array
  if (!Array.isArray(modules) || modules.length === 0) {
    return {
      valid: false,
      status: 400,
      message: "Modules selection must be a non-empty array",
    };
  }

  // Deduplicate module IDs while preserving valid ObjectId strings
  const validModuleIds = modules.filter((id) => mongoose.Types.ObjectId.isValid(id));
  if (validModuleIds.length === 0) {
    return {
      valid: false,
      status: 400,
      message: "One or more provided module IDs are invalid",
    };
  }

  const uniqueModuleIdStrs = [
    ...new Set(validModuleIds.map((id) => id.toString().trim())),
  ];

  // 4. Validate All Modules Exist
  const foundModules = await Module.find({ _id: { $in: uniqueModuleIdStrs } });
  if (foundModules.length !== uniqueModuleIdStrs.length) {
    return {
      valid: false,
      status: 400,
      message: "One or more specified modules do not exist in the database",
    };
  }

  // Verify EVERY module belongs to the specified phase
  const mismatchedModule = foundModules.find(
    (mod) => !mod.phase || mod.phase.toString() !== phaseId.toString()
  );

  if (mismatchedModule) {
    return {
      valid: false,
      status: 400,
      message: `Module "${mismatchedModule.title}" does not belong to the selected phase "${phaseExists.title}"`,
    };
  }

  // 5. Type-Specific Rules for minRequired
  let resolvedMinRequired = 1;

  if (type === "required") {
    resolvedMinRequired = 1;
  } else if (type === "optional") {
    resolvedMinRequired = 0;
  } else if (type === "choice_group") {
    if (uniqueModuleIdStrs.length < 2) {
      return {
        valid: false,
        status: 400,
        message: "Choice group requirements require at least 2 modules to select from",
      };
    }

    const minReqNum = Number(minRequired);
    if (
      isNaN(minReqNum) ||
      minReqNum < 1 ||
      minReqNum > uniqueModuleIdStrs.length
    ) {
      return {
        valid: false,
        status: 400,
        message: `minRequired for choice_group must be an integer between 1 and ${uniqueModuleIdStrs.length}`,
      };
    }
    resolvedMinRequired = minReqNum;
  }

  // 6. Duplicate Requirement Check (Identical phase, type, and module set)
  const queryFilter = { phase: phaseId, type };
  if (excludeRequirementId) {
    queryFilter._id = { $ne: excludeRequirementId };
  }

  const existingReqs = await CurriculumRequirement.find(queryFilter);
  const newSet = new Set(uniqueModuleIdStrs);

  const isDuplicate = existingReqs.some((req) => {
    if (req.modules.length !== newSet.size) return false;
    return req.modules.every((mId) => newSet.has(mId.toString()));
  });

  if (isDuplicate) {
    return {
      valid: false,
      status: 409,
      message:
        "An identical curriculum requirement with the same phase, type, and module set already exists",
    };
  }

  return {
    valid: true,
    data: {
      phase: phaseId,
      type,
      modules: uniqueModuleIdStrs,
      minRequired: resolvedMinRequired,
    },
  };
};

/**
 * GET /api/admin/curriculum-requirements
 * Fetch all curriculum requirements with optional query filters (?career=, ?phase=, ?type=, ?search=)
 */
const getAdminRequirements = async (req, res) => {
  try {
    const { career: careerId, phase: phaseId, type, search } = req.query;

    let targetPhaseIds = null;

    // Filter by career if specified
    if (careerId && mongoose.Types.ObjectId.isValid(careerId)) {
      const careerPhases = await Phase.find({ career: careerId }).select("_id");
      targetPhaseIds = careerPhases.map((p) => p._id.toString());
    }

    const filter = {};

    if (phaseId && mongoose.Types.ObjectId.isValid(phaseId)) {
      filter.phase = phaseId;
    } else if (targetPhaseIds !== null) {
      filter.phase = { $in: targetPhaseIds };
    }

    if (type && ["required", "optional", "choice_group"].includes(type)) {
      filter.type = type;
    }

    let requirements = await CurriculumRequirement.find(filter)
      .populate({
        path: "phase",
        select: "_id title order isActive career",
        populate: {
          path: "career",
          select: "_id title slug isActive",
        },
      })
      .populate("modules", "_id title order isActive phase")
      .sort({ createdAt: -1 });

    // Perform text search if provided
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      requirements = requirements.filter((reqDoc) => {
        const careerTitle = reqDoc.phase?.career?.title || "";
        const phaseTitle = reqDoc.phase?.title || "";
        const moduleTitles = reqDoc.modules?.map((m) => m.title).join(" ") || "";
        return (
          searchRegex.test(careerTitle) ||
          searchRegex.test(phaseTitle) ||
          searchRegex.test(moduleTitles)
        );
      });
    }

    // Format response payload
    const formattedRequirements = requirements.map((reqDoc) => {
      const obj = reqDoc.toObject();
      const careerObj = obj.phase?.career || null;
      return {
        ...obj,
        career: careerObj,
        moduleCount: obj.modules ? obj.modules.length : 0,
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedRequirements.length,
      requirements: formattedRequirements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch curriculum requirements",
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/curriculum-requirements/:id
 * Fetch single requirement by ID with populated phase, career, and modules
 */
const getAdminRequirementById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid requirement ID format",
      });
    }

    const requirement = await CurriculumRequirement.findById(id)
      .populate({
        path: "phase",
        select: "_id title order isActive career",
        populate: {
          path: "career",
          select: "_id title slug isActive",
        },
      })
      .populate("modules", "_id title order isActive phase");

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: "Curriculum requirement not found",
      });
    }

    const obj = requirement.toObject();
    const careerObj = obj.phase?.career || null;

    return res.status(200).json({
      success: true,
      requirement: {
        ...obj,
        career: careerObj,
        moduleCount: obj.modules ? obj.modules.length : 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch curriculum requirement details",
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/curriculum-requirements
 * Create a new curriculum requirement rule
 */
const createAdminRequirement = async (req, res) => {
  try {
    const { phase, type, modules, minRequired } = req.body;

    const validation = await validateRequirementInputs({
      phaseId: phase,
      type,
      modules,
      minRequired,
    });

    if (!validation.valid) {
      return res.status(validation.status).json({
        success: false,
        message: validation.message,
      });
    }

    const newRequirement = await CurriculumRequirement.create(validation.data);

    const populatedRequirement = await CurriculumRequirement.findById(newRequirement._id)
      .populate({
        path: "phase",
        select: "_id title order isActive career",
        populate: {
          path: "career",
          select: "_id title slug isActive",
        },
      })
      .populate("modules", "_id title order isActive phase");

    const obj = populatedRequirement.toObject();
    const careerObj = obj.phase?.career || null;

    return res.status(201).json({
      success: true,
      message: "Curriculum requirement created successfully",
      requirement: {
        ...obj,
        career: careerObj,
        moduleCount: obj.modules ? obj.modules.length : 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create curriculum requirement",
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/curriculum-requirements/:id
 * Update an existing curriculum requirement rule
 */
const updateAdminRequirement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid requirement ID format",
      });
    }

    const existingReq = await CurriculumRequirement.findById(id);
    if (!existingReq) {
      return res.status(404).json({
        success: false,
        message: "Curriculum requirement not found",
      });
    }

    const phaseId = req.body.phase || existingReq.phase.toString();
    const type = req.body.type || existingReq.type;
    const modules = req.body.modules || existingReq.modules;
    const minRequired =
      req.body.minRequired !== undefined
        ? req.body.minRequired
        : existingReq.minRequired;

    const validation = await validateRequirementInputs({
      phaseId,
      type,
      modules,
      minRequired,
      excludeRequirementId: id,
    });

    if (!validation.valid) {
      return res.status(validation.status).json({
        success: false,
        message: validation.message,
      });
    }

    existingReq.phase = validation.data.phase;
    existingReq.type = validation.data.type;
    existingReq.modules = validation.data.modules;
    existingReq.minRequired = validation.data.minRequired;

    await existingReq.save();

    const updatedRequirement = await CurriculumRequirement.findById(existingReq._id)
      .populate({
        path: "phase",
        select: "_id title order isActive career",
        populate: {
          path: "career",
          select: "_id title slug isActive",
        },
      })
      .populate("modules", "_id title order isActive phase");

    const obj = updatedRequirement.toObject();
    const careerObj = obj.phase?.career || null;

    return res.status(200).json({
      success: true,
      message: "Curriculum requirement updated successfully",
      requirement: {
        ...obj,
        career: careerObj,
        moduleCount: obj.modules ? obj.modules.length : 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update curriculum requirement",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/curriculum-requirements/:id
 * Delete a curriculum requirement rule
 */
const deleteAdminRequirement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid requirement ID format",
      });
    }

    const requirement = await CurriculumRequirement.findById(id).populate("phase", "_id title");

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: "Curriculum requirement not found",
      });
    }

    await CurriculumRequirement.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Curriculum requirement deleted successfully",
      requirement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete curriculum requirement",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminRequirements,
  getAdminRequirementById,
  createAdminRequirement,
  updateAdminRequirement,
  deleteAdminRequirement,
};
