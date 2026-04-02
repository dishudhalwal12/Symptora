import { cn } from "@/lib/utils";

export function PageIntro({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("page-fade-in space-y-4", className)}>
      {eyebrow ? <p className="medify-pill">{eyebrow}</p> : null}
      <h2 className="max-w-4xl text-4xl font-semibold leading-[0.92] tracking-[-0.06em] text-[#171717] dark:text-[#f8f4ea] md:text-5xl xl:text-6xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-8 text-[#3f3f3f] dark:text-[#f1ead8] md:text-base">{description}</p>
    </div>
  );
}
