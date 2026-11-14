import { cn } from "cn";
import { forwardRef, InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
    { className, ...props },
    ref,
) {
    return (
        <input
            ref={ref}
            {...props}
            className={cn(
                "bg-card border-foreground shadow-neo-sm focus-visible:ring-primary h-10 w-full border-2 px-3.5 py-2 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-60",
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
                "border-foreground bg-card shadow-neo-sm placeholder:text-muted-foreground focus-visible:border-ring aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 focus-visible:ring-primary flex field-sizing-content min-h-16 w-full rounded-md border-2 p-2.5 text-xs font-medium shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
                className,
            )}
            {...props}
        />
    );
}
