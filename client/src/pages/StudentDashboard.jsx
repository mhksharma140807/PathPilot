import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getStudentDashboard } from "../services/dashboardService";
import DashboardCard from "../components/DashboardCard";
import Sidebar from "../components/Sidebar";
import ModuleCard from "../components/ModuleCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

function StudentDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj?.name) {
          setUserName(userObj.name);
        }
      } catch (err) {
        // Fallback
      }
    }
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getStudentDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard loading failed:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const userInitial = userName ? userName.charAt(0).toUpperCase() : "S";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <header className="border-b border-slate-200 bg-white px-6 py-5 md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Student Dashboard
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Welcome back, {userName}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {userInitial}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 md:px-8">
          {loading && <LoadingState message="Loading your dashboard..." />}

          {!loading && error && (
            <ErrorState message={error} onRetry={loadDashboard} />
          )}

          {!loading && !error && dashboardData && (
            <>
              {!dashboardData.hasEnrollment && !dashboardData.career ? (
                <EmptyState
                  title="No Career Path Selected"
                  description="You haven't chosen a career path yet. Browse available paths to start building your learning journey."
                  actionText="Explore Career Paths"
                  actionLink="/my-career"
                />
              ) : (
                <>
                  {/* Current Career Banner */}
                  <section className="rounded-2xl bg-slate-900 p-6 text-white md:p-8">
                    <div className="max-w-3xl">
                      <p className="text-sm font-medium text-slate-300">
                        Current Career Path
                      </p>

                      <h3 className="mt-2 text-3xl font-bold">
                        {dashboardData.career?.title || "Career Path"}
                      </h3>

                      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                        {dashboardData.career?.overview ||
                          dashboardData.career?.description ||
                          "Build practical skills across key modules."}
                      </p>

                      <Link
                        to="/learning-modules"
                        className="mt-6 inline-block rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  </section>

                  {/* Summary Metric Cards */}
                  <section>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <DashboardCard
                        title="Overall Progress"
                        value={`${dashboardData.summary?.overallProgress || 0}%`}
                        subtitle="Career completion"
                      />

                      <DashboardCard
                        title="Modules"
                        value={`${dashboardData.summary?.totalModules || 0}`}
                        subtitle="Learning modules"
                      />

                      <DashboardCard
                        title="Completed"
                        value={`${dashboardData.summary?.completedModules || 0}`}
                        subtitle="Modules completed"
                      />

                      <DashboardCard
                        title="Estimated Time"
                        value={`${(dashboardData.modules || []).reduce(
                          (acc, m) => acc + (m.estimatedHours || 0),
                          0
                        )}h`}
                        subtitle="Total duration"
                      />
                    </div>
                  </section>

                  {/* Modules Section */}
                  <section>
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          Your Learning Path
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Continue from where you left off.
                        </p>
                      </div>

                      <Link
                        to="/learning-modules"
                        className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                      >
                        View All →
                      </Link>
                    </div>

                    {(!dashboardData.modules || dashboardData.modules.length === 0) ? (
                      <EmptyState
                        title="No modules found"
                        description="Modules for this career path are being prepared."
                      />
                    ) : (
                      <div className="grid gap-5 md:grid-cols-2">
                        {dashboardData.modules.map((module, index) => (
                          <ModuleCard
                            key={module.moduleId || module._id || index}
                            module={{
                              ...module,
                              _id: module.moduleId || module._id,
                              progress: module.progressPercentage || 0,
                            }}
                            index={index}
                          />
                        ))}
                      </div>
                    )}
                  </section>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;