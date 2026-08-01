import { useEffect, useState } from "react";
import { getMyCareer } from "../services/careerService";
import { getModulesByCareer } from "../services/moduleService";
import { getMyProgress } from "../services/progressService";
import ModuleCard from "../components/ModuleCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import ProgressBar from "../components/ProgressBar";

function LearningModules() {
  const [modules, setModules] = useState([]);
  const [career, setCareer] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const careerResponse = await getMyCareer();

      const selectedCareer =
        careerResponse?.career ||
        careerResponse?.data?.career ||
        careerResponse?.enrollment?.career;

      const careerId =
        selectedCareer?._id ||
        careerResponse?.careerId ||
        careerResponse?.data?.careerId ||
        careerResponse?.enrollment?.careerId;

      if (!careerId) {
        setCareer(null);
        setModules([]);
        return;
      }

      setCareer(selectedCareer);

      const [moduleResponse, progressResponse] = await Promise.all([
        getModulesByCareer(careerId),
        getMyProgress().catch(() => ({ progress: [] })),
      ]);

      const fetchedModules =
        moduleResponse?.modules ||
        moduleResponse?.data?.modules ||
        moduleResponse?.data ||
        [];

      setModules(fetchedModules);

      const progList = progressResponse?.progress || [];
      const map = {};
      progList.forEach((item) => {
        const mId = item.module?._id || item.module;
        if (mId) {
          map[mId] = item.progressPercentage || item.progress || 0;
        }
      });
      setProgressMap(map);

    } catch (err) {
      console.error("Failed to load learning modules:", err);
      setError(err.message || "Unable to load your learning modules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalCount = modules.length;
  const completedCount = modules.filter(
    (m) => (progressMap[m._id || m.id] || 0) >= 100
  ).length;
  const inProgressCount = modules.filter((m) => {
    const p = progressMap[m._id || m.id] || 0;
    return p > 0 && p < 100;
  }).length;
  const notStartedCount = totalCount - completedCount - inProgressCount;

  const overallPct =
    totalCount > 0
      ? Math.round(
          (modules.reduce((acc, m) => acc + (progressMap[m._id || m.id] || 0), 0) /
            (totalCount * 100)) *
            100
        )
      : 0;

  const filteredModules = modules.filter((m) => {
    const p = progressMap[m._id || m.id] || 0;
    if (filter === "completed") return p >= 100;
    if (filter === "in_progress") return p > 0 && p < 100;
    if (filter === "not_started") return p === 0;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 space-y-8">
      {loading && <LoadingState message="Loading learning modules..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadData} />
      )}

      {!loading && !error && !career && (
        <EmptyState
          title="No Active Career Selected"
          description="Please select a career path first to view its learning modules."
          actionText="Select a Career Path"
          actionLink="/my-career"
        />
      )}

      {!loading && !error && career && (
        <>
          {/* Career Curriculum Overview Banner */}
          <section className="rounded-3xl bg-[#0F172A] p-6 text-white shadow-md md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 border border-slate-700">
                  Active Curriculum
                </span>

                <h2 className="mt-3 text-3xl font-extrabold text-white">
                  {career.title || career.name || "Career Path"}
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Work through step-by-step learning modules to build real-world proficiency.
                </p>
              </div>

              <div className="w-full md:w-64 rounded-2xl bg-slate-800/90 p-5 border border-slate-700/80 shrink-0">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Curriculum Completion</span>
                  <span className="text-base font-extrabold text-white">{overallPct}%</span>
                </div>
                <div className="mt-3">
                  <ProgressBar progress={overallPct} />
                </div>
                <div className="mt-4 flex justify-between text-xs text-slate-400 border-t border-slate-700/50 pt-3">
                  <span>Done: {completedCount}</span>
                  <span>Total: {totalCount}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Modules Filter & Grid */}
          <section>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                Modules ({filteredModules.length})
              </h3>

              {/* Filter Tabs */}
              <div className="inline-flex rounded-xl bg-slate-200/80 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`rounded-lg px-3.5 py-1.5 transition ${
                    filter === "all"
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-slate-600 hover:text-[#0F172A]"
                  }`}
                >
                  All ({totalCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("in_progress")}
                  className={`rounded-lg px-3.5 py-1.5 transition ${
                    filter === "in_progress"
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-[#0F172A] hover:text-[#0F172A]"
                  }`}
                >
                  In Progress ({inProgressCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("completed")}
                  className={`rounded-lg px-3.5 py-1.5 transition ${
                    filter === "completed"
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-[#0F172A] hover:text-[#0F172A]"
                  }`}
                >
                  Completed ({completedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("not_started")}
                  className={`rounded-lg px-3.5 py-1.5 transition ${
                    filter === "not_started"
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-[#0F172A] hover:text-[#0F172A]"
                  }`}
                >
                  Not Started ({notStartedCount})
                </button>
              </div>
            </div>

            {filteredModules.length === 0 ? (
              <EmptyState
                title="No modules match filter"
                description={
                  modules.length === 0
                    ? "Learning modules will appear here once added to this career path."
                    : "No modules currently match the selected status filter."
                }
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredModules.map((module, index) => {
                  const mId = module._id || module.id;
                  const moduleProg = progressMap[mId] || 0;
                  const firstIncomplete = filteredModules.find((m) => (progressMap[m._id || m.id] || 0) < 100);
                  const isCurrent = firstIncomplete && (firstIncomplete._id || firstIncomplete.id) === mId;

                  return (
                    <ModuleCard
                      key={mId || index}
                      module={{
                        ...module,
                        _id: mId,
                        progress: moduleProg,
                      }}
                      index={index}
                      isCurrent={isCurrent}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default LearningModules;