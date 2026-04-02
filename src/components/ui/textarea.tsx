import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[120px] w-full rounded-[1.4rem] border-[3px] border-[#171717] bg-[#fffdf5] px-4 py-3 text-sm font-medium text-[#171717] shadow-[4px_4px_0_#171717] outline-none transition duration-150 placeholder:text-[#6a6a6a] focus:ring-4 focus:ring-[#7de7ff]/45 dark:border-[#f8f4ea] dark:bg-[#f8f4ea] dark:text-[#171717] dark:placeholder:text-[#6a6a6a] dark:shadow-[4px_4px_0_#000000]",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
