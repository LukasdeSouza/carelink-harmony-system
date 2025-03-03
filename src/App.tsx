
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { Toaster } from "@/components/ui/sonner";
import { FlowProvider } from "@/contexts/FlowContext";

import Login from "@/pages/Login";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import ResetPassword from "@/pages/ResetPassword";
import UpdatePassword from "@/pages/UpdatePassword";
import FlowSelection from "@/pages/flow-selection";
import DashboardPage from "@/pages/dashboard";
import SchedulePage from "@/pages/schedule";
import ProceduresPage from "@/pages/procedures";
import StaffPage from "@/pages/staff";
import PatientsPage from "@/pages/patients";
import RecordsPage from "@/pages/records";
import MedicalExamsPage from "@/pages/medical-exams";
import InventoryPage from "@/pages/inventory";
import InventoryTypePage from "@/pages/inventory/[type]";
import ProductsPage from "@/pages/inventory/products";
import FinancialPage from "@/pages/financial";
import TimeClockPage from "@/pages/time-clock";
import AIAssistantPage from "@/pages/ai-assistant";
import SettingsPage from "@/pages/settings";
import PermissionsPage from "@/pages/admin/permissions";

function App() {
  return (
    <FlowProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/flow-selection" element={<PrivateRoute><FlowSelection /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/schedule" element={<PrivateRoute><SchedulePage /></PrivateRoute>} />
          <Route path="/procedures" element={<PrivateRoute><ProceduresPage /></PrivateRoute>} />
          <Route path="/staff" element={<PrivateRoute><StaffPage /></PrivateRoute>} />
          <Route path="/patients" element={<PrivateRoute><PatientsPage /></PrivateRoute>} />
          <Route path="/records" element={<PrivateRoute><RecordsPage /></PrivateRoute>} />
          <Route path="/medical-exams" element={<PrivateRoute><MedicalExamsPage /></PrivateRoute>} />
          <Route path="/inventory" element={<PrivateRoute><InventoryPage /></PrivateRoute>} />
          <Route path="/inventory/:type" element={<PrivateRoute><InventoryTypePage /></PrivateRoute>} />
          <Route path="/inventory/products" element={<PrivateRoute><ProductsPage /></PrivateRoute>} />
          <Route path="/financial" element={<PrivateRoute><FinancialPage /></PrivateRoute>} />
          <Route path="/time-clock" element={<PrivateRoute><TimeClockPage /></PrivateRoute>} />
          <Route path="/ai-assistant" element={<PrivateRoute><AIAssistantPage /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
          <Route path="/admin/permissions" element={<PrivateRoute><PermissionsPage /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </Router>
    </FlowProvider>
  );
}

export default App;
