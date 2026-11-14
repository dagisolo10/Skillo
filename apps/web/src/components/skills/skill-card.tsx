"use client";

import { UserAvatar } from "@/components/ui/avatar";
import { SkillDetail } from "@/types/models";
import { cn } from "cn";
import { Users, Zap } from "lucide-react";
import Link from "next/link";

// todo: update the numbers
export function SkillCard({ skill }: { skill: SkillDetail }) {
    const demandCount = 4;
    const teacherCount = 6;

    return (
        <Link href={`/skills/${skill.id}`} className={cn("bg-card active-sink shadow-neo flex min-h-64 flex-col justify-between gap-4 p-5 transition-all duration-300 hover:scale-102")}>
            <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <span className="bg-secondary border border-black px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase">{skill.category}</span>
                    <span className="font-clash text-2xl leading-none">{skill.emoji}</span>
                </div>

                <h3 className="font-clash text-lg leading-snug font-black">{skill.name}</h3>
                <p className="text-muted-foreground line-clamp-2 text-sm font-medium">{skill.description}</p>
            </div>

            <div className="flex items-center justify-between gap-2 border-t-2 border-black pt-4">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="bg-muted border border-black p-0.5">
                        <UserAvatar seed={skill.user.avatarSeed} size={32} />
                    </div>
                    <div>
                        <p className="truncate text-xs font-bold">{skill.user.name}</p>
                        <p className="text-muted-foreground font-mono text-[10px]">@{skill.user.username}</p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 font-mono text-sm font-bold">
                    <span className="text-muted-foreground flex items-center gap-1">
                        <Users size={12} /> {demandCount} want
                    </span>
                    <span className="bg-primary shadow-neo-sm flex items-center gap-1 border border-black px-2 py-0.5">
                        <Zap size={10} /> {teacherCount}
                    </span>
                </div>
            </div>
        </Link>
    );
}
