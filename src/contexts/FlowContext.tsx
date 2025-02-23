
import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('drfacil.user.role');
    return saved ? (saved as UserRole) : null;
  });

  useEffect(() => {
    if (selectedFlow) {
      localStorage.setItem('drfacil.flow', selectedFlow);
    } else {
      localStorage.removeItem('drfacil.flow');
    }
  }, [selectedFlow]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('drfacil.user.role', userRole);
    } else {
      localStorage.removeItem('drfacil.user.role');
    }
  }, [userRole]);

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
