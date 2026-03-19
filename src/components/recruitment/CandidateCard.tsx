import { motion } from "framer-motion";
import { Star, ChevronRight } from "lucide-react";
import { type Candidate, type PipelineStage } from "@/data/mockData";

const sourceLabels: Record<string, string> = {
  linkedin: "LinkedIn", referral: "Referral", "careers-page": "Careers Page", indeed: "Indeed", other: "Other",
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < rating ? "fill-amber-400 text-amber-400" : "text-border"} />
      ))}
    </div>
  );
}

interface CandidateCardProps {
  candidate: Candidate;
  onClick: (candidate: Candidate) => void;
}

export function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="p-3 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onClick(candidate)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-semibold text-primary">
              {candidate.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-foreground truncate">{candidate.name}</p>
            <p className="text-[11px] text-muted-foreground truncate">{candidate.role}</p>
          </div>
        </div>
        <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
      </div>
      <div className="flex items-center justify-between">
        <RatingStars rating={candidate.rating} />
        <span className="text-[10px] text-muted-foreground">
          {sourceLabels[candidate.source]}
        </span>
      </div>
    </motion.div>
  );
}