import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FlowProvider } from "./contexts/FlowContext";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
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
import AIAssistant from "./pages/ai-assistant";

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
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/" element={
        <PrivateRoute>
          <FlowSelection />
        </PrivateRoute>
      } />
      <Route path="/flow-selection" element={
        <PrivateRoute>
          <FlowSelection />
        </PrivateRoute>
      } />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/ai-assistant" element={
        <PrivateRoute>
          <AIAssistant />
        </PrivateRoute>
      } />
      <Route path="/staff" element={
        <PrivateRoute>
          <Staff />
        </PrivateRoute>
      } />
      <Route path="/patients" element={
        <PrivateRoute>
          <Patients />
        </PrivateRoute>
      } />
      <Route path="/time-clock" element={
        <PrivateRoute>
          <TimeClock />
        </PrivateRoute>
      } />
      <Route path="/records" element={
        <PrivateRoute>
          <Records />
        </PrivateRoute>
      } />
      <Route path="/medical-exams" element={
        <PrivateRoute>
          <MedicalExams />
        </PrivateRoute>
      } />
      <Route path="/inventory" element={
        <PrivateRoute>
          <Inventory />
        </PrivateRoute>
      } />
      <Route path="/inventory/:type" element={
        <PrivateRoute>
          <InventoryType />
        </PrivateRoute>
      } />
      <Route path="/procedures" element={
        <PrivateRoute>
          <Procedures />
        </PrivateRoute>
      } />
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
