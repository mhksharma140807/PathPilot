import { useState, useEffect, useMemo } from "react";
import {
  getAdminCareers,
  createAdminCareer,
  updateAdminCareer,
  toggleAdminCareerStatus,
  deleteAdminCareer,
} from "../../services/adminService";
import { useToast } from "../../context/ToastContext";

function AdminCareers() {
  const toast = useToast();

  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null); // null for create, object for edit
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    overview: "",
    skills: "",
    estimatedDuration: "",
    isActive: true,
  });

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteConflict, setDeleteConflict] = useState(null);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminCareers();
      if (res?.success) {
        setCareers(res.careers || []);
      } else {
        setError(res?.message || "Failed to load careers");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  // Filtered & Searched Careers
  const filteredCareers = useMemo(() => {
    return careers.filter((c) => {
      // Status filter
      if (statusFilter === "active" && !c.isActive) return false;
      if (statusFilter === "inactive" && c.isActive) return false;

      // Search term filter
      if (!searchTerm.trim()) return true;
      const query = searchTerm.toLowerCase();
      const titleMatch = c.title?.toLowerCase().includes(query);
      const slugMatch = c.slug?.toLowerCase().includes(query);
      const descMatch = c.description?.toLowerCase().includes(query);
      const skillsMatch = c.skills?.some((s) =>
        s.toLowerCase().includes(query)
      );

      return titleMatch || slugMatch || descMatch || skillsMatch;
    });
  }, [careers, statusFilter, searchTerm]);

  // Statistics
  const totalCount = careers.length;
  const activeCount = careers.filter((c) => c.isActive).length;
  const inactiveCount = totalCount - activeCount;
  const totalModulesCount = careers.reduce(
    (acc, curr) => acc + (curr.moduleCount || 0),
    0
  );

  // Form Handlers
  const handleOpenCreateModal = () => {
    setEditingCareer(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      overview: "",
      skills: "",
      estimatedDuration: "6 Months",
      isActive: true,
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (career) => {
    setEditingCareer(career);
    setFormData({
      title: career.title || "",
      slug: career.slug || "",
      description: career.description || "",
      overview: career.overview || "",
      skills: Array.isArray(career.skills) ? career.skills.join(", ") : "",
      estimatedDuration: career.estimatedDuration || "",
      isActive: Boolean(career.isActive),
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-slug generation on title change if slug was empty or auto-derived
    if (name === "title" && (!editingCareer || !formData.slug)) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formSubmitting) return;

    setFormError("");
    setFormSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        overview: formData.overview.trim(),
        skills: formData.skills,
        estimatedDuration: formData.estimatedDuration.trim(),
        isActive: formData.isActive,
      };

      if (editingCareer) {
        const res = await updateAdminCareer(editingCareer._id, payload);
        if (res?.success) {
          toast.success(`Career "${res.career.title}" updated successfully!`);
          setIsFormOpen(false);
          fetchCareers();
        } else {
          setFormError(res?.message || "Failed to update career");
        }
      } else {
        const res = await createAdminCareer(payload);
        if (res?.success) {
          toast.success(`Career "${res.career.title}" created successfully!`);
          setIsFormOpen(false);
          fetchCareers();
        } else {
          setFormError(res?.message || "Failed to create career");
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

  // Status Toggle Handler
  const handleToggleStatus = async (career) => {
    try {
      const res = await toggleAdminCareerStatus(career._id, !career.isActive);
      if (res?.success) {
        toast.success(res.message);
        // Optimistic UI update
        setCareers((prev) =>
          prev.map((c) =>
            c._id === career._id ? { ...c, isActive: res.career.isActive } : c
          )
        );
      } else {
        toast.error(res?.message || "Failed to update status");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to toggle status"
      );
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    setDeleteConflict(null);

    try {
      const res = await deleteAdminCareer(deleteTarget._id);
      if (res?.success) {
        toast.success(`Career "${deleteTarget.title}" deleted.`);
        setDeleteTarget(null);
        fetchCareers();
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (err.response?.status === 409) {
        setDeleteConflict(
          errorData?.message ||
            "Cannot delete career due to existing curriculum dependencies."
        );
      } else {
        toast.error(errorData?.message || err.message || "Deletion failed");
        setDeleteTarget(null);
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 font-sans antialiased">
      {/* 1. Header Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight sm:text-2xl">
              Careers Management
            </h1>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
              Admin Portal
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Configure career paths, technical tracks, skills, and roadmap availability.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition active:scale-95 shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create New Career</span>
        </button>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Careers</p>
            <p className="text-2xl font-extrabold text-[#0F172A] mt-1">{totalCount}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            💼
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Tracks</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{activeCount}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            ✓
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Inactive Tracks</p>
            <p className="text-2xl font-extrabold text-slate-500 mt-1">{inactiveCount}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold">
            ⏸
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Modules</p>
            <p className="text-2xl font-extrabold text-indigo-600 mt-1">{totalModulesCount}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            📚
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by title, slug, description, or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50/70 outline-none transition focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

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
            onClick={fetchCareers}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* 6. Main Content View */}
      {!loading && !error && (
        <>
          {filteredCareers.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB] text-2xl font-bold">
                🎯
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">No Careers Found</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search criteria or filter options."
                    : "Get started by creating your first career roadmap track."}
                </p>
              </div>
              {!searchTerm && statusFilter === "all" && (
                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                >
                  + Create First Career
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
                      <th className="py-3.5 px-4">Career Track</th>
                      <th className="py-3.5 px-4">Description & Skills</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-center">Phases / Modules</th>
                      <th className="py-3.5 px-4 text-center">Duration</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredCareers.map((career) => (
                      <tr key={career._id} className="hover:bg-slate-50/80 transition">
                        {/* Title & Slug */}
                        <td className="py-4 px-4 align-top max-w-[200px]">
                          <p className="font-extrabold text-[#0F172A] leading-snug">{career.title}</p>
                          <span className="inline-block mt-1 font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {career.slug}
                          </span>
                        </td>

                        {/* Description & Skills */}
                        <td className="py-4 px-4 align-top max-w-[320px]">
                          <p className="text-slate-600 line-clamp-2 text-xs leading-relaxed">
                            {career.description}
                          </p>
                          {career.skills && career.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {career.skills.map((skill, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        {/* Status Switch */}
                        <td className="py-4 px-4 text-center align-top">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(career)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                              career.isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${career.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                            <span>{career.isActive ? "Active" : "Inactive"}</span>
                          </button>
                        </td>

                        {/* Phase & Module Counts */}
                        <td className="py-4 px-4 text-center align-top">
                          <div className="flex justify-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                              <span className="text-slate-400">Phases:</span>
                              <span>{career.phaseCount ?? 0}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
                              <span className="text-indigo-400">Modules:</span>
                              <span>{career.moduleCount ?? 0}</span>
                            </span>
                          </div>
                        </td>

                        {/* Duration */}
                        <td className="py-4 px-4 text-center align-top text-slate-500 font-medium">
                          {career.estimatedDuration || "—"}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right align-top">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(career)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-200"
                              title="Edit Career"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setDeleteTarget(career);
                                setDeleteConflict(null);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-200"
                              title="Delete Career"
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
              {filteredCareers.map((career) => (
                <div
                  key={career._id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-extrabold text-[#0F172A] leading-snug">
                          {career.title}
                        </h3>
                        <span className="inline-block mt-0.5 font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {career.slug}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(career)}
                        className={`shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition ${
                          career.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {career.isActive ? "Active" : "Inactive"}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {career.description}
                    </p>

                    {career.skills && career.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {career.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-slate-500 font-semibold">
                      <span>{career.phaseCount ?? 0} Phases</span>
                      <span>•</span>
                      <span>{career.moduleCount ?? 0} Modules</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(career)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget(career);
                          setDeleteConflict(null);
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

      {/* 7. CREATE / EDIT CAREER MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#0F172A]">
                  {editingCareer ? "Edit Career Track" : "Create New Career Track"}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingCareer
                    ? `Update details for "${editingCareer.title}"`
                    : "Add a new career path to PathPilot's curriculum roadmap."}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                    Career Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="e.g. Full Stack Web Development"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                    URL Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={handleFormChange}
                    placeholder="e.g. full-stack-web-development"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Provide a comprehensive summary of this career path..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                  Detailed Overview (Optional)
                </label>
                <textarea
                  name="overview"
                  rows={3}
                  value={formData.overview}
                  onChange={handleFormChange}
                  placeholder="In-depth roadmap overview or target career outcomes..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                    Key Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleFormChange}
                    placeholder="HTML, CSS, React, Node.js"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    name="estimatedDuration"
                    value={formData.estimatedDuration}
                    onChange={handleFormChange}
                    placeholder="e.g. 6 Months / 24 Weeks"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleFormChange}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActiveToggle" className="font-bold text-[#0F172A] cursor-pointer">
                  Activate career track for student enrollment immediately
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
                    <span>{editingCareer ? "Update Career" : "Create Career"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. DELETE CONFIRMATION MODAL WITH DEPENDENCY WARNING */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-100 font-bold">
                ⚠️
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">Delete Career Track</h3>
                <p className="text-xs text-slate-500">
                  Target: <span className="font-bold text-slate-800">{deleteTarget.title}</span>
                </p>
              </div>
            </div>

            {deleteConflict ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs space-y-2 text-amber-800">
                <p className="font-extrabold text-amber-900">Deletion Blocked (Data Relationship Safety)</p>
                <p className="leading-relaxed">{deleteConflict}</p>
                <p className="text-[11px] text-amber-700 italic">
                  Tip: Instead of deleting, you can deactivate this career to hide it from students.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete <span className="font-bold">{deleteTarget.title}</span>? This action cannot be undone if the career has no dependent curriculum data.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteConflict(null);
                }}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                {deleteConflict ? "Close" : "Cancel"}
              </button>

              {!deleteConflict && (
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-red-700 transition disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCareers;
