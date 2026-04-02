import { AlertTriangle, LucideIcon, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export function RecoveryState({
  title,
  description,
  actionLabel = "Try again",
  onAction,
  icon: Icon = AlertTriangle,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
}) {
  return (
    <div className="rise-in rounded-[2rem] border-[3px] border-[#171717] bg-[#ffe75c] p-6 text-[#171717] shadow-[8px_8px_0_#171717]">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-[1rem] border-[3px] border-[#171717] bg-[#fffdf5] p-2 text-[#171717] shadow-[4px_4px_0_#171717]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#3d3d3d]">{description}</p>
          {onAction ? (
            <Button className="mt-4" variant="outline" onClick={onAction}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              {actionLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
