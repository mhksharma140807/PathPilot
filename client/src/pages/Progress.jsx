import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentDashboard } from "../services/dashboardService";
import DashboardCard from "../components/DashboardCard";
import ProgressBar from "../components/ProgressBar";
import StatusBadge from "../components/StatusBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

function Progress() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProgressData = async () => {
    try {
      setLoading(true);
      setError("");
      const resData = await getStudentDashboard();
      setData(resData || {});
    } catch (err) {
      console.error("Failed to load progress analytics:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load progress analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgressData();
  }, []);

  const hasEnrollment = data?.hasEnrollment && data?.career;
  const modules = data?.modules || [];
  const totalModules = data?.summary?.totalModules || modules.length || 0;
  const completedModules = data?.summary?.completedModules || modules.filter((m) => (m.progressPercentage || m.progress || 0) >= 100).length || 0;
  const inProgressModules = modules.filter((m) => {
    const p = m.progressPercentage || m.progress || 0;
    return p > 0 && p < 100;
  }).length;
  const notStartedModules = totalModules - completedModules - inProgressModules;
  const overallProgress = data?.summary?.overallProgress || 0;

  const currentModule = modules.find(
    (m) => (m.progressPercentage || m.progress || 0) < 100
  ) || modules[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 space-y-8">
      {loading && <LoadingState variant="progress" message="Loading your progress analytics..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadProgressData} />
      )}

      {!loading && !error && (!hasEnrollment || modules.length === 0) && (
        <EmptyState
          title="No completed modules yet."
          description="Select your career path or complete learning units to see detailed analytics."
          actionText="Explore Career Paths"
          actionLink="/my-career"
        />
      )}

      {!loading && !error && hasEnrollment && (
        <>
          {/* Analytics Hero / Career Overview */}
          <section className="rounded-3xl bg-[#0F172A] p-6 text-white shadow-md md:p-8 border border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-blue-400 border border-slate-700">
                  Enrolled Path Analytics
                </span>

                <h2 className="mt-3 text-3xl font-extrabold text-white">
                  {data.career?.title || data.career?.name || "Career Path"}
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Detailed breakdown of your completed learning milestones and curriculum progress.
                </p>
              </div>

              <div className="w-full md:w-64 rounded-2xl bg-slate-800/90 p-5 border border-slate-700/80 shrink-0">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Overall Completion</span>
                  <span className="text-base font-extrabold text-white">{overallProgress}%</span>
                </div>
                <div className="mt-3">
                  <ProgressBar progress={overallProgress} />
                </div>
                <div className="mt-4 flex justify-between text-xs text-slate-400 border-t border-slate-700/50 pt-3">
                  <span>Mastered: {completedModules}</span>
                  <span>Total: {totalModules}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Milestone & Summary Cards */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title="Overall Completion"
              value={`${overallProgress}%`}
              subtitle="Curriculum percentage"
              highlight={true}
              icon={
                <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />

            <DashboardCard
              title="Completed Modules"
              value={`${completedModules}`}
              subtitle="Fully mastered units"
              icon={
                <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            <DashboardCard
              title="In Progress"
              value={`${inProgressModules}`}
              subtitle="Active modules"
              icon={
                <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            <DashboardCard
              title="Remaining Modules"
              value={`${Math.max(notStartedModules, 0)}`}
              subtitle="Pending units"
              icon={
                <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
            />
          </section>

          {/* VISUAL PROGRESS TIMELINE */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs md:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-extrabold text-[#0F172A]">
                Visual Progress Timeline
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Visual status overview of all modules in sequence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {modules.map((mod, idx) => {
                const prog = mod.progressPercentage || mod.progress || 0;
                const isDone = prog >= 100;
                const isInProgress = prog > 0 && prog < 100;

                return (
                  <div
                    key={mod.moduleId || mod._id || idx}
                    className={`rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                      isDone
                        ? "bg-emerald-50/50 border-emerald-200"
                        : isInProgress
                        ? "bg-blue-50/50 border-blue-200 ring-1 ring-[#2563EB]/20"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-extrabold mb-2">
                        <span className={isDone ? "text-emerald-700" : isInProgress ? "text-[#2563EB]" : "text-slate-500"}>
                          Module 0{idx + 1}
                        </span>
                        <span className="text-xs font-bold">
                          {isDone ? "✓ Done" : isInProgress ? `${prog}%` : "Not Started"}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0F172A] truncate">
                        {mod.title}
                      </h4>
                    </div>

                    <div className="mt-3 pt-2">
                      <ProgressBar progress={prog} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Detailed Breakdown List */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-xl font-extrabold text-[#0F172A]">
                  Milestone Progress Breakdown
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Individual completion rate and status per module unit.
                </p>
              </div>

              {currentModule && (
                <button
                  type="button"
                  onClick={() => navigate(`/learning-modules/${currentModule.moduleId || currentModule._id}`)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:bg-blue-700 shadow-xs shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <span>Continue Active Module →</span>
                </button>
              )}
            </div>

            <div className="space-y-4 overflow-x-auto">
              {modules.map((mod, idx) => {
                const prog = mod.progressPercentage || mod.progress || 0;
                return (
                  <div
                    key={mod.moduleId || mod._id || idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 transition-all duration-200"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 text-xs font-extrabold text-slate-700 shrink-0">
                          0{idx + 1}
                        </span>
                        <h4 className="text-base font-bold text-[#0F172A] truncate">
                          {mod.title}
                        </h4>
                        <StatusBadge progress={prog} status={mod.status} />
                      </div>
                      {mod.description && (
                        <p className="text-xs text-slate-500 line-clamp-1 sm:pl-10">
                          {mod.description}
                        </p>
                      )}
                    </div>

                    <div className="sm:w-56 shrink-0 space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500">Progress</span>
                        <span className="text-[#0F172A]">{prog}%</span>
                      </div>
                      <ProgressBar progress={prog} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Progress;
