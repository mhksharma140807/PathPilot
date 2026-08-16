const CareerEnrollment = require("../models/CareerEnrollment");
const Phase = require("../models/Phase");
const Module = require("../models/Module");
const ModuleProgress = require("../models/ModuleProgress");
const CurriculumRequirement = require("../models/CurriculumRequirement");

// Helper function to calculate phase completion metrics based on requirements or fallback
const calculatePhaseRequirementMetrics = (
  phaseModules,
  phaseReqs,
  completedModuleIdsSet
) => {
  if (!phaseReqs || phaseReqs.length === 0) {
    // Fallback rule: If phase has NO CurriculumRequirement documents,
    // all active modules in the phase are required.
    const totalRequiredModules = phaseModules.length;
    const completedModules = phaseModules.filter((mod) =>
      completedModuleIdsSet.has(mod._id.toString())
    ).length;
    const isComplete =
      totalRequiredModules > 0 && completedModules === totalRequiredModules;

    return { totalRequiredModules, completedModules, isComplete };
  }

  // Requirement documents exist
  let totalRequiredModules = 0;
  let completedModules = 0;
  let allBlockingSatisfied = true;
  let blockingCount = 0;

  phaseReqs.forEach((req) => {
    const modIdStrings = req.modules.map((m) => m.toString());
    const completedCountInReq = modIdStrings.filter((mId) =>
      completedModuleIdsSet.has(mId)
    ).length;

    if (req.type === "required") {
      blockingCount++;
      const target = req.minRequired || 1;
      totalRequiredModules += target;
      completedModules += Math.min(completedCountInReq, target);
      if (completedCountInReq < target) {
        allBlockingSatisfied = false;
      }
    } else if (req.type === "choice_group") {
      blockingCount++;
      const target = req.minRequired;
      totalRequiredModules += target;
      completedModules += Math.min(completedCountInReq, target);
      if (completedCountInReq < target) {
        allBlockingSatisfied = false;
      }
    } else if (req.type === "optional") {
      // Optional requirements do not block completion and minRequired is 0
    }
  });

  const isComplete = blockingCount > 0 ? allBlockingSatisfied : true;

  return { totalRequiredModules, completedModules, isComplete };
};

const getCurriculumState = async (req, res) => {
  try {
    const studentId = req.user._id || req.user.id;

    const enrollment = await CareerEnrollment.findOne({
      student: studentId,
      status: "active",
    }).populate("career", "_id title slug");

    if (!enrollment || !enrollment.career) {
      return res.status(404).json({
        message: "No active career selected",
      });
    }

    const careerId = enrollment.career._id;

    // Fetch active phases and modules for the career
    const phases = await Phase.find({
      career: careerId,
      isActive: true,
    }).sort({ order: 1 });

    const modules = await Module.find({
      career: careerId,
      isActive: true,
    }).sort({ order: 1 });

    // Fetch curriculum requirements for active phases
    const phaseIds = phases.map((p) => p._id);
    const requirements = await CurriculumRequirement.find({
      phase: { $in: phaseIds },
    });

    const requirementsByPhaseMap = new Map();
    requirements.forEach((reqDoc) => {
      const phaseIdStr = reqDoc.phase.toString();
      if (!requirementsByPhaseMap.has(phaseIdStr)) {
        requirementsByPhaseMap.set(phaseIdStr, []);
      }
      requirementsByPhaseMap.get(phaseIdStr).push(reqDoc);
    });

    // Fetch progress records for the student in this career
    const progressRecords = await ModuleProgress.find({
      student: studentId,
      career: careerId,
    });

    // Build progress map and completed module IDs set
    const progressMap = new Map();
    const completedModuleIdsSet = new Set();

    progressRecords.forEach((record) => {
      const modIdStr = record.module.toString();
      progressMap.set(modIdStr, record);

      const isComplete =
        record.status === "completed" ||
        (typeof record.progressPercentage === "number" &&
          record.progressPercentage >= 100);

      if (isComplete) {
        completedModuleIdsSet.add(modIdStr);
      }
    });

    // Group active modules by phase ID
    const modulesByPhaseMap = new Map();
    const unassignedModulesList = [];

    modules.forEach((mod) => {
      if (mod.phase) {
        const phaseIdStr = mod.phase.toString();
        if (!modulesByPhaseMap.has(phaseIdStr)) {
          modulesByPhaseMap.set(phaseIdStr, []);
        }
        modulesByPhaseMap.get(phaseIdStr).push(mod);
      } else {
        unassignedModulesList.push(mod);
      }
    });

    // Step 1: Calculate phase completion status
    const completedPhaseIdsSet = new Set();

    phases.forEach((phase) => {
      const phaseIdStr = phase._id.toString();
      const phaseModules = modulesByPhaseMap.get(phaseIdStr) || [];
      const phaseReqs = requirementsByPhaseMap.get(phaseIdStr) || [];

      const { isComplete } = calculatePhaseRequirementMetrics(
        phaseModules,
        phaseReqs,
        completedModuleIdsSet
      );

      if (isComplete) {
        completedPhaseIdsSet.add(phaseIdStr);
      }
    });

    // Step 2: Build response phases with unlock and completion status
    const formattedPhases = phases.map((phase) => {
      const phaseIdStr = phase._id.toString();

      // Phase Unlock Rule:
      // - Empty prerequisitePhases -> unlocked
      // - Non-empty prerequisitePhases -> ALL prerequisite phases must be complete
      const prereqs = phase.prerequisitePhases || [];
      const isUnlocked =
        prereqs.length === 0 ||
        prereqs.every((prereqId) =>
          completedPhaseIdsSet.has(prereqId.toString())
        );

      const phaseModules = modulesByPhaseMap.get(phaseIdStr) || [];
      const phaseReqs = requirementsByPhaseMap.get(phaseIdStr) || [];

      const { totalRequiredModules, completedModules, isComplete } =
        calculatePhaseRequirementMetrics(
          phaseModules,
          phaseReqs,
          completedModuleIdsSet
        );

      const formattedModules = phaseModules.map((mod) => {
        const modIdStr = mod._id.toString();
        const prog = progressMap.get(modIdStr);

        const isModComplete = completedModuleIdsSet.has(modIdStr);

        // Module Unlock Rule:
        // - Empty prerequisites -> unlocked if phase is unlocked
        // - Non-empty prerequisites -> unlocked if phase is unlocked AND ALL prerequisite modules complete
        const modPrereqs = mod.prerequisites || [];
        const isModUnlocked =
          isUnlocked &&
          (modPrereqs.length === 0 ||
            modPrereqs.every((prereqId) =>
              completedModuleIdsSet.has(prereqId.toString())
            ));

        const progressPercentage = prog?.progressPercentage || 0;
        const status = prog?.status || "not_started";
        const completedLessons = prog?.completedLessons || [];

        return {
          _id: mod._id,
          title: mod.title,
          description: mod.description,
          order: mod.order,
          isUnlocked: isModUnlocked,
          isComplete: isModComplete,
          progressPercentage,
          status,
          completedLessons,
        };
      });

      return {
        _id: phase._id,
        title: phase.title,
        description: phase.description,
        order: phase.order,
        isUnlocked,
        isComplete,
        completedModules,
        totalRequiredModules,
        modules: formattedModules,
      };
    });

    const responsePayload = {
      career: {
        _id: enrollment.career._id,
        title: enrollment.career.title,
        slug: enrollment.career.slug,
      },
      phases: formattedPhases,
    };

    if (unassignedModulesList.length > 0) {
      responsePayload.unassignedModules = unassignedModulesList.map((mod) => {
        const modIdStr = mod._id.toString();
        const prog = progressMap.get(modIdStr);
        const isModComplete = completedModuleIdsSet.has(modIdStr);
        const modPrereqs = mod.prerequisites || [];
        const isModUnlocked =
          modPrereqs.length === 0 ||
          modPrereqs.every((prereqId) =>
            completedModuleIdsSet.has(prereqId.toString())
          );

        return {
          _id: mod._id,
          title: mod.title,
          description: mod.description,
          order: mod.order,
          isUnlocked: isModUnlocked,
          isComplete: isModComplete,
          progressPercentage: prog?.progressPercentage || 0,
          status: prog?.status || "not_started",
          completedLessons: prog?.completedLessons || [],
        };
      });
    }

    return res.status(200).json(responsePayload);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch curriculum state",
      error: error.message,
    });
  }
};

module.exports = {
  getCurriculumState,
};
