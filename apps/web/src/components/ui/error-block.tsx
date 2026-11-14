import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBlockProps {
    title: string;
    onRetry: () => void;
    description?: string;
}

export function ErrorBlock({ title, description, onRetry }: ErrorBlockProps) {
    return (
        <div className="bg-card shadow-neo w-full space-y-4 p-8 text-center">
            <div className="shadow-neo-sm border-destructive bg-destructive/10 text-destructive mx-auto flex h-12 w-12 items-center justify-center border-2">
                <AlertTriangle size={24} />
            </div>
            <h2 className="font-clash text-xl font-black">{title}</h2>
            {description && <p className="text-muted-foreground font-mono text-xs leading-relaxed">{description}</p>}
            <Button onClick={onRetry} size={"lg"} className="px-12">
                <RefreshCw size={14} /> Retry
            </Button>
        </div>
    );
}
