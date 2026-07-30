import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getStudentDashboard } from "../services/dashboardService";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import ModuleCard from "../components/ModuleCard";
import ProgressBar from "../components/ProgressBar";
import StatusBadge from "../components/StatusBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import CareerRoadmap from "../components/CareerRoadmap";

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
      setData(resData);
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

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <main className="min-w-0 flex-1 p-8">
          <LoadingState message="Loading your learning analytics..." />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <main className="min-w-0 flex-1 p-8">
          <ErrorState message={error} onRetry={loadProgressData} />
        </main>
      </div>
    );
  }

  const hasEnrollment = data?.hasEnrollment && data?.career;
  const modules = data?.modules || [];
  const totalModules = data?.summary?.totalModules || modules.length || 0;
  const completedModules = data?.summary?.completedModules || modules.filter((m) => m.status === "completed").length || 0;
  const inProgressModules = modules.filter((m) => m.status === "in_progress" || (m.progressPercentage > 0 && m.progressPercentage < 100)).length;
  const notStartedModules = modules.filter((m) => m.status === "not_started" || (!m.status && (m.progressPercentage || 0) === 0)).length;
  const overallProgress = data?.summary?.overallProgress || 0;

  // Identify focus module to continue learning
  const currentLearningModule = modules.find(
    (m) => (m.progressPercentage || 0) > 0 && (m.progressPercentage || 0) < 100
  ) || modules.find((m) => (m.progressPercentage || 0) < 100) || modules[0];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="min-w-0 flex-1">
        {/* Top Header */}
        <header className="border-b border-slate-200/80 bg-white px-6 py-5 md:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Learning Analytics
            </p>
            <h1 className="mt-1 text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Progress & Analytics
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Detailed breakdown of your curriculum completion and active learning status.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-8 md:px-8 space-y-8">
          {!hasEnrollment ? (
            <EmptyState
              title="No Active Career Selected"
              description="Choose a career path to begin tracking your module progress and learning analytics."
              actionText="Explore Career Paths"
              actionLink="/my-career"
            />
          ) : modules.length === 0 ? (
            <EmptyState
              title="No Modules Available"
              description="Your selected career path does not currently have any learning modules."
            />
          ) : (
            <>
              {/* Analytics Hero / Career Overview */}
              <section className="relative overflow-hidden rounded-3xl bg-[#0F172A] p-6 text-white shadow-lg md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="max-w-2xl">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-cyan-400 border border-slate-700/50">
                      Enrolled Path Analytics
                    </span>

                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                      {data.career?.title || data.career?.name}
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      Track your completion metrics across all structured learning modules.
                    </p>
                  </div>

                  <div className="w-full md:w-64 rounded-2xl bg-slate-800/80 p-5 border border-slate-700/60 backdrop-blur-sm shrink-0">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span>Overall Career Completion</span>
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

              {/* Progress Summary Cards */}
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                  title="Overall Progress"
                  value={`${overallProgress}%`}
                  subtitle="Curriculum completed"
                  highlight={true}
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  }
                />

                <DashboardCard
                  title="Completed Modules"
                  value={`${completedModules}`}
                  subtitle="Fully finished units"
                  icon={
                    <svg className="h-5 w-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />

                <DashboardCard
                  title="In Progress"
                  value={`${inProgressModules}`}
                  subtitle="Active modules"
                  icon={
                    <svg className="h-5 w-5 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />

                <DashboardCard
                  title="Remaining Modules"
                  value={`${notStartedModules}`}
                  subtitle="Yet to be started"
                  icon={
                    <svg className="h-5 w-5 text-[#64748B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  }
                />
              </section>

              {/* Career Roadmap & Skill Progress */}
              <CareerRoadmap
                career={data.career}
                modules={modules}
                overallProgress={overallProgress}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Progress;
