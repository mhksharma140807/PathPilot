import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import StudentDashboard from "../pages/StudentDashboard";
import ProtectedRoute from "./ProtectedRoute";
import MyCareer from "../pages/MyCareer";
import LearningModules from "../pages/LearningModules";
import ModuleDetails from "../pages/ModuleDetails";
import Progress from "../pages/Progress";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/my-career" element={<MyCareer />} />
        <Route path="/student/career" element={<MyCareer />} />
        <Route path="/learning-modules" element={<LearningModules />} />
        <Route path="/student/modules" element={<LearningModules />} />
        <Route path="/learning-modules/:moduleId" element={<ModuleDetails />} />
        <Route path="/progress" element={<Progress />} />
      </Route>

      <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;