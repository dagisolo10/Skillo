"use client";

import { Button } from "@/components/ui/button";
import { Avatar, Style } from "@dicebear/core";
import lorelei from "@dicebear/styles/lorelei.json" with { type: "json" };
import { cn } from "cn";
import Image from "next/image";
import { useState } from "react";

const AVATAR_SEEDS = ["Felix", "Aneka", "Zack", "Milo", "Sasha", "Pepper", "Shadow", "Gizmo", "Ziggy", "Nova"];

const style = new Style(lorelei);

interface AvatarPickerProps {
    value?: string;
    onSelect?: (seed: string) => void;
    size?: number;
}

export function AvatarPicker({ value, onSelect, size = 48 }: AvatarPickerProps) {
    const [selectedSeed, setSelectedSeed] = useState<string>(value || AVATAR_SEEDS[0]);

    const handleSelect = (seed: string) => {
        setSelectedSeed(seed);
        onSelect?.(seed);
    };

    return (
        <div className="grid w-full grid-cols-5 gap-4 gap-y-6">
            {AVATAR_SEEDS.map((seed) => {
                const isSelected = selectedSeed === seed;
                const dataUri = new Avatar(style, { seed, size }).toDataUri();

                return (
                    <Button
                        key={seed}
                        type="button"
                        onClick={() => handleSelect(seed)}
                        variant={isSelected ? "default" : "secondary"}
                        className={cn("relative p-1", isSelected ? "" : "bg-card hover:bg-muted")}
                    >
                        <Image src={dataUri} className="-translate-y-2" alt={`Avatar ${seed}`} width={size} height={size} />
                        {isSelected && <span className="bg-foreground text-background absolute -top-2 -right-2 flex size-4 items-center justify-center text-[10px]">✓</span>}
                    </Button>
                );
            })}
        </div>
    );
}

export function UserAvatar({ seed = "Bob", size = 48 }: { seed?: string; size?: number }) {
    const dataUri = new Avatar(style, { seed, size }).toDataUri();

    return <Image src={dataUri} alt="User Avatar" width={size} height={size} />;
}
