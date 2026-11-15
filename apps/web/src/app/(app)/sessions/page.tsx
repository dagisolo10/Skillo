"use client";

import { SessionStatusBadge } from "@/components/sessions/session-status";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBlock } from "@/components/ui/error-block";
import { PageHeader } from "@/components/ui/page-header";
import { useAcceptOrRejectSession, useGetSessions } from "@/hooks/tan-stack/session";
import { useGetUser } from "@/hooks/tan-stack/user";
import { SessionDetail } from "@/types/models";
import { cn } from "cn";
import { formatDate } from "date-fns";
import { ArrowUpRight, BookOpen, Check, Clock, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

type SessionFilter = "all" | "teaching" | "learning";

const FILTERS: { value: SessionFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "teaching", label: "Teaching" },
    { value: "learning", label: "Learning" },
];

export default function SessionsPage() {
    return (
        <Suspense fallback={<SessionsSkeleton />}>
            <SessionsContent />
        </Suspense>
    );
}

function SessionsContent() {
    const searchParams = useSearchParams();
    const skillId = searchParams.get("booked_skill_session");
    const [filter, setFilter] = useState<SessionFilter>("all");
    const userQuery = useGetUser();
    const sessionsQuery = useGetSessions();

    const acceptOrRejectMutation = useAcceptOrRejectSession();

    const user = userQuery.data;

    if (sessionsQuery.isPending || userQuery.isPending) {
        return <SessionsSkeleton />;
    }

    if (sessionsQuery.isError || userQuery.isError) {
        return (
            <div className="bg-background flex min-h-screen w-full items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <ErrorBlock
                        title="Failed to load sessions"
                        description={sessionsQuery.error?.message ?? userQuery.error?.message ?? "Something went wrong."}
                        onRetry={() => {
                            sessionsQuery.refetch();
                            userQuery.refetch();
                        }}
                    />
                </div>
            </div>
        );
    }

    const sessions = sessionsQuery.data ?? [];
    const teaching = user ? sessions.filter((session) => session.mentorId === user.id) : [];
    const learning = user ? sessions.filter((session) => session.learnerId === user.id) : [];

    const visible = filter === "teaching" ? teaching : filter === "learning" ? learning : sessions;

    return (
        <div className="bg-background min-h-screen w-full p-6 lg:p-10">
            <div className="mx-auto max-w-7xl space-y-8">
                <PageHeader
                    title="My Sessions"
                    eyebrow="🤝 Sessions"
                    description="Track the skills you are teaching and learning. Sessions start as pending until both peers confirm."
                    action={
                        <Link href="/skills">
                            <Button className="shadow-neo-sm active-sink-sm gap-2 px-6 text-sm font-bold">
                                <BookOpen size={14} /> Find a skill
                            </Button>
                        </Link>
                    }
                />

                <div className="flex flex-wrap items-center gap-2">
                    {FILTERS.map(({ value, label }) => {
                        const count = value === "teaching" ? teaching.length : value === "learning" ? learning.length : sessions.length;

                        return (
                            <Button key={value} size={"sm"} onClick={() => setFilter(value)} className="h-auto gap-2 px-3 py-1.5 text-xs" variant={filter === value ? "default" : "outline"}>
                                {label}
                                <span className="font-mono text-[10px] opacity-70">{count}</span>
                            </Button>
                        );
                    })}
                </div>

                {visible.length === 0 ? (
                    <EmptyState
                        emoji={filter === "teaching" ? "🎓" : filter === "learning" ? "📚" : "🗂️"}
                        title={filter === "teaching" ? "You are not teaching anything yet" : filter === "learning" ? "You are not learning anything yet" : "No sessions yet"}
                        description={filter === "teaching" ? "List a skill to start offering sessions to other peers." : "Browse the marketplace and book your first session."}
                        action={
                            <Link href="/skills">
                                <Button className="font-bold">Explore skills</Button>
                            </Link>
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {visible.map((session) => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                userId={user?.id}
                                searched={session.skillId === skillId}
                                isPending={acceptOrRejectMutation.isPending}
                                onAccept={() => acceptOrRejectMutation.mutate({ id: session.id, action: "accept" })}
                                onReject={() => acceptOrRejectMutation.mutate({ id: session.id, action: "reject" })}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function SessionCard({
    session,
    userId,
    onAccept,
    onReject,
    isPending,
    searched = false,
}: {
    userId?: string;
    searched?: boolean;
    isPending: boolean;
    onAccept: () => void;
    onReject: () => void;
    session: SessionDetail;
}) {
    const isTeaching = session.mentorId === userId;
    const isPendingSession = session.status === "PENDING";
    const partner = isTeaching ? session.learner : session.mentor;

    return (
        <div className="relative">
            {searched && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-16 -right-5 z-20 size-24 select-none"
                    style={{ animation: "springBounce 2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite" }}
                >
                    <svg viewBox="0 0 120 120" className="text-primary size-full overflow-visible drop-shadow-[2px_2px_0px_#000]" fill="none">
                        <path
                            pathLength={100}
                            strokeWidth="3.5"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="[stroke-dasharray:100] [stroke-dashoffset:100]"
                            style={{ animation: "drawStrokeLoop 2.2s ease-in-out infinite" }}
                            d="M 110 8 C 85 5, 52 18, 60 44 C 66 64, 92 56, 86 38 C 80 20, 44 35, 38 78 L 35 102"
                        />
                        <path
                            pathLength={100}
                            strokeWidth="3.5"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M 23 89 L 35 104 L 49 91"
                            className="[stroke-dasharray:100] [stroke-dashoffset:100]"
                            style={{ animation: "drawArrowLoop 2.2s ease-in-out infinite" }}
                        />
                    </svg>
                </div>
            )}

            <div className={cn("bg-card shadow-neo flex flex-col justify-between gap-5 p-5 transition-transform duration-300", searched && "-translate-y-0.5 ring-2 ring-black")}>
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                        <span className="bg-secondary shadow-neo-sm px-2.5 py-1 font-mono text-[10px] font-black uppercase">{isTeaching ? "Teaching" : "Learning"}</span>
                        <SessionStatusBadge status={session.status} />
                    </div>

                    <Link href={`/skills/${session.skillId}`} className="group flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                            <span className="text-muted-foreground font-mono text-[10px] font-bold uppercase">{session.skill.category}</span>
                            <h3 className="font-clash flex items-center gap-1 text-lg leading-snug font-black">
                                <span className="truncate">{session.skill.name}</span>
                                <ArrowUpRight size={14} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                            </h3>
                        </div>
                        <span className="font-clash shrink-0 text-2xl leading-none">{session.skill.emoji}</span>
                    </Link>

                    <div className="flex items-center gap-3 border-t-2 border-black pt-4">
                        <div className="bg-primary shadow-neo-sm shrink-0 p-0.5">
                            <UserAvatar seed={partner.avatarSeed} size={40} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-muted-foreground font-mono text-[9px] font-black tracking-wider uppercase">{isTeaching ? "Learner" : "Mentor"}</p>
                            <p className="font-clash truncate text-sm font-black">{partner.name}</p>
                            <p className="text-muted-foreground truncate font-mono text-[10px]">@{partner.username}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 border-t-2 border-black pt-3">
                    <div className="text-muted-foreground flex items-center justify-between gap-2 font-mono text-[10px] font-bold">
                        <span className="flex items-center gap-1.5">
                            <Clock size={11} /> Requested at {formatDate(session.createdAt, "p d MMM yyyy")}
                        </span>
                        {session.acceptedAt && <span className="text-success">Accepted {formatDate(session.acceptedAt, "d MMM")}</span>}
                    </div>

                    {isTeaching && isPendingSession && (
                        <div className="flex gap-2">
                            <Button size="sm" onClick={onAccept} disabled={isPending} className="flex-1 gap-1 text-xs font-bold">
                                <Check size={12} /> Accept
                            </Button>
                            <Button size="sm" variant="outline" onClick={onReject} disabled={isPending} className="flex-1 gap-1 text-xs font-bold">
                                <X size={12} /> Reject
                            </Button>
                        </div>
                    )}

                    <Link href={`/sessions/${session.id}`} className="group/link inline-flex items-center gap-1 font-mono text-[10px] font-black uppercase underline underline-offset-4">
                        View session
                        <ArrowUpRight size={11} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

function SessionsSkeleton() {
    return (
        <div className="bg-background min-h-screen w-full p-6 lg:p-10">
            <div className="mx-auto max-w-7xl animate-pulse space-y-8">
                <div className="space-y-3">
                    <div className="bg-muted h-5 w-24 border border-black" />
                    <div className="bg-muted h-10 w-64 border border-black" />
                    <div className="bg-muted h-4 w-full max-w-xl" />
                </div>

                <div className="flex gap-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="bg-muted h-8 w-24 border-2 border-black" />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="bg-card shadow-neo space-y-5 p-5">
                            <div className="flex justify-between">
                                <div className="bg-muted h-6 w-20" />
                                <div className="bg-muted h-6 w-24" />
                            </div>
                            <div className="space-y-2">
                                <div className="bg-muted h-3 w-16" />
                                <div className="bg-muted h-5 w-3/4" />
                            </div>
                            <div className="flex items-center gap-3 border-t-2 border-black pt-4">
                                <div className="bg-muted size-11 border border-black" />
                                <div className="space-y-2">
                                    <div className="bg-muted h-3 w-24" />
                                    <div className="bg-muted h-3 w-16" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
