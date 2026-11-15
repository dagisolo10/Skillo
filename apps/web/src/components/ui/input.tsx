import { cn } from "cn";
import { forwardRef, InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
    return (
        <input
            ref={ref}
            {...props}
            className={cn(
                "bg-card border-foreground shadow-neo-sm focus-visible:border-primary h-10 w-full border-2 px-3.5 py-2 text-xs font-medium transition-all duration-300 outline-none disabled:opacity-60",
                className,
            )}
        />
    );
});

export function Label({ className, ...props }: React.ComponentProps<"label">) {
    return (
        <label
            data-slot="label"
            className={cn(
                "flex items-center gap-2 font-mono text-sm leading-none font-bold select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                className,
            )}
            {...props}
        />
    );
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                "border-foreground bg-card shadow-neo-sm placeholder:text-muted-foreground focus-visible:border-primary aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex field-sizing-content min-h-16 w-full rounded-md border-2 p-2.5 text-xs font-medium shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-1 md:text-sm",
                className,
            )}
            {...props}
        />
    );
}
