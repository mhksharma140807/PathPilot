const User = require("../models/User");
const CareerEnrollment = require("../models/CareerEnrollment");
const ModuleProgress = require("../models/ModuleProgress");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

/**
 * GET /api/admin/users
 * Fetch all users with optional filters (?role=, ?status=, ?verification=, ?search=)
 * Returns safe user objects with populated active career enrollment and progress metrics.
 */
const getAdminUsers = async (req, res) => {
  try {
    const { role, status, verification, search } = req.query;

    const filter = {};

    if (role && ["student", "teacher", "parent", "admin"].includes(role)) {
      filter.role = role;
    }

    if (status === "active") {
      filter.isActive = true;
    } else if (status === "inactive") {
      filter.isActive = false;
    }

    if (verification === "verified") {
      filter.isVerified = true;
    } else if (verification === "unverified") {
      filter.isVerified = false;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    // Populate active career enrollment and progress metrics for each user
    const formattedUsers = await Promise.all(
      users.map(async (userDoc) => {
        const userObj = userDoc.toObject();

        const [activeEnrollment, totalEnrollments, totalProgressRecords, completedModules] =
          await Promise.all([
            CareerEnrollment.findOne({
              student: userDoc._id,
              status: "active",
            }).populate("career", "_id title slug"),
            CareerEnrollment.countDocuments({ student: userDoc._id }),
            ModuleProgress.countDocuments({ student: userDoc._id }),
            ModuleProgress.countDocuments({
              student: userDoc._id,
              status: "completed",
            }),
          ]);

        const progressPercentage =
          totalProgressRecords > 0
            ? Math.round((completedModules / totalProgressRecords) * 100)
            : 0;

        return {
          ...userObj,
          activeCareer: activeEnrollment?.career || null,
          metrics: {
            totalEnrollments,
            totalProgressRecords,
            completedModules,
            progressPercentage,
          },
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/users/:id
 * Fetch detailed user record with complete enrollment history and progress summary
 */
const getAdminUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const [enrollmentHistory, activeEnrollment, totalProgressRecords, completedModules] =
      await Promise.all([
        CareerEnrollment.find({ student: user._id })
          .populate("career", "_id title slug")
          .sort({ createdAt: -1 }),
        CareerEnrollment.findOne({ student: user._id, status: "active" }).populate(
          "career",
          "_id title slug"
        ),
        ModuleProgress.countDocuments({ student: user._id }),
        ModuleProgress.countDocuments({
          student: user._id,
          status: "completed",
        }),
      ]);

    const progressPercentage =
      totalProgressRecords > 0
        ? Math.round((completedModules / totalProgressRecords) * 100)
        : 0;

    const userObj = user.toObject();

    return res.status(200).json({
      success: true,
      user: {
        ...userObj,
        activeCareer: activeEnrollment?.career || null,
        enrollmentHistory,
        metrics: {
          totalEnrollments: enrollmentHistory.length,
          totalProgressRecords,
          completedModules,
          progressPercentage,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/users
 * Admin endpoint to create a new user (student, admin, etc.) with bcrypt hashed password
 */
const createAdminUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, profileImage, isVerified, isActive } =
      req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and role are required",
      });
    }

    const allowedRoles = ["student", "teacher", "parent", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be one of: student, teacher, parent, admin",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email address already exists",
      });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      phone: phone || "",
      profileImage: profileImage || "",
      isVerified: Boolean(isVerified),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    const safeUser = await User.findById(newUser._id).select("-password");

    return res.status(201).json({
      success: true,
      message: "User account created successfully",
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create user account",
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/users/:id
 * Admin endpoint to update user details.
 * Protects password unless explicitly updated, and prevents admin self-demotion / self-deactivation.
 */
const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentAdminId = (req.user._id || req.user.id).toString();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, email, role, phone, profileImage, isVerified, isActive, password } =
      req.body;

    // Self-protection: An admin cannot demote or deactivate their own currently logged-in account
    if (currentAdminId === id.toString()) {
      if (role && role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "You cannot change your own admin role",
        });
      }
      if (isActive === false) {
        return res.status(403).json({
          success: false,
          message: "You cannot deactivate your own logged-in admin account",
        });
      }
    }

    // Check duplicate email if changed
    if (email && email.toLowerCase().trim() !== existingUser.email) {
      const emailTaken = await User.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: id },
      });

      if (emailTaken) {
        return res.status(409).json({
          success: false,
          message: "A user with this email address already exists",
        });
      }
      existingUser.email = email.toLowerCase().trim();
    }

    if (name) existingUser.name = name.trim();
    if (role && ["student", "teacher", "parent", "admin"].includes(role)) {
      existingUser.role = role;
    }
    if (phone !== undefined) existingUser.phone = phone;
    if (profileImage !== undefined) existingUser.profileImage = profileImage;
    if (isVerified !== undefined) existingUser.isVerified = Boolean(isVerified);
    if (isActive !== undefined) existingUser.isActive = Boolean(isActive);

    // Password Update Safeguard: Only hash and overwrite if explicitly provided
    if (password && typeof password === "string" && password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      existingUser.password = await bcrypt.hash(password.trim(), salt);
    }

    await existingUser.save();

    const safeUser = await User.findById(id).select("-password");

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user profile",
      error: error.message,
    });
  }
};

/**
 * PATCH /api/admin/users/:id/status
 * Admin endpoint to toggle account active status. Prevents self-deactivation.
 */
const toggleAdminUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const currentAdminId = (req.user._id || req.user.id).toString();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive boolean parameter is required",
      });
    }

    // Self-deactivation protection
    if (currentAdminId === id.toString() && isActive === false) {
      return res.status(403).json({
        success: false,
        message: "You cannot deactivate your own logged-in admin account",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = isActive;
    await user.save();

    const safeUser = await User.findById(id).select("-password");

    return res.status(200).json({
      success: true,
      message: `User account ${isActive ? "activated" : "deactivated"} successfully`,
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user account status",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/users/:id
 * Admin endpoint to delete a user account safely.
 * Returns HTTP 409 Conflict with dependency counts if enrollment/progress records exist.
 * Prevents admin self-deletion.
 */
const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentAdminId = (req.user._id || req.user.id).toString();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Self-delete protection
    if (currentAdminId === id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete your own logged-in admin account",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check relationship dependencies
    const [enrollments, progress] = await Promise.all([
      CareerEnrollment.countDocuments({ student: id }),
      ModuleProgress.countDocuments({ student: id }),
    ]);

    if (enrollments > 0 || progress > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Cannot delete user because related career enrollment or module progress data exists. Deactivate the account instead.",
        dependencies: {
          enrollments,
          progress,
        },
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User account deleted successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user account",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
  toggleAdminUserStatus,
  deleteAdminUser,
};
