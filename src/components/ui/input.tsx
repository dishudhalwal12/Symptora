import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-[1.2rem] border-[3px] border-[#171717] bg-[#fffdf5] px-4 py-2 text-sm font-medium text-[#171717] shadow-[4px_4px_0_#171717] transition duration-150 file:border-0 file:bg-transparent file:text-sm file:font-semibold placeholder:text-[#6a6a6a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7de7ff]/45 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#f8f4ea] dark:bg-[#f8f4ea] dark:text-[#171717] dark:placeholder:text-[#6a6a6a] dark:shadow-[4px_4px_0_#000000]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
