"use client";

import { SESSION_STATUS_META, SessionStatusBadge } from "@/components/sessions/session-status";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBlock } from "@/components/ui/error-block";
import { useAuth } from "@/contexts/auth-context";
import { useAcceptOrRejectSession, useGetSession } from "@/hooks/tan-stack/session";
import { SessionDetail, SessionStatus, SessionUser } from "@/types/models";
import { cn } from "cn";
import { formatDate } from "date-fns";
import { ArrowLeft, ArrowUpRight, Calendar, Check, CheckCircle2, Clock, Users, X } from "lucide-react";
import Link from "next/link";
import { ElementType } from "react";

const STATUS_BLURBS: Record<SessionStatus, string> = {
    PENDING: "Waiting for the mentor to accept this request. No credits move until both peers confirm.",
    ACTIVE: "Both peers confirmed this swap. The credit sits in escrow until the session completes.",
    COMPLETED: "This swap is done. The escrowed credit has been handed over to the mentor.",
    CANCELLED: "This session was cancelled and any escrowed credit was returned to the learner.",
};

export default function SessionDetailContent({ id }: { id: string }) {
    const { user, isLoading, isSignedIn } = useAuth();
    const sessionQuery = useGetSession(id);
    const acceptReject = useAcceptOrRejectSession();

    if (isLoading) {
        return <SessionDetailSkeleton />;
    }

    if (!isSignedIn) {
        return (
            <div className="bg-background flex min-h-screen w-full items-center justify-center p-6">
                <EmptyState
                    className="w-full max-w-md"
                    emoji="🔒"
                    title="Sign in to view this session"
                    description="Sessions are private to the two peers involved. Sign in to see yours."
                    action={
                        <Link href="/auth">
                            <Button className="shadow-neo-sm active-sink-sm px-6 text-sm font-bold">Sign in</Button>
                        </Link>
                    }
                />
            </div>
        );
    }

    if (sessionQuery.isPending) {
        return <SessionDetailSkeleton />;
    }

    if (sessionQuery.isError) {
        return (
            <div className="bg-background flex min-h-screen w-full items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <ErrorBlock title="Failed to load session" description={sessionQuery.error.message} onRetry={() => sessionQuery.refetch()} />
                </div>
            </div>
        );
    }

    const session = sessionQuery.data;

    if (!session) {
        return null;
    }

    // Defence in depth: even if a cache entry were ever keyed or seeded incorrectly, never render a
    // session whose peers don't include the signed-in user.
    if (session.mentorId !== user?.id && session.learnerId !== user?.id) {
        return (
            <div className="bg-background flex min-h-screen w-full items-center justify-center p-6">
                <EmptyState
                    className="w-full max-w-md"
                    emoji="🔒"
                    title="Session not found"
                    description="This session isn't one of yours."
                    action={
                        <Link href="/sessions">
                            <Button className="shadow-neo-sm active-sink-sm px-6 text-sm font-bold">Back to sessions</Button>
                        </Link>
                    }
                />
            </div>
        );
    }

    return <SessionView session={session} viewerId={user?.id} onAcceptOrReject={acceptReject} />;
}

function SessionView({ session, viewerId, onAcceptOrReject }: { session: SessionDetail; viewerId?: string; onAcceptOrReject: ReturnType<typeof useAcceptOrRejectSession> }) {
    const meta = SESSION_STATUS_META[session.status];
    const StatusIcon = meta.icon;
    const blurb = STATUS_BLURBS[session.status];

    const isMentor = session.mentorId === viewerId;
    const isLearner = session.learnerId === viewerId;
    const roleLabel = isMentor ? "You are the mentor" : isLearner ? "You are the learner" : "Participant";

    const timeline: { icon: ElementType; label: string; at: string; tone: TimelineTone }[] = [
        { icon: Clock, label: `Requested by ${session.learner.name}`, at: session.createdAt, tone: "muted" },
        ...(session.acceptedAt ? [{ icon: CheckCircle2, label: `Accepted by ${session.mentor.name}`, at: session.acceptedAt, tone: "success" as const }] : []),
    ];

    return (
        <div className="bg-background min-h-screen w-full p-6 lg:p-10">
            <div className="mx-auto max-w-7xl space-y-8">
                <Link href="/sessions" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 font-mono text-xs font-bold uppercase transition-colors">
                    <ArrowLeft size={14} /> Back to sessions
                </Link>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="bg-card shadow-neo space-y-8 p-6 lg:col-span-8 lg:p-8">
                        <div className="space-y-5">
                            <div className="flex flex-wrap items-center gap-3">
                                <SessionStatusBadge status={session.status} />
                                <span className="bg-secondary border-2 border-black px-2.5 py-1 font-mono text-[10px] font-black uppercase">{session.skill.category}</span>
                                <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase">
                                    <Users size={12} /> {roleLabel}
                                </span>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 space-y-2">
                                    <h1 className="font-clash text-4xl leading-none font-black sm:text-5xl">{session.skill.name}</h1>
                                    <Link
                                        href={`/skills/${session.skillId}`}
                                        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-mono text-xs font-bold uppercase underline underline-offset-4 transition-colors"
                                    >
                                        View skill <ArrowUpRight size={12} />
                                    </Link>
                                </div>
                                <span className="font-clash shrink-0 text-5xl leading-none sm:text-6xl">{session.skill.emoji}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <InfoTile icon={StatusIcon} label="Status" value={session.status} valueClassName={meta.textClassName} />
                            <InfoTile icon={Calendar} label="Requested" value={formatDate(session.createdAt, "d MMM yyyy")} />
                            <InfoTile icon={CheckCircle2} label="Accepted" value={session.acceptedAt ? formatDate(session.acceptedAt, "d MMM yyyy") : "Not yet"} />
                        </div>

                        <div className="space-y-4 border-t-2 border-black pt-6">
                            <h2 className="font-clash text-2xl font-black">Session timeline</h2>
                            <ol className="space-y-3">
                                {timeline.map((event) => (
                                    <TimelineRow key={event.label} icon={event.icon} label={event.label} at={event.at} tone={event.tone} />
                                ))}
                                {!session.acceptedAt && session.status === "PENDING" && <TimelineRow icon={Clock} label={`Waiting on ${session.mentor.name} to confirm`} tone="pending" />}
                            </ol>
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-4">
                        <div className="bg-card shadow-neo space-y-5 p-6">
                            <span className="text-muted-foreground block font-mono text-xs font-black tracking-wider uppercase">Participants</span>

                            <ParticipantRow role="Mentor" person={session.mentor} isYou={isMentor} />
                            <div className="border-t-2 border-black" />
                            <ParticipantRow role="Learner" person={session.learner} isYou={isLearner} />
                        </div>

                        <div className="shadow-neo space-y-3 p-6">
                            <SessionStatusBadge status={session.status} className="shadow-neo-sm" />
                            <p className="font-mono text-xs leading-relaxed font-bold">{blurb}</p>
                            <p className="font-mono text-[10px] leading-relaxed font-bold opacity-80">Every swap is one-on-one and costs 1 credit.</p>

                            {isMentor && session.status === "PENDING" && (
                                <div className="flex gap-2 pt-2">
                                    <Button size="sm" onClick={() => onAcceptOrReject.mutate({ id: session.id, action: "accept" })} disabled={onAcceptOrReject.isPending} className="flex-1 gap-1 text-xs font-bold">
                                        <Check size={12} /> Accept
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => onAcceptOrReject.mutate({ id: session.id, action: "reject" })} disabled={onAcceptOrReject.isPending} className="flex-1 gap-1 text-xs font-bold">
                                        <X size={12} /> Reject
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ParticipantRow({ role, person, isYou }: { role: string; person: SessionUser; isYou: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className="bg-primary shadow-neo-sm shrink-0 -rotate-2 p-1">
                <UserAvatar seed={person.avatarSeed} size={48} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-muted-foreground font-mono text-[9px] font-black tracking-wider uppercase">{role}</p>
                <p className="font-clash truncate text-base font-black">{person.name}</p>
                <p className="text-muted-foreground truncate font-mono text-[10px]">@{person.username}</p>
            </div>
            {isYou && <span className="bg-secondary shadow-neo-sm shrink-0 px-2 py-0.5 font-mono text-[9px] font-black uppercase">You</span>}
        </div>
    );
}

type TimelineTone = "muted" | "pending" | "success";

const TIMELINE_TONES: Record<TimelineTone, string> = {
    muted: "bg-muted text-foreground",
    pending: "bg-amber-500/15 text-amber-600",
    success: "bg-success/15 text-success",
};

function TimelineRow({ icon: Icon, label, at, tone }: { icon: ElementType; label: string; at?: string; tone: TimelineTone }) {
    return (
        <li className="flex items-start gap-3">
            <span className={cn("flex size-8 shrink-0 items-center justify-center border-2 border-black", TIMELINE_TONES[tone])}>
                <Icon size={14} />
            </span>
            <div className="min-w-0">
                <p className="font-mono text-xs font-bold">{label}</p>
                <p className="text-muted-foreground font-mono text-[10px]">{at ? formatDate(at, "d MMM yyyy, HH:mm") : "In progress"}</p>
            </div>
        </li>
    );
}

function InfoTile({ icon: Icon, label, value, valueClassName }: { icon: ElementType; label: string; value: string; valueClassName?: string }) {
    return (
        <div className="bg-muted/50 shadow-neo-sm flex items-center gap-3 p-3">
            <span className="bg-primary shadow-neo-sm flex size-9 shrink-0 items-center justify-center">
                <Icon size={16} />
            </span>
            <div className="min-w-0">
                <p className="text-muted-foreground font-mono text-[9px] font-black tracking-wider uppercase">{label}</p>
                <p className={cn("font-clash truncate text-xl font-bold", valueClassName)}>{value}</p>
            </div>
        </div>
    );
}

function SessionDetailSkeleton() {
    return (
        <div className="bg-background min-h-screen w-full p-6 lg:p-10">
            <div className="mx-auto max-w-7xl animate-pulse space-y-8">
                <div className="bg-muted h-4 w-36" />

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="bg-card shadow-neo space-y-8 p-6 lg:col-span-8 lg:p-8">
                        <div className="space-y-5">
                            <div className="flex gap-3">
                                <div className="bg-muted h-6 w-24 border border-black" />
                                <div className="bg-muted h-6 w-20 border border-black" />
                            </div>
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-2">
                                    <div className="bg-muted h-12 w-64 max-w-full border border-black" />
                                    <div className="bg-muted h-3 w-24" />
                                </div>
                                <div className="bg-muted size-14 border border-black" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="bg-muted/50 h-16 border-2 border-black" />
                            ))}
                        </div>

                        <div className="space-y-4 border-t-2 border-black pt-6">
                            <div className="bg-muted h-7 w-48 border border-black" />
                            {Array.from({ length: 2 }).map((_, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="bg-muted size-8 border-2 border-black" />
                                    <div className="space-y-2">
                                        <div className="bg-muted h-3.5 w-40" />
                                        <div className="bg-muted h-3 w-24" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-4">
                        <div className="bg-card shadow-neo space-y-5 p-6">
                            <div className="bg-muted h-3 w-24" />
                            {Array.from({ length: 2 }).map((_, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="bg-muted size-14 border border-black" />
                                    <div className="space-y-2">
                                        <div className="bg-muted h-3 w-20" />
                                        <div className="bg-muted h-4 w-28" />
                                        <div className="bg-muted h-3 w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-primary shadow-neo h-44" />
                    </div>
                </div>
            </div>
        </div>
    );
}
