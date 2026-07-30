import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCareers, getMyCareer, selectCareer } from "../services/careerService";
import Sidebar from "../components/Sidebar";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

function MyCareer() {
  const navigate = useNavigate();
  const [careers, setCareers] = useState([]);
  const [currentCareer, setCurrentCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState(null);
  const [error, setError] = useState("");

  const loadCareerData = async () => {
    try {
      setLoading(true);
      setError("");

      const [careerData, enrollmentData] = await Promise.all([
        getCareers(),
        getMyCareer().catch(() => ({ enrollment: null, career: null })),
      ]);

      setCareers(careerData.careers || careerData.data || []);
      setCurrentCareer(
        enrollmentData.career || enrollmentData.enrollment?.career || null
      );
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

      // Navigate to student dashboard after selection
      navigate("/student/dashboard");
    } catch (err) {
      // Handle "already enrolled" gracefully — reload career data to reflect current state
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

      <main className="min-w-0 flex-1">
        {/* Top Header */}
        <header className="border-b border-slate-200/80 bg-white px-6 py-5 md:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Career Catalog
            </p>
            <h1 className="mt-1 text-2xl font-extrabold text-[#0F172A] tracking-tight">
              My Career Path
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Select or change your target career path to tailor your module curriculum.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-8 md:px-8 space-y-8">
          {loading && <LoadingState message="Loading available career paths..." />}

          {!loading && error && (
            <ErrorState message={error} onRetry={loadCareerData} />
          )}

          {!loading && !error && (
            <>
              {/* Highlight Active Enrolled Career */}
              {currentCareer && (
                <section className="relative overflow-hidden rounded-3xl bg-[#0F172A] p-6 text-white shadow-lg md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                      <div className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-[#10B981]/30">
                        <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
                        Active Enrolled Career Path
                      </div>

                      <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl text-white">
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
                              className="rounded-lg bg-slate-800/80 border border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-300"
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
                        className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#3730A3] shadow-md"
                      >
                        <span>Start Learning Modules</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate("/student/dashboard")}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                      >
                        View Dashboard
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* Available Paths Grid */}
              <section>
                <div className="mb-6">
                  <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                    Explore Career Options
                  </h2>
                  <p className="mt-1 text-sm text-[#64748B]">
                    Switching paths updates your enrolled curriculum and module progress view.
                  </p>
                </div>

                {careers.length === 0 ? (
                  <EmptyState
                    title="No career paths available"
                    description="No career paths are currently listed in the database."
                  />
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {careers.map((career) => {
                      const isSelected = currentCareer?._id === career._id;

                      return (
                        <article
                          key={career._id}
                          className={`group flex flex-col justify-between rounded-2xl border p-6 shadow-sm transition-all duration-200 ${
                            isSelected
                              ? "border-[#4F46E5] bg-white ring-2 ring-[#4F46E5]/20 shadow-md"
                              : "border-slate-200/80 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition">
                                {career.title || career.name}
                              </h3>
                              {isSelected && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#4F46E5] px-2.5 py-0.5 text-xs font-semibold text-white shrink-0">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]"></span>
                                  Enrolled
                                </span>
                              )}
                            </div>

                            <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
                              {career.description ||
                                career.overview ||
                                "Follow a structured learning path designed for this career field."}
                            </p>

                            {career.skills && career.skills.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-1.5">
                                {career.skills.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-[#64748B] border border-slate-200/50"
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
                                  : "bg-[#4F46E5] text-white hover:bg-[#3730A3] shadow-sm disabled:opacity-60"
                              }`}
                            >
                              {selectingId === career._id
                                ? "Selecting..."
                                : isSelected
                                ? "Current Active Path"
                                : "Select Career Path"}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default MyCareer;