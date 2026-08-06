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
    if (overallProgress === 0) return "Starting is the hardest step. Begin your first lesson today!";
    if (overallProgress < 25) return "Great start! Momentum is building with every lesson completed.";
    if (overallProgress < 50) return "You're making steady progress! Keep up the daily streak.";
    if (overallProgress < 75) return "Over halfway there! Your job-ready technical skills are taking shape.";
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
        icon: "✓",
        color: "bg-emerald-100 text-emerald-700",
      });
    }
    if (currentModule) {
      list.push({
        id: "act-2",
        title: `Started ${currentModule.title}`,
        time: "2 hours ago",
        icon: "⚡",
        color: "bg-blue-100 text-blue-700",
      });
    }
    list.push({
      id: "act-3",
      title: "Updated Profile preferences",
      time: "3 days ago",
      icon: "👤",
      color: "bg-slate-100 text-slate-700",
    });
    return list;
  }, [modules, completedModules, currentModule]);

  const upcomingGoals = useMemo(() => {
    return [
      {
        id: "g-1",
        title: currentModule ? `Finish ${currentModule.title}` : "Complete next module",
        target: "Short term",
        completed: false,
      },
      {
        id: "g-2",
        title: "Reach 50% Career Completion",
        target: "Mid term",
        completed: overallProgress >= 50,
      },
      {
        id: "g-3",
        title: "Master entire roadmap deliverables",
        target: "Long term",
        completed: overallProgress >= 100,
      },
    ];
  }, [currentModule, overallProgress]);

  const achievements = useMemo(() => {
    return [
      {
        id: "ach-1",
        title: "Path Enrolled",
        desc: "Activated career path",
        icon: "🚀",
        unlocked: dashboardData?.hasEnrollment || Boolean(dashboardData?.career),
      },
      {
        id: "ach-2",
        title: "First Milestone",
        desc: "Mastered 1st module",
        icon: "🏆",
        unlocked: completedModules > 0,
      },
      {
        id: "ach-[#ach-3]",
        title: "Streak Master",
        desc: "5-day learning streak",
        icon: "🔥",
        unlocked: true,
      },
      {
        id: "ach-4",
        title: "Career Master",
        desc: "100% roadmap completion",
        icon: "👑",
        unlocked: overallProgress >= 100,
      },
    ];
  }, [dashboardData, completedModules, overallProgress]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 md:px-8">
      {loading && <LoadingState variant="dashboard" message="Loading your command center..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadDashboard} />
      )}

      {!loading && !error && dashboardData && (
        <>
          {!dashboardData.hasEnrollment && !dashboardData.career ? (
            <EmptyState
              title="My learning journey hasn't started yet."
              description="Select a career path to unlock your structured learning roadmap."
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
              {/* 1. ENHANCED DASHBOARD WELCOME SECTION */}
              <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-sm">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#2563EB] border border-blue-100">
                      <span className="h-2 w-2 rounded-full bg-[#2563EB] animate-pulse"></span>
                      Enrolled: {dashboardData.career?.title || dashboardData.career?.name || "Career Path"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200/70">
                      <span>🔥</span>
                      <span>{learningStreakDays}-Day Streak</span>
                    </span>
                  </div>

                  <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight sm:text-3xl">
                    Welcome back, {userName}!
                  </h1>

                  <p className="text-sm font-medium text-slate-600 leading-relaxed">
                    {motivationalMessage}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <div className="text-center px-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Roadmap Progress</p>
                    <p className="text-2xl font-extrabold text-[#2563EB] mt-0.5">{overallProgress}%</p>
                  </div>
                  <div className="h-10 w-px bg-slate-200" />
                  <Link
                    to="/my-career"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 shadow-xs active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span>View Roadmap</span>
                    <span>→</span>
                  </Link>
                </div>
              </section>

              {/* 2. PRIMARY CARD: CONTINUE LEARNING */}
              {currentModule && (
                <section className="relative overflow-hidden rounded-3xl bg-[#0F172A] p-6 text-white shadow-xl md:p-8 border border-slate-800 transition-all hover:shadow-2xl">
                  <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

                  <div className="relative z-10 grid gap-6 lg:grid-cols-12 items-center">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-500/30">
                          <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
                          Active Learning Focus
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

                      <div className="space-y-1.5 pt-2 max-w-lg">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-400">Current Unit Progress</span>
                          <span className="text-blue-400">{currentModuleProg}%</span>
                        </div>
                        <ProgressBar progress={currentModuleProg} />
                      </div>

                      <div className="pt-3 flex flex-wrap items-center gap-4">
                        <Link
                          to={`/learning-modules/${currentModule.moduleId || currentModule._id}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-7 py-3.5 text-sm font-extrabold text-white transition-all duration-200 hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                          <span>Continue Learning Now</span>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>

                    <div className="lg:col-span-4 rounded-2xl bg-slate-800/80 p-5 border border-slate-700/80 text-center space-y-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Curriculum Progress
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

              {/* 3. LEARNING OVERVIEW & STATS */}
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between transition-all hover:border-blue-300 hover:shadow-md">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Overall Progress
                      </p>
                      <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">
                        {overallProgress}%
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">Completion percentage</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between transition-all hover:border-emerald-300 hover:shadow-md">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Completed Modules
                      </p>
                      <p className="mt-1 text-2xl font-extrabold text-emerald-600">
                        {completedModules}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">Mastered units</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between transition-all hover:border-slate-300 hover:shadow-md">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Remaining Modules
                      </p>
                      <p className="mt-1 text-2xl font-extrabold text-slate-700">
                        {remainingModules}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">Pending curriculum units</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between transition-all hover:border-indigo-300 hover:shadow-md">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Current Module
                      </p>
                      <p className="mt-1 text-base font-bold text-[#0F172A] truncate max-w-[130px]">
                        {currentModule?.title || "None"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">Stage {activeIndex + 1}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* QUICK ACTIONS SECTION */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Link
                      to={currentModule ? `/learning-modules/${currentModule.moduleId || currentModule._id}` : "/learning-modules"}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 hover:bg-white hover:border-[#2563EB] hover:shadow-sm transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-200">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] truncate">Continue Learning</p>
                        <p className="text-[10px] text-slate-400 truncate">Resume lesson</p>
                      </div>
                    </Link>

                    <Link
                      to="/my-career"
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 hover:bg-white hover:border-[#2563EB] hover:shadow-sm transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-200">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] truncate">View Career Roadmap</p>
                        <p className="text-[10px] text-slate-400 truncate">Active path</p>
                      </div>
                    </Link>

                    <Link
                      to="/progress"
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 hover:bg-white hover:border-[#2563EB] hover:shadow-sm transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-200">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] truncate">Track Progress</p>
                        <p className="text-[10px] text-slate-400 truncate">Analytics & stats</p>
                      </div>
                    </Link>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 hover:bg-white hover:border-[#2563EB] hover:shadow-sm transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-200">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] truncate">View Profile</p>
                        <p className="text-[10px] text-slate-400 truncate">Account identity</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 4. MAIN DASHBOARD CONTENT GRID */}
              <div className="grid gap-8 lg:grid-cols-12">
                {/* Left Column: Learning Journey Preview */}
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

                    {modules.length === 0 ? (
                      <EmptyState
                        title="No module sequence available"
                        description="Select a career path to view your learning roadmap."
                        actionText="Choose Career Path"
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
                              className={`flex items-center justify-between rounded-2xl border p-4 transition-all duration-200 ${isCurrent
                                  ? "border-[#2563EB] bg-blue-50/40 ring-1 ring-[#2563EB]/30"
                                  : isDone
                                    ? "border-emerald-200 bg-emerald-50/30"
                                    : "border-slate-100 bg-slate-50/80"
                                }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 pr-2">
                                <span
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${isDone
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
                                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${isDone
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
                    )}
                  </section>
                </div>

                {/* Right Column: Recent Activity, Upcoming Goals, Achievement Preview */}
                <div className="lg:col-span-5 space-y-6">
                  {/* RECENT ACTIVITY CARD */}
                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">
                        Recent Activity
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400">Live Log</span>
                    </div>

                    {recentActivities.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No recent activity logged yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {recentActivities.map((act) => (
                          <div key={act.id} className="flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${act.color} text-xs font-bold`}>
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
                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">
                        Upcoming Goals
                      </h4>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Targets</span>
                    </div>

                    <div className="space-y-2.5">
                      {upcomingGoals.map((goal) => (
                        <div
                          key={goal.id}
                          className={`flex items-center justify-between p-3 rounded-2xl border text-xs transition-colors ${goal.completed ? "border-emerald-200 bg-emerald-50/40" : "border-slate-100 bg-[#F8FAFC]"
                            }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${goal.completed ? "bg-emerald-600 text-white" : "border border-slate-300 text-slate-400"
                              }`}>
                              {goal.completed ? "✓" : ""}
                            </span>
                            <span className={`font-semibold truncate ${goal.completed ? "text-slate-500 line-through" : "text-[#0F172A]"}`}>
                              {goal.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 shrink-0">{goal.target}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* ACHIEVEMENT PREVIEW */}
                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">
                        Achievement Preview
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400">Milestones</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {achievements.map((ach) => (
                        <div
                          key={ach.id}
                          className={`rounded-2xl border p-3 text-center space-y-1 transition-all ${ach.unlocked
                              ? "border-emerald-200 bg-emerald-50/50 shadow-xs"
                              : "border-slate-200 bg-slate-50/50 opacity-60 grayscale"
                            }`}
                        >
                          <div className="text-xl">{ach.icon}</div>
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