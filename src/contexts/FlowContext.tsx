
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExtendedUserRole, UserPermission } from '@/types/auth';

export type FlowType = 'clinical' | 'administrative' | null;
export type UserRole = 'admin' | 'nurse' | 'receptionist';

interface FlowContextType {
  selectedFlow: FlowType;
  setSelectedFlow: (flow: FlowType) => void;
  userRole: ExtendedUserRole | null;
  setUserRole: (role: ExtendedUserRole | null) => void;
  userPermissions: UserPermission | null;
  setUserPermissions: (permissions: UserPermission | null) => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [selectedFlow, setSelectedFlow] = useState<FlowType>(() => {
    const saved = localStorage.getItem('drfacil.flow');
    return saved ? (saved as FlowType) : null;
  });

  const [userRole, setUserRole] = useState<ExtendedUserRole | null>(null);
  const [userPermissions, setUserPermissions] = useState<UserPermission | null>(null);

  // Monitor authentication state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Get user role and permissions
        getUserRoleAndPermissions(session?.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUserRole(null);
        setUserPermissions(null);
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
      // Get user role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, super_admin')
        .eq('id', userId)
        .single();
        
      if (userError) throw userError;
      
      const userRoleValue = userData.role as UserRole;
      const isSuperAdmin = userData.super_admin || false;
      
      setUserRole({ 
        ...userRoleValue, 
        super_admin: isSuperAdmin 
      });
      
      // If not super admin, get permissions
      if (!isSuperAdmin) {
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('role_permissions')
          .select(`
            permission_id,
            permission:permissions(route)
          `)
          .eq('role_id', userRoleValue);
          
        if (permissionsError) throw permissionsError;
        
        const routes = permissionsData.map(p => p.permission?.route).filter(Boolean) as string[];
        setUserPermissions({ routes });
      } else {
        // Super admin has access to all routes
        setUserPermissions({ routes: ['*'] });
      }
    } catch (error) {
      console.error('Error fetching user role and permissions:', error);
      // Default to admin without permissions
      setUserRole('admin');
      setUserPermissions({ routes: [] });
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
    setUserPermissions
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
