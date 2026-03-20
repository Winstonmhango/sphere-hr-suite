import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/auth/AuthContext";
import { ProtectedRoute } from "@/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Recruitment from "./pages/Recruitment";
import Onboarding from "./pages/Onboarding";
import Leave from "./pages/Leave";
import Departments from "./pages/Departments";
import Payroll from "./pages/Payroll";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
            <Route path="/recruitment" element={<ProtectedRoute><Recruitment /></ProtectedRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/leave" element={<ProtectedRoute><Leave /></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
            <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
