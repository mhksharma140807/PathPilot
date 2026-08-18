import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminDashboardStats } from "../../services/adminService";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminDashboardStats();
      if (res?.success) {
        setData(res);
      } else {
        setError(res?.message || "Failed to load admin dashboard metrics");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to connect to admin dashboard server"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-slate-200 rounded-xl" />
          <div className="h-6 w-32 bg-slate-200 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          <svg className="mx-auto h-12 w-12 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-bold text-red-900">Dashboard Failed to Load</h3>
          <p className="mt-1 text-xs text-red-700">{error}</p>
          <button
            type="button"
            onClick={fetchDashboardData}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const { stats, careerOverview } = data || {};

  const statCards = [
    {
      title: "Total Students",
      value: stats?.students ?? 0,
      icon: (
        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bgColor: "bg-blue-50 border-blue-100",
    },
    {
      title: "Total Careers",
      value: stats?.careers ?? 0,
      icon: (
        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: "bg-indigo-50 border-indigo-100",
    },
    {
      title: "Total Phases",
      value: stats?.phases ?? 0,
      icon: (
        <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bgColor: "bg-amber-50 border-amber-100",
    },
    {
      title: "Total Modules",
      value: stats?.modules ?? 0,
      icon: (
        <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      bgColor: "bg-emerald-50 border-emerald-100",
    },
  ];

  const quickActions = [
    {
      name: "Manage Careers",
      path: "/admin/careers",
      desc: "Configure career paths & descriptions",
      color: "border-blue-200 hover:border-blue-400 bg-white",
    },
    {
      name: "Manage Phases",
      path: "/admin/phases",
      desc: "Organize phase order & prerequisites",
      color: "border-indigo-200 hover:border-indigo-400 bg-white",
    },
    {
      name: "Manage Modules",
      path: "/admin/modules",
      desc: "Add & edit modules & lesson content",
      color: "border-emerald-200 hover:border-emerald-400 bg-white",
    },
    {
      name: "Curriculum Requirements",
      path: "/admin/requirements",
      desc: "Set choice groups & phase completion rules",
      color: "border-amber-200 hover:border-amber-400 bg-white",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight sm:text-2xl">
            Admin Overview
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Manage PathPilot's career learning ecosystem & curriculum structure.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition shrink-0"
        >
          <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Analytics
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`rounded-2xl border p-5 transition-all shadow-xs bg-white ${card.bgColor}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className="rounded-xl p-2 bg-white/80 shadow-2xs">
                {card.icon}
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
                {card.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight">
          Quick Management Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className={`group flex flex-col justify-between rounded-2xl border p-4 shadow-xs transition hover:shadow-md ${action.color}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-[#0F172A] group-hover:text-[#2563EB] transition">
                    {action.name}
                  </h4>
                  <svg className="h-4 w-4 text-slate-400 group-hover:text-[#2563EB] transform group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  {action.desc}
                </p>
              </div>
              <div className="mt-3">
                <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                  Batch 14 Ready
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Curriculum Structure Overview Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight">
            Curriculum Breakdown
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {careerOverview?.length || 0} Careers Configured
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          {!careerOverview || careerOverview.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No career data available in the system yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Career Title</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Phases</th>
                    <th className="py-3 px-4 text-center">Modules</th>
                    <th className="py-3 px-4 text-center">Active Modules</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {careerOverview.map((career) => (
                    <tr key={career._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-[#0F172A]">
                        {career.title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {career.slug}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            career.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {career.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                        {career.phaseCount}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                        {career.moduleCount}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-600">
                        {career.activeModuleCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
