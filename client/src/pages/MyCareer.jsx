import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCareers, getMyCareer, selectCareer } from "../services/careerService";
import Sidebar from "../components/Sidebar";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm font-medium text-slate-500">PathPilot</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              My Career Path
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Choose the career path you want to build your learning journey around.
            </p>
          </div>

          {loading && <LoadingState message="Loading career paths..." />}

          {!loading && error && (
            <div className="mb-6">
              <ErrorState message={error} onRetry={loadCareerData} />
            </div>
          )}

          {!loading && (
            <>
              {currentCareer && (
                <section className="mb-8 rounded-2xl bg-slate-900 p-6 text-white md:p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="inline-block rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                        Active Enrolled Path
                      </span>
                      <h2 className="mt-2 text-2xl font-bold">
                        {currentCareer.title || currentCareer.name}
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm text-slate-300">
                        {currentCareer.overview || currentCareer.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/student/dashboard")}
                      className="shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </section>
              )}

              <section>
                <h2 className="mb-4 text-xl font-bold text-slate-900">
                  Available Career Paths
                </h2>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {careers.map((career) => {
                    const isSelected = currentCareer?._id === career._id;

                    return (
                      <article
                        key={career._id}
                        className={`flex flex-col justify-between rounded-2xl border p-6 shadow-sm transition ${
                          isSelected
                            ? "border-slate-900 bg-white ring-2 ring-slate-900/10"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">
                              {career.title || career.name}
                            </h3>
                            {isSelected && (
                              <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-semibold text-white">
                                Selected
                              </span>
                            )}
                          </div>

                          <p className="mt-3 text-sm leading-6 text-slate-500">
                            {career.description ||
                              "Follow a structured learning path designed for this career."}
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

                        <button
                          type="button"
                          disabled={selectingId === career._id || isSelected}
                          onClick={() => handleSelectCareer(career._id)}
                          className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                            isSelected
                              ? "bg-slate-100 text-slate-400 cursor-default"
                              : "bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
                          }`}
                        >
                          {selectingId === career._id
                            ? "Selecting..."
                            : isSelected
                            ? "Current Career Path"
                            : "Select Career Path"}
                        </button>
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