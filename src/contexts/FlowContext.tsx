
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExtendedUserRole, UserPermission, User } from '@/types/auth';

export type FlowType = 'clinical' | 'administrative' | null;
export type UserRole = 'admin' | 'nurse' | 'receptionist';

interface FlowContextType {
  selectedFlow: FlowType;
  setSelectedFlow: (flow: FlowType) => void;
  userRole: ExtendedUserRole | null;
  setUserRole: (role: ExtendedUserRole | null) => void;
  userPermissions: UserPermission | null;
  setUserPermissions: (permissions: UserPermission | null) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [selectedFlow, setSelectedFlow] = useState<FlowType>(() => {
    const saved = localStorage.getItem('drfacil.flow');
    return saved ? (saved as FlowType) : null;
  });

  const [userRole, setUserRole] = useState<ExtendedUserRole | null>(null);
  const [userPermissions, setUserPermissions] = useState<UserPermission | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Monitor authentication state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Get user role and permissions
        getUserRoleAndPermissions(session?.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUserRole(null);
        setUserPermissions(null);
        setCurrentUser(null);
        setSelectedFlow(null);
        localStorage.removeItem('drfacil.flow');
      }
    });

    // Check initial authentication state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        getUserRoleAndPermissions(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Get user role and permissions
  const getUserRoleAndPermissions = async (userId: string | undefined) => {
    if (!userId) return;
    
    try {
      // For development purposes, default to super admin with all permissions
      // This ensures routes still work even if the database tables don't exist yet
      const isSuperAdmin = true;
      const userRoleValue = 'admin' as UserRole;
      
      // Set current user
      const mockUser: User = {
        id: userId,
        email: "admin@drfacil.com.br",
        name: "Administrador Super",
        role: userRoleValue,
        super_admin: isSuperAdmin,
        subscription: {
          active: true,
          expiresAt: "2025-12-31T23:59:59Z",
          plan: "premium"
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      setCurrentUser(mockUser);
      
      setUserRole({ 
        role: userRoleValue, 
        super_admin: isSuperAdmin,
        userId: userId
      });

      // Super admin has access to all routes
      setUserPermissions({ 
        routes: ['*'],
        userId: userId
      });
      
      /* 
      // This code should be used when the database tables are set up
      // Get user information
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, name, role, super_admin, subscription, created_at, last_login')
        .eq('id', userId)
        .single();
        
      if (userError) throw userError;
      
      setCurrentUser(userData as User);
      
      const userRoleValue = userData.role as UserRole;
      const isSuperAdmin = userData.super_admin || false;
      
      setUserRole({ 
        role: userRoleValue, 
        super_admin: isSuperAdmin,
        userId: userId,
        subscription: userData.subscription
      });
      
      // If not super admin, get user-specific permissions
      if (!isSuperAdmin) {
        // First try to get user-specific permissions
        const { data: userPermissionsData, error: userPermissionsError } = await supabase
          .from('user_permissions')
          .select(`
            permission_id,
            permission:permissions(route)
          `)
          .eq('user_id', userId);
          
        if (userPermissionsError) throw userPermissionsError;
        
        if (userPermissionsData && userPermissionsData.length > 0) {
          // User has specific permissions
          const routes = userPermissionsData.map(p => p.permission?.route).filter(Boolean) as string[];
          setUserPermissions({ routes, userId });
        } else {
          // Fall back to role-based permissions
          const { data: permissionsData, error: permissionsError } = await supabase
            .from('role_permissions')
            .select(`
              permission_id,
              permission:permissions(route)
            `)
            .eq('role_id', userRoleValue);
            
          if (permissionsError) throw permissionsError;
          
          const routes = permissionsData.map(p => p.permission?.route).filter(Boolean) as string[];
          setUserPermissions({ routes, userId });
        }
      } else {
        // Super admin has access to all routes
        setUserPermissions({ routes: ['*'], userId });
      }
      */
    } catch (error) {
      console.error('Error fetching user role and permissions:', error);
      // Default to admin with all permissions for now
      setUserRole({ role: 'admin', super_admin: true, userId });
      setUserPermissions({ routes: ['*'], userId });
    }
  };

  // Persist flow in localStorage
  useEffect(() => {
    if (selectedFlow) {
      localStorage.setItem('drfacil.flow', selectedFlow);
    } else {
      localStorage.removeItem('drfacil.flow');
    }
  }, [selectedFlow]);

  const value = {
    selectedFlow,
    setSelectedFlow,
    userRole,
    setUserRole,
    userPermissions,
    setUserPermissions,
    currentUser,
    setCurrentUser
  };

  return (
    <FlowContext.Provider value={value}>
      {children}
    </FlowContext.Provider>
  );
}

export function useFlow() {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
}
