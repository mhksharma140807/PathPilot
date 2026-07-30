import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getModuleById } from "../services/moduleService";
import { getMyProgress, updateModuleProgress } from "../services/progressService";
import ProgressBar from "../components/ProgressBar";
import Sidebar from "../components/Sidebar";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import StatusBadge from "../components/StatusBadge";

function ModuleDetails() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const loadModuleDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const [moduleData, progressData] = await Promise.all([
        getModuleById(moduleId),
        getMyProgress().catch(() => ({ progress: [] })),
      ]);

      setModule(moduleData?.module || moduleData);

      const progList = progressData?.progress || [];
      if (Array.isArray(progList)) {
        const found = progList.find(
          (item) =>
            item.module?._id === moduleId ||
            item.module === moduleId
        );
        setProgress(
          found?.progressPercentage ?? found?.progress ?? 0
        );
      }
    } catch (err) {
      console.error("Failed to load module details:", err);
      setError(
        err.response?.data?.message || err.message || "Unable to load this learning module."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (moduleId) {
      loadModuleDetails();
    }
  }, [moduleId]);

  const handleUpdateProgress = async (newProgress) => {
    try {
      setUpdating(true);
      setError("");

      const clamped = Math.min(Math.max(newProgress, 0), 100);
      await updateModuleProgress(moduleId, clamped);

      setProgress(clamped);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Unable to update module progress."
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1">
        {/* Navigation Top Header */}
        <header className="border-b border-slate-200/80 bg-white px-6 py-5 md:px-8">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/learning-modules")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Learning Modules</span>
            </button>

            {module && (
              <StatusBadge progress={progress} />
            )}
          </div>
        </header>

        <div className="mx-auto max-w-4xl space-y-6 px-6 py-8 md:px-8">
          {loading && <LoadingState message="Loading module details..." />}

          {!loading && error && !module && (
            <ErrorState message={error} onRetry={loadModuleDetails} />
          )}

          {!loading && module && (
            <>
              {/* Module Hero Banner */}
              <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-md md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                  <span className="font-semibold uppercase tracking-wider text-slate-400">
                    Module Deep Dive
                  </span>
                  {module.estimatedHours > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1 font-medium text-slate-300 border border-slate-700">
                      <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Duration: ~{module.estimatedHours} {module.estimatedHours === 1 ? 'hour' : 'hours'}
                    </span>
                  )}
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {module.title || module.name || "Module"}
                </h1>

                {module.description && (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
                    {module.description}
                  </p>
                )}
              </section>

              {/* Progress & Action Card */}
              <section className={`rounded-3xl border p-6 shadow-sm transition md:p-8 ${progress >= 100 ? 'border-emerald-200/80 bg-emerald-50/60' : 'border-slate-200/80 bg-white'}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Your Progress
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {progress >= 100
                        ? "Congratulations! You have fully completed this module."
                        : "Track your completion state and mark your progress as you learn."}
                    </p>
                  </div>

                  <span className={`text-2xl font-extrabold ${progress >= 100 ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {progress}%
                  </span>
                </div>

                <div className="mt-5">
                  <ProgressBar progress={progress} />
                </div>

                {error && (
                  <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={updating || progress >= 100}
                    onClick={() => handleUpdateProgress(Math.min(progress + 25, 100))}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {updating
                      ? "Updating..."
                      : progress >= 100
                      ? "✓ Module Completed"
                      : "Mark Progress (+25%)"}
                  </button>

                  {progress > 0 && progress < 100 && (
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => handleUpdateProgress(100)}
                      className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                      Complete Module (100%)
                    </button>
                  )}

                  {progress > 0 && (
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => handleUpdateProgress(0)}
                      className="ml-auto text-xs font-semibold text-slate-400 hover:text-red-600 transition"
                    >
                      Reset Progress
                    </button>
                  )}
                </div>
              </section>

              {/* Learning Outcomes Card */}
              <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  What You Will Master
                </h2>

                <div className="mt-5 space-y-4 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800 text-xs font-bold mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Core Domain Foundations</p>
                      <p className="mt-0.5 text-xs text-slate-500">Master fundamental principles and real-world execution standards.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800 text-xs font-bold mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Practical Implementation</p>
                      <p className="mt-0.5 text-xs text-slate-500">Apply industry techniques to produce showcase-ready outputs.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800 text-xs font-bold mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Career-Ready Artifacts</p>
                      <p className="mt-0.5 text-xs text-slate-500">Demonstrate capability suitable for college or internship portfolios.</p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default ModuleDetails;