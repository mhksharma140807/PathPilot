const CurriculumRequirement = require("../models/CurriculumRequirement");
const Phase = require("../models/Phase");
const Module = require("../models/Module");

// Helper function to validate and normalize requirement parameters
const validateRequirementInputs = async ({
  phaseId,
  type,
  modules,
  minRequired,
  excludeRequirementId = null,
}) => {
  // 1. Validate phase exists
  const phaseExists = await Phase.findById(phaseId);
  if (!phaseExists) {
    return { valid: false, status: 404, message: "Phase not found" };
  }

  // 2. Validate requirement type
  const allowedTypes = ["required", "optional", "choice_group"];
  if (!type || !allowedTypes.includes(type)) {
    return {
      valid: false,
      status: 400,
      message: "Type must be one of: required, optional, choice_group",
    };
  }

  // 3. Validate modules array
  if (!Array.isArray(modules) || modules.length === 0) {
    return {
      valid: false,
      status: 400,
      message: "modules array must not be empty",
    };
  }

  // Deduplicate module IDs while preserving string format for lookup
  const uniqueModuleIds = [
    ...new Set(modules.map((id) => id.toString().trim())),
  ];

  // 4. Validate all module IDs exist
  const foundModules = await Module.find({ _id: { $in: uniqueModuleIds } });
  if (foundModules.length !== uniqueModuleIds.length) {
    return {
      valid: false,
      status: 400,
      message: "One or more specified module IDs do not exist",
    };
  }

  // Verify all modules belong to the specified phase
  const mismatchedModule = foundModules.find(
    (mod) => !mod.phase || mod.phase.toString() !== phaseId.toString()
  );

  if (mismatchedModule) {
    return {
      valid: false,
      status: 400,
      message: "All referenced modules must belong to the specified phase",
    };
  }

  // 5. Type-specific rules for minRequired
  let resolvedMinRequired = 1;

  if (type === "required") {
    resolvedMinRequired = 1;
  } else if (type === "optional") {
    resolvedMinRequired = 0;
  } else if (type === "choice_group") {
    if (uniqueModuleIds.length < 2) {
      return {
        valid: false,
        status: 400,
        message: "choice_group requirements require at least two modules",
      };
    }

    const minReqNum = Number(minRequired);
    if (
      isNaN(minReqNum) ||
      minReqNum < 1 ||
      minReqNum > uniqueModuleIds.length
    ) {
      return {
        valid: false,
        status: 400,
        message: `minRequired for choice_group must be between 1 and ${uniqueModuleIds.length}`,
      };
    }
    resolvedMinRequired = minReqNum;
  }

  // 6. Check for duplicate requirements
  const queryFilter = { phase: phaseId, type };
  if (excludeRequirementId) {
    queryFilter._id = { $ne: excludeRequirementId };
  }

  const existingReqs = await CurriculumRequirement.find(queryFilter);
  const newSet = new Set(uniqueModuleIds);

  const isDuplicate = existingReqs.some((req) => {
    if (req.modules.length !== newSet.size) return false;
    return req.modules.every((mId) => newSet.has(mId.toString()));
  });

  if (isDuplicate) {
    return {
      valid: false,
      status: 400,
      message:
        "An identical requirement with the same phase, type, and module set already exists",
    };
  }

  return {
    valid: true,
    data: {
      phase: phaseId,
      type,
      modules: uniqueModuleIds,
      minRequired: resolvedMinRequired,
    },
  };
};

// Create requirement
const createRequirement = async (req, res) => {
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
        message: validation.message,
      });
    }

    const newRequirement = await CurriculumRequirement.create(
      validation.data
    );

    return res.status(201).json({
      message: "Curriculum requirement created successfully",
      requirement: newRequirement,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create curriculum requirement",
      error: error.message,
    });
  }
};

// Get requirements by phase
const getRequirementsByPhase = async (req, res) => {
  try {
    const { phaseId } = req.params;

    const requirements = await CurriculumRequirement.find({
      phase: phaseId,
    })
      .populate("modules", "_id title order isActive")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      count: requirements.length,
      requirements,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch requirements for phase",
      error: error.message,
    });
  }
};

// Get single requirement by ID
const getRequirementById = async (req, res) => {
  try {
    const requirement = await CurriculumRequirement.findById(req.params.id)
      .populate("phase", "_id title")
      .populate("modules", "_id title order isActive");

    if (!requirement) {
      return res.status(404).json({
        message: "Curriculum requirement not found",
      });
    }

    return res.status(200).json({
      requirement,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch curriculum requirement details",
      error: error.message,
    });
  }
};

// Update requirement
const updateRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const existingReq = await CurriculumRequirement.findById(id);

    if (!existingReq) {
      return res.status(404).json({
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
        message: validation.message,
      });
    }

    existingReq.phase = validation.data.phase;
    existingReq.type = validation.data.type;
    existingReq.modules = validation.data.modules;
    existingReq.minRequired = validation.data.minRequired;

    const updatedRequirement = await existingReq.save();

    return res.status(200).json({
      message: "Curriculum requirement updated successfully",
      requirement: updatedRequirement,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update curriculum requirement",
      error: error.message,
    });
  }
};

// Delete requirement
const deleteRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const requirement = await CurriculumRequirement.findByIdAndDelete(id);

    if (!requirement) {
      return res.status(404).json({
        message: "Curriculum requirement not found",
      });
    }

    return res.status(200).json({
      message: "Curriculum requirement deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete curriculum requirement",
      error: error.message,
    });
  }
};

module.exports = {
  createRequirement,
  getRequirementsByPhase,
  getRequirementById,
  updateRequirement,
  deleteRequirement,
};
