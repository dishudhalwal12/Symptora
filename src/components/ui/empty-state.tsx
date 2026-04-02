import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="shell-card rise-in flex min-h-[240px] flex-col items-center justify-center px-6 py-10 text-center">
      {Icon ? (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[1.2rem] border-[3px] border-[#171717] bg-[#171717] text-[#fff7c5] shadow-[5px_5px_0_#171717]">
          <Icon className="h-6 w-6" />
        </div>
      ) : null}
      <h3 className="text-2xl font-semibold text-gray-950">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-7 text-[#4d4d4d]">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
