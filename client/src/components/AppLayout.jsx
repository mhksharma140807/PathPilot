import { useState, useEffect } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", isCollapsed ? "true" : "false");
  }, [isCollapsed]);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Get current user info from localStorage
  const userStr = localStorage.getItem("user");
  let userName = "Student";
  let userEmail = "";
  if (userStr) {
    try {
      const u = JSON.parse(userStr);
      if (u?.name) userName = u.name;
      if (u?.email) userEmail = u.email;
    } catch (e) {}
  }
  const userInitial = userName.charAt(0).toUpperCase();

  // Determine Page Title & Welcome/Subtext based on active route
  const getHeaderInfo = () => {
    const path = location.pathname;

    if (path.startsWith("/student/dashboard")) {
      return {
        title: "Dashboard",
        welcome: `Welcome back, ${userName}`,
        category: "Command Center",
      };
    }
    if (path.startsWith("/my-career") || path.startsWith("/student/career")) {
      return {
        title: "Career Path",
        welcome: "Explore your roadmap & active curriculum",
        category: "Career Strategy",
      };
    }
    if (path.startsWith("/learning-modules/")) {
      return {
        title: "Learning Unit",
        welcome: "Interactive lesson & module content",
        category: "Curriculum Unit",
      };
    }
    if (path.startsWith("/learning-modules") || path.startsWith("/student/modules")) {
      return {
        title: "Learning",
        welcome: "Master units to complete your active path",
        category: "Learning Modules",
      };
    }
    if (path.startsWith("/progress")) {
      return {
        title: "Progress",
        welcome: "Comprehensive module completion analytics",
        category: "Performance Analytics",
      };
    }
    if (path.startsWith("/profile")) {
      return {
        title: "Profile",
        welcome: "Manage your profile & account preferences",
        category: "Account Settings",
      };
    }

    return {
      title: "PathPilot",
      welcome: `Welcome back, ${userName}`,
      category: "Dashboard",
    };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased overflow-x-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area offset by desktop sidebar width */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 py-3.5 sm:px-6 md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            {/* Left: Mobile Toggle & Page Header Info */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
                aria-label="Open menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {headerInfo.category}
                </p>
                <h1 className="text-lg font-extrabold text-[#0F172A] tracking-tight sm:text-xl">
                  {headerInfo.title}
                </h1>
              </div>
            </div>

            {/* Middle: Search Bar Placeholder (Optional/SaaS style) */}
            <div className="hidden md:flex flex-1 max-w-xs mx-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search modules, skills..."
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-1.5 pl-9 pr-3 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 cursor-default"
                />
              </div>
            </div>

            {/* Right: Welcome Text & User Profile Avatar */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-[#0F172A] leading-snug">{userName}</p>
                <p className="text-[11px] text-slate-400 font-medium">{userEmail || "Student"}</p>
              </div>

              <Link
                to="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-xs font-bold text-white shadow-xs ring-2 ring-blue-500/20 hover:bg-blue-700 transition"
                title="View Profile"
              >
                {userInitial}
              </Link>
            </div>
          </div>
        </header>

        {/* Dynamic Page Outlet Container */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
