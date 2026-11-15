"use client";

import ProfileModal from "@/components/profile/edit-modal";
import DeleteSkillDialog from "@/components/skills/delete-skill-dialog";
import SkillFormModal from "@/components/skills/skill-form-modal";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ErrorBlock } from "@/components/ui/error-block";
import { PageHeader } from "@/components/ui/page-header";
import { useGetSkills } from "@/hooks/tan-stack/skill";
import { useGetUser } from "@/hooks/tan-stack/user";
import { SkillDetail, User } from "@/types/models";
import { cn } from "cn";
import { formatDate } from "date-fns";
import { BookOpen, Calendar, Pencil, Plus, Sparkles, Trash2, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// TODO: Profile page is still a work in progress. Replace the mocked skills/ledger data with real API
// data, and wire up the "Add Skill", "Request Skill", and "Delete Account Node" buttons before shipping.
interface PeerSkill {
    id: string;
    name: string;
    emoji: string;
    level: string;
    experience?: string;
    note?: string;
    category: string;
}

interface LedgerEvent {
    id: string;
    type: "earn" | "spend" | "hold" | "starter" | "refund";
    amount: number;
    note: string;
    createdAt: string;
}

const LEDGER_STYLES: Record<string, { label: string; className: string }> = {
    earn: { label: "⚡ Earned", className: "bg-brand-mint text-foreground" },
    spend: { label: "Spent", className: "bg-brand-coral text-white" },
    hold: { label: "🔒 Escrow", className: "bg-brand-yellow text-foreground" },
    starter: { label: "❣️ Welcome", className: "bg-secondary text-foreground" },
    refund: { label: "🤑 Refund", className: "bg-accent text-foreground" },
};

export default function ProfilePage() {
    const userQuery = useGetUser();

    if (userQuery.isLoading) {
        return <div className="font-clash flex h-screen items-center justify-center text-6xl font-black">Loading</div>;
    }

    if (userQuery.isError) {
        return (
            <div className="bg-background flex min-h-screen w-full items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <ErrorBlock title="Failed to load profile" description={userQuery.error.message} onRetry={() => userQuery.refetch()} />
                </div>
            </div>
        );
    }

    if (!userQuery.data) {
        return null;
    }

    return <ProfileContent user={userQuery.data} />;
}

// todo: remove mock data
function ProfileContent({ user }: { user: User }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const skillsQuery = useGetSkills({ userId: user.id, limit: 50 });
    const [isSkillFormOpen, setIsSkillFormOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<SkillDetail | null>(null);
    const [deletingSkill, setDeletingSkill] = useState<SkillDetail | null>(null);

    const [wantedSkills] = useState<PeerSkill[]>([
        {
            id: "w1",
            name: "Rust Systems & CLI Tooling",
            emoji: "🦀",
            level: "Beginner",
            note: "Memory-safe command line applications",
            category: "Tech",
        },
        {
            id: "w2",
            name: "UI/UX Prototyping in Figma",
            emoji: "🎨",
            level: "Intermediate",
            note: "Design tokens and minimalist dark themes",
            category: "Design",
        },
    ]);

    const [ledger] = useState<LedgerEvent[]>([
        {
            id: "t1",
            type: "starter",
            amount: 1,
            note: "Network welcome bonus credit",
            createdAt: "2025-06-15T10:00:00Z",
        },
        {
            id: "t2",
            type: "earn",
            amount: 1,
            note: "Taught Next.js Architecture to @sarah",
            createdAt: "2025-07-20T14:30:00Z",
        },
        {
            id: "t3",
            type: "earn",
            amount: 1,
            note: "Taught Linux Hyprland Setup to @marcus",
            createdAt: "2025-08-05T09:15:00Z",
        },
        {
            id: "t4",
            type: "hold",
            amount: -1,
            note: "Escrow lock for Rust Systems session",
            createdAt: "2025-09-10T08:00:00Z",
        },
        {
            id: "t5",
            type: "refund",
            amount: 1,
            note: "Refund from rescheduled Rust session",
            createdAt: "2025-09-15T12:00:00Z",
        },
    ]);

    return (
        <div className="bg-background relative min-h-screen w-full p-6 lg:p-12">
            <div className="mx-auto max-w-7xl space-y-10">
                <PageHeader eyebrow="⚙️ Node Control Panel" title="Profile & Credit Ledger" description="Manage your peer identity, broadcasted capabilities, and verifiable transaction logs." />

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="bg-card shadow-neo flex flex-col justify-between space-y-6 p-8 lg:col-span-8">
                        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-5">
                                <div className="bg-primary shadow-neo-sm -rotate-2 p-1.5">
                                    <UserAvatar seed={user.avatarSeed} size={72} />
                                </div>
                                <div className="space-y-1.5">
                                    <h2 className="font-clash text-3xl font-black tracking-tight">{user.name}</h2>
                                    <p className="text-muted-foreground font-mono text-xs font-bold">@{user.username}</p>
                                </div>
                            </div>

                            <div className="bg-muted shadow-neo-sm flex items-center gap-2 self-start px-3 py-2 font-mono text-xs font-bold sm:self-auto">
                                <Calendar size={14} className="text-foreground" />
                                <span>Joined {formatDate(user.createdAt, "MMMM yyyy")}</span>
                            </div>
                        </div>

                        <div className="bg-muted/50 space-y-2 border-2 border-black p-4">
                            <span className="text-muted-foreground block font-mono text-[10px] font-black tracking-wider uppercase">Active Bio</span>
                            <p className="font-mono text-xs leading-relaxed">{user.bio}</p>
                        </div>

                        <div className="flex items-center justify-between border-t-2 border-black pt-5">
                            <ProfileModal user={user} open={isEditModalOpen} key={`open-${isEditModalOpen}`} onOpenChange={setIsEditModalOpen} />
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-4">
                        <div className="bg-primary shadow-neo space-y-3 p-6">
                            <div className="flex items-center justify-between">
                                <span className="bg-card shadow-neo-sm px-2 py-0.5 font-mono text-[10px] font-black tracking-widest uppercase">Credit Balance</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-clash text-6xl font-black">{user.credits}</span>
                                <span className="font-mono text-sm font-bold uppercase">⚡ Credits</span>
                            </div>
                            <p className="border-t-2 border-black/20 pt-3 font-mono text-xs font-bold">Available for booking masterclasses & learning slots.</p>
                        </div>

                        <div className="bg-card shadow-neo grid grid-cols-3 divide-x-2 divide-black border-2 border-black">
                            <StatCell icon={BookOpen} label="Taught" value="3" />
                            <StatCell icon={Sparkles} label="Learned" value="2" />
                            <StatCell icon={Zap} label="Rating" value="4.9" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="bg-card shadow-neo space-y-5 border-2 border-black p-6">
                        <div className="flex items-center justify-between border-b-2 border-black pb-4">
                            <h2 className="font-clash flex items-center gap-2 text-xl font-black tracking-tight">
                                <BookOpen size={20} className="text-primary" /> Skills You Teach
                            </h2>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setEditingSkill(null);
                                    setIsSkillFormOpen(true);
                                }}
                                className="shadow-neo-sm active-sink-sm gap-1.5 font-bold"
                            >
                                <Plus size={14} /> Add Skill
                            </Button>
                        </div>

                        <p className="text-muted-foreground font-mono text-xs">
                            Each completed teaching session yields <strong className="text-foreground">1 credit</strong> upon confirmation.
                        </p>

                        <div className="space-y-3">
                            {skillsQuery.isPending ? (
                                Array.from({ length: 2 }).map((_, index) => <div key={index} className="bg-muted h-20 animate-pulse border-2 border-black" />)
                            ) : skillsQuery.isError ? (
                                <div className="bg-destructive/10 border-2 border-black p-4">
                                    <p className="font-mono text-xs font-bold">{skillsQuery.error.message}</p>
                                    <Button size="sm" variant="outline" onClick={() => skillsQuery.refetch()} className="mt-2 font-bold">
                                        Retry
                                    </Button>
                                </div>
                            ) : skillsQuery.items.length === 0 ? (
                                <div className="bg-background shadow-neo-sm border-2 border-black p-5 text-center">
                                    <p className="font-mono text-xs font-bold">You have not listed any skills yet.</p>
                                    <p className="text-muted-foreground mt-1 font-mono text-[10px]">Add one to start teaching.</p>
                                </div>
                            ) : (
                                skillsQuery.items.map((skill) => (
                                    <OwnedSkillItem
                                        key={skill.id}
                                        skill={skill}
                                        onEdit={() => {
                                            setEditingSkill(skill);
                                            setIsSkillFormOpen(true);
                                        }}
                                        onDelete={() => setDeletingSkill(skill)}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-card shadow-neo space-y-5 border-2 border-black p-6">
                        <div className="flex items-center justify-between border-b-2 border-black pb-4">
                            <h2 className="font-clash flex items-center gap-2 text-xl font-black tracking-tight">
                                <Sparkles size={20} className="text-secondary" /> Skills You Want
                            </h2>
                            <Button size="sm" variant="secondary" className="shadow-neo-sm active-sink-sm gap-1.5 font-bold">
                                <Plus size={14} /> Request Skill
                            </Button>
                        </div>

                        <p className="text-muted-foreground font-mono text-xs">The matching protocol connects you with active community mentors.</p>

                        <div className="space-y-3">
                            {wantedSkills.map((skill) => (
                                <SkillItem key={skill.id} skill={skill} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-card shadow-neo space-y-6 p-8">
                    <div className="flex items-center justify-between border-b-2 border-black pb-4">
                        <div>
                            <h2 className="font-clash flex items-center gap-2 text-xl font-black">
                                <Zap size={20} className="text-primary" /> Credit Ledger Activity
                            </h2>
                            <p className="text-muted-foreground mt-1 font-mono text-xs">Immutable log of earnings, escrow holds, and welcome grants.</p>
                        </div>
                        <span className="bg-muted border-2 border-black px-3 py-1 font-mono text-xs font-bold">{ledger.length} events logged</span>
                    </div>

                    <div className="bg-background divide-y-2 divide-black border-2 border-black">
                        {ledger.map((tx) => {
                            const style = LEDGER_STYLES[tx.type];
                            return (
                                <div key={tx.id} className="hover:bg-muted/50 flex flex-col justify-between gap-3 p-4 transition-colors sm:flex-row sm:items-center">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className={cn("min-w-20 shrink-0 border-2 border-black px-2.5 py-1 font-mono text-[10px] font-black uppercase", style.className)}>{style.label}</span>
                                        <p className="truncate font-mono text-xs font-bold">{tx.note}</p>
                                    </div>

                                    <div className="flex shrink-0 items-center justify-between gap-6 sm:justify-end">
                                        <span className="text-muted-foreground font-mono text-xs">{formatDate(tx.createdAt, "dd MMMM yyyy")}</span>
                                        <span className={cn(tx.amount > 0 ? "text-emerald-700" : "text-brand-coral", `text-right font-mono font-semibold`)}>
                                            {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-destructive/10 shadow-neo space-y-4 border-4 p-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                            <h2 className="font-clash text-destructive text-xl font-black tracking-tight">Danger Zone</h2>
                            <p className="text-muted-foreground max-w-2xl font-mono text-xs leading-relaxed">
                                Permanently wipe your account node, broadcasted skills, and ledger history from the local P2P network.
                            </p>
                        </div>
                        <Button variant="destructive" className="shadow-neo-sm active-sink-sm px-6">
                            <Trash2 size={16} /> Delete Account Node
                        </Button>
                    </div>
                </div>
            </div>

            {isSkillFormOpen && <SkillFormModal open={isSkillFormOpen} skill={editingSkill ?? undefined} onOpenChange={setIsSkillFormOpen} />}

            {deletingSkill && (
                <DeleteSkillDialog
                    open
                    skill={deletingSkill}
                    onOpenChange={(open) => {
                        if (!open) {
                            setDeletingSkill(null);
                        }
                    }}
                    onDeleted={() => setDeletingSkill(null)}
                />
            )}
        </div>
    );
}

function OwnedSkillItem({ skill, onEdit, onDelete }: { skill: SkillDetail; onEdit: () => void; onDelete: () => void }) {
    return (
        <div className="bg-background shadow-neo-sm flex items-start justify-between gap-3 border-2 border-black p-4">
            <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <Link href={`/skills/${skill.id}`} className="font-clash flex items-center gap-2 truncate text-base font-black underline-offset-4 hover:underline">
                        <span className="shrink-0 text-lg">{skill.emoji}</span>
                        <span className="truncate">{skill.name}</span>
                    </Link>
                    <span className="bg-primary/20 shrink-0 border border-black px-2 py-0.5 font-mono text-[10px] font-black uppercase">{skill.category}</span>
                </div>
                <p className="text-muted-foreground truncate font-mono text-xs">{skill.description}</p>
            </div>

            <div className="flex shrink-0 gap-1.5">
                <Button size="icon-sm" variant="outline" aria-label={`Edit ${skill.name}`} onClick={onEdit}>
                    <Pencil size={14} />
                </Button>
                <Button size="icon-sm" variant="destructive" aria-label={`Delete ${skill.name}`} onClick={onDelete}>
                    <Trash2 size={14} />
                </Button>
            </div>
        </div>
    );
}

function SkillItem({ skill }: { skill: PeerSkill }) {
    return (
        <div className="bg-background shadow-neo-sm flex h-28 items-start justify-between gap-4 p-4 transition-transform duration-300 hover:scale-102">
            <div className="flex h-full flex-1 flex-col gap-1">
                <div className="flex items-center justify-between gap-2.5">
                    <span className="font-clash flex items-center gap-2 truncate text-base font-black">
                        <span className="text-lg">{skill.emoji}</span> {skill.name}
                    </span>
                    <span className="bg-primary/20 border border-black px-2 py-0.5 font-mono text-[10px] font-black uppercase">{skill.level}</span>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    {skill.note && <p className="text-muted-foreground truncate font-mono text-xs">{skill.note}</p>}
                    {skill.experience && <span className="bg-muted shrink-0 border border-black px-2.5 py-1 font-mono text-[10px] font-bold">{skill.experience}</span>}
                </div>
            </div>
        </div>
    );
}

function StatCell({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center">
            <Icon size={18} className="text-primary" />
            <span className="font-clash text-3xl font-black tracking-tight">{value}</span>
            <span className="text-muted-foreground font-mono text-[10px] font-black tracking-wider uppercase">{label}</span>
        </div>
    );
}
