"use client";

import { Skill } from "@/types/models";
import Link from "next/link";

export function SkillCard({ skill }: { skill: Skill }) {
    return (
        <Link href={`/skills/${skill.id}`} className="bg-card shadow-neo group flex flex-col justify-between gap-4 p-5 transition-transform hover:-translate-y-1">
            <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <span className="bg-secondary border border-black px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase">{skill.category}</span>
                    <span className="font-clash text-2xl leading-none">{skill.emoji}</span>
                </div>

                <h3 className="font-clash text-lg leading-snug font-black">{skill.name}</h3>
                <p className="text-muted-foreground line-clamp-2 text-sm font-medium">{skill.description}</p>
            </div>
        </Link>
    );
}
