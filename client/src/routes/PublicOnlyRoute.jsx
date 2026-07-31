import { Navigate, Outlet } from "react-router-dom";

function PublicOnlyRoute() {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/student/dashboard" replace />;
  }

  return <Outlet />;
}

export default PublicOnlyRoute;
