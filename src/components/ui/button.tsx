import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "danger"
  size?: "default" | "sm" | "lg"
}

export function buttonStyles({
  className,
  variant = "default",
  size = "default",
}: {
  className?: string
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
} = {}) {
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap border-[3px] text-sm font-black uppercase tracking-[0.14em] transition duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7de7ff]/50 disabled:pointer-events-none disabled:opacity-50",
    {
      "rounded-[1.15rem] border-[#171717] bg-[#171717] text-[#fff7c5] shadow-[5px_5px_0_#171717] hover:bg-[#2d2d2d] dark:border-[#171717] dark:bg-[#171717] dark:text-[#fff7c5] dark:shadow-[5px_5px_0_#000000]": variant === "default",
      "rounded-[1.15rem] border-[#171717] bg-[#fffdf5] text-[#171717] shadow-[5px_5px_0_#171717] hover:bg-[#ffe75c] dark:border-[#f8f4ea] dark:bg-[#f8f4ea] dark:text-[#171717] dark:shadow-[5px_5px_0_#000000]": variant === "outline",
      "rounded-[1.15rem] border-transparent bg-transparent text-[#171717] shadow-none hover:bg-black/5 dark:text-[#f8f4ea] dark:hover:bg-white/8": variant === "ghost",
      "border-0 bg-transparent p-0 normal-case tracking-normal shadow-none underline decoration-[3px] underline-offset-4 hover:no-underline": variant === "link",
      "rounded-[1.15rem] border-[#171717] bg-[#ff8bc2] text-[#171717] shadow-[5px_5px_0_#171717] hover:bg-[#ffa46f] dark:border-[#171717] dark:bg-[#ff8bc2] dark:text-[#171717] dark:shadow-[5px_5px_0_#000000]": variant === "danger",
      "h-11 px-6 py-2": size === "default",
      "h-9 rounded-[1rem] px-4 text-[11px]": size === "sm",
      "h-12 px-8 text-sm": size === "lg",
    },
    className
  )
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonStyles({ className, variant, size })}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
