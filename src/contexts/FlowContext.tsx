
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type FlowType = 'clinical' | 'administrative' | null;
type UserRole = 'admin' | 'nurse' | 'receptionist';

interface FlowContextType {
  selectedFlow: FlowType;
  setSelectedFlow: (flow: FlowType) => void;
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [selectedFlow, setSelectedFlow] = useState<FlowType>(() => {
    const saved = localStorage.getItem('drfacil.flow');
    return saved ? (saved as FlowType) : null;
  });

  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Monitora o estado da autenticação
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Por enquanto, definimos como admin. Você deve adaptar isso para pegar o papel real do usuário
        setUserRole('admin');
      } else if (event === 'SIGNED_OUT') {
        setUserRole(null);
        setSelectedFlow(null);
        localStorage.removeItem('drfacil.flow');
      }
    });

    // Verifica o estado inicial da autenticação
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserRole('admin');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Persiste apenas o flow no localStorage
  useEffect(() => {
    if (selectedFlow) {
      localStorage.setItem('drfacil.flow', selectedFlow);
    } else {
      localStorage.removeItem('drfacil.flow');
    }
  }, [selectedFlow]);

  return (
    <FlowContext.Provider value={{ selectedFlow, setSelectedFlow, userRole, setUserRole }}>
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
