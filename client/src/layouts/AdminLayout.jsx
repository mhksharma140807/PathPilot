import { useState, useEffect } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { getStoredUser, clearAuthSession } from "../utils/authStorage";
import { useToast } from "../context/ToastContext";

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem("admin_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("admin_sidebar_collapsed", isCollapsed ? "true" : "false");
    } catch {}
  }, [isCollapsed]);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileOpen]);

  const user = getStoredUser();
  const userName = user?.name || "Administrator";
  const userEmail = user?.email || "admin@pathpilot.dev";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    clearAuthSession();
    toast.info("Logged out of Admin Portal");
    navigate("/login", { replace: true });
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: "Careers",
      path: "/admin/careers",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: "Phases",
      path: "/admin/phases",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: "Modules",
      path: "/admin/modules",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      name: "Requirements",
      path: "/admin/requirements",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/admin/careers")) return "Careers Management";
    if (path.startsWith("/admin/phases")) return "Phases Management";
    if (path.startsWith("/admin/modules")) return "Modules Management";
    if (path.startsWith("/admin/requirements")) return "Curriculum Requirements";
    if (path.startsWith("/admin/users")) return "User & Student Management";
    return "Admin Dashboard";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased overflow-x-hidden">
      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col border-r border-slate-800 bg-[#0F172A] text-slate-300 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        } ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800 shrink-0">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white font-extrabold text-lg shadow-md">
              P
            </div>
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">
                  PathPilot
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
                  Admin
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white transition"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={`h-4 w-4 transform transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/admin/dashboard" &&
                location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#2563EB] text-white shadow-md font-bold"
                    : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Back to Student Dashboard Link */}
        <div className="p-3 border-t border-slate-800 shrink-0">
          <Link
            to="/student/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800/70 hover:text-slate-200 transition"
            title={isCollapsed ? "Student Portal" : undefined}
          >
            <svg className="h-5 w-5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {!isCollapsed && <span>Student Portal</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 py-3.5 sm:px-6 md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            {/* Left: Mobile Drawer Button & Breadcrumbs */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden"
                aria-label="Open menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div>
                <nav className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <span className="text-amber-600">Admin</span>
                  <span>/</span>
                  <span className="text-[#2563EB]">{getPageTitle()}</span>
                </nav>
                <h1 className="text-lg font-extrabold text-[#0F172A] tracking-tight sm:text-xl">
                  {getPageTitle()}
                </h1>
              </div>
            </div>

            {/* Right: Admin User Profile Dropdown */}
            <div className="flex items-center gap-3 shrink-0 relative">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-[#0F172A] leading-snug">{userName}</p>
                <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.2 rounded">
                  System Admin
                </span>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-xs font-extrabold text-white shadow-xs ring-2 ring-amber-500/20 hover:opacity-90 transition"
                  aria-label="User profile menu"
                >
                  {userInitial}
                </button>

                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg z-40 text-slate-700">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-bold text-slate-900">{userName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                      >
                        <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
