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
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Employees", icon: Users, href: "/employees" },
  { label: "Recruitment", icon: UserPlus, href: "/recruitment" },
  { label: "Leave", icon: CalendarDays, href: "/leave" },
  { label: "Departments", icon: Building2, href: "/departments" },
  { label: "Payroll", icon: DollarSign, href: "/payroll" },
  { label: "Reports", icon: BarChart3, href: "/reports" },
];

export function Sidebar() {
  const location = useLocation();

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
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
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
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4">
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

        <div className="mt-3 mx-1 p-3 rounded-lg bg-accent border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">LP</span>
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-foreground truncate">Lisa Park</p>
              <p className="text-[11px] text-muted-foreground truncate">HR Business Partner</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
