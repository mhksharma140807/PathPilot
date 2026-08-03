import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getMyCareer } from "../services/careerService";
import { getModulesByCareer } from "../services/moduleService";
import { getMyProgress } from "../services/progressService";
import ModuleCard from "../components/ModuleCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import ProgressBar from "../components/ProgressBar";

function LearningModules() {
  const [modules, setModules] = useState([]);
  const [career, setCareer] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const careerResponse = await getMyCareer();

      const selectedCareer =
        careerResponse?.career ||
        careerResponse?.data?.career ||
        careerResponse?.enrollment?.career;

      const careerId =
        selectedCareer?._id ||
        careerResponse?.careerId ||
        careerResponse?.data?.careerId ||
        careerResponse?.enrollment?.careerId;

      if (!careerId) {
        setCareer(null);
        setModules([]);
        return;
      }

      setCareer(selectedCareer);

      const [moduleResponse, progressResponse] = await Promise.all([
        getModulesByCareer(careerId),
        getMyProgress().catch(() => ({ progress: [] })),
      ]);

      const fetchedModules =
        moduleResponse?.modules ||
        moduleResponse?.data?.modules ||
        moduleResponse?.data ||
        [];

      setModules(fetchedModules);

      const progList = progressResponse?.progress || [];
      const map = {};
      progList.forEach((item) => {
        const mId = item.module?._id || item.module;
        if (mId) {
          map[mId] = item.progressPercentage || item.progress || 0;
        }
      });
      setProgressMap(map);

    } catch (err) {
      console.error("Failed to load learning modules:", err);
      setError(err.message || "Unable to load your learning modules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalCount = modules.length;
  const completedCount = useMemo(
    () => modules.filter((m) => (progressMap[m._id || m.id] || 0) >= 100).length,
    [modules, progressMap]
  );
  const inProgressCount = useMemo(
    () => modules.filter((m) => {
      const p = progressMap[m._id || m.id] || 0;
      return p > 0 && p < 100;
    }).length,
    [modules, progressMap]
  );
  const remainingCount = totalCount - completedCount;

  const overallPct = useMemo(() => {
    if (totalCount === 0) return 0;
    const sum = modules.reduce((acc, m) => acc + (progressMap[m._id || m.id] || 0), 0);
    return Math.round((sum / (totalCount * 100)) * 100);
  }, [modules, totalCount, progressMap]);

  const totalEstHours = useMemo(() => {
    return modules.reduce((acc, m) => acc + (m.estimatedHours || 2), 0);
  }, [modules]);

  const currentModule = useMemo(() => {
    return modules.find((m) => (progressMap[m._id || m.id] || 0) < 100) || modules[0] || null;
  }, [modules, progressMap]);

  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      const p = progressMap[m._id || m.id] || 0;
      if (filter === "completed") return p >= 100;
      if (filter === "in_progress") return p > 0 && p < 100;
      if (filter === "not_started") return p === 0;
      return true;
    });
  }, [modules, progressMap, filter]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 space-y-8">
      {loading && <LoadingState variant="modules" message="Loading learning modules..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadData} />
      )}

      {!loading && !error && !career && (
        <EmptyState
          title="No modules available"
          description="Modules will appear once your learning path is activated."
          actionText="Go to Career Roadmap"
          actionLink="/my-career"
          icon={
            <svg className="h-8 w-8 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
      )}

      {!loading && !error && career && (
        <>
          {/* 1. PROFESSIONAL PAGE HEADER */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-sm">
            <div className="space-y-1.5 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#2563EB] border border-blue-100">
                <span className="h-2 w-2 rounded-full bg-[#2563EB]"></span>
                Enrolled: {career.title || career.name || "Career Path"}
              </span>
              <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight sm:text-3xl">
                Learning Modules
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Continue mastering your career roadmap through structured learning modules.
              </p>
            </div>

            {/* Right side stats header summary */}
            <div className="flex items-center gap-4 shrink-0 rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div className="text-center px-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall Completion</p>
                <p className="text-xl font-extrabold text-[#2563EB] mt-0.5">{overallPct}%</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-center px-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed Modules</p>
                <p className="text-xl font-extrabold text-emerald-600 mt-0.5">{completedCount}/{totalCount}</p>
              </div>
              <div className="h-8 w-px bg-slate-200 hidden sm:block" />
              <div className="text-center px-2 hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. Time</p>
                <p className="text-xl font-extrabold text-slate-700 mt-0.5">~{totalEstHours}h</p>
              </div>
            </div>
          </section>

          {/* 5. LEARNING SUMMARY SECTION */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between transition-all hover:border-emerald-300 hover:shadow-md">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</p>
                <p className="mt-1 text-2xl font-extrabold text-emerald-600">{completedCount}</p>
                <p className="text-xs text-slate-400 mt-0.5">Mastered units</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 font-bold">
                ✓
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between transition-all hover:border-slate-300 hover:shadow-md">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Remaining</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-700">{remainingCount}</p>
                <p className="text-xs text-slate-400 mt-0.5">Pending units</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 font-bold">
                ⏳
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between transition-all hover:border-blue-300 hover:shadow-md">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Module</p>
                <p className="mt-1 text-base font-bold text-[#0F172A] truncate max-w-[130px]">
                  {currentModule?.title || "None"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Active focus</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB] font-bold">
                ⚡
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between transition-all hover:border-blue-300 hover:shadow-md">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Progress</p>
                <p className="mt-1 text-2xl font-extrabold text-[#2563EB]">{overallPct}%</p>
                <p className="text-xs text-slate-400 mt-0.5">Curriculum milestone</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </section>

          {/* 7. RESPONSIVE GRID LAYOUT (3 columns desktop, 2 tablet, 1 mobile) */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                Curriculum Modules ({filteredModules.length})
              </h2>

              {/* Filter Tabs */}
              <div className="inline-flex rounded-xl bg-slate-200/80 p-1 text-xs font-semibold overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`rounded-lg px-3.5 py-1.5 transition-all duration-200 ${
                    filter === "all"
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-slate-600 hover:text-[#0F172A]"
                  }`}
                >
                  All ({totalCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("in_progress")}
                  className={`rounded-lg px-3.5 py-1.5 transition-all duration-200 ${
                    filter === "in_progress"
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-[#0F172A] hover:text-[#0F172A]"
                  }`}
                >
                  In Progress ({inProgressCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("completed")}
                  className={`rounded-lg px-3.5 py-1.5 transition-all duration-200 ${
                    filter === "completed"
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-[#0F172A] hover:text-[#0F172A]"
                  }`}
                >
                  Completed ({completedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("not_started")}
                  className={`rounded-lg px-3.5 py-1.5 transition-all duration-200 ${
                    filter === "not_started"
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-[#0F172A] hover:text-[#0F172A]"
                  }`}
                >
                  Not Started ({totalCount - completedCount - inProgressCount})
                </button>
              </div>
            </div>

            {filteredModules.length === 0 ? (
              <EmptyState
                title="No modules available"
                description={
                  modules.length === 0
                    ? "Modules will appear once your learning path is activated."
                    : "No modules match your selected filter."
                }
                actionText="Go to Career Roadmap"
                actionLink="/my-career"
              />
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredModules.map((module, index) => {
                  const mId = module._id || module.id;
                  const moduleProg = progressMap[mId] || 0;
                  const firstIncomplete = filteredModules.find((m) => (progressMap[m._id || m.id] || 0) < 100);
                  const isCurrent = firstIncomplete && (firstIncomplete._id || firstIncomplete.id) === mId;

                  return (
                    <ModuleCard
                      key={mId || index}
                      module={{
                        ...module,
                        _id: mId,
                        progress: moduleProg,
                      }}
                      index={index}
                      isCurrent={isCurrent}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default LearningModules;