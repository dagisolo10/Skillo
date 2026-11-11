import { cn } from "cn";
import { ReactNode } from "react";

interface EmptyStateProps {
    title: string;
    emoji?: string;
    action?: ReactNode;
    className?: string;
    description?: string;
}

export function EmptyState({ emoji = "🗂️", title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn("bg-card shadow-neo flex flex-col items-center gap-2 px-6 py-16 text-center", className)}>
            <span className="text-4xl">{emoji}</span>
            <p className="font-clash text-xl font-black">{title}</p>
            {description && <p className="text-muted-foreground mt-1 max-w-sm font-mono text-xs leading-relaxed">{description}</p>}
            {action && <div className="pt-3">{action}</div>}
        </div>
    );
}
