import { Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import StudentDashboard from "../pages/StudentDashboard";
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import MyCareer from "../pages/MyCareer";
import LearningModules from "../pages/LearningModules";
import ModuleDetails from "../pages/ModuleDetails";
import Progress from "../pages/Progress";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import AppLayout from "../components/AppLayout";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Auth Entry Routes - Redirect logged-in users to Dashboard */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Student Routes wrapped in AppLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/my-career" element={<MyCareer />} />
          <Route path="/student/career" element={<MyCareer />} />
          <Route path="/learning-modules" element={<LearningModules />} />
          <Route path="/student/modules" element={<LearningModules />} />
          <Route path="/learning-modules/:moduleId" element={<ModuleDetails />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Global 404 Page Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;