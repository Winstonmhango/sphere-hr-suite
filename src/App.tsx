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
import Salary from "./pages/Salary";
import Attendance from "./pages/Attendance";
import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import LoginPage from "./pages/LoginPage";
import RegisterUser from "./pages/RegisterUser";
import RegisterEmployee from "./pages/RegisterEmployee";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import Warehouses from "./pages/Warehouses";
import StockManagement from "./pages/StockManagement";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import Invoices from "./pages/Invoices";
import Accounting from "./pages/Accounting";
import ChartOfAccounts from "./pages/ChartOfAccounts";
import JournalEntries from "./pages/JournalEntries";
import TrialBalance from "./pages/TrialBalance";
import BudgetDashboard from "./pages/BudgetDashboard";
import BudgetPlanning from "./pages/BudgetPlanning";
import BudgetTracking from "./pages/BudgetTracking";
import BudgetVarianceAnalysis from "./pages/BudgetVarianceAnalysis";
import VoucherManagement from "./pages/VoucherManagement";
import AuditManagement from "./pages/AuditManagement";

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
            <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
            <Route path="/recruitment" element={<ProtectedRoute><Recruitment /></ProtectedRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/leave" element={<ProtectedRoute><Leave /></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
            <Route path="/salary" element={<ProtectedRoute><Salary /></ProtectedRoute>} />
            <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
            <Route path="/warehouses" element={<ProtectedRoute><Warehouses /></ProtectedRoute>} />
            <Route path="/stock-management" element={<ProtectedRoute><StockManagement /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
            <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
            <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
            <Route path="/accounting" element={<ProtectedRoute><Accounting /></ProtectedRoute>} />
            <Route path="/chart-of-accounts" element={<ProtectedRoute><ChartOfAccounts /></ProtectedRoute>} />
            <Route path="/journal-entries" element={<ProtectedRoute><JournalEntries /></ProtectedRoute>} />
            <Route path="/trial-balance" element={<ProtectedRoute><TrialBalance /></ProtectedRoute>} />
            <Route path="/budget" element={<ProtectedRoute><BudgetDashboard /></ProtectedRoute>} />
            <Route path="/budget-planning" element={<ProtectedRoute><BudgetPlanning /></ProtectedRoute>} />
            <Route path="/budget-tracking" element={<ProtectedRoute><BudgetTracking /></ProtectedRoute>} />
            <Route path="/budget-variance" element={<ProtectedRoute><BudgetVarianceAnalysis /></ProtectedRoute>} />
            <Route path="/vouchers" element={<ProtectedRoute><VoucherManagement /></ProtectedRoute>} />
            <Route path="/audit" element={<ProtectedRoute><AuditManagement /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/register-user" element={<ProtectedRoute><RegisterUser /></ProtectedRoute>} />
            <Route path="/register-employee" element={<ProtectedRoute><RegisterEmployee /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
