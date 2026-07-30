import { useEffect, useState } from "react";
import { getMyCareer } from "../services/careerService";
import { getModulesByCareer } from "../services/moduleService";
import { getMyProgress } from "../services/progressService";
import Sidebar from "../components/Sidebar";
import ModuleCard from "../components/ModuleCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

function LearningModules() {
  const [modules, setModules] = useState([]);
  const [career, setCareer] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      // Create progress lookup map
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

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <header className="border-b border-slate-200 bg-white px-6 py-5 md:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-medium text-slate-500">Learning Path</p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Learning Modules
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Follow your career path step by step and build practical skills.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-8 md:px-8 space-y-8">
          {loading && <LoadingState message="Loading your learning modules..." />}

          {!loading && error && (
            <ErrorState message={error} onRetry={loadData} />
          )}

          {!loading && !error && !career && (
            <EmptyState
              title="No Active Career Selected"
              description="Please select a career path to view its learning modules."
              actionText="Select a Career"
              actionLink="/my-career"
            />
          )}

          {!loading && !error && career && (
            <>
              <section className="rounded-2xl bg-slate-900 p-6 text-white md:p-8">
                <p className="text-sm text-slate-300">Current Career Path</p>

                <h2 className="mt-2 text-2xl font-bold">
                  {career.title || career.name || "Career Path"}
                </h2>

                <p className="mt-2 text-sm text-slate-300">
                  Complete these modules to progress through your selected career.
                </p>
              </section>

              {modules.length === 0 ? (
                <EmptyState
                  title="No modules available yet"
                  description="Learning modules will appear here once added to this career path."
                />
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {modules.map((module, index) => {
                    const mId = module._id || module.id;
                    const moduleProg = progressMap[mId] || 0;

                    return (
                      <ModuleCard
                        key={mId || index}
                        module={{
                          ...module,
                          _id: mId,
                          progress: moduleProg,
                        }}
                        index={index}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default LearningModules;