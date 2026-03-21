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
} from "lucide-react";
import { useAuth } from "@/auth/AuthContext";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Employees", icon: Users, href: "/employees" },
  { label: "Recruitment", icon: UserPlus, href: "/recruitment" },
  { label: "Onboarding", icon: ClipboardList, href: "/onboarding" },
  { label: "Leave", icon: CalendarDays, href: "/leave" },
  { label: "Departments", icon: Building2, href: "/departments" },
  { label: "Payroll", icon: DollarSign, href: "/payroll" },
  { label: "Reports", icon: BarChart3, href: "/reports" },
];

const adminItems = [
  { label: "Register User", icon: UserCog, href: "/register-user" },
  { label: "Register Employee", icon: UserCheck, href: "/register-employee" },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const renderNavItem = (item: typeof navItems[0]) => {
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
        {navItems.map(renderNavItem)}

        {/* Admin section */}
        {user?.role === "admin" && (
          <>
            <div className="pt-4 pb-1 px-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Administration
              </span>
            </div>
            {adminItems.map(renderNavItem)}
          </>
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
