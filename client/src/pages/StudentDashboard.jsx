import { useEffect, useState } from "react";
import { getStudentDashboard } from "../services/dashboardService";
import DashboardCard from "../components/DashboardCard";
import Sidebar from "../components/Sidebar";
import ModuleCard from "../components/ModuleCard";

function StudentDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const data = await getStudentDashboard(token);
        setDashboardData(data);
      } catch (error) {
        console.error("Dashboard loading failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const modules = [
    {
      title: "Web Development Fundamentals",
      status: "In Progress",
      progress: 65,
    },
    {
      title: "Frontend Development",
      status: "In Progress",
      progress: 40,
    },
    {
      title: "Backend Development",
      status: "Not Started",
      progress: 0,
    },
    {
      title: "Database and Authentication",
      status: "Not Started",
      progress: 0,
    },
  ];

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
                Welcome back, Mahak
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              M
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 md:px-8">
          <section className="rounded-2xl bg-slate-900 p-6 text-white md:p-8">
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-slate-300">
                Current Career Path
              </p>

              <h3 className="mt-2 text-3xl font-bold">
                Full Stack Developer
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Build practical skills across frontend development,
                backend APIs, databases and authentication.
              </p>

              <button
                type="button"
                className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                Continue Learning
              </button>
            </div>
          </section>

          <section>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DashboardCard
                title="Overall Progress"
                value="26%"
                subtitle="Career completion"
              />

              <DashboardCard
                title="Modules"
                value="4"
                subtitle="Learning modules"
              />

              <DashboardCard
                title="Completed"
                value="0"
                subtitle="Modules completed"
              />

              <DashboardCard
                title="Learning Time"
                value="12h"
                subtitle="Estimated activity"
              />
            </div>
          </section>

          <section>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Your Learning Path
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Continue from where you left off.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {modules.map((module, index) => (
                <ModuleCard
                  key={module._id || module.id || index}
                  module={module}
                  index={index}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;