import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  ringClassName?: string;
  crossClassName?: string;
  dotClassName?: string;
};

export function BrandMark({
  className,
  ringClassName,
  crossClassName,
  dotClassName,
}: BrandMarkProps) {
  return (
    <div
      className={cn(
        "relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[1.2rem] border-[3px] border-[#171717] bg-[#ffe75c]",
        "shadow-[5px_5px_0_#171717]",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-[7px] rounded-[0.9rem] border-[2px] border-[#171717] bg-[#fffdf5]",
          ringClassName
        )}
      />
      <svg viewBox="0 0 64 64" className="relative z-10 h-full w-full p-2.5" aria-hidden="true">
        <path
          d="M12 34h11l5-10 5 16 6-11h13"
          fill="none"
          stroke="#171717"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5"
          className={cn(crossClassName)}
        />
        <circle
          cx="46"
          cy="19"
          r="4.5"
          fill="#ff8bc2"
          className={cn(dotClassName)}
        />
      </svg>
    </div>
  );
}

type BrandLockupProps = {
  label?: string;
  className?: string;
  brandClassName?: string;
  labelClassName?: string;
  markClassName?: string;
};

export function BrandLockup({
  label,
  className,
  brandClassName,
  labelClassName,
  markClassName,
}: BrandLockupProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <BrandMark className={markClassName} />
      <div>
        <p className={cn("text-xs font-black uppercase tracking-[0.32em] text-[#171717]", brandClassName)}>Symptora</p>
        {label ? <p className={cn("text-base font-semibold text-[#171717]", labelClassName)}>{label}</p> : null}
      </div>
    </div>
  );
}
