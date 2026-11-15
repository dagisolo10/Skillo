"use client";

import DeleteSkillDialog from "@/components/skills/delete-skill-dialog";
import SkillFormModal from "@/components/skills/skill-form-modal";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ErrorBlock } from "@/components/ui/error-block";
import { toast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/auth-context";
import { useCreateSession } from "@/hooks/tan-stack/session";
import { useGetSkill } from "@/hooks/tan-stack/skill";
import { formatDate } from "date-fns";
import { ArrowLeft, Calendar, Check, Loader2, Pencil, ShieldCheck, Sparkles, Trash2, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ElementType, useState } from "react";

export default function SkillDetailContent({ id }: { id: string }) {
    const router = useRouter();
    const { user, isSignedIn } = useAuth();

    const skillQuery = useGetSkill(id);
    const createSession = useCreateSession();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isSkillFormOpen, setIsSkillFormOpen] = useState(false);

    if (skillQuery.isPending) {
        return <SkillDetailSkeleton />;
    }

    if (skillQuery.isError) {
        return (
            <div className="bg-background flex min-h-screen w-full items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <ErrorBlock title="Failed to load skill" onRetry={() => skillQuery.refetch()} description={skillQuery.error.message} />
                </div>
            </div>
        );
    }

    const skill = skillQuery.data;

    if (!skill) {
        return null;
    }

    const isOwnSkill = !!user && skill.userId === user.id;

    function bookSession() {
        if (!isSignedIn) {
            toast.add({
                type: "info",
                title: "Sign in required",
                description: "Sign in to book a session with this mentor.",
                actionProps: {
                    children: "Sign in",
                    onClick: () => router.push("/auth"),
                },
            });
            return;
        }

        createSession.mutate(
            { skillId: skill.id },
            {
                onSuccess: () => {
                    toast.add({
                        type: "success",
                        title: "Session requested",
                        description: `Your request was sent to ${skill.user.name}.`,
                    });
                },
                onError: (error) => {
                    if (error.message.includes("You already have an open session")) {
                        toast.add({
                            type: "error",
                            title: "Booking failed",
                            description: error.message || "Could not create the session. Try again.",
                            actionProps: {
                                children: "View Session",
                                onClick: () => router.push(`/sessions?booked_skill_session=${id}`),
                            },
                        });

                        return;
                    }
                    toast.add({
                        type: "error",
                        title: "Booking failed",
                        description: error.message || "Could not create the session. Try again.",
                    });
                },
            },
        );
    }

    return (
        <div className="bg-background min-h-screen w-full p-6 lg:p-10">
            <div className="mx-auto max-w-7xl space-y-8">
                <Link href="/skills" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 font-mono text-xs font-bold uppercase transition-colors">
                    <ArrowLeft size={14} /> Back to skills
                </Link>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="bg-card shadow-neo space-y-8 p-6 lg:col-span-8 lg:p-8">
                        <div className="space-y-5">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="bg-secondary border-2 border-black px-2.5 py-1 font-mono text-[10px] font-black uppercase">{skill.category}</span>
                                <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase">
                                    <Calendar size={12} /> Listed {formatDate(skill.createdAt, "d MMM yyyy")}
                                </span>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <h1 className="font-clash text-4xl leading-none font-black sm:text-5xl">{skill.name}</h1>
                                <span className="font-clash shrink-0 text-5xl leading-none sm:text-6xl">{skill.emoji}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <InfoTile icon={Zap} label="Session cost" value="1 credit" />
                            <InfoTile icon={Sparkles} label="Format" value="1-on-1" />
                            <InfoTile icon={Users} label="Category" value={skill.category} />
                        </div>

                        <div className="space-y-3 border-t-2 border-black pt-6">
                            <h2 className="font-clash text-2xl font-black">About this skill</h2>
                            <p className="text-muted-foreground font-mono text-sm leading-relaxed">{skill.description}</p>
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-4">
                        <div className="bg-card shadow-neo space-y-5 p-6">
                            <span className="text-muted-foreground block font-mono text-xs font-black tracking-wider uppercase">Your mentor</span>

                            <div className="flex items-center gap-3">
                                <div className="bg-primary shadow-neo-sm -rotate-2 p-1">
                                    <UserAvatar seed={skill.user.avatarSeed} size={56} />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-clash truncate text-lg font-black">{skill.user.name}</p>
                                    <p className="text-muted-foreground truncate font-mono text-xs">@{skill.user.username}</p>
                                </div>
                            </div>

                            <div className="bg-muted/50 space-y-2 border-2 border-black p-3 font-mono text-[11px]">
                                <p className="flex items-center gap-2">
                                    <Check size={12} className="text-success" /> Identity verified
                                </p>
                                <p className="flex items-center gap-2">
                                    <ShieldCheck size={12} className="text-success" /> Credit held in escrow
                                </p>
                            </div>

                            {isOwnSkill ? (
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" onClick={() => setIsSkillFormOpen(true)} className="shadow-neo-sm gap-2 font-bold">
                                        <Pencil size={14} /> Edit
                                    </Button>
                                    <Button variant="destructive" onClick={() => setIsDeleteOpen(true)} className="shadow-neo-sm gap-2 font-bold">
                                        <Trash2 size={14} /> Delete
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Button onClick={bookSession} disabled={createSession.isPending} className="shadow-neo-sm active-sink-sm w-full gap-2 px-6 py-3 font-bold">
                                        {createSession.isPending ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" /> Requesting...
                                            </>
                                        ) : (
                                            <>
                                                <Zap size={14} /> Book a session
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-muted-foreground text-center font-mono text-xs">Your credit is held until the session is confirmed by both peers.</p>
                                </>
                            )}
                        </div>

                        <div className="bg-primary shadow-neo space-y-3 p-6">
                            <span className="bg-card shadow-neo-sm inline-block px-2 py-0.5 font-mono text-[10px] font-black tracking-widest uppercase">Have a skill to trade?</span>
                            <p className="font-mono text-xs leading-relaxed font-bold">Teach a session and earn that credit back — the network runs on reciprocity.</p>
                            <Link href="/skills" className="inline-block font-mono text-xs font-black uppercase underline underline-offset-4">
                                Browse more skills →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {isSkillFormOpen && <SkillFormModal open={isSkillFormOpen} skill={skill} onOpenChange={setIsSkillFormOpen} />}

            {isDeleteOpen && <DeleteSkillDialog open={isDeleteOpen} skill={skill} onOpenChange={setIsDeleteOpen} onDeleted={() => router.push("/skills")} />}
        </div>
    );
}

function InfoTile({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) {
    return (
        <div className="bg-muted/50 shadow-neo-sm flex items-center gap-3 p-3">
            <span className="bg-primary shadow-neo-sm flex size-9 shrink-0 items-center justify-center">
                <Icon size={16} />
            </span>
            <div className="min-w-0">
                <p className="text-muted-foreground font-mono text-[9px] font-black tracking-wider uppercase">{label}</p>
                <p className="font-clash truncate text-xl font-bold">{value}</p>
            </div>
        </div>
    );
}

function SkillDetailSkeleton() {
    return (
        <div className="bg-background min-h-screen w-full p-6 lg:p-10">
            <div className="mx-auto max-w-7xl animate-pulse space-y-8">
                <div className="bg-muted h-4 w-32" />

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="bg-card shadow-neo space-y-8 p-6 lg:col-span-8 lg:p-8">
                        <div className="space-y-5">
                            <div className="bg-muted h-5 w-28 border border-black" />
                            <div className="bg-muted h-12 w-3/4 border border-black" />
                            <div className="space-y-2">
                                <div className="bg-muted h-4 w-full" />
                                <div className="bg-muted h-4 w-5/6" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="bg-muted/50 h-16 border-2 border-black" />
                            ))}
                        </div>

                        <div className="space-y-3 border-t-2 border-black pt-6">
                            <div className="bg-muted h-7 w-48 border border-black" />
                            <div className="bg-muted h-4 w-full" />
                            <div className="bg-muted h-4 w-4/5" />
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-4">
                        <div className="bg-card shadow-neo space-y-5 p-6">
                            <div className="bg-muted h-3 w-24" />
                            <div className="flex items-center gap-3">
                                <div className="bg-muted size-14 border border-black" />
                                <div className="space-y-2">
                                    <div className="bg-muted h-4 w-28" />
                                    <div className="bg-muted h-3 w-20" />
                                </div>
                            </div>
                            <div className="bg-muted h-10 w-full" />
                            <div className="bg-muted h-10 w-full" />
                        </div>

                        <div className="bg-primary shadow-neo h-48" />
                    </div>
                </div>
            </div>
        </div>
    );
}
