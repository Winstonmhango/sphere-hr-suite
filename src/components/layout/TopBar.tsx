import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-[15px] font-semibold tracking-tight-ui text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-[12px] text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <Input
            placeholder="Search..."
            className="h-8 w-[200px] pl-8 text-[13px] bg-accent border-none"
          />
        </div>
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
          <Bell size={16} className="text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
}
