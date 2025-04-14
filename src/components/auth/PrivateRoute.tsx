
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFlow } from "@/contexts/FlowContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Always authenticated
  const [isLoading, setIsLoading] = useState(false);
  const { userPermissions, userRole } = useFlow();

  // Super admin has access to all routes
  if (userRole?.super_admin) {
    return <>{children}</>;
  }

  // Allow access to all authenticated users for development
  return <>{children}</>;
}
