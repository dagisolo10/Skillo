import { CheckCircle2, Clock, GraduationCap, XCircle } from "lucide-react";
import { SessionStatus } from "@/types/models";
import { ElementType } from "react";
import { cn } from "cn";


type SessionStatusMeta = {
    icon: ElementType;
    /** Tinted chip used for the status badge. */
    className: string;
    /** Icon tint used for timeline nodes and small accents. */
    accentClassName: string;
    /** Text-only tint used when the status sits inside another surface. */
    textClassName: string;
};

export const SESSION_STATUS_META: Record<SessionStatus, SessionStatusMeta> = {
    PENDING: {
        icon: Clock,
        className: "border-amber-500/30 bg-amber-500/10 text-amber-600",
        accentClassName: "bg-amber-500/15 text-amber-600",
        textClassName: "text-amber-600",
    },
    ACTIVE: {
        icon: CheckCircle2,
        className: "border-success/30 bg-success/10 text-success",
        accentClassName: "bg-success/15 text-success",
        textClassName: "text-success",
    },
    COMPLETED: {
        icon: GraduationCap,
        className: "border-foreground/20 bg-muted text-muted-foreground",
        accentClassName: "bg-muted text-muted-foreground",
        textClassName: "text-muted-foreground",
    },
    CANCELLED: {
        icon: XCircle,
        className: "border-destructive/30 bg-destructive/10 text-destructive",
        accentClassName: "bg-destructive/15 text-destructive",
        textClassName: "text-destructive",
    },
};

export function SessionStatusBadge({ status, className }: { status: SessionStatus; className?: string }) {
    const meta = SESSION_STATUS_META[status];
    const Icon = meta.icon;

    return (
        <span className={cn("inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] font-black uppercase", meta.className, className)}>
            <Icon size={11} />
            {status}
        </span>
    );
}
