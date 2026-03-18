import { motion } from "framer-motion";

const activities = [
  { action: "Salary updated", target: "Sarah Chen", detail: "$140,000 → $145,000", time: "2h ago", type: "update" },
  { action: "New hire", target: "David Kim", detail: "Engineering · Frontend Developer", time: "1d ago", type: "create" },
  { action: "Leave approved", target: "Marcus Johnson", detail: "Annual · 5 days", time: "2d ago", type: "approve" },
  { action: "Performance review", target: "Emma Thompson", detail: "Q4 2025 · Exceeds expectations", time: "3d ago", type: "review" },
  { action: "Departure", target: "Ryan Mitchell", detail: "Engineering · Last day: Mar 15", time: "3d ago", type: "departure" },
];

const typeColors: Record<string, string> = {
  update: "bg-blue-500",
  create: "bg-emerald-500",
  approve: "bg-primary",
  review: "bg-amber-500",
  departure: "bg-red-400",
};

export function RecentActivity() {
  return (
    <div className="sphere-card">
      <div className="px-5 py-4 border-b">
        <h2 className="text-[14px] font-semibold text-foreground tracking-tight-ui">Recent Activity</h2>
      </div>
      <div className="divide-y">
        {activities.map((activity, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="px-5 py-3.5 flex items-start gap-3 hover:bg-accent/50 transition-colors"
          >
            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${typeColors[activity.type]}`} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-foreground">
                <span className="font-medium">{activity.action}</span>
                {" · "}
                <span>{activity.target}</span>
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{activity.detail}</p>
            </div>
            <span className="text-[11px] text-muted-foreground shrink-0">{activity.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
