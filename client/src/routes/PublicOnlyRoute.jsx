import { Navigate, Outlet } from "react-router-dom";
import { getStoredToken, getStoredUser } from "../utils/authStorage";

function PublicOnlyRoute() {
  const token = getStoredToken();
  const user = getStoredUser();

  if (token) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return <Outlet />;
}

export default PublicOnlyRoute;
