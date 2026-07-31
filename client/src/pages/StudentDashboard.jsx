import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getStudentDashboard } from "../services/dashboardService";
import DashboardCard from "../components/DashboardCard";
import Sidebar from "../components/Sidebar";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import ProgressBar from "../components/ProgressBar";

function StudentDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj?.name) {
          setUserName(userObj.name);
        }
      } catch (err) {}
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

  const userInitial = userName ? userName.charAt(0).toUpperCase() : "S";

  const nextUnfinishedModule = dashboardData?.modules?.find(
    (m) => (m.progressPercentage || m.progress || 0) < 100
  ) || dashboardData?.modules?.[0];

  const overallProgress = dashboardData?.summary?.overallProgress || 0;
  const totalModules = dashboardData?.summary?.totalModules || 0;
  const completedModules = dashboardData?.summary?.completedModules || 0;
  const inProgressModules = dashboardData?.modules?.filter(
    (m) => (m.progressPercentage || m.progress || 0) > 0 && (m.progressPercentage || m.progress || 0) < 100
  ).length || 0;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      {/* Main Content Area with desktop sidebar offset */}
      <main className="min-w-0 flex-1 md:ml-64">
        {/* Page Top Header */}
        <header className="border-b border-slate-200 bg-white px-6 py-5 md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Command Center
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-[#0F172A] tracking-tight">
                Welcome back, {userName}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-[#0F172A]">{userName}</p>
                <p className="text-xs text-slate-500">Student Learner</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-sm font-bold text-white shadow-xs">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 md:px-8">
          {loading && <LoadingState message="Loading your command center..." />}

          {!loading && error && (
            <ErrorState message={error} onRetry={loadDashboard} />
          )}

          {!loading && !error && dashboardData && (
            <>
              {!dashboardData.hasEnrollment && !dashboardData.career ? (
                <EmptyState
                  title="No Career Path Selected"
                  description="You haven't chosen a career path yet. Select a career path to get your customized roadmap and learning modules."
                  actionText="Choose a Career Path"
                  actionLink="/my-career"
                  icon={
                    <svg className="h-7 w-7 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />
              ) : (
                <>
                  {/* Hero Action Card: What should I do right now? */}
                  <section className="relative overflow-hidden rounded-3xl bg-[#0F172A] p-6 text-white shadow-md md:p-8">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 border border-slate-700">
                          <span className="h-2 w-2 rounded-full bg-[#2563EB]"></span>
                          Active Goal
                        </div>

                        <h3 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                          {dashboardData.career?.title || "Career Path"}
                        </h3>

                        <p className="mt-3 text-sm leading-relaxed text-slate-300">
                          {nextUnfinishedModule
                            ? `Next Up: Module ${nextUnfinishedModule.moduleNumber || ""}: ${nextUnfinishedModule.title}`
                            : "All current modules completed! Review your progress analytics."}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-4">
                          <Link
                            to={nextUnfinishedModule ? `/learning-modules/${nextUnfinishedModule.moduleId || nextUnfinishedModule._id}` : "/learning-modules"}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 shadow-sm"
                          >
                            <span>Continue Learning</span>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>

                          <Link
                            to="/my-career"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                          >
                            View Career Path
                          </Link>
                        </div>
                      </div>

                      {/* Overall Progress Progress Ring Widget */}
                      <div className="w-full md:w-64 rounded-2xl bg-slate-800/90 p-5 border border-slate-700/80 shrink-0">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                          <span>Overall Progress</span>
                          <span className="text-base font-extrabold text-white">
                            {overallProgress}%
                          </span>
                        </div>
                        <div className="mt-3">
                          <ProgressBar progress={overallProgress} />
                        </div>
                        <div className="mt-4 flex justify-between text-xs text-slate-400 border-t border-slate-700/50 pt-3">
                          <span>Done: {completedModules}</span>
                          <span>Total: {totalModules} Modules</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Summary Metric Stats */}
                  <section>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <DashboardCard
                        title="Overall Completion"
                        value={`${overallProgress}%`}
                        subtitle="Career milestone progress"
                        highlight={true}
                        icon={
                          <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        }
                      />

                      <DashboardCard
                        title="Total Modules"
                        value={`${totalModules}`}
                        subtitle="Curriculum learning units"
                        icon={
                          <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        }
                      />

                      <DashboardCard
                        title="Completed Modules"
                        value={`${completedModules}`}
                        subtitle="Mastered modules"
                        icon={
                          <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        }
                      />

                      <DashboardCard
                        title="In Progress"
                        value={`${inProgressModules}`}
                        subtitle="Currently active modules"
                        icon={
                          <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        }
                      />
                    </div>
                  </section>

                  {/* Next Step / Roadmap Preview */}
                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs md:p-8">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                      <div>
                        <h3 className="text-xl font-extrabold text-[#0F172A]">
                          Learning Journey Snapshot
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Quick preview of your structured stages
                        </p>
                      </div>
                      <Link
                        to="/my-career"
                        className="text-xs font-bold text-[#2563EB] hover:underline"
                      >
                        Full Career Roadmap →
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {dashboardData?.modules?.slice(0, 4).map((mod, idx) => {
                        const isDone = (mod.progressPercentage || mod.progress || 0) >= 100;
                        const isInProgress = (mod.progressPercentage || mod.progress || 0) > 0 && !isDone;
                        return (
                          <div
                            key={mod.moduleId || mod._id || idx}
                            className={`p-4 rounded-2xl border ${
                              isDone
                                ? "bg-emerald-50/60 border-emerald-200"
                                : isInProgress
                                ? "bg-blue-50/60 border-blue-200"
                                : "bg-slate-50 border-slate-100"
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-bold mb-2">
                              <span className={isDone ? "text-emerald-700" : isInProgress ? "text-[#2563EB]" : "text-slate-500"}>
                                Step 0{idx + 1}
                              </span>
                              <span className="text-xs">
                                {isDone ? "✓ Done" : isInProgress ? `${mod.progressPercentage || 0}%` : "Next"}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-[#0F172A] truncate">
                              {mod.title}
                            </h4>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;