import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Building2,
  DollarSign,
  BarChart3,
  Settings,
  UserPlus,
  ClipboardList,
  UserCog,
  UserCheck,
  LogOut,
  Clock,
  ListTodo,
  Wallet,
  Package,
  Warehouse,
  TrendingUp,
  User,
  FileText,
  Calculator,
  Receipt,
  Target,
  Ticket,
  Shield,
  ChevronDown,
  ChevronRight,
  Handshake,
  CreditCard,
  PiggyBank,
  Scale,
  TrendingDown,
  FileSpreadsheet,
  Search,
  Maximize2,
  Minimize2
} from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { useState } from "react";

// Organized navigation groups
const navigationGroups = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/" },
      { label: "Reports", icon: BarChart3, href: "/reports" },
      { label: "Audit", icon: Shield, href: "/audit" }
    ]
  },
  {
    title: "HR Management",
    items: [
      { label: "Employees", icon: Users, href: "/employees" },
      { label: "Attendance", icon: Clock, href: "/attendance" },
      { label: "Tasks", icon: ListTodo, href: "/tasks" },
      { label: "Recruitment", icon: UserPlus, href: "/recruitment" },
      { label: "Onboarding", icon: ClipboardList, href: "/onboarding" },
      { label: "Leave", icon: CalendarDays, href: "/leave" },
      { label: "Departments", icon: Building2, href: "/departments" }
    ]
  },
  {
    title: "Payroll & Benefits",
    items: [
      { label: "Salary", icon: Wallet, href: "/salary" },
      { label: "Payroll", icon: DollarSign, href: "/payroll" },
      { label: "Vouchers", icon: Ticket, href: "/vouchers" }
    ]
  },
  {
    title: "Accounting",
    items: [
      { label: "Accounting", icon: Calculator, href: "/accounting" },
      { label: "Chart of Accounts", icon: Scale, href: "/chart-of-accounts" },
      { label: "Journal Entries", icon: Receipt, href: "/journal-entries" },
      { label: "Trial Balance", icon: BarChart3, href: "/trial-balance" }
    ]
  },
  {
    title: "Budget Management",
    items: [
      { label: "Budget", icon: Target, href: "/budget" },
      { label: "Budget Planning", icon: Calculator, href: "/budget-planning" },
      { label: "Budget Tracking", icon: Wallet, href: "/budget-tracking" },
      { label: "Budget Variance", icon: TrendingDown, href: "/budget-variance" }
    ]
  },
  {
    title: "CRM",
    items: [
      { label: "Customers", icon: User, href: "/customers" },
      { label: "Suppliers", icon: Building2, href: "/suppliers" },
      { label: "Invoices", icon: FileText, href: "/invoices" }
    ]
  },
  {
    title: "Inventory",
    items: [
      { label: "Inventory", icon: Package, href: "/inventory" },
      { label: "Warehouses", icon: Warehouse, href: "/warehouses" },
      { label: "Stock Management", icon: TrendingUp, href: "/stock-management" }
    ]
  }
];

const adminItems = [
  { label: "Register User", icon: UserCog, href: "/register-user" },
  { label: "Register Employee", icon: UserCheck, href: "/register-employee" },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Main"]);

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => {
      // If clicking on already expanded group, close it
      if (prev.includes(groupTitle)) {
        return prev.filter(g => g !== groupTitle);
      }
      // Otherwise, close all other groups and open only this one
      return [groupTitle];
    });
  };

  const expandAll = () => {
    const allGroupTitles = navigationGroups.map(g => g.title);
    setExpandedGroups(allGroupTitles);
  };

  const collapseAll = () => {
    setExpandedGroups([]);
  };

  const isAllExpanded = expandedGroups.length === navigationGroups.length;
  const isAnyExpanded = expandedGroups.length > 0;

  const renderNavItem = (item: any) => {
    const active = location.pathname === item.href;
    return (
      <Link key={item.href} to={item.href}>
        <motion.div
          whileHover={{ backgroundColor: "hsl(var(--accent))" }}
          whileTap={{ scale: 0.98 }}
          className={`relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-150 ${
            active
              ? "text-foreground font-medium bg-accent"
              : "text-muted-foreground"
          }`}
        >
          {active && (
            <motion.div
              layoutId="nav-pill"
              className="absolute left-0 w-1 h-4 bg-primary rounded-r-full"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <item.icon size={18} strokeWidth={active ? 2 : 1.5} />
          <span className="text-[13px] tracking-tight-ui">{item.label}</span>
        </motion.div>
      </Link>
    );
  };

  const renderNavigationGroup = (group: typeof navigationGroups[0]) => {
    const isExpanded = expandedGroups.includes(group.title);
    const hasActiveRoute = group.items.some(item => location.pathname === item.href);

    return (
      <div key={group.title} className="mb-2">
        {/* Group Header */}
        <button
          onClick={() => toggleGroup(group.title)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-150 ${
            hasActiveRoute
              ? "text-foreground font-medium bg-accent/50"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
          }`}
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            {group.title}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={14} />
          </motion.div>
        </button>

        {/* Group Items */}
        <motion.div
          initial={false}
          animate={{ 
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="mt-1 space-y-0.5">
            {group.items.map(renderNavItem)}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <aside className="w-[240px] h-full border-r bg-card flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">S</span>
          </div>
          <span className="text-[15px] font-semibold tracking-tight-ui text-foreground">
            Sphere HR
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {/* Expand/Collapse All Controls */}
        <div className="mb-3 flex gap-1">
          <button
            onClick={expandAll}
            disabled={isAllExpanded}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
              isAllExpanded
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-accent/50 text-foreground hover:bg-accent"
            }`}
          >
            <Maximize2 size={12} />
            <span>Expand All</span>
          </button>
          <button
            onClick={collapseAll}
            disabled={!isAnyExpanded}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
              !isAnyExpanded
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-accent/50 text-foreground hover:bg-accent"
            }`}
          >
            <Minimize2 size={12} />
            <span>Collapse All</span>
          </button>
        </div>

        {navigationGroups.map(renderNavigationGroup)}

        {/* Admin section */}
        {user?.role === "admin" && (
          <div className="mt-4">
            <div className="mb-2">
              <button
                onClick={() => toggleGroup("Administration")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-150 ${
                  expandedGroups.includes("Administration")
                    ? "text-foreground font-medium bg-accent/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                }`}
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Administration
                </span>
                <motion.div
                  animate={{ rotate: expandedGroups.includes("Administration") ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight size={14} />
                </motion.div>
              </button>
            </div>
            <motion.div
              initial={false}
              animate={{ 
                height: expandedGroups.includes("Administration") ? "auto" : 0,
                opacity: expandedGroups.includes("Administration") ? 1 : 0
              }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-0.5">
                {adminItems.map(renderNavItem)}
              </div>
            </motion.div>
          </div>
        )}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-2">
        <Link to="/settings">
          <motion.div
            whileHover={{ backgroundColor: "hsl(var(--accent))" }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-muted-foreground transition-colors duration-150"
          >
            <Settings size={18} strokeWidth={1.5} />
            <span className="text-[13px] tracking-tight-ui">Settings</span>
          </motion.div>
        </Link>

        <div className="mx-1 p-3 rounded-lg bg-accent border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">
                {user?.name?.split(" ").map((n) => n[0]).join("") || "U"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-foreground truncate">{user?.name || "User"}</p>
              <p className="text-[11px] text-muted-foreground truncate capitalize">{user?.role || "—"}</p>
            </div>
            <button
              onClick={logout}
              className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
