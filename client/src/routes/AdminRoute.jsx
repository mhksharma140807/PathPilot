import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getStoredToken, getStoredUser } from "../utils/authStorage";

function AdminRoute() {
  const token = getStoredToken();
  const user = getStoredUser();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/student/dashboard" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
