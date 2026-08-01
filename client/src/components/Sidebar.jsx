import { useNavigate, NavLink, useLocation } from "react-router-dom";

function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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

  const navItems = [
    {
      label: "Dashboard",
      path: "/student/dashboard",
      icon: (
        <svg className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: "Career Path",
      path: "/my-career",
      icon: (
        <svg className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Learning",
      path: "/learning-modules",
      icon: (
        <svg className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      label: "Progress",
      path: "/progress",
      icon: (
        <svg className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: "Profile",
      path: "/profile",
      icon: (
        <svg className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  const isItemActive = (itemPath) => {
    if (itemPath === "/student/dashboard") {
      return location.pathname === "/student/dashboard";
    }
    if (itemPath === "/my-career") {
      return location.pathname === "/my-career" || location.pathname === "/student/career";
    }
    if (itemPath === "/learning-modules") {
      return location.pathname.startsWith("/learning-modules") || location.pathname.startsWith("/student/modules");
    }
    return location.pathname === itemPath;
  };

  const renderNavContent = (collapsed = false, isMobile = false) => (
    <div className="flex h-full flex-col justify-between bg-[#0F172A] text-white select-none overflow-hidden">
      {/* 1. Top Branding Header (Logo stays fixed at top) */}
      <div className="shrink-0">
        <div
          className={`flex items-center border-b border-slate-800/80 py-4 transition-all duration-300 ${
            collapsed && !isMobile ? "justify-center px-3" : "justify-between px-5"
          }`}
        >
          <NavLink
            to="/student/dashboard"
            onClick={() => isMobile && setIsMobileOpen(false)}
            className="flex items-center gap-3 min-w-0"
            title="PathPilot Dashboard"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-white font-extrabold text-base shadow-sm ring-2 ring-blue-500/20">
              P
            </div>
            {(!collapsed || isMobile) && (
              <div className="min-w-0 overflow-hidden transition-all duration-300">
                <h1 className="text-lg font-extrabold text-white tracking-tight leading-none truncate">
                  PathPilot
                </h1>
                <p className="text-[10px] font-semibold text-blue-400 mt-0.5 truncate">
                  SaaS Dashboard
                </p>
              </div>
            )}
          </NavLink>

          {/* Desktop Collapse Toggle Button */}
          {!isMobile && (
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white transition"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg
                className={`h-4 w-4 transition-transform duration-300 ${
                  collapsed ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Mobile Close Button */}
          {isMobile && (
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
              aria-label="Close drawer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 2. Navigation Items (Centrally Aligned in Vertical Space) */}
      <div className="flex-1 flex flex-col justify-center py-4 overflow-y-auto px-3">
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const active = isItemActive(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={collapsed && !isMobile ? item.label : undefined}
                onClick={() => isMobile && setIsMobileOpen(false)}
                className={`group relative flex items-center rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                  collapsed && !isMobile
                    ? "justify-center px-2.5"
                    : "gap-3.5 px-3.5"
                } ${
                  active
                    ? "bg-[#2563EB] text-white shadow-sm font-bold"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                {/* Active Left Pill Accent */}
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white shadow-xs" />
                )}

                {item.icon}

                {(!collapsed || isMobile) && (
                  <span className="truncate whitespace-nowrap transition-all duration-300">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* 3. Bottom Footer (User & Logout stay fixed at bottom) */}
      <div className="shrink-0 border-t border-slate-800/80 p-3 space-y-2">
        {/* User Card */}
        <NavLink
          to="/profile"
          onClick={() => isMobile && setIsMobileOpen(false)}
          title={collapsed && !isMobile ? userName : undefined}
          className={`flex items-center rounded-xl bg-slate-800/40 border border-slate-800/60 p-2.5 transition hover:bg-slate-800 ${
            collapsed && !isMobile ? "justify-center" : "gap-3"
          }`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] text-xs font-bold text-white shadow-xs">
            {userInitial}
          </div>
          {(!collapsed || isMobile) && (
            <div className="min-w-0 flex-1 overflow-hidden transition-all duration-300">
              <p className="truncate text-xs font-bold text-white leading-snug">
                {userName}
              </p>
              <p className="truncate text-[11px] text-slate-400 leading-tight">
                {userEmail || "Student"}
              </p>
            </div>
          )}
        </NavLink>

        {/* Separated Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed && !isMobile ? "Logout" : undefined}
          className={`flex w-full items-center rounded-xl border border-slate-800/80 bg-slate-900/60 py-2.5 text-xs font-semibold text-slate-400 transition hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 ${
            collapsed && !isMobile ? "justify-center px-2" : "justify-center gap-2 px-3"
          }`}
        >
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {(!collapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden md:block fixed left-0 top-0 bottom-0 z-30 h-screen border-r border-slate-800 bg-[#0F172A] transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {renderNavContent(isCollapsed, false)}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-72 bg-[#0F172A] shadow-2xl transition-transform duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {renderNavContent(false, true)}
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;