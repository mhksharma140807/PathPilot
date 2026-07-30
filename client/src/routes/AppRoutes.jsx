import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import StudentDashboard from "../pages/StudentDashboard";
import ProtectedRoute from "./ProtectedRoute";
import MyCareer from "../pages/MyCareer";
import LearningModules from "../pages/LearningModules";
import ModuleDetails from "../pages/ModuleDetails";







function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/student/career"
          element={<MyCareer />}
        />

        <Route
          path="/student/modules"
          element={<LearningModules />}
        />
      </Route>

      <Route
        path="/learning-modules/:moduleId"
        element={<ModuleDetails />}
      />

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;