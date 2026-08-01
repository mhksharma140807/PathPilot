import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { getStudentDashboard } from "../services/dashboardService";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

function Profile() {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const userStr = localStorage.getItem("user");
      let localUser = null;
      if (userStr) {
        try {
          localUser = JSON.parse(userStr);
        } catch (e) {}
      }

      try {
        const userRes = await getCurrentUser();
        if (userRes?.user) {
          setUser(userRes.user);
          localStorage.setItem("user", JSON.stringify(userRes.user));
        } else if (localUser) {
          setUser(localUser);
        }
      } catch (e) {
        if (localUser) setUser(localUser);
      }

      try {
        const dashData = await getStudentDashboard();
        setDashboardData(dashData);
      } catch (e) {}
    } catch (err) {
      setError(err.message || "Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const userName = user?.name || "Student Learner";
  const userEmail = user?.email || "student@example.com";
  const userRole = user?.role || "student";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 md:px-8">
      {loading && <LoadingState message="Loading profile details..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadProfile} />
      )}

      {!loading && (
        <div className="grid gap-6 md:grid-cols-12">
          {/* Left Identity Card */}
          <div className="md:col-span-4 rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xs flex flex-col items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#2563EB] text-3xl font-extrabold text-white shadow-md mb-4">
              {userInitial}
            </div>
            <h3 className="text-xl font-extrabold text-[#0F172A]">{userName}</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{userEmail}</p>
            <span className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#2563EB] border border-blue-100">
              {userRole} Account
            </span>
          </div>

          {/* Right Details & Enrolled Path */}
          <div className="md:col-span-8 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
              <h4 className="text-base font-bold text-[#0F172A] border-b border-slate-100 pb-3 mb-4">
                Account Information
              </h4>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs text-slate-500 font-semibold uppercase">Full Name</dt>
                  <dd className="mt-1 font-bold text-[#0F172A]">{userName}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 font-semibold uppercase">Email Address</dt>
                  <dd className="mt-1 font-bold text-[#0F172A]">{userEmail}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 font-semibold uppercase">Account Role</dt>
                  <dd className="mt-1 font-bold text-[#0F172A] capitalize">{userRole}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 font-semibold uppercase">Platform Status</dt>
                  <dd className="mt-1 font-bold text-emerald-600">Active Student</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
              <h4 className="text-base font-bold text-[#0F172A] border-b border-slate-100 pb-3 mb-4">
                Active Learning Path
              </h4>
              {dashboardData?.career ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-[#0F172A]">
                      {dashboardData.career.title || dashboardData.career.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {dashboardData.career.overview || dashboardData.career.description}
                    </p>
                  </div>
                  <Link
                    to="/my-career"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2.5 rounded-xl shrink-0 transition"
                  >
                    View Path Roadmap
                  </Link>
                </div>
              ) : (
                <div className="text-sm text-slate-500 space-y-3">
                  <p>You have not selected an active career path yet.</p>
                  <Link
                    to="/my-career"
                    className="inline-block text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 px-4 py-2 rounded-xl transition"
                  >
                    Explore Career Paths
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
