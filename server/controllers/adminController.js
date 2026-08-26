const User = require("../models/User");
const Career = require("../models/Career");
const Phase = require("../models/Phase");
const Module = require("../models/Module");

// Get Admin Dashboard Overview Statistics (Read-Only)
const getAdminDashboardData = async (req, res) => {
  try {
    const [totalStudents, totalCareers, totalPhases, totalModules] =
      await Promise.all([
        User.countDocuments({ role: "student" }),
        Career.countDocuments(),
        Phase.countDocuments(),
        Module.countDocuments(),
      ]);

    const careers = await Career.find()
      .select("_id title slug description isActive createdAt")
      .sort({ createdAt: 1 });

    const careerOverview = await Promise.all(
      careers.map(async (career) => {
        const [phaseCount, moduleCount, activeModuleCount] = await Promise.all(
          [
            Phase.countDocuments({ career: career._id }),
            Module.countDocuments({ career: career._id }),
            Module.countDocuments({ career: career._id, isActive: true }),
          ]
        );

        return {
          _id: career._id,
          title: career.title,
          slug: career.slug,
          description: career.description,
          isActive: career.isActive,
          phaseCount,
          moduleCount,
          activeModuleCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      stats: {
        students: totalStudents,
        careers: totalCareers,
        phases: totalPhases,
        modules: totalModules,
      },
      careerOverview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard analytics",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminDashboardData,
};
