import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCareers, getMyCareer, selectCareer } from "../services/careerService";
import Sidebar from "../components/Sidebar";
import CareerRoadmap from "../components/CareerRoadmap";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

function MyCareer() {
  const navigate = useNavigate();
  const [careers, setCareers] = useState([]);
  const [currentCareer, setCurrentCareer] = useState(null);
  const [modules, setModules] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState(null);
  const [error, setError] = useState("");

  const loadCareerData = async () => {
    try {
      setLoading(true);
      setError("");

      const [careerData, enrollmentData] = await Promise.all([
        getCareers(),
        getMyCareer().catch(() => ({ enrollment: null, career: null, modules: [], summary: {} })),
      ]);

      setCareers(careerData.careers || careerData.data || []);
      const activeCareer = enrollmentData.career || enrollmentData.enrollment?.career || null;
      setCurrentCareer(activeCareer);
      setModules(enrollmentData.modules || []);
      setOverallProgress(enrollmentData.summary?.overallProgress || enrollmentData.enrollment?.overallProgress || 0);
    } catch (err) {
      console.error("Career loading failed:", err);
      setError("Unable to load career information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCareerData();
  }, []);

  const handleSelectCareer = async (careerId) => {
    try {
      setSelectingId(careerId);
      setError("");

      const data = await selectCareer(careerId);
      const selected = data.career || data.enrollment?.career;
      setCurrentCareer(selected);
      await loadCareerData();
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.enrollment) {
        await loadCareerData();
      } else {
        setError(
          err.response?.data?.message || err.message || "Unable to select this career path."
        );
      }
    } finally {
      setSelectingId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="min-w-0 flex-1 md:ml-64">
        {/* Top Header */}
        <header className="border-b border-slate-200 bg-white px-6 py-5 md:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Career Roadmap & Strategy
            </p>
            <h1 className="mt-1 text-2xl font-extrabold text-[#0F172A] tracking-tight">
              My Career Path
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Explore your selected career roadmap, stages, and curriculum sequence.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-8 md:px-8 space-y-8">
          {loading && <LoadingState message="Loading career path & roadmap..." />}

          {!loading && error && (
            <ErrorState message={error} onRetry={loadCareerData} />
          )}

          {!loading && !error && (
            <>
              {/* Highlight Active Enrolled Career & Roadmap */}
              {currentCareer ? (
                <div className="space-y-8">
                  {/* Selected Career Header Banner */}
                  <section className="rounded-3xl bg-[#0F172A] p-6 text-white shadow-md md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                          Enrolled Path
                        </div>

                        <h2 className="mt-3 text-3xl font-extrabold text-white">
                          {currentCareer.title || currentCareer.name}
                        </h2>

                        <p className="mt-2 text-sm leading-relaxed text-slate-300">
                          {currentCareer.overview || currentCareer.description}
                        </p>

                        {currentCareer.skills && currentCareer.skills.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {currentCareer.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => navigate("/learning-modules")}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 shadow-sm"
                        >
                          <span>Begin / Continue Learning</span>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Career Roadmap Visualization */}
                  <CareerRoadmap
                    career={currentCareer}
                    modules={modules}
                    overallProgress={overallProgress}
                  />
                </div>
              ) : (
                <EmptyState
                  title="No Career Path Enrolled"
                  description="Choose a career path below to activate your learning roadmap and start mastering modules."
                  icon={
                    <svg className="h-7 w-7 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />
              )}

              {/* Career Options Catalog */}
              <section className="pt-4 border-t border-slate-200">
                <div className="mb-6">
                  <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                    All Available Career Paths
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Switching paths updates your active curriculum roadmap.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {careers.map((career) => {
                    const isSelected = currentCareer?._id === career._id;

                    return (
                      <article
                        key={career._id}
                        className={`flex flex-col justify-between rounded-2xl border p-6 shadow-xs transition-all ${
                          isSelected
                            ? "border-[#2563EB] bg-white ring-2 ring-[#2563EB]/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-lg font-bold text-[#0F172A]">
                              {career.title || career.name}
                            </h3>
                            {isSelected && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#2563EB] px-2.5 py-0.5 text-xs font-semibold text-white shrink-0">
                                Enrolled
                              </span>
                            )}
                          </div>

                          <p className="mt-3 text-sm leading-relaxed text-slate-600">
                            {career.description || career.overview}
                          </p>

                          {career.skills && career.skills.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {career.skills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100">
                          <button
                            type="button"
                            disabled={selectingId === career._id || isSelected}
                            onClick={() => handleSelectCareer(career._id)}
                            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                              isSelected
                                ? "bg-slate-100 text-slate-400 cursor-default"
                                : "bg-[#2563EB] text-white hover:bg-blue-700 shadow-xs disabled:opacity-60"
                            }`}
                          >
                            {selectingId === career._id
                              ? "Selecting..."
                              : isSelected
                              ? "Active Career Path"
                              : "Select Career Path"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default MyCareer;