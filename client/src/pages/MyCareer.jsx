import { useEffect, useState } from "react";
import { getCareers, getMyCareer, selectCareer } from "../services/careerService";

function MyCareer() {
  const [careers, setCareers] = useState([]);
  const [currentCareer, setCurrentCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCareerData = async () => {
      try {
        const [careerData, enrollmentData] = await Promise.all([
          getCareers(),
          getMyCareer(),
        ]);

        setCareers(careerData.careers || careerData.data || []);
        setCurrentCareer(
          enrollmentData.career || enrollmentData.data || null
        );
      } catch (error) {
        console.error("Career loading failed:", error);
        setError("Unable to load career information.");
      } finally {
        setLoading(false);
      }
    };

    loadCareerData();
  }, []);

  const handleSelectCareer = async (careerId) => {
    try {
      setSelecting(true);
      setError("");

      const data = await selectCareer(careerId);

      setCurrentCareer(data.career || data.data || null);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to select this career path."
      );
    } finally {
      setSelecting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-sm text-slate-500">
        Loading career paths...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            PathPilot
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            My Career
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Choose the career path you want to build your learning journey around.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {currentCareer && (
          <section className="mb-8 rounded-2xl bg-slate-900 p-6 text-white">
            <p className="text-sm text-slate-300">
              Current Career Path
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {currentCareer.title || currentCareer.name}
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              This is your currently selected PathPilot career path.
            </p>
          </section>
        )}

        <section>
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Available Career Paths
          </h2>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {careers.map((career) => (
              <article
                key={career._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-slate-900">
                  {career.title || career.name}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {career.description ||
                    "Follow a structured learning path designed for this career."}
                </p>

                <button
                  type="button"
                  disabled={selecting}
                  onClick={() => handleSelectCareer(career._id)}
                  className="mt-6 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {selecting ? "Selecting..." : "Select Career"}
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default MyCareer;