import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStudentDashboard } from "../services/dashboardService";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import ProgressBar from "../components/ProgressBar";

function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u?.name) setUserName(u.name);
      } catch (e) {}
    }
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getStudentDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard loading failed:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Compute Module Data & Stats
  const modules = dashboardData?.modules || [];
  const totalModules = dashboardData?.summary?.totalModules || modules.length || 0;
  const completedModules = dashboardData?.summary?.completedModules || modules.filter((m) => (m.progressPercentage || m.progress || 0) >= 100).length || 0;
  const remainingModules = Math.max(totalModules - completedModules, 0);
  const overallProgress = dashboardData?.summary?.overallProgress || 0;

  // Find Current Active Module (first incomplete module)
  const currentModuleIndex = modules.findIndex(
    (m) => (m.progressPercentage || m.progress || 0) < 100
  );
  const activeIndex = currentModuleIndex !== -1 ? currentModuleIndex : 0;
  const currentModule = modules[activeIndex] || null;
  const currentModuleProg = currentModule ? (currentModule.progressPercentage || currentModule.progress || 0) : 0;

  // Find Next Upcoming Module
  const upcomingModule = modules[activeIndex + 1] || null;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 md:px-8">
      {loading && <LoadingState message="Loading your command center..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadDashboard} />
      )}

      {!loading && !error && dashboardData && (
        <>
          {!dashboardData.hasEnrollment && !dashboardData.career ? (
            <EmptyState
              title="No Career Path Selected"
              description="You haven't chosen a career path yet. Select a career path to launch your customized learning roadmap."
              actionText="Choose Career Path"
              actionLink="/my-career"
              icon={
                <svg className="h-7 w-7 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
          ) : (
            <>
              {/* 1. HERO SECTION */}
              <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB]">
                    <span className="h-2 w-2 rounded-full bg-[#2563EB]"></span>
                    <span>Learning Command Center</span>
                  </div>
                  <h1 className="mt-1 text-2xl font-extrabold text-[#0F172A] tracking-tight sm:text-3xl">
                    Welcome back, {userName}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 max-w-xl">
                    Enrolled in <span className="font-semibold text-slate-800">{dashboardData.career?.title || dashboardData.career?.name}</span>. Stay consistent — every lesson brings you closer to mastery.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    to="/my-career"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-[#0F172A] transition"
                  >
                    <span>View Career Path</span>
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </section>

              {/* 2. PRIMARY CARD: CONTINUE LEARNING (LARGEST CARD) */}
              {currentModule && (
                <section className="relative overflow-hidden rounded-3xl bg-[#0F172A] p-6 text-white shadow-xl md:p-8 border border-slate-800">
                  {/* Subtle Background Accent Gradient Glow */}
                  <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

                  <div className="relative z-10 grid gap-6 lg:grid-cols-12 items-center">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-500/30">
                          <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
                          Continue Learning
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          Stage {activeIndex + 1} of {totalModules}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                          Module {currentModule.moduleNumber || activeIndex + 1}: {currentModule.title}
                        </h2>
                        {currentModule.description && (
                          <p className="mt-2 text-sm leading-relaxed text-slate-300 line-clamp-2">
                            {currentModule.description}
                          </p>
                        )}
                      </div>

                      {/* Current Module Progress Indicator */}
                      <div className="space-y-1.5 pt-2 max-w-lg">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-400">Module Progress</span>
                          <span className="text-blue-400">{currentModuleProg}%</span>
                        </div>
                        <ProgressBar progress={currentModuleProg} />
                      </div>

                      <div className="pt-3 flex flex-wrap items-center gap-4">
                        <Link
                          to={`/learning-modules/${currentModule.moduleId || currentModule._id}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-7 py-3.5 text-sm font-extrabold text-white transition hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-95"
                        >
                          <span>Resume Lesson Now</span>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>

                    {/* Overall Progress Gauge Widget Box */}
                    <div className="lg:col-span-4 rounded-2xl bg-slate-800/80 p-5 border border-slate-700/80 text-center space-y-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Overall Career Progress
                      </p>
                      <div className="text-4xl font-extrabold text-white">
                        {overallProgress}%
                      </div>
                      <ProgressBar progress={overallProgress} />
                      <p className="text-[11px] text-slate-400">
                        {completedModules} of {totalModules} modules completed
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* 3. QUICK STATS GRID */}
              <section className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Overall Progress
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">
                      {overallProgress}%
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Total track milestone</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Completed Modules
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-emerald-600">
                      {completedModules}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Mastered learning units</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Modules Remaining
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-slate-700">
                      {remainingModules}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Pending curriculum units</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </section>

              {/* 4. MAIN DASHBOARD CONTENT GRID (JOURNEY PREVIEW + UPCOMING & RECENT PROGRESS) */}
              <div className="grid gap-8 lg:grid-cols-12">
                {/* 4a. Left Column: Learning Journey Preview & Current Stage */}
                <div className="lg:col-span-7 space-y-6">
                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                      <div>
                        <h3 className="text-lg font-extrabold text-[#0F172A]">
                          Learning Journey Preview
                        </h3>
                        <p className="text-xs text-slate-500">
                          Structured stages along your enrolled career path
                        </p>
                      </div>
                      <Link
                        to="/my-career"
                        className="text-xs font-bold text-[#2563EB] hover:underline"
                      >
                        Full Roadmap →
                      </Link>
                    </div>

                    {/* Stage Timeline List Preview */}
                    <div className="space-y-3">
                      {modules.slice(0, 4).map((mod, idx) => {
                        const prog = mod.progressPercentage || mod.progress || 0;
                        const isDone = prog >= 100;
                        const isCurrent = idx === activeIndex;

                        return (
                          <div
                            key={mod.moduleId || mod._id || idx}
                            className={`flex items-center justify-between rounded-2xl border p-4 transition ${
                              isCurrent
                                ? "border-[#2563EB] bg-blue-50/40 ring-1 ring-[#2563EB]/30"
                                : isDone
                                ? "border-emerald-200 bg-emerald-50/30"
                                : "border-slate-100 bg-slate-50/80"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 pr-2">
                              <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${
                                  isDone
                                    ? "bg-emerald-600 text-white"
                                    : isCurrent
                                    ? "bg-[#2563EB] text-white"
                                    : "bg-slate-200 text-slate-600"
                                }`}
                              >
                                {isDone ? "✓" : `0${idx + 1}`}
                              </span>
                              <div className="min-w-0">
                                <h4 className="text-sm font-bold text-[#0F172A] truncate">
                                  {mod.title}
                                </h4>
                                <p className="text-xs text-slate-500 truncate">
                                  {isCurrent ? "Current Stage" : isDone ? "Mastered" : "Upcoming"}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                isDone
                                  ? "bg-emerald-100 text-emerald-800"
                                  : isCurrent
                                  ? "bg-blue-100 text-[#2563EB]"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {isDone ? "Completed" : isCurrent ? `${prog}%` : "Next Up"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>

                {/* 4b. Right Column: Current Stage, Upcoming Module & Recent Progress */}
                <div className="lg:col-span-5 space-y-6">
                  {/* 5. CURRENT STAGE CALLOUT */}
                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      Current Active Stage
                    </div>
                    <h4 className="text-lg font-extrabold text-[#0F172A]">
                      Stage {activeIndex + 1}: {currentModule?.title || "Active Module"}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      You are currently building hands-on competency in this unit. Complete all lessons to advance.
                    </p>
                  </section>

                  {/* 6. UPCOMING MODULE */}
                  {upcomingModule && (
                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Up Next
                      </div>
                      <h4 className="text-base font-bold text-[#0F172A]">
                        Module {upcomingModule.moduleNumber || activeIndex + 2}: {upcomingModule.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                        {upcomingModule.description || "Unlocks after completing your current module."}
                      </p>
                    </section>
                  )}

                  {/* 7. RECENT PROGRESS SUMMARY */}
                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Recent Activity Summary
                    </h4>
                    <div className="space-y-2.5">
                      {modules.slice(0, 3).map((mod, idx) => {
                        const prog = mod.progressPercentage || mod.progress || 0;
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-700 truncate max-w-[180px]">{mod.title}</span>
                              <span className="text-[#0F172A]">{prog}%</span>
                            </div>
                            <ProgressBar progress={prog} />
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default StudentDashboard;