import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import ProgressBar from "../components/ProgressBar";



function ModuleDetails() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadModule = async () => {
      try {
        setLoading(true);
        setError("");

        const [moduleResponse, progressResponse] = await Promise.all([
          api.get(`/modules/${moduleId}`),
          api.get("/progress/me"),
        ]);

        setModule(
          moduleResponse.data?.module ||
            moduleResponse.data?.data ||
            moduleResponse.data
        );

        const progressData =
          progressResponse.data?.progress ||
          progressResponse.data?.data ||
          progressResponse.data;

        if (Array.isArray(progressData)) {
          const currentProgress = progressData.find(
            (item) =>
              item.module?._id === moduleId ||
              item.module === moduleId
          );

          setProgress(currentProgress?.progress || 0);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load this learning module."
        );
      } finally {
        setLoading(false);
      }
    };

    loadModule();
  }, [moduleId]);

  const updateProgress = async (newProgress) => {
    try {
      setUpdating(true);

      await api.put("/progress/module", {
        moduleId,
        progress: newProgress,
      });

      setProgress(newProgress);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update module progress."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-500">
            Loading module...
          </p>
        </div>
      </div>
    );
  }

  if (error && !module) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-white p-8 text-center">
          <p className="font-medium text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/learning-modules")}
            className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Learning Modules
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
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

      <main className="mx-auto max-w-4xl space-y-6 px-6 py-8 md:px-8">
        <section className="rounded-2xl bg-slate-900 p-6 text-white md:p-8">
          <p className="text-sm text-slate-300">
            Learning Module
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {module?.title || module?.name || "Module"}
          </h1>

          {module?.description && (
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              {module.description}
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Your Progress
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep progressing through this module.
              </p>
            </div>

            <span className="text-lg font-bold text-slate-900">
              {progress}%
            </span>
          </div>

          <div className="mt-5">
            <ProgressBar progress={progress} />
          </div>
          {error && (
            <p className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={updating}
              onClick={() => updateProgress(Math.min(progress + 25, 100))}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {updating ? "Updating..." : "Mark Progress"}
            </button>

            {progress >= 100 && (
              <span className="flex items-center rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700">
                Module Completed
              </span>
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
      </main>
    </div>
  );
}

export default ModuleDetails;