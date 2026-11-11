import { cn } from "cn";
import { forwardRef, InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
    return <input ref={ref} {...props} className={cn("bg-card border-foreground shadow-neo-sm h-10 w-full border-2 px-3.5 py-2 text-xs font-medium outline-none disabled:opacity-60", className)} />;
});
