"use client";

import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { AlertTriangle, RefreshCw } from "lucide-react";
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

/** Shared error block used by every query-backed page. */
export function ErrorBlock({ title, description, onRetry }: { title: string; description?: string; onRetry: () => void }) {
    return (
        <div className="bg-background flex min-h-screen w-full items-center justify-center p-6">
            <div className="bg-card shadow-neo w-full max-w-md space-y-4 p-8 text-center">
                <div className="shadow-neo-sm mx-auto flex h-12 w-12 items-center justify-center border-2 border-red-500 bg-red-500/10 text-red-500">
                    <AlertTriangle size={24} />
                </div>
                <h2 className="font-clash text-xl font-black">{title}</h2>
                {description && <p className="text-muted-foreground font-mono text-xs leading-relaxed">{description}</p>}
                <Button onClick={onRetry} className="mt-2 w-full gap-2">
                    <RefreshCw size={14} /> Retry
                </Button>
            </div>
        </div>
    );
}
