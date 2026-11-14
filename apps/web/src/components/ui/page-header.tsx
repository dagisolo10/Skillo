"use client";

import { cn } from "cn";
import { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    eyebrow: string;
    action?: ReactNode;
    description?: string;
    eyebrowClassName?: string;
}

export function PageHeader({ eyebrow, eyebrowClassName, title, description, action }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
                <span className={cn("shadow-neo-sm inline-block px-2.5 py-0.5 font-mono text-[10px] font-black uppercase", eyebrowClassName)}>{eyebrow}</span>
                <h1 className="font-clash text-3xl font-black tracking-tight sm:text-4xl">
                    {title}
                    <span className="text-primary">.</span>
                </h1>
                {description && <p className="text-muted-foreground max-w-2xl font-medium">{description}</p>}
            </div>

            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}
