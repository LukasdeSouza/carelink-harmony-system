
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useFlow } from "@/contexts/FlowContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { userPermissions, userRole } = useFlow();
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1]; // Get first path segment

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Wait for initial authentication check
  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Super admin has access to all routes
  if (userRole?.super_admin) {
    return <>{children}</>;
  }

  // Special admin permissions management route - only for super_admin
  if (currentPath === "admin") {
    return <Navigate to="/flow-selection" replace />;
  }

  // Check if user has permission to access this route
  if (userPermissions) {
    const hasWildcardPermission = userPermissions.routes.includes('*');
    const hasSpecificPermission = userPermissions.routes.includes(currentPath);
    
    // Allow access to root and flow-selection for all authenticated users
    const isPublicRoute = currentPath === '' || currentPath === 'flow-selection';
    
    if (!hasWildcardPermission && !hasSpecificPermission && !isPublicRoute) {
      return <Navigate to="/flow-selection" replace />;
    }
  }

  return <>{children}</>;
}
