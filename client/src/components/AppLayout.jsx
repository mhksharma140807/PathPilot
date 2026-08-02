import { useState, useEffect } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { getStoredUser, clearAuthSession } from "../utils/authStorage";

import { useToast } from "../context/ToastContext";

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem("sidebar_collapsed") === "true";
    } catch (e) {
      return false;
    }
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("sidebar_collapsed", isCollapsed ? "true" : "false");
    } catch (e) {}
  }, [isCollapsed]);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Get current user info from safe authStorage
  const user = getStoredUser();
  const userName = user?.name || "Student";
  const userEmail = user?.email || "";
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
        title: "Career Roadmap",
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
        title: "Learning Hub",
        welcome: "Master units to complete your active path",
        category: "Learning Modules",
      };
    }
    if (path.startsWith("/progress")) {
      return {
        title: "Progress Tracker",
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

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Handle Escape key to close profile dropdown
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

  const handleLogout = () => {
    clearAuthSession();
    toast.info("Logged out successfully");
    navigate("/", { replace: true });
  };

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
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:hidden focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40"
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

            {/* Middle: Disabled Search Bar Placeholder */}
            <div 
              title="Global search will be available in Version 2."
              className="hidden lg:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs text-slate-400 cursor-default select-none transition-colors hover:border-slate-300"
            >
              <svg className="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search modules, skills..."
                disabled
                tabIndex={-1}
                className="bg-transparent outline-none cursor-default w-48 placeholder:text-slate-400 text-slate-500 font-medium"
                aria-label="Search modules and skills (disabled)"
              />
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-200/80 px-2 py-0.5 rounded-full shrink-0">
                Coming Soon
              </span>
            </div>

            {/* Right: Welcome Text & User Profile Avatar Dropdown */}
            <div className="flex items-center gap-3 shrink-0 relative">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-[#0F172A] leading-snug">{userName}</p>
                <p className="text-[11px] text-slate-400 font-medium">{userEmail || "Student"}</p>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-xs font-bold text-white shadow-xs ring-2 ring-blue-500/20 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-600"
                  aria-label="User profile menu"
                  aria-expanded={isProfileOpen}
                >
                  {userInitial}
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg z-40 text-slate-700">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold hover:bg-slate-100 transition focus:outline-none focus:bg-slate-100"
                      >
                        <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Profile</span>
                      </Link>

                      <div className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-400 cursor-default">
                        <div className="flex items-center gap-2.5">
                          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Settings</span>
                        </div>
                        <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Soon</span>
                      </div>

                      <div className="my-1 border-t border-slate-100" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition focus:outline-none focus:bg-red-50"
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

        {/* Dynamic Page Outlet Container */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
