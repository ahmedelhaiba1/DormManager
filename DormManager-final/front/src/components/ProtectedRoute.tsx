import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { JSX } from "react";

export function ProtectedRoute({ children, roles }: {
  children: JSX.Element,
  roles?: string[]
}) {
  const { isLogged, role } = useAuth();

  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    // User is logged but has no access
    return <Navigate to="/403" replace />;
  }

  return children;
}
