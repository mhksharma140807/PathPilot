import { Navigate, Outlet } from "react-router-dom";
import { getStoredToken } from "../utils/authStorage";

function PublicOnlyRoute() {
  const token = getStoredToken();

  if (token) {
    return <Navigate to="/student/dashboard" replace />;
  }

  return <Outlet />;
}

export default PublicOnlyRoute;
