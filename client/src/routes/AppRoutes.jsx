import { Route, Routes, Navigate } from "react-router-dom";
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
import AdminRoute from "./AdminRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminCareers from "../pages/admin/AdminCareers";
import AdminPhases from "../pages/admin/AdminPhases";
import AdminModules from "../pages/admin/AdminModules";
import AdminRequirements from "../pages/admin/AdminRequirements";
import AdminPlaceholder from "../pages/admin/AdminPlaceholder";
import AdminUsers from "../pages/admin/AdminUsers";

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

      {/* Protected Admin Routes wrapped in AdminLayout */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/careers" element={<AdminCareers />} />
          <Route path="/admin/phases" element={<AdminPhases />} />
          <Route path="/admin/modules" element={<AdminModules />} />
          <Route path="/admin/requirements" element={<AdminRequirements />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Route>

      {/* Global 404 Page Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;