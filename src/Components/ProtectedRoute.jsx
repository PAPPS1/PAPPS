import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireSenior = false }) => {
  const auth = JSON.parse(localStorage.getItem("papps_auth"));

  // Not logged in
  if (!auth?.isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  // Senior Admin required for this route
  if (requireSenior && auth.role !== "senior_admin") {
    return <Navigate to="/admin/login" replace />;
  }

  // Logged in as either admin or senior admin is allowed
  return children;
};

export default ProtectedRoute;
