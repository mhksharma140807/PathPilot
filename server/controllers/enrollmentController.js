const CareerEnrollment = require("../models/CareerEnrollment");
const Career = require("../models/Career");

// Select a career for a student
const selectCareer = async (req, res) => {
  try {
    const studentId = req.user._id || req.user.id;
    const { careerId } = req.body;

    const career = await Career.findOne({
      _id: careerId,
      isActive: true,
    });

    if (!career) {
      return res.status(404).json({
        message: "Career not found",
      });
    }

    const existingEnrollment = await CareerEnrollment.findOne({
      student: studentId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "You already have an active career",
        enrollment: existingEnrollment,
        career: existingEnrollment.career,
      });
    }

    const enrollment = await CareerEnrollment.create({
      student: studentId,
      career: career._id,
    });

    const populatedEnrollment = await CareerEnrollment.findById(
      enrollment._id
    )
      .populate("career")
      .populate("student", "name email role");

    res.status(201).json({
      message: "Career selected successfully",
      enrollment: populatedEnrollment,
      career: populatedEnrollment.career,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to select career",
      error: error.message,
    });
  }
};

// Get the currently selected career
const getMyCareer = async (req, res) => {
  try {
    const studentId = req.user._id || req.user.id;

    const enrollment = await CareerEnrollment.findOne({
      student: studentId,
      status: "active",
    }).populate("career");

    if (!enrollment) {
      return res.status(200).json({
        enrollment: null,
        career: null,
        message: "No active career selected",
      });
    }

    res.status(200).json({
      enrollment,
      career: enrollment.career,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch selected career",
      error: error.message,
    });
  }
};

module.exports = {
  selectCareer,
  getMyCareer,
};