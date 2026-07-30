import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getStudentDashboard } from "../services/dashboardService";
import { getRecommendedProject } from "../services/projectRecommendations";
import DashboardCard from "../components/DashboardCard";
import Sidebar from "../components/Sidebar";
import ModuleCard from "../components/ModuleCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import ProgressBar from "../components/ProgressBar";
import StatusBadge from "../components/StatusBadge";
import CareerCompletion from "../components/CareerCompletion";
import RecommendedProject from "../components/RecommendedProject";

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
      } catch (err) {
        // Fallback
      }
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
  const isCareerCompleted = overallProgress >= 100 && (dashboardData?.summary?.totalModules || 0) > 0;
  const recommendedProject = getRecommendedProject(dashboardData?.career);

  const handleScrollToProject = () => {
    const el = document.getElementById("recommended-project");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="min-w-0 flex-1">
        {/* Page Top Header */}
        <header className="border-b border-slate-200/80 bg-white px-6 py-5 md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Student Workspace
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-[#0F172A] tracking-tight">
                Welcome back, {userName}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-[#0F172A]">{userName}</p>
                <p className="text-xs text-[#64748B]">Student Learner</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4F46E5] text-sm font-bold text-white shadow-sm">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 md:px-8">
          {loading && <LoadingState message="Loading your dashboard..." />}

          {!loading && error && (
            <ErrorState message={error} onRetry={loadDashboard} />
          )}

          {!loading && !error && dashboardData && (
            <>
              {!dashboardData.hasEnrollment && !dashboardData.career ? (
                <EmptyState
                  title="No Career Path Selected"
                  description="You haven't chosen a career path yet. Explore our curated career paths to launch your learning journey."
                  actionText="Explore Career Paths"
                  actionLink="/my-career"
                  icon={
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />
              ) : (
                <>
                  {/* 1. Continue Learning or Career Completion Section */}
                  {isCareerCompleted ? (
                    <CareerCompletion
                      career={dashboardData.career}
                      summary={dashboardData.summary}
                      onExploreProject={handleScrollToProject}
                    />
                  ) : (
                    <section className="relative overflow-hidden rounded-3xl bg-[#0F172A] p-6 text-white shadow-lg md:p-8">
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="max-w-2xl">
                          <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-300 border border-slate-700/50">
                            <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
                            Active Career Path
                          </div>

                          <h3 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                            {dashboardData.career?.title || "Career Path"}
                          </h3>

                          <p className="mt-3 text-sm leading-relaxed text-slate-300">
                            {dashboardData.career?.overview ||
                              dashboardData.career?.description ||
                              "Build practical, showcase-ready skills across your structured learning modules."}
                          </p>

                          <div className="mt-6 flex flex-wrap items-center gap-4">
                            <Link
                              to={nextUnfinishedModule ? `/learning-modules/${nextUnfinishedModule.moduleId || nextUnfinishedModule._id}` : "/learning-modules"}
                              className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#3730A3] shadow-md"
                            >
                              <span>Continue Learning</span>
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </Link>

                            <Link
                              to="/my-career"
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                            >
                              Change Path
                            </Link>
                          </div>
                        </div>

                        {/* Overall Progress Widget on Banner */}
                        <div className="w-full md:w-64 rounded-2xl bg-slate-800/80 p-5 border border-slate-700/60 backdrop-blur-sm shrink-0">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                            <span>Career Progress</span>
                            <span className="text-base font-extrabold text-white">
                              {overallProgress}%
                            </span>
                          </div>
                          <div className="mt-3">
                            <ProgressBar progress={overallProgress} />
                          </div>
                          <div className="mt-4 flex justify-between text-xs text-slate-400 border-t border-slate-700/50 pt-3">
                            <span>Completed: {dashboardData.summary?.completedModules || 0}</span>
                            <span>Total: {dashboardData.summary?.totalModules || 0}</span>
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* 2. Progress Overview Metrics */}
                  <section>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <DashboardCard
                        title="Overall Progress"
                        value={`${overallProgress}%`}
                        subtitle="Career path completion"
                        highlight={true}
                        icon={
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        }
                      />

                      <DashboardCard
                        title="Total Modules"
                        value={`${dashboardData.summary?.totalModules || 0}`}
                        subtitle="Curriculum learning units"
                        icon={
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        }
                      />

                      <DashboardCard
                        title="Completed"
                        value={`${dashboardData.summary?.completedModules || 0}`}
                        subtitle="Fully mastered modules"
                        icon={
                          <svg className="h-5 w-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        }
                      />

                      <DashboardCard
                        title="Remaining Modules"
                        value={`${Math.max(
                          (dashboardData.summary?.totalModules || 0) -
                          (dashboardData.summary?.completedModules || 0),
                          0
                        )}`}
                        subtitle="Modules to master"
                        icon={
                          <svg className="h-5 w-5 text-[#64748B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        }
                      />
                    </div>
                  </section>

                  {/* 3. Continue Your Learning Focus Card */}
                  {nextUnfinishedModule && !isCareerCompleted && (
                    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                            Current Active Module
                          </span>
                          <h3 className="text-xl font-extrabold text-[#0F172A] mt-1">
                            Continue Your Learning
                          </h3>
                        </div>
                        <StatusBadge progress={nextUnfinishedModule.progressPercentage || 0} status={nextUnfinishedModule.status} />
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-xl">
                          <h4 className="text-lg font-bold text-[#0F172A]">
                            {nextUnfinishedModule.title}
                          </h4>
                          {nextUnfinishedModule.description && (
                            <p className="text-sm text-[#64748B] line-clamp-2">
                              {nextUnfinishedModule.description}
                            </p>
                          )}
                          <div className="pt-2 w-full md:w-80">
                            <div className="flex justify-between text-xs font-semibold mb-1">
                              <span className="text-[#64748B]">Module Progress</span>
                              <span className="text-[#0F172A]">{nextUnfinishedModule.progressPercentage || 0}%</span>
                            </div>
                            <ProgressBar progress={nextUnfinishedModule.progressPercentage || 0} />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => navigate(`/learning-modules/${nextUnfinishedModule.moduleId || nextUnfinishedModule._id}`)}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#3730A3] shadow-md shrink-0"
                        >
                          <span>Continue Module</span>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </section>
                  )}

                  {/* 4. Career Snapshot Card */}
                  <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                      <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                        Career Path Snapshot
                      </h3>
                      <span className="text-xs font-semibold text-[#64748B]">
                        {dashboardData.career?.title || "Enrolled Career"}
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 text-center">
                      <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                        <p className="text-xs font-semibold uppercase text-[#64748B]">Active Track</p>
                        <p className="text-base font-extrabold text-[#0F172A] mt-1 truncate">{dashboardData.career?.title || "Career Path"}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                        <p className="text-xs font-semibold uppercase text-[#64748B]">Total Modules</p>
                        <p className="text-base font-extrabold text-[#0F172A] mt-1">{dashboardData.summary?.totalModules || 0} Units</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                        <p className="text-xs font-semibold uppercase text-[#64748B]">Overall Readiness</p>
                        <p className="text-base font-extrabold text-[#4F46E5] mt-1">{overallProgress}%</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                        <p className="text-xs font-semibold uppercase text-[#64748B]">Current Stage</p>
                        <p className="text-base font-extrabold text-[#0F172A] mt-1 truncate">
                          {isCareerCompleted ? "🎉 Completed" : nextUnfinishedModule ? nextUnfinishedModule.title : "Not Started"}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* 5. Modules Grid */}
                  <section>
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                          Your Modules
                        </h3>
                        <p className="text-sm text-[#64748B]">
                          Step-by-step curriculum for {dashboardData.career?.title || "your path"}.
                        </p>
                      </div>

                      <Link
                        to="/learning-modules"
                        className="inline-flex items-center gap-1 text-sm font-bold text-[#4F46E5] hover:text-[#3730A3] transition"
                      >
                        <span>View All Modules</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>

                    {(!dashboardData.modules || dashboardData.modules.length === 0) ? (
                      <EmptyState
                        title="No modules found"
                        description="Modules for this career path are currently being prepared."
                      />
                    ) : (
                      <div className="grid gap-5 md:grid-cols-2">
                        {dashboardData.modules.map((module, index) => (
                          <ModuleCard
                            key={module.moduleId || module._id || index}
                            module={{
                              ...module,
                              _id: module.moduleId || module._id,
                              progress: module.progressPercentage || 0,
                            }}
                            index={index}
                          />
                        ))}
                      </div>
                    )}
                  </section>

                  {/* 4. Recommended Project Section */}
                  {recommendedProject && (
                    <RecommendedProject
                      project={recommendedProject}
                      careerTitle={dashboardData.career?.title || dashboardData.career?.name}
                    />
                  )}
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