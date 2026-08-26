import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentDashboard } from "../services/dashboardService";
import { getMyCertificates, claimCertificate } from "../services/certificateService";
import CertificateCard from "../components/CertificateCard";
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
  const [certificate, setCertificate] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [certError, setCertError] = useState("");

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
  const modules = useMemo(() => data?.modules || [], [data]);
  const totalModules = data?.summary?.totalModules || modules.length || 0;
  const completedModules = useMemo(
    () => data?.summary?.completedModules || modules.filter((m) => (m.progressPercentage || m.progress || 0) >= 100).length || 0,
    [data, modules]
  );
  const inProgressModules = useMemo(
    () => modules.filter((m) => {
      const p = m.progressPercentage || m.progress || 0;
      return p > 0 && p < 100;
    }).length,
    [modules]
  );
  const notStartedModules = totalModules - completedModules - inProgressModules;
  const overallProgress = data?.summary?.overallProgress || 0;

  useEffect(() => {
    if (hasEnrollment && overallProgress >= 100) {
      getMyCertificates()
        .then((res) => {
          if (res?.success && res?.certificates?.length > 0) {
            const currentCareerId = data?.career?._id || data?.career?.id;
            const match =
              res.certificates.find(
                (c) =>
                  (c.career?._id || c.career?.id || c.career) === currentCareerId
              ) || res.certificates[0];
            setCertificate(match);
          }
        })
        .catch((err) => console.warn("Failed to fetch user certificate:", err));
    }
  }, [hasEnrollment, overallProgress, data?.career]);

  const handleClaim = async () => {
    try {
      setClaiming(true);
      setCertError("");
      const res = await claimCertificate();
      if (res?.success && res?.certificate) {
        setCertificate(res.certificate);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to claim certificate.";
      setCertError(msg);
    } finally {
      setClaiming(false);
    }
  };

  const currentModuleIndex = useMemo(
    () => modules.findIndex((m) => (m.progressPercentage || m.progress || 0) < 100),
    [modules]
  );
  const activeIndex = currentModuleIndex !== -1 ? currentModuleIndex : 0;
  const currentModule = modules[activeIndex] || modules[0] || null;

  // Level & Milestone calculations
  const currentLevel = useMemo(() => {
    if (overallProgress < 25) return "Level 1: Beginner Explorer";
    if (overallProgress < 50) return "Level 2: Intermediate Apprentice";
    if (overallProgress < 75) return "Level 3: Advanced Competant";
    if (overallProgress < 100) return "Level 4: Specialist Candidate";
    return "Level 5: Master Engineer";
  }, [overallProgress]);

  const nextMilestoneName = useMemo(() => {
    if (overallProgress < 25) return "25% Foundation Milestone";
    if (overallProgress < 50) return "50% Mid-Roadmap Milestone";
    if (overallProgress < 75) return "75% Professional Milestone";
    if (overallProgress < 100) return "100% Career Completion";
    return "Curriculum Complete";
  }, [overallProgress]);

  // 5. Milestone Timeline Steps
  const milestoneSteps = [
    { label: "Career Started", pct: 0, desc: "Path enrolled" },
    { label: "Quarter Mark", pct: 25, desc: "Foundations mastered" },
    { label: "Halfway Mark", pct: 50, desc: "Core skills acquired" },
    { label: "Advanced Stage", pct: 75, desc: "Projects completed" },
    { label: "Career Master", pct: 100, desc: "Job ready" },
  ];

  // 6. Badges (Earned / Locked)
  const badges = [
    { id: "b1", title: "Path Enrolled", desc: "Started roadmap", icon: "🚀", unlocked: true },
    { id: "b2", title: "First Mastery", desc: "1 module done", icon: "🏆", unlocked: completedModules > 0 },
    { id: "b3", title: "Halfway Hero", desc: "50% completion", icon: "⚡", unlocked: overallProgress >= 50 },
    { id: "b4", title: "Career Champion", desc: "100% completion", icon: "👑", unlocked: overallProgress >= 100 },
  ];

  // 7. Performance Insights
  const performanceInsights = useMemo(() => {
    const strongest = modules.find((m) => (m.progressPercentage || m.progress || 0) >= 100)?.title || "HTML & CSS Architecture";
    const needsImp = currentModule?.title || "Advanced JavaScript Async Patterns";
    const recommended = currentModule?.title || "Next Module in Roadmap";
    const hoursLeft = Math.max((totalModules - completedModules) * 3, 0);

    return {
      strongest,
      needsImp,
      recommended,
      estTimeLeft: `~${hoursLeft || 12} Hours remaining`,
    };
  }, [modules, completedModules, totalModules, currentModule]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 space-y-8">
      {loading && <LoadingState variant="progress" message="Loading your progress analytics..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadProgressData} />
      )}

      {/* 8. EMPTY STATE */}
      {!loading && !error && (!hasEnrollment || modules.length === 0) && (
        <EmptyState
          title="Start Learning"
          description="Your analytics will appear after completing modules and starting your active career path."
          actionText="Explore Career Paths"
          actionLink="/my-career"
          icon={
            <svg className="h-8 w-8 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      )}

      {!loading && !error && hasEnrollment && modules.length > 0 && (
        <>
          {/* 1. PREMIUM ANALYTICS HEADER */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-sm">
            <div className="space-y-1.5 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#2563EB] border border-blue-100">
                <span className="h-2 w-2 rounded-full bg-[#2563EB]"></span>
                Enrolled: {data.career?.title || data.career?.name || "Career Path"}
              </span>
              <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight sm:text-3xl">
                Learning Progress
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Track your learning journey and monitor your career growth.
              </p>
            </div>

            {/* Right Side Overview Summary */}
            <div className="flex items-center gap-4 shrink-0 rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div className="text-center px-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall Progress</p>
                <p className="text-xl font-extrabold text-[#2563EB] mt-0.5">{overallProgress}%</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-center px-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Career Completion</p>
                <p className="text-xl font-extrabold text-emerald-600 mt-0.5">{completedModules}/{totalModules}</p>
              </div>
              <div className="h-8 w-px bg-slate-200 hidden sm:block" />
              <div className="text-center px-2 hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Learning Status</p>
                <p className="text-xs font-extrabold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full mt-1">Active</p>
              </div>
            </div>
          </section>

          {/* GRADUATION / CERTIFICATE SECTION (When overallProgress >= 100) */}
          {overallProgress >= 100 && (
            <section className="space-y-4">
              {certificate ? (
                <CertificateCard certificate={certificate} />
              ) : (
                <div className="rounded-3xl border border-emerald-300 bg-gradient-to-r from-emerald-950 via-[#0F172A] to-blue-950 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                  <div className="space-y-2 max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                      <span>🎉</span>
                      <span>100% Curriculum Completed</span>
                    </span>
                    <h3 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                      Claim Your Official PathPilot Certificate
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Congratulations! You have mastered all curriculum requirements for{" "}
                      <strong className="text-emerald-300">
                        {data?.career?.title || "your active career"}
                      </strong>
                      . Your verified credential is ready to be claimed.
                    </p>
                    {certError && (
                      <p className="text-xs font-semibold text-red-300 bg-red-950/60 p-2 rounded-xl border border-red-800/60">
                        {certError}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleClaim}
                    disabled={claiming}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg hover:bg-emerald-400 transition active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer"
                  >
                    {claiming ? (
                      <span>Issuing Certificate...</span>
                    ) : (
                      <>
                        <span>🎓 Claim Official Certificate</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </section>
          )}

          {/* 2. KPI CARDS (4 cards) */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between transition-all hover:border-blue-300 hover:shadow-md">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Progress</p>
                <p className="mt-1 text-3xl font-extrabold text-[#0F172A]">{overallProgress}%</p>
                <p className="text-xs text-slate-400 mt-1">Total track completion</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between transition-all hover:border-emerald-300 hover:shadow-md">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Modules</p>
                <p className="mt-1 text-3xl font-extrabold text-emerald-600">{completedModules}</p>
                <p className="text-xs text-slate-400 mt-1">Mastered curriculum units</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 font-bold">
                ✓
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between transition-all hover:border-slate-300 hover:shadow-md">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Remaining Modules</p>
                <p className="mt-1 text-3xl font-extrabold text-slate-700">{Math.max(notStartedModules, 0)}</p>
                <p className="text-xs text-slate-400 mt-1">Pending units to finish</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 font-bold">
                ⏳
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between transition-all hover:border-amber-300 hover:shadow-md">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Learning Streak</p>
                <p className="mt-1 text-3xl font-extrabold text-amber-600">5 Days 🔥</p>
                <p className="text-xs text-slate-400 mt-1">Consistent daily progress</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 text-xl font-bold">
                🔥
              </div>
            </div>
          </section>

          {/* 3. PROGRESS VISUALIZATION HERO CARD */}
          <section className="rounded-3xl bg-[#0F172A] p-6 text-white shadow-xl md:p-8 border border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-bold text-blue-300 border border-blue-500/30">
                  <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
                  Active Career Trajectory
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {currentLevel}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Next Milestone: <span className="font-bold text-blue-400">{nextMilestoneName}</span>
                </p>
              </div>

              <div className="w-full md:w-64 rounded-2xl bg-slate-800/90 p-5 border border-slate-700/80 shrink-0 text-center space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Current Completion</span>
                  <span className="text-blue-400 font-extrabold">{overallProgress}%</span>
                </div>
                <ProgressBar progress={overallProgress} />
                <p className="text-[11px] text-slate-400">
                  {completedModules} of {totalModules} modules mastered
                </p>
              </div>
            </div>
          </section>

          {/* 5. MILESTONE TIMELINE */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs md:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Progression Track</span>
              <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight mt-0.5">
                Milestone Timeline
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
              {milestoneSteps.map((m, idx) => {
                const isPassed = overallProgress >= m.pct;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-4 text-center space-y-2 transition-all ${
                      isPassed
                        ? "border-emerald-200 bg-emerald-50/50 shadow-xs"
                        : "border-slate-200 bg-slate-50/60 opacity-60"
                    }`}
                  >
                    <div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold ${
                      isPassed ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                    }`}>
                      {isPassed ? "✓" : `${m.pct}%`}
                    </div>
                    <p className={`text-xs font-bold ${isPassed ? "text-[#0F172A]" : "text-slate-500"}`}>{m.label}</p>
                    <p className="text-[10px] text-slate-400">{m.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. MODULE PROGRESS TABLE */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#0F172A]">
                  Module Progress Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Detailed status, duration, and progress metrics per module unit.
                </p>
              </div>

              {currentModule && (
                <button
                  type="button"
                  onClick={() => navigate(`/learning-modules/${currentModule.moduleId || currentModule._id}`)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:bg-blue-700 shadow-xs shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span>Continue Current Module →</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#F8FAFC]">
                    <th className="p-3 font-extrabold text-[#0F172A] uppercase tracking-wider">Module</th>
                    <th className="p-3 font-extrabold text-[#0F172A] uppercase tracking-wider">Status</th>
                    <th className="p-3 font-extrabold text-[#0F172A] uppercase tracking-wider">Progress</th>
                    <th className="p-3 font-extrabold text-[#0F172A] uppercase tracking-wider">Duration</th>
                    <th className="p-3 font-extrabold text-[#0F172A] uppercase tracking-wider">Last Activity</th>
                    <th className="p-3 font-extrabold text-[#0F172A] uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {modules.map((mod, idx) => {
                    const prog = mod.progressPercentage || mod.progress || 0;
                    const isDone = prog >= 100;
                    const isInProgress = prog > 0 && prog < 100;

                    return (
                      <tr key={mod.moduleId || mod._id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-[#0F172A]">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-[10px] font-extrabold text-slate-600">
                              0{idx + 1}
                            </span>
                            <span className="truncate max-w-[200px]">{mod.title}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <StatusBadge progress={prog} status={mod.status} />
                        </td>
                        <td className="p-3 min-w-[140px]">
                          <div className="space-y-1">
                            <div className="flex justify-between font-bold text-[10px]">
                              <span>{prog}%</span>
                            </div>
                            <ProgressBar progress={prog} />
                          </div>
                        </td>
                        <td className="p-3 font-medium text-slate-500">
                          ~{mod.estimatedHours || 2} Hours
                        </td>
                        <td className="p-3 text-slate-400">
                          {isDone ? "Completed" : isInProgress ? "2 hours ago" : "Pending"}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/learning-modules/${mod.moduleId || mod._id}`)}
                            className="inline-flex items-center gap-1 font-bold text-[#2563EB] hover:underline"
                          >
                            <span>{isDone ? "Review" : "Launch"}</span>
                            <span>→</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* 6. ACHIEVEMENT OVERVIEW & 7. PERFORMANCE INSIGHTS */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* ACHIEVEMENT OVERVIEW */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#0F172A]">Achievement Badges</h3>
                <span className="text-xs text-slate-400 font-semibold">{completedModules} Unlocked</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {badges.map((b) => (
                  <div
                    key={b.id}
                    className={`rounded-2xl border p-4 text-center space-y-1 transition-all ${
                      b.unlocked
                        ? "border-emerald-200 bg-emerald-50/50 shadow-xs"
                        : "border-slate-200 bg-slate-50/50 opacity-60 grayscale"
                    }`}
                  >
                    <div className="text-2xl">{b.icon}</div>
                    <p className="text-xs font-bold text-[#0F172A]">{b.title}</p>
                    <p className="text-[10px] text-slate-500">{b.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* PERFORMANCE INSIGHTS */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#0F172A]">Performance Insights</h3>
                <span className="text-xs text-[#2563EB] font-bold">Analytics</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Strongest Area</p>
                  <p className="font-extrabold text-emerald-900">{performanceInsights.strongest}</p>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Focus Recommendation</p>
                  <p className="font-extrabold text-amber-900">{performanceInsights.needsImp}</p>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Recommended Next Module</p>
                  <p className="font-extrabold text-blue-900">{performanceInsights.recommended}</p>
                  <p className="text-[10px] text-blue-600 mt-1">{performanceInsights.estTimeLeft}</p>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default Progress;
