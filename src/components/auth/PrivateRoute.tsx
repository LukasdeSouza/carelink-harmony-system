
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useFlow } from "@/contexts/FlowContext";
import { toast } from "sonner";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userPermissions, userRole } = useFlow();
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1]; // Get first path segment

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Adicionar um timeout para evitar bloqueio infinito
        const authPromise = supabase.auth.getSession();
        
        // Criar um timeout de 5 segundos
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error("Tempo limite excedido ao verificar autenticação"));
          }, 5000);
        });
        
        // Usar Promise.race para evitar esperar indefinidamente
        const result = await Promise.race([
          authPromise,
          timeoutPromise
        ]) as { data: { session: any } } | Error;
        
        if (result instanceof Error) {
          console.error("Erro de timeout:", result);
          // Em modo de desenvolvimento, prosseguir como autenticado para testes
          if (import.meta.env.DEV) {
            console.log("Modo de desenvolvimento: simulando usuário autenticado");
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            toast.error("Erro de conexão ao servidor. Tente novamente mais tarde.");
          }
        } else {
          setIsAuthenticated(!!result.data.session);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        // Em modo de desenvolvimento, prosseguir como autenticado para testes
        if (import.meta.env.DEV) {
          console.log("Modo de desenvolvimento: simulando usuário autenticado");
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          toast.error("Erro ao verificar autenticação. Tente novamente mais tarde.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Ainda mantemos a inscrição para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Modificar o componente de loading para mostrar um feedback visual melhor
  if (isLoading || isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Verificando autenticação...</p>
      </div>
    );
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
