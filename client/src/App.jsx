import { useEffect } from "react";
import { BrowserRouter, useLocation, useNavigationType } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";

function NavigationHandler() {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // 1. Scroll Restoration
    if (navType !== "POP") {
      window.scrollTo(0, 0);
    }

    // 2. Page Title Metadata Update
    let title = "PathPilot";
    if (pathname === "/") {
      title = "PathPilot";
    } else if (pathname.startsWith("/student/dashboard")) {
      title = "Dashboard • PathPilot";
    } else if (pathname.startsWith("/profile")) {
      title = "Profile • PathPilot";
    } else if (pathname.startsWith("/progress")) {
      title = "Progress • PathPilot";
    } else if (pathname.startsWith("/learning-modules/")) {
      title = "Learning Unit • PathPilot";
    } else if (pathname.startsWith("/learning-modules") || pathname.startsWith("/student/modules")) {
      title = "Learning Hub • PathPilot";
    } else if (pathname.startsWith("/my-career") || pathname.startsWith("/student/career")) {
      title = "Career Roadmap • PathPilot";
    } else if (pathname === "/login") {
      title = "Sign In • PathPilot";
    } else if (pathname === "/register") {
      title = "Create Account • PathPilot";
    } else {
      title = "Page Not Found • PathPilot";
    }
    document.title = title;

    // 3. Accessibility Focus Management after Navigation
    const timer = setTimeout(() => {
      const heading = document.querySelector("h1") || document.querySelector("main");
      if (heading) {
        if (!heading.getAttribute("tabindex")) {
          heading.setAttribute("tabindex", "-1");
        }
        heading.focus({ preventScroll: true });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, navType]);

  return null;
}

import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <NavigationHandler />
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;