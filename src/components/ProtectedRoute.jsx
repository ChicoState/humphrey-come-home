/**
 * ProtectedRoute — redirects to /login if not authenticated.
 * Wrap authenticated routes with this in the router.
 * Shows a spinner while the auth session is resolving.
 */
import { Navigate, Outlet, useLocation } from "react-router";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <Outlet />;
}