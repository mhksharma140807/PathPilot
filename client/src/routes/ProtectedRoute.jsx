import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getStoredToken } from "../utils/authStorage";

function ProtectedRoute() {
  const token = getStoredToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;