
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FlowProvider } from "./contexts/FlowContext";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Dashboard from "./pages/dashboard";
import TimeClock from "./pages/time-clock";
import Records from "./pages/records";
import Staff from "./pages/staff";
import Patients from "./pages/patients";
import MedicalExams from "./pages/medical-exams";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/inventory";
import InventoryType from "./pages/inventory/[type]";
import Procedures from "./pages/procedures";
import FlowSelection from "./pages/flow-selection";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<FlowSelection />} />
      <Route path="/flow-selection" element={<FlowSelection />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/staff" element={<Staff />} />
      <Route path="/patients" element={<Patients />} />
      <Route path="/time-clock" element={<TimeClock />} />
      <Route path="/records" element={<Records />} />
      <Route path="/medical-exams" element={<MedicalExams />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/inventory/:type" element={<InventoryType />} />
      <Route path="/procedures" element={<Procedures />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <FlowProvider>
          <div className="min-h-screen bg-background font-inter">
            <Toaster />
            <Sonner />
            <AppRoutes />
          </div>
        </FlowProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
