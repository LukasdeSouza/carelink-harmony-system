
import React, { createContext, useContext, useState } from 'react';

type FlowType = 'clinical' | 'administrative' | null;

interface FlowContextType {
  selectedFlow: FlowType;
  setSelectedFlow: (flow: FlowType) => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [selectedFlow, setSelectedFlow] = useState<FlowType>(null);

  return (
    <FlowContext.Provider value={{ selectedFlow, setSelectedFlow }}>
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
