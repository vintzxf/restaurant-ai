import { Navigate } from "react-router-dom";
import { getSession } from "../utils/auth";

export default function ProtectedRoute({ children, role }) {
  const user = getSession();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}