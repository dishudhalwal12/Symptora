import { RiskLevel } from "@/types";
import { cn } from "@/lib/utils";

const STYLES: Record<RiskLevel, string> = {
  Low: "border-[3px] border-[#171717] bg-[#b6f36d] text-[#171717]",
  Moderate: "border-[3px] border-[#171717] bg-[#ffe75c] text-[#171717]",
  High: "border-[3px] border-[#171717] bg-[#ff8bc2] text-[#171717]",
};

export function StatusPill({
  label,
  level,
  className,
}: {
  label?: string;
  level: RiskLevel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] shadow-[3px_3px_0_#171717]",
        STYLES[level],
        className
      )}
    >
      {label || `${level} risk`}
    </span>
  );
}
