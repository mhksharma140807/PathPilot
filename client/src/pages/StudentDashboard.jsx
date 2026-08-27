import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getStudentDashboard } from "../services/dashboardService";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import ProgressBar from "../components/ProgressBar";
import { getStoredUser } from "../utils/authStorage";

function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    const user = getStoredUser();
    if (user?.name) setUserName(user.name);
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getStudentDashboard();
      setDashboardData(data || {});
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

  // Compute Module Data & Stats safely
  const modules = useMemo(() => dashboardData?.modules || [], [dashboardData]);
  const totalModules = dashboardData?.summary?.totalModules || modules.length || 0;
  const completedModules = useMemo(
    () => dashboardData?.summary?.completedModules || modules.filter((m) => (m.progressPercentage || m.progress || 0) >= 100).length || 0,
    [dashboardData, modules]
  );
  const remainingModules = Math.max(totalModules - completedModules, 0);
  const overallProgress = dashboardData?.summary?.overallProgress || 0;

  // Find Current Active Module
  const currentModuleIndex = modules.findIndex(
    (m) => (m.progressPercentage || m.progress || 0) < 100
  );
  const activeIndex = currentModuleIndex !== -1 ? currentModuleIndex : 0;
  const currentModule = modules[activeIndex] || null;
  const currentModuleProg = currentModule ? (currentModule.progressPercentage || currentModule.progress || 0) : 0;

  // Dynamic motivational message based on overall progress
  const motivationalMessage = useMemo(() => {
    if (overallProgress === 0) return "Begin your first module to kickstart your learning path.";
    if (overallProgress < 25) return "Great start! Momentum is building with every lesson completed.";
    if (overallProgress < 50) return "You're making steady progress. Keep up the daily learning momentum.";
    if (overallProgress < 75) return "Over halfway there! Your technical skills are taking shape.";
    if (overallProgress < 100) return "Almost at the finish line! Final push towards career mastery.";
    return "Congratulations! You have completed your enrolled career roadmap!";
  }, [overallProgress]);

  // Demo values for streak, recent activity, upcoming goals, and achievement preview
  const learningStreakDays = 5;

  const recentActivities = useMemo(() => {
    if (modules.length === 0) return [];
    const list = [];
    if (completedModules > 0) {
      list.push({
        id: "act-1",
        title: `Completed ${modules[0]?.title || "HTML Basics"}`,
        time: "Yesterday",
        icon: (
          <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ),
        color: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
      });
    }
    if (currentModule) {
      list.push({
        id: "act-2",
        title: `Started ${currentModule.title}`,
        time: "2 hours ago",
        icon: (
          <svg className="h-3.5 w-3.5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        color: "bg-blue-50 text-[#2563EB] border border-blue-200/60",
      });
    }
    list.push({
      id: "act-3",
      title: "Updated account preferences",
      time: "3 days ago",
      icon: (
        <svg className="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: "bg-slate-100 text-slate-700 border border-slate-200/60",
    });
    return list;
  }, [modules, completedModules, currentModule]);

  const upcomingGoals = useMemo(() => {
    return [
      {
        id: "g-1",
        title: currentModule ? `Finish ${currentModule.title}` : "Complete next module",
        target: "Next Goal",
        completed: false,
      },
      {
        id: "g-2",
        title: "Reach 50% Roadmap Completion",
        target: "Milestone",
        completed: overallProgress >= 50,
      },
      {
        id: "g-3",
        title: "Complete All Enrolled Modules",
        target: "Final Goal",
        completed: overallProgress >= 100,
      },
    ];
  }, [currentModule, overallProgress]);

  const achievements = useMemo(() => {
    return [
      {
        id: "ach-1",
        title: "Path Enrolled",
        desc: "Active career roadmap",
        icon: (
          <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        ),
        unlocked: dashboardData?.hasEnrollment || Boolean(dashboardData?.career),
      },
      {
        id: "ach-2",
        title: "First Milestone",
        desc: "Mastered first module",
        icon: (
          <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2 0h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        ),
        unlocked: completedModules > 0,
      },
      {
        id: "ach-3",
        title: "Streak Master",
        desc: "5-day learning streak",
        icon: (
          <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
        ),
        unlocked: true,
      },
      {
        id: "ach-4",
        title: "Career Master",
        desc: "100% roadmap completed",
        icon: (
          <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        ),
        unlocked: overallProgress >= 100,
      },
    ];
  }, [dashboardData, completedModules, overallProgress]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 md:px-8">
      {loading && <LoadingState variant="dashboard" message="Loading your dashboard..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadDashboard} />
      )}

      {!loading && !error && dashboardData && (
        <>
          {!dashboardData.hasEnrollment && !dashboardData.career ? (
            <EmptyState
              title="No Active Career Path Enrolled"
              description="Explore available career paths to activate your structured learning roadmap."
              actionText="Explore Career Paths"
              actionLink="/my-career"
              icon={
                <svg className="h-7 w-7 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
          ) : (
            <>
              {/* 1. DASHBOARD WELCOME SECTION */}
              <section className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#2563EB] border border-blue-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB] animate-pulse"></span>
                      Active Career Path: {dashboardData.career?.title || dashboardData.career?.name || "Career Path"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200/70">
                      <svg className="h-3.5 w-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                      <span>{learningStreakDays}-Day Streak</span>
                    </span>
                  </div>

                  <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight sm:text-3xl">
                    Welcome back, {userName}!
                  </h1>

                  <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                    {motivationalMessage}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 rounded-xl bg-slate-50 p-4 border border-slate-200/80">
                  <div className="text-center px-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Career Progress</p>
                    <p className="text-2xl font-extrabold text-[#2563EB] mt-0.5">{overallProgress}%</p>
                  </div>
                  <div className="h-9 w-px bg-slate-200" />
                  <Link
                    to="/my-career"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#1D4ED8] shadow-2xs active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span>View Roadmap</span>
                    <span>→</span>
                  </Link>
                </div>
              </section>

              {/* 2. PRIMARY CARD: CURRENT FOCUS MODULE */}
              {currentModule && (
                <section className="relative overflow-hidden rounded-2xl bg-[#0F172A] p-5 sm:p-7 text-white shadow-md border border-slate-800">
                  <div className="relative z-10 grid gap-6 lg:grid-cols-12 items-center">
                    <div className="lg:col-span-8 space-y-3.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/20 px-2.5 py-1 text-xs font-bold text-blue-300 border border-blue-500/30">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                          CURRENT FOCUS MODULE
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          Module {activeIndex + 1} of {totalModules}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-xl font-extrabold text-white tracking-tight sm:text-2xl">
                          {currentModule.title}
                        </h2>
                        {currentModule.description && (
                          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-300 line-clamp-2">
                            {currentModule.description}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5 pt-1 max-w-lg">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-400">Module Completion</span>
                          <span className="text-blue-400">{currentModuleProg}%</span>
                        </div>
                        <ProgressBar progress={currentModuleProg} />
                      </div>

                      <div className="pt-2 flex flex-wrap items-center gap-4">
                        <Link
                          to={`/learning-modules/${currentModule.moduleId || currentModule._id}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-2.5 text-xs sm:text-sm font-extrabold text-white transition-all duration-200 hover:bg-[#1D4ED8] shadow-2xs active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                          <span>Continue Learning</span>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>

                    <div className="lg:col-span-4 rounded-xl bg-slate-900/90 p-4 border border-slate-800 text-center space-y-2.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        OVERALL PROGRESS
                      </p>
                      <div className="text-3xl font-extrabold text-white">
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

              {/* 3. LEARNING OVERVIEW STATS GRID */}
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs flex items-center justify-between transition-all hover:border-blue-300">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        OVERALL PROGRESS
                      </p>
                      <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">
                        {overallProgress}%
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Career roadmap completion</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-[#2563EB]">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs flex items-center justify-between transition-all hover:border-emerald-300">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        COMPLETED MODULES
                      </p>
                      <p className="mt-1 text-2xl font-extrabold text-emerald-600">
                        {completedModules}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Mastered learning units</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs flex items-center justify-between transition-all hover:border-slate-300">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        REMAINING MODULES
                      </p>
                      <p className="mt-1 text-2xl font-extrabold text-slate-700">
                        {remainingModules}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Pending learning units</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-slate-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs flex items-center justify-between transition-all hover:border-blue-300">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        CURRENT MODULE
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#0F172A] truncate max-w-[130px]">
                        {currentModule?.title || "None"}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Active focus unit</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-[#2563EB]">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* QUICK ACTIONS SECTION */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-3">
                  <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    Quick Navigation Actions
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Link
                      to={currentModule ? `/learning-modules/${currentModule.moduleId || currentModule._id}` : "/learning-modules"}
                      className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 hover:bg-white hover:border-[#2563EB] hover:shadow-2xs transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-200">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] truncate">Continue Learning</p>
                        <p className="text-[10px] text-slate-500 truncate">Resume active module</p>
                      </div>
                    </Link>

                    <Link
                      to="/my-career"
                      className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 hover:bg-white hover:border-[#2563EB] hover:shadow-2xs transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-200">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] truncate">Career Roadmap</p>
                        <p className="text-[10px] text-slate-500 truncate">View full path</p>
                      </div>
                    </Link>

                    <Link
                      to="/progress"
                      className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 hover:bg-white hover:border-[#2563EB] hover:shadow-2xs transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-200">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] truncate">Progress Analytics</p>
                        <p className="text-[10px] text-slate-500 truncate">Track performance</p>
                      </div>
                    </Link>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 hover:bg-white hover:border-[#2563EB] hover:shadow-2xs transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-200">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] truncate">Account Settings</p>
                        <p className="text-[10px] text-slate-500 truncate">Manage profile</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 4. MAIN DASHBOARD CONTENT GRID */}
              <div className="grid gap-6 lg:grid-cols-12">
                {/* Left Column: Learning Journey Preview */}
                <div className="lg:col-span-7 space-y-6">
                  <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <div>
                        <h3 className="text-base font-extrabold text-[#0F172A]">
                          Career Roadmap Progress
                        </h3>
                        <p className="text-xs text-slate-500">
                          Modules along your selected career path
                        </p>
                      </div>
                      <Link
                        to="/my-career"
                        className="text-xs font-bold text-[#2563EB] hover:underline"
                      >
                        Full Roadmap →
                      </Link>
                    </div>

                    {modules.length === 0 ? (
                      <EmptyState
                        title="No module sequence available"
                        description="Select a career path to view your learning roadmap."
                        actionText="Explore Career Paths"
                        actionLink="/my-career"
                      />
                    ) : (
                      <div className="space-y-3">
                        {modules.slice(0, 4).map((mod, idx) => {
                          const prog = mod.progressPercentage || mod.progress || 0;
                          const isDone = prog >= 100;
                          const isCurrent = idx === activeIndex;

                          return (
                            <div
                              key={mod.moduleId || mod._id || idx}
                              className={`flex items-center justify-between rounded-xl border p-3.5 transition-all duration-200 ${isCurrent
                                  ? "border-[#2563EB] bg-blue-50/40 ring-1 ring-[#2563EB]/30"
                                  : isDone
                                    ? "border-emerald-200/90 bg-emerald-50/30"
                                    : "border-slate-200/70 bg-slate-50/60"
                                }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 pr-2">
                                <span
                                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${isDone
                                      ? "bg-emerald-600 text-white"
                                      : isCurrent
                                        ? "bg-[#2563EB] text-white"
                                        : "bg-slate-200 text-slate-600"
                                    }`}
                                >
                                  {isDone ? "✓" : `0${idx + 1}`}
                                </span>
                                <div className="min-w-0">
                                  <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] truncate">
                                    {mod.title}
                                  </h4>
                                  <p className="text-[11px] text-slate-500 truncate">
                                    {isCurrent ? "In Progress" : isDone ? "Completed" : "Upcoming"}
                                  </p>
                                </div>
                              </div>

                              <span
                                className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ${isDone
                                    ? "bg-emerald-100 text-emerald-800"
                                    : isCurrent
                                      ? "bg-blue-100 text-[#2563EB]"
                                      : "bg-slate-200/80 text-slate-600"
                                  }`}
                              >
                                {isDone ? "Completed" : isCurrent ? `${prog}%` : "Upcoming"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                </div>

                {/* Right Column: Recent Activity, Upcoming Goals, Achievement Preview & Certificate */}
                <div className="lg:col-span-5 space-y-6">
                  {/* RECENT ACTIVITY CARD */}
                  <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                        Recent Activity
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400">Activity Log</span>
                    </div>

                    {recentActivities.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No recent activity logged yet.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {recentActivities.map((act) => (
                          <div key={act.id} className="flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${act.color}`}>
                                {act.icon}
                              </span>
                              <p className="font-semibold text-slate-700 truncate">{act.title}</p>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0">{act.time}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* UPCOMING GOALS CARD */}
                  <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                        Learning Goals
                      </h4>
                      <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full">Milestones</span>
                    </div>

                    <div className="space-y-2">
                      {upcomingGoals.map((goal) => (
                        <div
                          key={goal.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${goal.completed ? "border-emerald-200/80 bg-emerald-50/40" : "border-slate-200/70 bg-slate-50/60"
                            }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${goal.completed ? "bg-emerald-600 text-white" : "border border-slate-300 text-slate-400"
                              }`}>
                              {goal.completed ? "✓" : ""}
                            </span>
                            <span className={`font-semibold truncate ${goal.completed ? "text-slate-400 line-through" : "text-[#0F172A]"}`}>
                              {goal.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 shrink-0">{goal.target}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* ACHIEVEMENT PREVIEW */}
                  <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                        Achievements & Badges
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400">Milestones</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {achievements.map((ach) => (
                        <div
                          key={ach.id}
                          className={`rounded-xl border p-2.5 text-center space-y-1 transition-all ${ach.unlocked
                              ? "border-amber-200/80 bg-amber-50/50 shadow-2xs"
                              : "border-slate-200/60 bg-slate-50/50 opacity-50 grayscale"
                            }`}
                        >
                          <div className="flex justify-center">{ach.icon}</div>
                          <p className="text-xs font-bold text-[#0F172A] truncate">{ach.title}</p>
                          <p className="text-[10px] text-slate-500 truncate">{ach.desc}</p>
                        </div>
                      ))}
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