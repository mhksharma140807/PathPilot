import { useState, useEffect, useMemo } from "react";
import {
  getAdminModules,
  getAdminCareers,
  getAdminPhases,
  createAdminModule,
  updateAdminModule,
  toggleAdminModuleStatus,
  deleteAdminModule,
} from "../../services/adminService";
import { useToast } from "../../context/ToastContext";

function AdminModules() {
  const toast = useToast();

  const [modules, setModules] = useState([]);
  const [careers, setCareers] = useState([]);
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCareerFilter, setSelectedCareerFilter] = useState("all");
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null); // null for create, object for edit
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    career: "",
    phase: "",
    title: "",
    description: "",
    order: 1,
    estimatedHours: 4,
    objectives: [""],
    lessons: [
      {
        title: "",
        duration: "15 mins",
        content: "",
        keyTakeaway: "",
      },
    ],
    prerequisites: [],
    isActive: true,
  });

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteConflict, setDeleteConflict] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [modulesRes, careersRes, phasesRes] = await Promise.all([
        getAdminModules(),
        getAdminCareers(),
        getAdminPhases(),
      ]);

      if (modulesRes?.success) {
        setModules(modulesRes.modules || []);
      } else {
        setError(modulesRes?.message || "Failed to load modules");
      }

      if (careersRes?.success) {
        setCareers(careersRes.careers || []);
      }

      if (phasesRes?.success) {
        setPhases(phasesRes.phases || []);
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
    fetchData();
  }, []);

  // Filter phases by selected career in filter bar or modal
  const availablePhasesForCareerFilter = useMemo(() => {
    if (selectedCareerFilter === "all") return phases;
    return phases.filter(
      (p) =>
        (p.career?._id || p.career) === selectedCareerFilter
    );
  }, [phases, selectedCareerFilter]);

  const availablePhasesForModal = useMemo(() => {
    if (!formData.career) return phases;
    return phases.filter(
      (p) => (p.career?._id || p.career) === formData.career
    );
  }, [phases, formData.career]);

  const availablePrerequisitesForModal = useMemo(() => {
    return modules.filter((m) => {
      // Exclude current module if editing
      if (editingModule && (m._id === editingModule._id)) return false;
      // Filter by selected career if specified
      if (formData.career && (m.career?._id || m.career) !== formData.career) {
        return false;
      }
      return true;
    });
  }, [modules, editingModule, formData.career]);

  // Filtered & Searched Modules
  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      // Career filter
      if (
        selectedCareerFilter !== "all" &&
        (m.career?._id || m.career) !== selectedCareerFilter
      ) {
        return false;
      }

      // Phase filter
      if (selectedPhaseFilter !== "all") {
        if (selectedPhaseFilter === "none" && m.phase) return false;
        if (
          selectedPhaseFilter !== "none" &&
          (m.phase?._id || m.phase) !== selectedPhaseFilter
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter === "active" && !m.isActive) return false;
      if (statusFilter === "inactive" && m.isActive) return false;

      // Search query
      if (!searchTerm.trim()) return true;
      const query = searchTerm.toLowerCase();
      const titleMatch = m.title?.toLowerCase().includes(query);
      const descMatch = m.description?.toLowerCase().includes(query);
      const careerMatch = m.career?.title?.toLowerCase().includes(query);
      const phaseMatch = m.phase?.title?.toLowerCase().includes(query);
      const lessonMatch = m.lessons?.some((l) =>
        l.title?.toLowerCase().includes(query)
      );

      return titleMatch || descMatch || careerMatch || phaseMatch || lessonMatch;
    });
  }, [modules, selectedCareerFilter, selectedPhaseFilter, statusFilter, searchTerm]);

  // Statistics
  const totalCount = modules.length;
  const activeCount = modules.filter((m) => m.isActive).length;
  const inactiveCount = totalCount - activeCount;
  const totalLessonsCount = modules.reduce(
    (acc, curr) => acc + (curr.lessons?.length || 0),
    0
  );

  // Form Handlers
  const handleOpenCreateModal = () => {
    setEditingModule(null);
    const initialCareer = careers[0]?._id || "";
    const matchingPhases = phases.filter(
      (p) => (p.career?._id || p.career) === initialCareer
    );

    setFormData({
      career: initialCareer,
      phase: matchingPhases[0]?._id || "",
      title: "",
      description: "",
      order: 1,
      estimatedHours: 4,
      objectives: [""],
      lessons: [
        {
          title: "Introduction",
          duration: "15 mins",
          content: "Welcome to this module. In this lesson, you will learn...",
          keyTakeaway: "",
        },
      ],
      prerequisites: [],
      isActive: true,
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (mod) => {
    setEditingModule(mod);
    setFormData({
      career: mod.career?._id || mod.career || "",
      phase: mod.phase?._id || mod.phase || "",
      title: mod.title || "",
      description: mod.description || "",
      order: mod.order || 1,
      estimatedHours: mod.estimatedHours || 0,
      objectives:
        Array.isArray(mod.objectives) && mod.objectives.length > 0
          ? [...mod.objectives]
          : [""],
      lessons:
        Array.isArray(mod.lessons) && mod.lessons.length > 0
          ? mod.lessons.map((l) => ({
              title: l.title || "",
              duration: l.duration || "15 mins",
              content: l.content || "",
              keyTakeaway: l.keyTakeaway || "",
            }))
          : [
              {
                title: "",
                duration: "15 mins",
                content: "",
                keyTakeaway: "",
              },
            ],
      prerequisites: Array.isArray(mod.prerequisites)
        ? mod.prerequisites.map((p) => p._id || p)
        : [],
      isActive: Boolean(mod.isActive),
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Reset phase if career changes and phase doesn't match new career
      if (name === "career") {
        const validPhases = phases.filter(
          (p) => (p.career?._id || p.career) === value
        );
        if (!validPhases.some((p) => p._id === prev.phase)) {
          updated.phase = validPhases[0]?._id || "";
        }
      }

      return updated;
    });
  };

  // Dynamic Objectives Builder
  const handleObjectiveChange = (index, value) => {
    setFormData((prev) => {
      const newObjectives = [...prev.objectives];
      newObjectives[index] = value;
      return { ...prev, objectives: newObjectives };
    });
  };

  const handleAddObjective = () => {
    setFormData((prev) => ({
      ...prev,
      objectives: [...prev.objectives, ""],
    }));
  };

  const handleRemoveObjective = (index) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }));
  };

  // Dynamic Lesson Builder
  const handleLessonChange = (index, field, value) => {
    setFormData((prev) => {
      const newLessons = [...prev.lessons];
      newLessons[index] = { ...newLessons[index], [field]: value };
      return { ...prev, lessons: newLessons };
    });
  };

  const handleAddLesson = () => {
    setFormData((prev) => ({
      ...prev,
      lessons: [
        ...prev.lessons,
        {
          title: "",
          duration: "15 mins",
          content: "",
          keyTakeaway: "",
        },
      ],
    }));
  };

  const handleRemoveLesson = (index) => {
    setFormData((prev) => ({
      ...prev,
      lessons: prev.lessons.filter((_, i) => i !== index),
    }));
  };

  const handleMoveLesson = (index, direction) => {
    setFormData((prev) => {
      const newLessons = [...prev.lessons];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= newLessons.length) return prev;
      const temp = newLessons[index];
      newLessons[index] = newLessons[targetIndex];
      newLessons[targetIndex] = temp;
      return { ...prev, lessons: newLessons };
    });
  };

  // Prerequisites toggle
  const handlePrerequisiteToggle = (modId) => {
    setFormData((prev) => {
      const exists = prev.prerequisites.includes(modId);
      return {
        ...prev,
        prerequisites: exists
          ? prev.prerequisites.filter((id) => id !== modId)
          : [...prev.prerequisites, modId],
      };
    });
  };

  // Form Submit Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formSubmitting) return;

    if (!formData.career) {
      setFormError("Please select an associated career track.");
      return;
    }

    if (!formData.title.trim()) {
      setFormError("Module title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setFormError("Module description is required.");
      return;
    }

    // Validate lessons
    const validLessons = formData.lessons.filter(
      (l) => l.title.trim() && l.content.trim()
    );

    if (formData.lessons.length > 0 && validLessons.length < formData.lessons.length) {
      setFormError("Each lesson must have at least a Title and Content.");
      return;
    }

    setFormError("");
    setFormSubmitting(true);

    try {
      const payload = {
        career: formData.career,
        phase: formData.phase || null,
        title: formData.title.trim(),
        description: formData.description.trim(),
        order: Number(formData.order),
        estimatedHours: Number(formData.estimatedHours || 0),
        objectives: formData.objectives.map((o) => o.trim()).filter(Boolean),
        lessons: validLessons.map((l) => ({
          title: l.title.trim(),
          duration: (l.duration || "15 mins").trim(),
          content: l.content.trim(),
          keyTakeaway: (l.keyTakeaway || "").trim(),
        })),
        prerequisites: formData.prerequisites,
        isActive: formData.isActive,
      };

      if (editingModule) {
        const res = await updateAdminModule(editingModule._id, payload);
        if (res?.success) {
          toast.success(`Module "${res.module.title}" updated successfully!`);
          setIsFormOpen(false);
          fetchData();
        } else {
          setFormError(res?.message || "Failed to update module");
        }
      } else {
        const res = await createAdminModule(payload);
        if (res?.success) {
          toast.success(`Module "${res.module.title}" created successfully!`);
          setIsFormOpen(false);
          fetchData();
        } else {
          setFormError(res?.message || "Failed to create module");
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
  const handleToggleStatus = async (mod) => {
    try {
      const res = await toggleAdminModuleStatus(mod._id, !mod.isActive);
      if (res?.success) {
        toast.success(res.message);
        setModules((prev) =>
          prev.map((m) =>
            m._id === mod._id ? { ...m, isActive: res.module.isActive } : m
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
      const res = await deleteAdminModule(deleteTarget._id);
      if (res?.success) {
        toast.success(`Module "${deleteTarget.title}" deleted.`);
        setDeleteTarget(null);
        fetchData();
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (err.response?.status === 409) {
        setDeleteConflict(errorData);
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
              Modules Management
            </h1>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
              Admin Portal
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Configure curriculum modules, learning objectives, lesson units, and phase dependencies.
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
          <span>Create New Module</span>
        </button>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Modules</p>
            <p className="text-2xl font-extrabold text-[#0F172A] mt-1">{totalCount}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            📚
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Modules</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{activeCount}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            ✓
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Inactive Modules</p>
            <p className="text-2xl font-extrabold text-slate-500 mt-1">{inactiveCount}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold">
            ⏸
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Lessons</p>
            <p className="text-2xl font-extrabold text-indigo-600 mt-1">{totalLessonsCount}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            📝
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
            placeholder="Search by title, lesson, phase..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Career Filter */}
          <select
            value={selectedCareerFilter}
            onChange={(e) => {
              setSelectedCareerFilter(e.target.value);
              setSelectedPhaseFilter("all");
            }}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50/70 outline-none transition focus:border-blue-500 max-w-[160px] truncate"
          >
            <option value="all">All Careers</option>
            {careers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>

          {/* Phase Filter */}
          <select
            value={selectedPhaseFilter}
            onChange={(e) => setSelectedPhaseFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50/70 outline-none transition focus:border-blue-500 max-w-[160px] truncate"
          >
            <option value="all">All Phases</option>
            <option value="none">Unassigned (No Phase)</option>
            {availablePhasesForCareerFilter.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title} (#{p.order})
              </option>
            ))}
          </select>

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

          {/* Reset Filters */}
          {(searchTerm || selectedCareerFilter !== "all" || selectedPhaseFilter !== "all" || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCareerFilter("all");
                setSelectedPhaseFilter("all");
                setStatusFilter("all");
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
            onClick={fetchData}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* 6. Main Content View */}
      {!loading && !error && (
        <>
          {filteredModules.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 text-2xl font-bold">
                📚
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">No Modules Found</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {searchTerm || selectedCareerFilter !== "all" || selectedPhaseFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your search criteria or filter options."
                    : "Get started by creating your first curriculum module."}
                </p>
              </div>
              {!searchTerm && selectedCareerFilter === "all" && statusFilter === "all" && (
                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                >
                  + Create First Module
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
                      <th className="py-3.5 px-4 text-center">Order</th>
                      <th className="py-3.5 px-4">Module Title & Description</th>
                      <th className="py-3.5 px-4">Career Track</th>
                      <th className="py-3.5 px-4">Phase</th>
                      <th className="py-3.5 px-4 text-center">Lessons / Hours</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredModules.map((mod) => (
                      <tr key={mod._id} className="hover:bg-slate-50/80 transition">
                        {/* Order Badge */}
                        <td className="py-4 px-4 text-center align-top">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs border border-indigo-200">
                            #{mod.order}
                          </span>
                        </td>

                        {/* Title & Description */}
                        <td className="py-4 px-4 align-top max-w-[280px]">
                          <p className="font-extrabold text-[#0F172A] leading-snug">{mod.title}</p>
                          <p className="text-slate-500 line-clamp-2 text-[11px] mt-0.5 leading-relaxed">
                            {mod.description}
                          </p>
                          {mod.objectives && mod.objectives.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              <span className="text-[9px] font-bold uppercase text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                {mod.objectives.length} Objectives
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Career Track */}
                        <td className="py-4 px-4 align-top">
                          <span className="inline-block font-semibold text-[10px] text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                            {mod.career?.title || "Unknown Career"}
                          </span>
                        </td>

                        {/* Phase */}
                        <td className="py-4 px-4 align-top">
                          {mod.phase ? (
                            <span className="inline-block font-semibold text-[10px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                              {mod.phase.title} (#{mod.phase.order})
                            </span>
                          ) : (
                            <span className="inline-block text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded italic">
                              None
                            </span>
                          )}
                        </td>

                        {/* Lessons & Hours */}
                        <td className="py-4 px-4 text-center align-top">
                          <div className="flex flex-col items-center gap-1">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                              <span>{mod.lessons?.length || 0} Lessons</span>
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500">
                              ~{mod.estimatedHours || 0} hrs
                            </span>
                          </div>
                        </td>

                        {/* Status Switch */}
                        <td className="py-4 px-4 text-center align-top">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(mod)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                              mod.isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${mod.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                            <span>{mod.isActive ? "Active" : "Inactive"}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right align-top">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(mod)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-200"
                              title="Edit Module"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setDeleteTarget(mod);
                                setDeleteConflict(null);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-200"
                              title="Delete Module"
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
              {filteredModules.map((mod) => (
                <div
                  key={mod._id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs border border-indigo-200">
                          #{mod.order}
                        </span>
                        <div>
                          <h3 className="text-base font-extrabold text-[#0F172A] leading-snug">
                            {mod.title}
                          </h3>
                          <span className="inline-block mt-0.5 font-semibold text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                            {mod.career?.title || "Unknown Career"}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(mod)}
                        className={`shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition ${
                          mod.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {mod.isActive ? "Active" : "Inactive"}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {mod.description}
                    </p>

                    {mod.phase && (
                      <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 inline-block">
                        Phase: {mod.phase.title} (#{mod.phase.order})
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-slate-500 font-semibold">
                      <span>{mod.lessons?.length || 0} Lessons</span>
                      <span>•</span>
                      <span>~{mod.estimatedHours || 0} hrs</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(mod)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget(mod);
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

      {/* 7. CREATE / EDIT MODULE MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#0F172A]">
                  {editingModule ? "Edit Curriculum Module" : "Create New Module"}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingModule
                    ? `Update module details and lessons for "${editingModule.title}"`
                    : "Add a new learning module to a career track."}
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

            <form onSubmit={handleFormSubmit} className="space-y-6 text-xs">
              {/* Basic Meta Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                    Career Track <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="career"
                    required
                    value={formData.career}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-semibold"
                  >
                    <option value="" disabled>
                      Select Career Track
                    </option>
                    {careers.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                    Associated Phase (Optional)
                  </label>
                  <select
                    name="phase"
                    value={formData.phase}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-semibold"
                  >
                    <option value="">No Phase (Unassigned)</option>
                    {availablePhasesForModal.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title} (#{p.order})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="mb-1 block font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                    Module Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="e.g. Advanced React Hooks & Context"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                    Order # <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="order"
                    required
                    min={1}
                    value={formData.order}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-bold text-center"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                    Est. Hours
                  </label>
                  <input
                    type="number"
                    name="estimatedHours"
                    min={0}
                    value={formData.estimatedHours}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-bold text-center"
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
                  rows={2}
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Provide a clear description of what students will learn in this module..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              {/* Dynamic Objectives Builder */}
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-[#0F172A] uppercase tracking-wider text-[11px]">
                    Learning Objectives ({formData.objectives.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddObjective}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition"
                  >
                    + Add Objective
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.objectives.map((obj, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold text-xs shrink-0 w-4">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={obj}
                        onChange={(e) => handleObjectiveChange(idx, e.target.value)}
                        placeholder={`e.g. Master state management using useContext and useReducer`}
                        className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-900 outline-none transition focus:border-blue-500"
                      />
                      {formData.objectives.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveObjective(idx)}
                          className="p-1 text-slate-400 hover:text-red-500 transition"
                          title="Remove Objective"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Lesson Builder */}
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <h4 className="font-extrabold text-[#0F172A] uppercase tracking-wider text-[11px]">
                      Lesson Units Builder ({formData.lessons.length})
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Construct lessons in sequence. Each lesson contains learning content and key takeaways.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLesson}
                    className="inline-flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                  >
                    + Add Lesson
                  </button>
                </div>

                {formData.lessons.map((les, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 relative shadow-2xs"
                  >
                    <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      <span className="font-extrabold text-xs text-slate-700">
                        Lesson #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveLesson(idx, -1)}
                          className="p-1 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-30 transition"
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={idx === formData.lessons.length - 1}
                          onClick={() => handleMoveLesson(idx, 1)}
                          className="p-1 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-30 transition"
                          title="Move Down"
                        >
                          ▼
                        </button>
                        {formData.lessons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLesson(idx)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded transition ml-1"
                            title="Remove Lesson"
                          >
                            🗑
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                          Lesson Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={les.title}
                          onChange={(e) => handleLessonChange(idx, "title", e.target.value)}
                          placeholder="e.g. Understanding State & Props"
                          className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-blue-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={les.duration}
                          onChange={(e) => handleLessonChange(idx, "duration", e.target.value)}
                          placeholder="e.g. 15 mins"
                          className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-blue-500 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                        Lesson Content <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={les.content}
                        onChange={(e) => handleLessonChange(idx, "content", e.target.value)}
                        placeholder="Detailed lesson content, explanations, or code examples..."
                        className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-blue-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                        Key Takeaway
                      </label>
                      <input
                        type="text"
                        value={les.keyTakeaway}
                        onChange={(e) => handleLessonChange(idx, "keyTakeaway", e.target.value)}
                        placeholder="Summary takeaway for students..."
                        className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-blue-500 font-medium"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Prerequisites Multi-Select */}
              {availablePrerequisitesForModal.length > 0 && (
                <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                  <label className="font-extrabold text-[#0F172A] uppercase tracking-wider text-[11px] block">
                    Prerequisite Modules (Optional)
                  </label>
                  <p className="text-[10px] text-slate-500 mb-2">
                    Select modules that must be completed before students can unlock this module.
                  </p>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 rounded-xl border border-slate-200 bg-white p-2.5">
                    {availablePrerequisitesForModal.map((pm) => {
                      const isChecked = formData.prerequisites.includes(pm._id);
                      return (
                        <label
                          key={pm._id}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handlePrerequisiteToggle(pm._id)}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="font-bold text-slate-800">{pm.title}</span>
                          {pm.phase && (
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              {pm.phase.title}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="moduleActiveToggle"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleFormChange}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="moduleActiveToggle" className="font-bold text-[#0F172A] cursor-pointer">
                  Activate module for student curriculum immediately
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
                    <span>{editingModule ? "Update Module" : "Create Module"}</span>
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
                <h3 className="text-base font-extrabold text-[#0F172A]">Delete Module</h3>
                <p className="text-xs text-slate-500">
                  Target: <span className="font-bold text-slate-800">{deleteTarget.title}</span>
                </p>
              </div>
            </div>

            {deleteConflict ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs space-y-3 text-amber-800">
                <p className="font-extrabold text-amber-900">Deletion Blocked (Data Relationship Safety)</p>
                <p className="leading-relaxed">
                  This module cannot be deleted because it is currently used by student progress, curriculum requirements, or other module prerequisites.
                </p>
                {deleteConflict.dependencies && (
                  <div className="bg-amber-100/70 p-2.5 rounded-xl text-[11px] font-semibold space-y-1">
                    <p>• Student Progress Records: {deleteConflict.dependencies.progress || 0}</p>
                    <p>• Curriculum Requirements: {deleteConflict.dependencies.requirements || 0}</p>
                    <p>• Prerequisite Dependencies: {deleteConflict.dependencies.prerequisiteDependents || 0}</p>
                  </div>
                )}
                <p className="text-[11px] text-amber-800 font-bold italic">
                  Recommendation: Deactivate this module instead of deleting.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete <span className="font-bold">{deleteTarget.title}</span>? This action cannot be undone if the module has no dependent curriculum data.
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
                  disabled={deleting}
                  onClick={handleDeleteConfirm}
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

export default AdminModules;
