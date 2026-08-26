const Career = require("../models/Career");
const Phase = require("../models/Phase");
const Module = require("../models/Module");
const CareerEnrollment = require("../models/CareerEnrollment");
const CurriculumRequirement = require("../models/CurriculumRequirement");

/**
 * GET /api/admin/careers
 * Fetch all careers (active & inactive) with phase/module counts
 */
const getAdminCareers = async (req, res) => {
  try {
    const careers = await Career.find().sort({ createdAt: 1 });

    const careersWithCounts = await Promise.all(
      careers.map(async (career) => {
        const [phaseCount, moduleCount, activeModuleCount, enrollmentCount] =
          await Promise.all([
            Phase.countDocuments({ career: career._id }),
            Module.countDocuments({ career: career._id }),
            Module.countDocuments({ career: career._id, isActive: true }),
            CareerEnrollment.countDocuments({ career: career._id }),
          ]);

        return {
          ...career.toObject(),
          phaseCount,
          moduleCount,
          activeModuleCount,
          enrollmentCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: careersWithCounts.length,
      careers: careersWithCounts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin careers",
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/careers/:id
 * Fetch single career details with breakdown
 */
const getAdminCareerById = async (req, res) => {
  try {
    const { id } = req.params;
    const career = await Career.findById(id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    const [phaseCount, moduleCount, enrollmentCount] = await Promise.all([
      Phase.countDocuments({ career: career._id }),
      Module.countDocuments({ career: career._id }),
      CareerEnrollment.countDocuments({ career: career._id }),
    ]);

    return res.status(200).json({
      success: true,
      career: {
        ...career.toObject(),
        phaseCount,
        moduleCount,
        enrollmentCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch career details",
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/careers
 * Create a new career
 */
const createAdminCareer = async (req, res) => {
  try {
    const {
      title,
      slug: rawSlug,
      description,
      overview,
      skills,
      estimatedDuration,
      isActive,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Career title is required",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Career description is required",
      });
    }

    // Auto-generate slug if not provided
    const slug = (rawSlug && rawSlug.trim())
      ? rawSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
      : title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "A valid slug is required",
      });
    }

    const existingCareer = await Career.findOne({ slug });
    if (existingCareer) {
      return res.status(409).json({
        success: false,
        message: `Career with slug "${slug}" already exists`,
      });
    }

    // Process skills array
    let parsedSkills = [];
    if (Array.isArray(skills)) {
      parsedSkills = skills.map((s) => String(s).trim()).filter(Boolean);
    } else if (typeof skills === "string") {
      parsedSkills = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const newCareer = await Career.create({
      title: title.trim(),
      slug,
      description: description.trim(),
      overview: (overview || "").trim(),
      skills: parsedSkills,
      estimatedDuration: (estimatedDuration || "").trim(),
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Career created successfully",
      career: newCareer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create career",
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/careers/:id
 * Update an existing career
 */
const updateAdminCareer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug: rawSlug,
      description,
      overview,
      skills,
      estimatedDuration,
      isActive,
    } = req.body;

    const career = await Career.findById(id);
    if (!career) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Career title cannot be empty",
      });
    }

    if (description !== undefined && !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Career description cannot be empty",
      });
    }

    // Slug check if changing
    let updatedSlug = career.slug;
    if (rawSlug !== undefined && rawSlug.trim()) {
      const formattedSlug = rawSlug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      if (formattedSlug !== career.slug) {
        const slugExists = await Career.findOne({
          slug: formattedSlug,
          _id: { $ne: id },
        });

        if (slugExists) {
          return res.status(409).json({
            success: false,
            message: `Career with slug "${formattedSlug}" already exists`,
          });
        }
        updatedSlug = formattedSlug;
      }
    } else if (title && title.trim() !== career.title) {
      // Auto-update slug if title changed and no explicit rawSlug provided
      const autoSlug = title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const slugExists = await Career.findOne({
        slug: autoSlug,
        _id: { $ne: id },
      });

      if (!slugExists) {
        updatedSlug = autoSlug;
      }
    }

    // Process skills array if provided
    let parsedSkills = career.skills;
    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        parsedSkills = skills.map((s) => String(s).trim()).filter(Boolean);
      } else if (typeof skills === "string") {
        parsedSkills = skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    if (title !== undefined) career.title = title.trim();
    career.slug = updatedSlug;
    if (description !== undefined) career.description = description.trim();
    if (overview !== undefined) career.overview = overview.trim();
    career.skills = parsedSkills;
    if (estimatedDuration !== undefined)
      career.estimatedDuration = estimatedDuration.trim();
    if (typeof isActive === "boolean") career.isActive = isActive;

    await career.save();

    return res.status(200).json({
      success: true,
      message: "Career updated successfully",
      career,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update career",
      error: error.message,
    });
  }
};

/**
 * PATCH /api/admin/careers/:id/status
 * Toggle or set career active status
 */
const toggleAdminCareerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const career = await Career.findById(id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    if (typeof req.body.isActive === "boolean") {
      career.isActive = req.body.isActive;
    } else {
      career.isActive = !career.isActive;
    }

    await career.save();

    return res.status(200).json({
      success: true,
      message: `Career "${career.title}" ${
        career.isActive ? "activated" : "deactivated"
      } successfully`,
      career,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update career status",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/careers/:id
 * Delete a career safely (only if no dependent records exist)
 */
const deleteAdminCareer = async (req, res) => {
  try {
    const { id } = req.params;
    const career = await Career.findById(id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    // Check relationship dependencies
    const phases = await Phase.find({ career: id }).select("_id");
    const phaseIds = phases.map((p) => p._id);

    const [phaseCount, moduleCount, enrollmentCount, requirementCount] =
      await Promise.all([
        Phase.countDocuments({ career: id }),
        Module.countDocuments({ career: id }),
        CareerEnrollment.countDocuments({ career: id }),
        phaseIds.length > 0
          ? CurriculumRequirement.countDocuments({ phase: { $in: phaseIds } })
          : 0,
      ]);

    if (
      phaseCount > 0 ||
      moduleCount > 0 ||
      enrollmentCount > 0 ||
      requirementCount > 0
    ) {
      return res.status(409).json({
        success: false,
        message: `Cannot delete career "${career.title}" because it contains dependent data (${phaseCount} phases, ${moduleCount} modules, ${enrollmentCount} student enrollments, ${requirementCount} curriculum requirements). Please remove or reassign dependent records first, or deactivate the career instead.`,
        dependencies: {
          phases: phaseCount,
          modules: moduleCount,
          enrollments: enrollmentCount,
          requirements: requirementCount,
        },
      });
    }

    await Career.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `Career "${career.title}" deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete career",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminCareers,
  getAdminCareerById,
  createAdminCareer,
  updateAdminCareer,
  toggleAdminCareerStatus,
  deleteAdminCareer,
};
