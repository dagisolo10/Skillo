"use client";

import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useUpdateUser } from "@/hooks/tan-stack/user";
import { User } from "@/types/models";
import { slugifyUsername } from "@/utils/helper-functions";
import { cn } from "cn";
import { Check, Edit3, Eye } from "lucide-react";
import { SubmitEvent, useState } from "react";
import z from "zod";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";

const AVATAR_SEEDS = ["CyberHero", "Aria", "Felix", "Zephyr", "Orion", "Kuma", "Nova", "Atlas", "Valkyrie", "Specter"];

interface ProfileModalProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const userUpdateSchema = z.object({
    avatarSeed: z.string().optional(),
    bio: z.string().max(280, "Bio cannot exceed 280 characters").trim().nullish(),
    name: z.string().min(3, "Name must be at least 3 characters").max(50).trim().optional(),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30)
        .transform((val) => slugifyUsername(val))
        .optional(),
});

export default function ProfileModal({ user, open, onOpenChange }: ProfileModalProps) {
    const userMut = useUpdateUser();

    const [bio, setBio] = useState(user.bio);
    const [name, setName] = useState(user.name);
    const [username, setUsername] = useState(user.username);
    const [avatarSeed, setAvatarSeed] = useState(user.avatarSeed);
    const [previewSeed, setPreviewSeed] = useState<string | null>(null);

    function saveChanges(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const result = userUpdateSchema.safeParse({ bio, name, username, avatarSeed });

        if (!result.success) {
            for (const { message } of result.error.issues) {
                toast.add({
                    type: "error",
                    title: "Invalid Input",
                    description: message || "Please check your input parameters.",
                });
            }
            return;
        }

        userMut.mutate(result.data, {
            onSuccess: () => {
                toast.add({ type: "success", title: "Profile Updated" });
                onOpenChange(false);
            },
            onError: (error) => {
                toast.add({
                    type: "error",
                    title: "Update Failed",
                    description: error.message || "Could not save profile changes to the network.",
                });
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger
                render={
                    <Button size={"sm"} className="h-auto gap-2 px-6 py-3">
                        <Edit3 size={14} /> Update Profile
                    </Button>
                }
            />

            <DialogContent className="bg-card shadow-neo-lg max-w-xl! overflow-y-auto rounded-none p-6 lg:p-8">
                <DialogHeader className="border-b-2 pb-4 text-left">
                    <DialogTitle className="font-clash flex items-center gap-2 text-2xl font-bold tracking-tight">
                        <Edit3 className="text-foreground" size={24} /> Profile Update
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-mono text-xs">
                        Update your public profile.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={saveChanges} className="space-y-6 pt-2">
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="space-y-1">
                                <Label className="text-xs tracking-wider uppercase">Display name</Label>
                                <Input value={name} maxLength={50} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs tracking-wider uppercase">Username</Label>
                                <Input maxLength={30} value={username} onChange={(e) => setUsername(e.target.value)} />
                                <p className="text-muted-foreground mt-1 font-mono text-[10px] break-all">
                                    {process.env.NEXT_PUBLIC_WEBSITE_URL}/u/{slugifyUsername(username)}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs tracking-wider uppercase">Bio</Label>
                            <Textarea
                                maxLength={280}
                                value={bio ?? ""}
                                onChange={(e) => setBio(e.target.value)}
                                className="h-28 w-full resize-none"
                            />
                            <div className="text-muted-foreground mt-2 flex justify-between font-mono text-[10px]">
                                <span>Markdown & plain text supported</span>
                                <span>{bio?.length ?? 0}/280</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs tracking-wider uppercase">Select Avatar Seed</Label>
                            <div className="flex flex-wrap gap-2.5">
                                {AVATAR_SEEDS.map((seed) => (
                                    <Button
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            setPreviewSeed(seed);
                                        }}
                                        key={seed}
                                        size={"sm"}
                                        type="button"
                                        className={cn("h-auto p-1.5")}
                                        onClick={() => setAvatarSeed(seed)}
                                        variant={avatarSeed === seed ? "default" : "outline"}
                                    >
                                        <UserAvatar seed={seed} size={40} />
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex items-center justify-end gap-3 border-t-2 border-black pt-5">
                        <DialogClose
                            render={
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    className="shadow-neo-sm font-bold"
                                >
                                    Cancel
                                </Button>
                            }
                        />
                        <Button
                            type="submit"
                            disabled={userMut.isPending}
                            className="shadow-neo-sm active-sink-sm gap-2 px-6 font-bold"
                        >
                            {userMut.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

            <Dialog open={!!previewSeed} onOpenChange={(isOpen) => !isOpen && setPreviewSeed(null)}>
                <DialogContent className="bg-card shadow-neo max-w-sm rounded-none p-6">
                    <DialogHeader className="border-b-2 border-black pb-4 text-left">
                        <DialogTitle className="font-clash flex items-center gap-2 text-xl font-bold tracking-tight">
                            <Eye className="text-foreground" size={20} /> Avatar Preview
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground font-mono text-xs">
                            Inspecting <strong className="text-foreground">{previewSeed}</strong>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col items-center justify-center gap-4 py-6">
                        <div className="shadow-neo bg-card p-4">
                            {previewSeed && <UserAvatar seed={previewSeed} size={200} />}
                        </div>
                        <span className="font-mono font-bold tracking-wider uppercase">{previewSeed}</span>
                    </div>

                    <DialogFooter className="flex items-center justify-end gap-3 border-t-2 border-black pt-4">
                        <DialogClose
                            render={
                                <Button type="button" variant="outline" size="sm" onClick={() => setPreviewSeed(null)}>
                                    Close
                                </Button>
                            }
                        />
                        <Button
                            type="button"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => {
                                if (previewSeed) setAvatarSeed(previewSeed);
                                setPreviewSeed(null);
                            }}
                        >
                            <Check size={14} /> Select This Seed
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Dialog>
    );
}
