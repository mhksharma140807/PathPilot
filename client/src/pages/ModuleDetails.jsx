import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getModuleById } from "../services/moduleService";
import { getMyProgress, updateModuleProgress } from "../services/progressService";
import ProgressBar from "../components/ProgressBar";
import Sidebar from "../components/Sidebar";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

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
        <header className="border-b border-slate-200 bg-white px-6 py-5 md:px-8">
          <div className="mx-auto max-w-4xl">
            <button
              type="button"
              onClick={() => navigate("/learning-modules")}
              className="text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              ← Back to Learning Modules
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-4xl space-y-6 px-6 py-8 md:px-8">
          {loading && <LoadingState message="Loading module details..." />}

          {!loading && error && !module && (
            <ErrorState message={error} onRetry={loadModuleDetails} />
          )}

          {!loading && module && (
            <>
              <section className="rounded-2xl bg-slate-900 p-6 text-white md:p-8">
                <p className="text-sm text-slate-300">Learning Module</p>

                <h1 className="mt-2 text-3xl font-bold">
                  {module.title || module.name || "Module"}
                </h1>

                {module.description && (
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                    {module.description}
                  </p>
                )}

                {module.estimatedHours && (
                  <div className="mt-4 inline-block rounded-lg bg-slate-800 px-3 py-1 text-xs text-slate-300">
                    Duration: ~{module.estimatedHours} hours
                  </div>
                )}
              </section>

              <section className={`rounded-2xl border p-6 shadow-sm ${progress >= 100 ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Your Progress
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {progress >= 100
                        ? "Congratulations! You've completed this module."
                        : "Keep progressing through this module."}
                    </p>
                  </div>

                  <span className={`text-lg font-bold ${progress >= 100 ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {progress}%
                  </span>
                </div>

                <div className="mt-5">
                  <ProgressBar progress={progress} />
                </div>

                {error && (
                  <p className="mt-4 text-sm font-medium text-red-600">
                    {error}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={updating || progress >= 100}
                    onClick={() => handleUpdateProgress(Math.min(progress + 25, 100))}
                    className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
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
                      className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      Mark as Completed (100%)
                    </button>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  What you will learn
                </h2>

                <ul className="mt-5 space-y-3 text-sm text-slate-600">
                  <li>• Understand the core concepts of this module.</li>
                  <li>• Build practical skills through structured learning.</li>
                  <li>• Apply concepts to real development tasks.</li>
                </ul>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default ModuleDetails;