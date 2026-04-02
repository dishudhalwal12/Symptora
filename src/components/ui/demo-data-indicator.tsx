import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export function DemoDataIndicator({
  title = "Preview data active",
  description = "Real data is still connected. These realistic values are filling empty areas so the screen stays complete for demos and recordings.",
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[26px] border border-white/80 bg-[linear-gradient(155deg,rgba(255,255,255,0.8),rgba(236,245,255,0.68))] px-4 py-4 text-[#24304d] shadow-[10px_10px_24px_rgba(167,179,214,0.12)] dark:border-[#263655] dark:bg-[linear-gradient(155deg,rgba(16,26,44,0.94),rgba(11,18,31,0.88))] dark:text-[#edf3ff]",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="medify-orb mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px]">
          <Sparkles className="h-4 w-4 text-[#24304d]" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#68779b] dark:text-[#9db0d5]">
            {title}
          </p>
          <p className="mt-2 text-sm leading-7 text-[#52638b] dark:text-[#b8c7e2]">{description}</p>
        </div>
      </div>
    </div>
  );
}
