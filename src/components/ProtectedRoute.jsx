import { Navigate } from "react-router-dom";
import { getSession } from "../utils/auth";

// Wrap any route that needs a logged-in user (and optionally a specific role).
// getSession() already returns null for expired sessions, so this also
// enforces "log out automatically once the session expires."
//
// Usage:
// <Route path="/vendor" element={<ProtectedRoute role="vendor"><VendorDashboard /></ProtectedRoute>} />
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