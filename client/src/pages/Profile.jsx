import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { getStudentDashboard } from "../services/dashboardService";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { getStoredUser, setStoredUser } from "../utils/authStorage";
import EmptyState from "../components/EmptyState";

function Profile() {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const localUser = getStoredUser();

      try {
        const userRes = await getCurrentUser();
        if (userRes?.user) {
          setUser(userRes.user);
          setStoredUser(userRes.user);
        } else if (localUser) {
          setUser(localUser);
        }
      } catch (e) {
        if (localUser) setUser(localUser);
      }

      try {
        const dashData = await getStudentDashboard();
        setDashboardData(dashData || {});
      } catch (e) { }
    } catch (err) {
      setError(err.message || "Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const modules = dashboardData?.modules || [];
  const totalModules = dashboardData?.summary?.totalModules || modules.length || 0;
  const completedModules = dashboardData?.summary?.completedModules || modules.filter((m) => (m.progressPercentage || m.progress || 0) >= 100).length || 0;
  const overallProgress = dashboardData?.summary?.overallProgress || 0;

  const userName = user?.name || "Student";
  const userEmail = user?.email || "student@pathpilot.com";
  const userRole = user?.role || "student";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 md:px-8">
      {loading && <LoadingState variant="profile" message="Loading profile details..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadProfile} />
      )}

      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-12">
          {/* Left Identity Card */}
          <div className="md:col-span-4 rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xs flex flex-col items-center justify-between space-y-6">
            <div className="flex flex-col items-center w-full">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#2563EB] text-3xl font-extrabold text-white shadow-md mb-4 ring-4 ring-blue-50">
                {userInitial}
              </div>
              <h3 className="text-xl font-extrabold text-[#0F172A]">{userName}</h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5 break-all">{userEmail}</p>
              <span className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#2563EB] border border-blue-100">
                {userRole} Account
              </span>
            </div>

            {/* Quick Metrics Badge Summary */}
            <div className="w-full grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 text-center">
              <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mastery</p>
                <p className="text-lg font-extrabold text-[#0F172A] mt-0.5">{overallProgress}%</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Modules</p>
                <p className="text-lg font-extrabold text-emerald-600 mt-0.5">{completedModules}/{totalModules}</p>
              </div>
            </div>
          </div>

          {/* Right Details & Enrolled Path & Achievements */}
          <div className="md:col-span-8 space-y-6">
            {/* Account Info */}
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
                  <dd className="mt-1 font-bold text-[#0F172A] break-all">{userEmail}</dd>
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

            {/* Current Active Career */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
              <h4 className="text-base font-bold text-[#0F172A] border-b border-slate-100 pb-3 mb-4">
                Active Learning Path
              </h4>
              {dashboardData?.career ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-[#2563EB] mb-1">
                      ENROLLED CURRICULUM
                    </span>
                    <p className="text-lg font-extrabold text-[#0F172A]">
                      {dashboardData.career.title || dashboardData.career.name || "Career Path"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {dashboardData.career.overview || dashboardData.career.description || "Active learning roadmap"}
                    </p>
                  </div>
                  <Link
                    to="/my-career"
                    className="inline-flex items-center justify-center gap-1 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 px-4 py-2.5 rounded-xl shrink-0 transition-all duration-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    View Roadmap
                  </Link>
                </div>
              ) : (
                <EmptyState
                  title="No additional information available."
                  description="Select a career path to active your learning roadmap and populate profile statistics."
                  actionText="Explore Career Paths"
                  actionLink="/my-career"
                />
              )}
            </div>

            {/* Achievement Placeholders */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold text-[#0F172A]">
                  Learner Badges & Achievements
                </h4>
                <span className="text-xs font-semibold text-slate-400">V1 Milestone Badges</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-center space-y-1">
                  <div className="text-2xl">🚀</div>
                  <p className="text-xs font-bold text-[#0F172A]">Path Enrolled</p>
                  <p className="text-[10px] text-slate-400">Career activated</p>
                </div>
                <div className={`rounded-2xl border p-4 text-center space-y-1 ${completedModules > 0 ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-slate-50/50 opacity-60'}`}>
                  <div className="text-2xl">{completedModules > 0 ? '🏆' : '🔒'}</div>
                  <p className="text-xs font-bold text-[#0F172A]">First Milestone</p>
                  <p className="text-[10px] text-slate-400">{completedModules > 0 ? 'Module mastered' : 'Complete 1 module'}</p>
                </div>
                <div className={`rounded-2xl border p-4 text-center space-y-1 ${overallProgress >= 100 ? 'border-amber-200 bg-amber-50/40' : 'border-slate-200 bg-slate-50/50 opacity-60'}`}>
                  <div className="text-2xl">{overallProgress >= 100 ? '👑' : '🔒'}</div>
                  <p className="text-xs font-bold text-[#0F172A]">Career Master</p>
                  <p className="text-[10px] text-slate-400">{overallProgress >= 100 ? 'Roadmap complete' : '100% completion'}</p>
                </div>
              </div>
            </div>

            {/* Account Preferences */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold text-[#0F172A]">
                  Account Preferences
                </h4>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                  Default Settings
                </span>
              </div>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="font-bold text-[#0F172A]">Email Notifications</p>
                    <p className="text-[11px] text-slate-400">Receive learning reminders and course updates</p>
                  </div>
                  <span className="text-xs font-bold text-[#2563EB]">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="font-bold text-[#0F172A]">Learning Theme</p>
                    <p className="text-[11px] text-slate-400">Interface appearance preference</p>
                  </div>
                  <span className="text-xs font-bold text-slate-700">Light (Default)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
