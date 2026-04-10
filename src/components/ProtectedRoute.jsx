/**
 * ProtectedRoute — redirects to /login if not authenticated.
 * Wrap authenticated routes with this in the router.
 * Shows a spinner while the auth session is resolving.
 */
import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import Spinner from "@/components/ui/Spinner";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
