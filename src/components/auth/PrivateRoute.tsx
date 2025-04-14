
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFlow } from "@/contexts/FlowContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Always authenticated
  const [isLoading, setIsLoading] = useState(false);
  const { userPermissions, userRole, setSelectedFlow } = useFlow();

  // Em modo de desenvolvimento, definir um fluxo padrão se não houver nenhum
  useEffect(() => {
    const storedFlow = localStorage.getItem("drfacil.flow");
    if (!storedFlow) {
      // Define um fluxo padrão (clinical) para desenvolvimento
      setSelectedFlow("clinical");
      localStorage.setItem("drfacil.flow", "clinical");
      console.log("Fluxo padrão definido como 'clinical'");
    }
  }, [setSelectedFlow]);

  // Super admin has access to all routes
  if (userRole?.super_admin) {
    return <>{children}</>;
  }

  // Allow access to all authenticated users for development
  return <>{children}</>;
}
