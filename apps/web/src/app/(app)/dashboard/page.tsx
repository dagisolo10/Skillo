"use client";

import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetUser } from "@/hooks/tan-stack/user";
import { User } from "@/types/models";
import { cn } from "cn";
import { AlertTriangle, ArrowRight, ArrowUpRight, BookOpen, Clock, Flame, Plus, RefreshCw, ShieldCheck, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

interface SkillSwap {
    id: string;
    seed: string;
    time: string;
    title: string;
    partner: string;
    type: "teaching" | "learning";
    status: "Confirmed" | "Pending Match";
}

const ACTIVE_SESSIONS: SkillSwap[] = [
    {
        id: "1",
        title: "Next.js App Router & Server Actions",
        partner: "Aria K.",
        seed: "Zack",
        time: "Today, 4:00 PM EAT",
        type: "teaching",
        status: "Confirmed",
    },
    {
        id: "2",
        title: "Rust Memory Management & Async",
        partner: "Alex R.",
        seed: "Gizmo",
        time: "Tomorrow, 2:30 PM EAT",
        type: "learning",
        status: "Confirmed",
    },
    {
        id: "3",
        title: "PostgreSQL Index Optimization",
        partner: "Marcus B.",
        seed: "Pepper",
        time: "Friday, 10:00 AM EAT",
        type: "teaching",
        status: "Pending Match",
    },
];

export default function DashboardPage() {
    const { data: user, isLoading: isUserLoading, isError, refetch } = useGetUser();

    if (isUserLoading) {
        return <DashboardSkeleton />;
    }

    if (isError || !user) {
        return <DashboardError onRetry={() => refetch()} />;
    }

    return <DashboardContent user={user} />;
}

function DashboardContent({ user }: { user: User }) {
    const name = user.name;
    const credits = user.credits;
    const avatar = user.avatarSeed;
    const usernameTag = `@${user.username}`;

    return (
        <div className="bg-background min-h-screen w-full p-6 lg:p-10">
            <div className="mx-auto max-w-7xl space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="font-clash mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                        Welcome back, {name}
                        <span className="text-primary">.</span>
                    </h1>

                    <div className="flex items-center gap-3">
                        <Link href="/sessions/new">
                            <Button className="gap-2">
                                <Plus size={16} /> New Skill Swap
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-card shadow-neo flex flex-col justify-between space-y-4 p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground font-mono text-xs font-bold uppercase">Credit Ledger</span>
                            <div className="bg-primary shadow-neo-sm p-2">
                                <Zap size={18} className="text-foreground" />
                            </div>
                        </div>
                        <div>
                            <div className="font-clash text-3xl font-black">{credits} Credits</div>
                            <p className="text-muted-foreground mt-1 font-mono text-[11px]">Prisma Balance Active</p>
                        </div>
                    </div>

                    <div className="bg-card shadow-neo flex flex-col justify-between space-y-4 p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground font-mono text-xs font-bold uppercase">Active Sessions</span>
                            <div className="bg-secondary shadow-neo-sm p-2">
                                <BookOpen size={18} className="text-foreground" />
                            </div>
                        </div>
                        <div>
                            <div className="font-clash text-3xl font-black">3 Booked</div>
                            <p className="text-muted-foreground mt-1 font-mono text-[11px]">Next session in 4 hours</p>
                        </div>
                    </div>

                    <div className="bg-card shadow-neo flex flex-col justify-between space-y-4 p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground font-mono text-xs font-bold uppercase">Network Streak</span>
                            <div className="bg-accent shadow-neo-sm p-2">
                                <Flame size={18} className="text-foreground" />
                            </div>
                        </div>
                        <div>
                            <div className="font-clash text-3xl font-black">12 Days</div>
                            <p className="text-muted-foreground mt-1 font-mono text-[11px]">Top 5% peer consistency</p>
                        </div>
                    </div>

                    <div className="bg-card shadow-neo flex flex-col justify-between space-y-4 p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground font-mono text-xs font-bold uppercase">Trust Rating</span>
                            <div className="bg-primary shadow-neo-sm p-2">
                                <ShieldCheck size={18} className="text-foreground" />
                            </div>
                        </div>
                        <div>
                            <div className="font-clash text-3xl font-black">4.98 / 5.0</div>
                            <p className="text-muted-foreground mt-1 font-mono text-[11px]">Based on 24 reviews</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="bg-card shadow-neo space-y-6 p-6 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h2 className="font-clash text-xl font-black tracking-tight">Upcoming Peer Sessions</h2>
                            <Link href="/sessions" className="flex items-center gap-1 font-mono text-xs font-bold hover:underline">
                                View all <ArrowUpRight size={14} />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {ACTIVE_SESSIONS.map((session) => (
                                <div
                                    key={session.id}
                                    className="bg-background shadow-neo-sm flex flex-col gap-4 p-4 transition-transform hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex items-start gap-3.5">
                                        <div className="bg-muted shadow-neo-sm shrink-0 p-1">
                                            <UserAvatar seed={session.seed} size={36} />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={cn(
                                                        "px-2 py-0.5 font-mono text-[9px] font-bold uppercase",
                                                        session.type === "teaching" ? "bg-primary text-foreground" : "bg-secondary text-foreground",
                                                    )}
                                                >
                                                    {session.type}
                                                </span>
                                                <span className="text-muted-foreground font-mono text-xs">w/ {session.partner}</span>
                                            </div>
                                            <h3 className="font-clash text-lg font-bold">{session.title}</h3>
                                            <p className="text-muted-foreground flex items-center gap-1 font-mono text-[11px]">
                                                <Clock size={12} /> {session.time}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 sm:justify-end">
                                        <span
                                            className={cn(
                                                "px-2.5 py-1 font-mono text-[10px] font-bold",
                                                session.status === "Confirmed" ? "border-success/20 bg-success/10 text-success border" : "border border-amber-500/20 bg-amber-500/10 text-amber-600",
                                            )}
                                        >
                                            {session.status}
                                        </span>
                                        <Button size="sm" variant="outline">
                                            Room
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-card shadow-neo space-y-4 p-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary shadow-neo-sm p-1">
                                    <UserAvatar seed={avatar} size={48} />
                                </div>
                                <div>
                                    <h3 className="font-clash text-base font-black">{name}</h3>
                                    <p className="text-muted-foreground font-mono text-xs">{usernameTag}</p>
                                </div>
                            </div>

                            <div className="border-foreground/20 space-y-2 border-t pt-3 font-mono text-xs">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Email:</span>
                                    <span className="max-w-40 truncate font-bold">{user.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Database ID:</span>
                                    <span className="max-w-30 truncate font-bold">{user.id}</span>
                                </div>
                            </div>

                            <Link href="/profile" className="block w-full">
                                <Button variant="secondary" size="sm" className="w-full">
                                    Edit Profile
                                </Button>
                            </Link>
                        </div>

                        <div className="bg-primary/20 shadow-neo space-y-3 p-6">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-primary" />
                                <h3 className="font-clash text-sm font-black tracking-wider uppercase">Explore Skills</h3>
                            </div>
                            <p className="text-muted-foreground font-mono text-xs leading-relaxed">
                                Ready to learn something new? Browse community-listed skills ranging from Rust async to Jazz piano improvisation.
                            </p>
                            <Link href="/explore" className="block pt-1">
                                <Button size="sm" className="w-full">
                                    Browse Marketplace <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="bg-background min-h-screen w-full animate-pulse p-6 lg:p-10">
            <div className="mx-auto max-w-7xl space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="bg-muted shadow-neo-sm h-4 w-28" />
                        <div className="bg-card shadow-neo-sm h-8 w-64" />
                    </div>
                    <div className="bg-primary shadow-neo h-10 w-36" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-card shadow-neo flex h-32 flex-col justify-between p-5">
                            <div className="bg-muted h-4 w-20" />
                            <div className="bg-muted h-8 w-28" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="bg-card shadow-neo h-96 p-6 lg:col-span-2" />
                    <div className="bg-card shadow-neo h-96 p-6" />
                </div>
            </div>
        </div>
    );
}

function DashboardError({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="bg-background flex h-screen w-full items-center justify-center p-6">
            <div className="bg-card shadow-neo w-full max-w-md space-y-4 p-8 text-center">
                <div className="shadow-neo-sm mx-auto flex h-12 w-12 items-center justify-center border-2 border-red-500 bg-red-500/10 text-red-500">
                    <AlertTriangle size={24} />
                </div>
                <h2 className="font-clash text-xl font-black">Failed to load cluster node</h2>
                <p className="text-muted-foreground font-mono text-xs">Could not retrieve your user profile and ledger data from the backend. Check your network or session token.</p>
                <Button onClick={onRetry} className="mt-4 w-full gap-2">
                    <RefreshCw size={14} /> Retry Connection
                </Button>
            </div>
        </div>
    );
}
