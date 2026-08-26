import { useState, useEffect, useMemo } from "react";
import {
  getAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
  toggleAdminUserStatus,
  deleteAdminUser,
} from "../../services/adminService";
import { useToast } from "../../context/ToastContext";
import { getStoredUser } from "../../utils/authStorage";

function AdminUsers() {
  const toast = useToast();
  const currentUser = getStoredUser();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    phone: "",
    isVerified: false,
    isActive: true,
  });

  // Details drawer/modal state
  const [detailUser, setDetailUser] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteDependencyError, setDeleteDependencyError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminUsers();
      if (res?.success) {
        setUsers(res.users || []);
      } else {
        setError(res?.message || "Failed to load user accounts");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to connect to user management server"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered Users list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role filter
      if (roleFilter !== "all" && u.role !== roleFilter) return false;

      // Status filter
      if (statusFilter === "active" && !u.isActive) return false;
      if (statusFilter === "inactive" && u.isActive) return false;

      // Verification filter
      if (verificationFilter === "verified" && !u.isVerified) return false;
      if (verificationFilter === "unverified" && u.isVerified) return false;

      // Search term
      if (!searchTerm.trim()) return true;
      const query = searchTerm.toLowerCase();
      const name = u.name?.toLowerCase() || "";
      const email = u.email?.toLowerCase() || "";

      return name.includes(query) || email.includes(query);
    });
  }, [users, roleFilter, statusFilter, verificationFilter, searchTerm]);

  // Statistics
  const totalCount = users.length;
  const studentCount = users.filter((u) => u.role === "student").length;
  const activeStudentCount = users.filter(
    (u) => u.role === "student" && u.isActive
  ).length;
  const adminStaffCount = users.filter(
    (u) => u.role === "admin" || u.role === "teacher"
  ).length;

  // Handlers
  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "student",
      phone: "",
      isVerified: true,
      isActive: true,
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (u) => {
    setEditingUser(u);
    setFormData({
      name: u.name || "",
      email: u.email || "",
      password: "", // blank preserves existing password
      role: u.role || "student",
      phone: u.phone || "",
      isVerified: Boolean(u.isVerified),
      isActive: Boolean(u.isActive),
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleOpenDetails = async (userId) => {
    try {
      setLoadingDetails(true);
      setDetailUser(null);
      const res = await getAdminUserById(userId);
      if (res?.success) {
        setDetailUser(res.user);
      } else {
        toast.error(res?.message || "Failed to load user details");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error loading user details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleToggleStatus = async (userObj) => {
    if (userObj._id === currentUser?.id || userObj._id === currentUser?._id) {
      toast.error("You cannot deactivate your own currently logged-in account!");
      return;
    }

    try {
      const res = await toggleAdminUserStatus(userObj._id, !userObj.isActive);
      if (res?.success) {
        toast.success(
          `User ${userObj.name} ${!userObj.isActive ? "activated" : "deactivated"}.`
        );
        fetchUsers();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to update status"
      );
    }
  };

  // Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formSubmitting) return;

    if (!formData.name.trim() || !formData.email.trim() || !formData.role) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (!editingUser && (!formData.password || formData.password.length < 6)) {
      setFormError("Password must be at least 6 characters long for new accounts.");
      return;
    }

    setFormError("");
    setFormSubmitting(true);

    try {
      if (editingUser) {
        const payload = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          phone: formData.phone.trim(),
          isVerified: formData.isVerified,
          isActive: formData.isActive,
        };
        if (formData.password && formData.password.trim().length >= 6) {
          payload.password = formData.password.trim();
        }

        const res = await updateAdminUser(editingUser._id, payload);
        if (res?.success) {
          toast.success("User account updated successfully!");
          setIsFormOpen(false);
          fetchUsers();
        } else {
          setFormError(res?.message || "Failed to update user");
        }
      } else {
        const payload = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          role: formData.role,
          phone: formData.phone.trim(),
          isVerified: formData.isVerified,
          isActive: formData.isActive,
        };

        const res = await createAdminUser(payload);
        if (res?.success) {
          toast.success("User account created successfully!");
          setIsFormOpen(false);
          fetchUsers();
        } else {
          setFormError(res?.message || "Failed to create user");
        }
      }
    } catch (err) {
      setFormError(
        err.response?.data?.message || err.message || "An error occurred"
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    setDeleteDependencyError(null);

    try {
      const res = await deleteAdminUser(deleteTarget._id);
      if (res?.success) {
        toast.success("User account deleted.");
        setDeleteTarget(null);
        fetchUsers();
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setDeleteDependencyError(
          err.response.data || {
            message: "Cannot delete user due to existing data dependencies.",
            dependencies: { enrollments: 1, progress: 0 },
          }
        );
      } else {
        toast.error(
          err.response?.data?.message || err.message || "Deletion failed"
        );
        setDeleteTarget(null);
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 font-sans antialiased">
      {/* 1. Header Banner & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight sm:text-2xl">
              User & Student Management
            </h1>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
              Admin Portal
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            View, manage, verify, and configure PathPilot user accounts, roles, and student enrollment status.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition active:scale-95 shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span>Create User</span>
        </button>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</p>
            <p className="text-2xl font-extrabold text-[#0F172A] mt-1">{totalCount}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            👥
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Students</p>
            <p className="text-2xl font-extrabold text-blue-600 mt-1">{studentCount}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            🎓
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Students</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{activeStudentCount}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            ⚡
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Admins & Staff</p>
            <p className="text-2xl font-extrabold text-purple-600 mt-1">{adminStaffCount}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            🛡️
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full md:max-w-xs">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50/70 outline-none transition focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50/70 outline-none transition focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Verification Filter */}
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50/70 outline-none transition focus:border-blue-500"
          >
            <option value="all">All Verification</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>

          {/* Reset Filters */}
          {(searchTerm || roleFilter !== "all" || statusFilter !== "all" || verificationFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("all");
                setStatusFilter("all");
                setVerificationFilter("all");
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 underline px-1"
            >
              Reset
            </button>
          )}

          {/* View Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === "table" ? "bg-white text-blue-600 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
              title="Table View"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === "grid" ? "bg-white text-blue-600 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
              title="Grid View"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Loading State */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-12 bg-slate-200 rounded-2xl w-full" />
          <div className="h-64 bg-slate-200 rounded-2xl w-full" />
        </div>
      )}

      {/* 5. Error State */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 space-y-3">
          <svg className="mx-auto h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xs font-bold">{error}</p>
          <button
            type="button"
            onClick={fetchUsers}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* 6. Main Content View */}
      {!loading && !error && (
        <>
          {filteredUsers.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 text-2xl font-bold">
                👥
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">No User Accounts Found</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {searchTerm || roleFilter !== "all" || statusFilter !== "all" || verificationFilter !== "all"
                    ? "Try adjusting your search criteria or filter options."
                    : "Get started by adding your first user account."}
                </p>
              </div>
              {!searchTerm && roleFilter === "all" && statusFilter === "all" && verificationFilter === "all" && (
                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                >
                  + Create First User
                </button>
              )}
            </div>
          ) : viewMode === "table" ? (
            /* Table View */
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">User</th>
                      <th className="py-3.5 px-4 text-center">Role</th>
                      <th className="py-3.5 px-4">Active Career Track</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4">Progress Summary</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/80 transition">
                        {/* User Profile */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-xs font-extrabold text-white shadow-2xs">
                              {u.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="font-extrabold text-[#0F172A] leading-snug">
                                {u.name}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="py-3.5 px-4 text-center align-top">
                          {u.role === "admin" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                              🛡️ Admin
                            </span>
                          )}
                          {u.role === "student" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                              🎓 Student
                            </span>
                          )}
                          {u.role === "teacher" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                              👨‍🏫 Teacher
                            </span>
                          )}
                          {u.role === "parent" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                              👪 Parent
                            </span>
                          )}
                        </td>

                        {/* Active Career */}
                        <td className="py-3.5 px-4 align-top">
                          {u.activeCareer ? (
                            <span className="inline-block font-semibold text-[10px] text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                              {u.activeCareer.title}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Unenrolled</span>
                          )}
                        </td>

                        {/* Account Status & Verification */}
                        <td className="py-3.5 px-4 text-center align-top space-y-1">
                          <div>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(u)}
                              className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border transition ${
                                u.isActive
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                              }`}
                            >
                              <span>{u.isActive ? "● Active" : "○ Inactive"}</span>
                            </button>
                          </div>
                          {u.isVerified ? (
                            <span className="text-[9px] font-bold text-emerald-600 block">✓ Verified</span>
                          ) : (
                            <span className="text-[9px] font-bold text-amber-600 block">⚠ Unverified</span>
                          )}
                        </td>

                        {/* Progress Summary */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="space-y-1 max-w-[160px]">
                            <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                              <span>{u.metrics?.completedModules || 0} Modules</span>
                              <span>{u.metrics?.progressPercentage || 0}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                style={{ width: `${u.metrics?.progressPercentage || 0}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right align-top">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenDetails(u._id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition border border-transparent hover:border-indigo-200"
                              title="View Details"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(u)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-200"
                              title="Edit User"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setDeleteTarget(u);
                                setDeleteDependencyError(null);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-200"
                              title="Delete User"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Grid Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((u) => (
                <div
                  key={u._id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-sm font-extrabold text-white shadow-2xs">
                          {u.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-[#0F172A] leading-snug">
                            {u.name}
                          </h3>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {u.email}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          u.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-bold text-slate-500">Role:</span>
                      <span className="capitalize font-bold text-[#0F172A]">{u.role}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500">Active Track:</span>
                      <span className="font-bold text-blue-600">
                        {u.activeCareer?.title || "None"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => handleOpenDetails(u._id)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      View Full Profile →
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(u)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget(u);
                          setDeleteDependencyError(null);
                        }}
                        className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 transition"
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* 7. CREATE / EDIT USER MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#0F172A]">
                  {editingUser ? "Edit User Account" : "Create User Account"}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingUser
                    ? `Update profile details for ${editingUser.name}`
                    : "Add a new student, teacher, parent, or admin user account."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-start gap-2">
                <span className="text-red-500 font-bold">⚠️</span>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="mb-1 block font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahak Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                  {editingUser ? "Reset Password (Optional)" : "Account Password *"}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  placeholder={editingUser ? "Leave blank to preserve password" : "At least 6 characters"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                    Account Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 font-semibold"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="parent">Parent</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-bold text-[#0F172A]">Verified Email Account</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-bold text-[#0F172A]">Account Active</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-extrabold text-white hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {formSubmitting ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingUser ? "Update Account" : "Create Account"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. USER DETAILS DRAWER / MODAL */}
      {(detailUser || loadingDetails) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#0F172A]">User Account Profile</h3>
                <p className="text-xs text-slate-500">Detailed student progress & enrollment analytics</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailUser(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            {loadingDetails ? (
              <div className="p-8 text-center space-y-3">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                <p className="text-xs font-bold text-slate-500">Loading user analytics...</p>
              </div>
            ) : detailUser ? (
              <div className="space-y-6 text-xs">
                {/* Header Profile Info */}
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-lg font-extrabold text-white shadow-xs">
                    {detailUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold text-[#0F172A]">{detailUser.name}</h4>
                      <span className="capitalize text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        {detailUser.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">{detailUser.email}</p>
                    <p className="text-[10px] text-slate-400">
                      Member since: {new Date(detailUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Enrollments</p>
                    <p className="text-lg font-extrabold text-[#0F172A] mt-0.5">
                      {detailUser.metrics?.totalEnrollments || 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Completed</p>
                    <p className="text-lg font-extrabold text-emerald-600 mt-0.5">
                      {detailUser.metrics?.completedModules || 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Progress</p>
                    <p className="text-lg font-extrabold text-blue-600 mt-0.5">
                      {detailUser.metrics?.progressPercentage || 0}%
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                    <p className={`text-xs font-extrabold mt-1 ${detailUser.isActive ? "text-emerald-600" : "text-slate-500"}`}>
                      {detailUser.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>

                {/* Active Career Enrollment Info */}
                <div className="space-y-2">
                  <h5 className="font-extrabold text-[#0F172A] uppercase tracking-wider text-[11px]">
                    Active Career Roadmap
                  </h5>
                  {detailUser.activeCareer ? (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 flex items-center justify-between">
                      <div>
                        <p className="font-extrabold text-blue-950 text-sm">
                          {detailUser.activeCareer.title}
                        </p>
                        <p className="text-[10px] text-blue-700 font-mono mt-0.5">
                          slug: {detailUser.activeCareer.slug}
                        </p>
                      </div>
                      <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                        Enrolled
                      </span>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-slate-400 text-xs italic">
                      This user is not currently enrolled in an active career.
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setDetailUser(null)}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
                  >
                    Close Profile
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* 9. DELETE CONFIRMATION & DEPENDENCY ERROR MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-100 font-bold">
                ⚠️
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">Delete User Account</h3>
                <p className="text-xs text-slate-500">
                  Target: <span className="font-bold text-slate-800">{deleteTarget.name}</span> ({deleteTarget.email})
                </p>
              </div>
            </div>

            {deleteDependencyError ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs space-y-3 text-amber-900">
                <p className="font-extrabold text-amber-900">Deletion Blocked: Existing Dependencies</p>
                <p className="leading-relaxed text-amber-800">
                  {deleteDependencyError.message}
                </p>
                {deleteDependencyError.dependencies && (
                  <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-bold pt-1">
                    <div className="bg-amber-100/70 p-2 rounded-xl border border-amber-200">
                      Enrollments: {deleteDependencyError.dependencies.enrollments || 0}
                    </div>
                    <div className="bg-amber-100/70 p-2 rounded-xl border border-amber-200">
                      Progress Records: {deleteDependencyError.dependencies.progress || 0}
                    </div>
                  </div>
                )}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleStatus(deleteTarget);
                      setDeleteTarget(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 transition"
                  >
                    Deactivate Account Instead
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete <span className="font-bold">{deleteTarget.name}</span>? This action cannot be undone if the user has no dependent career data.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteDependencyError(null);
                }}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              {!deleteDependencyError && (
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDeleteConfirm}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-red-700 transition disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Delete User"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
