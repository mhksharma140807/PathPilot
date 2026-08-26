import { useState, useEffect, useMemo } from "react";
import {
  getAdminRequirements,
  getAdminCareers,
  getAdminPhases,
  getAdminModules,
  createAdminRequirement,
  updateAdminRequirement,
  deleteAdminRequirement,
} from "../../services/adminService";
import { useToast } from "../../context/ToastContext";

function AdminRequirements() {
  const toast = useToast();

  const [requirements, setRequirements] = useState([]);
  const [careers, setCareers] = useState([]);
  const [phases, setPhases] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCareerFilter, setSelectedCareerFilter] = useState("all");
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    career: "",
    phase: "",
    type: "required",
    selectedModules: [],
    minRequired: 1,
  });

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [reqsRes, careersRes, phasesRes, modulesRes] = await Promise.all([
        getAdminRequirements(),
        getAdminCareers(),
        getAdminPhases(),
        getAdminModules(),
      ]);

      if (reqsRes?.success) {
        setRequirements(reqsRes.requirements || []);
      } else {
        setError(reqsRes?.message || "Failed to load curriculum requirements");
      }

      if (careersRes?.success) {
        setCareers(careersRes.careers || []);
      }

      if (phasesRes?.success) {
        setPhases(phasesRes.phases || []);
      }

      if (modulesRes?.success) {
        setModules(modulesRes.modules || []);
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

  // Filter phases by selected career in filter bar
  const availablePhasesForCareerFilter = useMemo(() => {
    if (selectedCareerFilter === "all") return phases;
    return phases.filter(
      (p) => (p.career?._id || p.career) === selectedCareerFilter
    );
  }, [phases, selectedCareerFilter]);

  // Filter phases by selected career in modal form
  const availablePhasesForModal = useMemo(() => {
    if (!formData.career) return phases;
    return phases.filter(
      (p) => (p.career?._id || p.career) === formData.career
    );
  }, [phases, formData.career]);

  // Filter modules by selected phase in modal form
  const availableModulesForModal = useMemo(() => {
    if (!formData.phase) return [];
    return modules.filter(
      (m) => (m.phase?._id || m.phase) === formData.phase
    );
  }, [modules, formData.phase]);

  // Filtered Requirements
  const filteredRequirements = useMemo(() => {
    return requirements.filter((r) => {
      // Career filter
      if (selectedCareerFilter !== "all") {
        const cId = r.career?._id || r.phase?.career?._id || r.phase?.career;
        if (cId !== selectedCareerFilter) return false;
      }

      // Phase filter
      if (selectedPhaseFilter !== "all") {
        const pId = r.phase?._id || r.phase;
        if (pId !== selectedPhaseFilter) return false;
      }

      // Type filter
      if (selectedTypeFilter !== "all" && r.type !== selectedTypeFilter) {
        return false;
      }

      // Search term
      if (!searchTerm.trim()) return true;
      const query = searchTerm.toLowerCase();
      const careerTitle = r.career?.title?.toLowerCase() || "";
      const phaseTitle = r.phase?.title?.toLowerCase() || "";
      const moduleTitles = r.modules
        ?.map((m) => m.title?.toLowerCase())
        .join(" ") || "";

      return (
        careerTitle.includes(query) ||
        phaseTitle.includes(query) ||
        moduleTitles.includes(query)
      );
    });
  }, [requirements, selectedCareerFilter, selectedPhaseFilter, selectedTypeFilter, searchTerm]);

  // Statistics
  const totalCount = requirements.length;
  const requiredCount = requirements.filter((r) => r.type === "required").length;
  const choiceGroupCount = requirements.filter((r) => r.type === "choice_group").length;
  const optionalCount = requirements.filter((r) => r.type === "optional").length;

  // Modal Handlers
  const handleOpenCreateModal = () => {
    setEditingRequirement(null);
    const firstCareer = careers[0]?._id || "";
    const matchingPhases = phases.filter(
      (p) => (p.career?._id || p.career) === firstCareer
    );
    const firstPhase = matchingPhases[0]?._id || "";

    setFormData({
      career: firstCareer,
      phase: firstPhase,
      type: "required",
      selectedModules: [],
      minRequired: 1,
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (reqDoc) => {
    setEditingRequirement(reqDoc);
    const pId = reqDoc.phase?._id || reqDoc.phase || "";
    const cId =
      reqDoc.career?._id ||
      reqDoc.phase?.career?._id ||
      reqDoc.phase?.career ||
      "";

    const moduleIds = Array.isArray(reqDoc.modules)
      ? reqDoc.modules.map((m) => m._id || m)
      : [];

    setFormData({
      career: cId,
      phase: pId,
      type: reqDoc.type || "required",
      selectedModules: moduleIds,
      minRequired: reqDoc.minRequired || 1,
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleCareerChangeInModal = (cId) => {
    const matchingPhases = phases.filter(
      (p) => (p.career?._id || p.career) === cId
    );
    const newPhaseId = matchingPhases[0]?._id || "";
    setFormData((prev) => ({
      ...prev,
      career: cId,
      phase: newPhaseId,
      selectedModules: [],
    }));
  };

  const handlePhaseChangeInModal = (pId) => {
    setFormData((prev) => ({
      ...prev,
      phase: pId,
      selectedModules: [],
    }));
  };

  const handleTypeChangeInModal = (newType) => {
    setFormData((prev) => {
      let newMin = prev.minRequired;
      if (newType === "required") newMin = 1;
      if (newType === "optional") newMin = 0;
      if (newType === "choice_group") {
        newMin = Math.max(1, Math.min(prev.minRequired || 1, prev.selectedModules.length || 1));
      }
      return {
        ...prev,
        type: newType,
        minRequired: newMin,
      };
    });
  };

  const handleModuleToggle = (mId) => {
    setFormData((prev) => {
      const exists = prev.selectedModules.includes(mId);
      const updatedModules = exists
        ? prev.selectedModules.filter((id) => id !== mId)
        : [...prev.selectedModules, mId];

      let updatedMin = prev.minRequired;
      if (prev.type === "choice_group") {
        const maxLen = updatedModules.length;
        if (maxLen === 0) updatedMin = 1;
        else updatedMin = Math.min(Math.max(1, prev.minRequired), maxLen);
      }

      return {
        ...prev,
        selectedModules: updatedModules,
        minRequired: updatedMin,
      };
    });
  };

  // Form Submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formSubmitting) return;

    if (!formData.career) {
      setFormError("Please select a career track.");
      return;
    }

    if (!formData.phase) {
      setFormError("Please select an associated phase.");
      return;
    }

    if (formData.selectedModules.length === 0) {
      setFormError("Please select at least one module for this requirement rule.");
      return;
    }

    if (formData.type === "choice_group") {
      if (formData.selectedModules.length < 2) {
        setFormError("Choice Group requirements require at least 2 modules to choose from.");
        return;
      }
      const minReq = Number(formData.minRequired);
      if (isNaN(minReq) || minReq < 1 || minReq > formData.selectedModules.length) {
        setFormError(`Min Required for Choice Group must be between 1 and ${formData.selectedModules.length}`);
        return;
      }
    }

    setFormError("");
    setFormSubmitting(true);

    try {
      const payload = {
        phase: formData.phase,
        type: formData.type,
        modules: formData.selectedModules,
        minRequired:
          formData.type === "required"
            ? 1
            : formData.type === "optional"
            ? 0
            : Number(formData.minRequired),
      };

      if (editingRequirement) {
        const res = await updateAdminRequirement(editingRequirement._id, payload);
        if (res?.success) {
          toast.success("Curriculum requirement rule updated successfully!");
          setIsFormOpen(false);
          fetchData();
        } else {
          setFormError(res?.message || "Failed to update requirement");
        }
      } else {
        const res = await createAdminRequirement(payload);
        if (res?.success) {
          toast.success("Curriculum requirement rule created successfully!");
          setIsFormOpen(false);
          fetchData();
        } else {
          setFormError(res?.message || "Failed to create requirement");
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

    try {
      const res = await deleteAdminRequirement(deleteTarget._id);
      if (res?.success) {
        toast.success("Curriculum requirement rule deleted.");
        setDeleteTarget(null);
        fetchData();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Deletion failed"
      );
      setDeleteTarget(null);
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
              Curriculum Requirements Management
            </h1>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
              Admin Portal
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Configure phase completion rules, mandatory units, choice groups, and optional modules for student roadmaps.
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
          <span>Create Requirement</span>
        </button>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Rules</p>
            <p className="text-2xl font-extrabold text-[#0F172A] mt-1">{totalCount}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            📋
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Required Rules</p>
            <p className="text-2xl font-extrabold text-blue-600 mt-1">{requiredCount}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            🔒
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Choice Groups</p>
            <p className="text-2xl font-extrabold text-purple-600 mt-1">{choiceGroupCount}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            🔀
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Optional Rules</p>
            <p className="text-2xl font-extrabold text-slate-500 mt-1">{optionalCount}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold">
            💡
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
            placeholder="Search career, phase, or module..."
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
            {availablePhasesForCareerFilter.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title} (#{p.order})
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50/70 outline-none transition focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="required">Required</option>
            <option value="choice_group">Choice Group</option>
            <option value="optional">Optional</option>
          </select>

          {/* Reset Filters */}
          {(searchTerm || selectedCareerFilter !== "all" || selectedPhaseFilter !== "all" || selectedTypeFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCareerFilter("all");
                setSelectedPhaseFilter("all");
                setSelectedTypeFilter("all");
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
          {filteredRequirements.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 text-2xl font-bold">
                📋
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">No Requirement Rules Found</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {searchTerm || selectedCareerFilter !== "all" || selectedPhaseFilter !== "all" || selectedTypeFilter !== "all"
                    ? "Try adjusting your search criteria or filter options."
                    : "Create specific requirement rules to customize phase completion criteria."}
                </p>
              </div>
              {!searchTerm && selectedCareerFilter === "all" && selectedPhaseFilter === "all" && selectedTypeFilter === "all" && (
                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                >
                  + Create First Requirement
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
                      <th className="py-3.5 px-4">Career & Phase</th>
                      <th className="py-3.5 px-4 text-center">Type</th>
                      <th className="py-3.5 px-4">Included Modules</th>
                      <th className="py-3.5 px-4 text-center">Completion Rule</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredRequirements.map((r) => (
                      <tr key={r._id} className="hover:bg-slate-50/80 transition">
                        {/* Career & Phase */}
                        <td className="py-4 px-4 align-top max-w-[240px]">
                          <p className="font-extrabold text-[#0F172A] leading-snug">
                            {r.phase?.title || "Unknown Phase"} (#{r.phase?.order || 0})
                          </p>
                          <span className="inline-block mt-1 font-semibold text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                            {r.career?.title || r.phase?.career?.title || "Unknown Career"}
                          </span>
                        </td>

                        {/* Type Badge */}
                        <td className="py-4 px-4 text-center align-top">
                          {r.type === "required" && (
                            <span className="inline-flex items-center gap-1 font-extrabold text-[10px] text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                              🔒 Required
                            </span>
                          )}
                          {r.type === "choice_group" && (
                            <span className="inline-flex items-center gap-1 font-extrabold text-[10px] text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                              🔀 Choice Group
                            </span>
                          )}
                          {r.type === "optional" && (
                            <span className="inline-flex items-center gap-1 font-extrabold text-[10px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                              💡 Optional
                            </span>
                          )}
                        </td>

                        {/* Included Modules */}
                        <td className="py-4 px-4 align-top max-w-[320px]">
                          <div className="flex flex-wrap gap-1.5">
                            {r.modules && r.modules.length > 0 ? (
                              r.modules.map((m) => (
                                <span
                                  key={m._id}
                                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200"
                                >
                                  <span>#{m.order}</span>
                                  <span>{m.title}</span>
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">No modules</span>
                            )}
                          </div>
                        </td>

                        {/* Completion Rule Description */}
                        <td className="py-4 px-4 text-center align-top">
                          <div className="inline-flex flex-col items-center">
                            {r.type === "required" && (
                              <span className="text-[11px] font-extrabold text-blue-900 bg-blue-50/70 px-2.5 py-1 rounded-lg border border-blue-100">
                                1 module required
                              </span>
                            )}
                            {r.type === "choice_group" && (
                              <span className="text-[11px] font-extrabold text-purple-900 bg-purple-50/70 px-2.5 py-1 rounded-lg border border-purple-100">
                                {r.minRequired} of {r.modules?.length || 0} modules required
                              </span>
                            )}
                            {r.type === "optional" && (
                              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                                Optional (Does not block)
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right align-top">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(r)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-200"
                              title="Edit Requirement"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(r)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-200"
                              title="Delete Requirement"
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
              {filteredRequirements.map((r) => (
                <div
                  key={r._id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-extrabold text-[#0F172A] leading-snug">
                          {r.phase?.title || "Unknown Phase"} (#{r.phase?.order || 0})
                        </h3>
                        <span className="inline-block mt-0.5 font-semibold text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                          {r.career?.title || r.phase?.career?.title || "Unknown Career"}
                        </span>
                      </div>

                      {r.type === "required" && (
                        <span className="shrink-0 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                          Required
                        </span>
                      )}
                      {r.type === "choice_group" && (
                        <span className="shrink-0 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border bg-purple-50 text-purple-700 border-purple-200">
                          Choice Group
                        </span>
                      )}
                      {r.type === "optional" && (
                        <span className="shrink-0 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border bg-slate-100 text-slate-600 border-slate-200">
                          Optional
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Included Modules ({r.modules?.length || 0})</p>
                      <div className="flex flex-wrap gap-1">
                        {r.modules?.map((m) => (
                          <span
                            key={m._id}
                            className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200"
                          >
                            #{m.order} {m.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-extrabold text-slate-600">
                      {r.type === "required"
                        ? "1 module required"
                        : r.type === "choice_group"
                        ? `${r.minRequired} of ${r.modules?.length || 0} required`
                        : "Optional"}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(r)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(r)}
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

      {/* 7. CREATE / EDIT REQUIREMENT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#0F172A]">
                  {editingRequirement ? "Edit Requirement Rule" : "Create Requirement Rule"}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingRequirement
                    ? `Update rule for "${editingRequirement.phase?.title}"`
                    : "Define a phase completion requirement rule for student roadmaps."}
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

            <form onSubmit={handleFormSubmit} className="space-y-5 text-xs">
              {/* Step 1 & 2: Career & Phase Cascading Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                    1. Career Track <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="career"
                    required
                    value={formData.career}
                    onChange={(e) => handleCareerChangeInModal(e.target.value)}
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
                    2. Associated Phase <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="phase"
                    required
                    value={formData.phase}
                    onChange={(e) => handlePhaseChangeInModal(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-semibold"
                  >
                    <option value="" disabled>
                      Select Phase
                    </option>
                    {availablePhasesForModal.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title} (#{p.order})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 3: Requirement Type Selection with Explanations */}
              <div className="space-y-2">
                <label className="block font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                  3. Requirement Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => handleTypeChangeInModal("required")}
                    className={`cursor-pointer rounded-2xl border p-3.5 transition flex flex-col justify-between ${
                      formData.type === "required"
                        ? "border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-blue-900">Required</p>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                        Students must complete the required module(s) according to this rule.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => handleTypeChangeInModal("choice_group")}
                    className={`cursor-pointer rounded-2xl border p-3.5 transition flex flex-col justify-between ${
                      formData.type === "choice_group"
                        ? "border-purple-500 bg-purple-50/70 ring-2 ring-purple-500/20"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-purple-900">Choice Group</p>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                        Students must complete a minimum number of modules from this group.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => handleTypeChangeInModal("optional")}
                    className={`cursor-pointer rounded-2xl border p-3.5 transition flex flex-col justify-between ${
                      formData.type === "optional"
                        ? "border-slate-400 bg-slate-100 ring-2 ring-slate-400/20"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-slate-800">Optional</p>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                        These modules do not contribute to the minimum completion requirement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Modules Selection (Cascaded by selected Phase) */}
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-[#0F172A] uppercase tracking-wider text-[11px]">
                    4. Included Modules ({formData.selectedModules.length} Selected) <span className="text-red-500">*</span>
                  </label>
                </div>
                <p className="text-[10px] text-slate-500 mb-2">
                  Select modules belonging to this phase that will be bound by this requirement rule.
                </p>

                {availableModulesForModal.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center text-xs text-slate-400">
                    No active modules found for this phase. Please create modules in this phase first.
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-1.5 rounded-xl border border-slate-200 bg-white p-2.5">
                    {availableModulesForModal.map((mod) => {
                      const isChecked = formData.selectedModules.includes(mod._id);
                      return (
                        <label
                          key={mod._id}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition ${
                            isChecked ? "bg-blue-50/80 border border-blue-200" : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleModuleToggle(mod._id)}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="font-bold text-slate-800">
                              #{mod.order} {mod.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            ~{mod.estimatedHours || 0} hrs
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Step 5: Conditional minRequired input for Choice Group */}
              {formData.type === "choice_group" && (
                <div className="space-y-1.5 rounded-2xl border border-purple-200 bg-purple-50/50 p-4">
                  <label className="font-extrabold text-purple-900 uppercase tracking-wider text-[11px] block">
                    5. Minimum Modules Required from Choice Group <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[10px] text-purple-700 mb-2">
                    Specify how many modules out of the {formData.selectedModules.length} selected modules a student must complete to satisfy this choice group.
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      required
                      min={1}
                      max={Math.max(1, formData.selectedModules.length)}
                      value={formData.minRequired}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          minRequired: Math.min(
                            Math.max(1, Number(e.target.value) || 1),
                            Math.max(1, prev.selectedModules.length)
                          ),
                        }))
                      }
                      className="w-24 rounded-xl border border-purple-300 px-3 py-2 text-xs text-purple-950 font-extrabold text-center outline-none focus:border-purple-600"
                    />
                    <span className="text-xs font-bold text-purple-800">
                      out of {formData.selectedModules.length} modules selected
                    </span>
                  </div>
                </div>
              )}

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
                    <span>{editingRequirement ? "Update Requirement" : "Create Requirement"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-100 font-bold">
                ⚠️
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">Delete Requirement Rule</h3>
                <p className="text-xs text-slate-500">
                  Target: <span className="font-bold text-slate-800">{deleteTarget.phase?.title}</span> ({deleteTarget.type})
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs space-y-2 text-amber-900">
              <p className="font-extrabold">Curriculum Engine Fallback Notice</p>
              <p className="leading-relaxed text-amber-800">
                Deleting this requirement rule will remove it from the phase. If this is the phase's last requirement rule, the student curriculum engine will fall back to treating all active modules in that phase as required.
              </p>
              <p className="text-[11px] text-amber-700 italic">
                Note: Deleting the requirement rule does NOT delete any modules or student progress.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-red-700 transition disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Requirement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRequirements;
