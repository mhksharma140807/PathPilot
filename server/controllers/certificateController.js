const Certificate = require("../models/Certificate");
const CareerEnrollment = require("../models/CareerEnrollment");
const Module = require("../models/Module");
const ModuleProgress = require("../models/ModuleProgress");

/**
 * POST /api/certificates/claim
 * Authenticated student endpoint to claim a career certificate upon 100% completion
 */
const issueOrClaimCertificate = async (req, res) => {
  try {
    const studentId = req.user._id || req.user.id;

    // Find active career enrollment for student
    const enrollment = await CareerEnrollment.findOne({
      student: studentId,
      status: "active",
    }).populate("career");

    if (!enrollment || !enrollment.career) {
      return res.status(400).json({
        success: false,
        message: "No active career enrollment found. You must enroll in a career track first.",
      });
    }

    const careerId = enrollment.career._id || enrollment.career;

    // Fetch active modules for career
    const modules = await Module.find({
      career: careerId,
      isActive: true,
    });

    if (modules.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No active learning modules found for this career.",
      });
    }

    // Fetch student progress records for career
    const progressRecords = await ModuleProgress.find({
      student: studentId,
      career: careerId,
    });

    const progressMap = new Map(
      progressRecords.map((p) => [p.module.toString(), p.progressPercentage || 0])
    );

    const totalModules = modules.length;
    const overallProgress =
      totalModules > 0
        ? Math.round(
            modules.reduce(
              (sum, mod) => sum + (progressMap.get(mod._id.toString()) || 0),
              0
            ) / totalModules
          )
        : 0;

    // Eligibility check: Requires exactly 100% completion
    if (overallProgress < 100) {
      return res.status(400).json({
        success: false,
        message: `Certificate claim rejected. You must complete 100% of your career curriculum first (Current progress: ${overallProgress}%).`,
        progressPercentage: overallProgress,
      });
    }

    // Idempotency check: Return existing certificate if already issued
    const existingCertificate = await Certificate.findOne({
      student: studentId,
      career: careerId,
    })
      .populate("career", "_id title slug description overview skills estimatedDuration")
      .populate("student", "_id name email");

    if (existingCertificate) {
      return res.status(200).json({
        success: true,
        message: "Certificate already issued for this career",
        certificate: existingCertificate,
      });
    }

    // Calculate metadata attributes
    const skillsMastered = enrollment.career?.skills || [];
    const completionTimeHours = modules.reduce(
      (acc, m) => acc + (m.estimatedHours || 0),
      0
    );

    // Create new certificate
    const newCertificate = await Certificate.create({
      student: studentId,
      career: careerId,
      skillsMastered,
      completionTimeHours,
    });

    const populatedCertificate = await Certificate.findById(newCertificate._id)
      .populate("career", "_id title slug description overview skills estimatedDuration")
      .populate("student", "_id name email");

    return res.status(201).json({
      success: true,
      message: "Congratulations! Your career certificate has been issued successfully.",
      certificate: populatedCertificate,
    });
  } catch (error) {
    // Duplicate key safety fallback
    if (error.code === 11000) {
      try {
        const studentId = req.user._id || req.user.id;
        const enrollment = await CareerEnrollment.findOne({
          student: studentId,
          status: "active",
        });

        if (enrollment && enrollment.career) {
          const existing = await Certificate.findOne({
            student: studentId,
            career: enrollment.career,
          })
            .populate("career", "_id title slug description overview skills estimatedDuration")
            .populate("student", "_id name email");

          if (existing) {
            return res.status(200).json({
              success: true,
              message: "Certificate already issued for this career",
              certificate: existing,
            });
          }
        }
      } catch (innerErr) {
        // Fallthrough to 500 handler
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to issue certificate",
      error: error.message,
    });
  }
};

/**
 * GET /api/certificates/my-certificates
 * Authenticated student endpoint to fetch all certificates earned by student
 */
const getMyCertificates = async (req, res) => {
  try {
    const studentId = req.user._id || req.user.id;

    const certificates = await Certificate.find({ student: studentId })
      .populate("career", "_id title slug description overview skills estimatedDuration")
      .sort({ issuedAt: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch certificates",
      error: error.message,
    });
  }
};

/**
 * GET /api/certificates/verify/:certificateId
 * PUBLIC endpoint to verify certificate authenticity by certificateId
 */
const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId || !certificateId.trim()) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: "Certificate ID is required for verification",
      });
    }

    const certificate = await Certificate.findOne({
      certificateId: certificateId.trim(),
    })
      .populate("student", "name")
      .populate("career", "title slug description overview skills estimatedDuration");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: "Invalid or non-existent Certificate ID. Verification failed.",
      });
    }

    return res.status(200).json({
      success: true,
      verified: true,
      message: "Certificate verified successfully",
      certificate: {
        certificateId: certificate.certificateId,
        studentName: certificate.student?.name || "Verified Student",
        careerTitle: certificate.career?.title || "Career Track",
        careerSlug: certificate.career?.slug || "",
        issuedAt: certificate.issuedAt,
        skillsMastered: certificate.skillsMastered || [],
        completionTimeHours: certificate.completionTimeHours || 0,
        verificationStatus: "VALID",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      verified: false,
      message: "Failed to verify certificate",
      error: error.message,
    });
  }
};

module.exports = {
  issueOrClaimCertificate,
  getMyCertificates,
  verifyCertificate,
};
