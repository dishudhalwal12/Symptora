import { cn } from "@/lib/utils";

export function LoadingPanel({
  className,
  lines = 4,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={cn("shell-card shimmer-surface rounded-[32px] p-6", className)}>
      <div className="space-y-4">
        <div className="h-3 w-28 rounded-full bg-black/20 dark:bg-black/20" />
        <div className="h-8 w-2/3 rounded-[1rem] bg-black/15 dark:bg-black/15" />
        <div className="space-y-3 pt-2">
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-14 rounded-[1.25rem] border-[3px] border-black/10 bg-white/45 dark:bg-white/45",
                index === lines - 1 ? "w-4/5" : "w-full"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
