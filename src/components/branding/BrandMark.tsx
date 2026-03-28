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
        "relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[20px]",
        "bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.92),rgba(223,235,255,0.9)_34%,rgba(182,213,255,0.98)_68%,rgba(123,165,235,1)_100%)]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_30px_rgba(109,144,204,0.22)]",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-[7px] rounded-[16px] border border-white/78 bg-white/42 backdrop-blur-xl",
          ringClassName
        )}
      />
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <span
          className={cn(
            "absolute h-[20px] w-[6px] rounded-full bg-[#1f3e74]",
            crossClassName
          )}
        />
        <span
          className={cn(
            "absolute h-[6px] w-[20px] rounded-full bg-[#1f3e74]",
            crossClassName
          )}
        />
        <span
          className={cn(
            "absolute right-[10px] top-[10px] h-[6px] w-[6px] rounded-full bg-[#ff935f] shadow-[0_0_0_3px_rgba(255,255,255,0.56)]",
            dotClassName
          )}
        />
      </div>
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
        <p className={cn("text-xs uppercase tracking-[0.32em] text-[#68779b]", brandClassName)}>Medify</p>
        {label ? <p className={cn("text-base font-semibold text-[#24304d]", labelClassName)}>{label}</p> : null}
      </div>
    </div>
  );
}
