"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { SKILL_CATEGORIES } from "@/constants/data";
import { useCreateSkill, useUpdateSkill } from "@/hooks/tan-stack/skill";
import { SkillCategory, SkillDetail } from "@/types/models";
import { cn } from "cn";
import { Loader2 } from "lucide-react";
import { SubmitEvent, useState } from "react";
import z from "zod";

const skillSchema = z.object({
    name: z.string().trim().min(3, "Name must be at least 3 characters").max(80, "Name cannot exceed 80 characters"),
    emoji: z.string().trim().max(8, "Emoji cannot exceed 8 characters").optional(),
    description: z.string().trim().min(10, "Description must be at least 10 characters").max(500, "Description cannot exceed 500 characters"),
    category: z.enum(SKILL_CATEGORIES as [SkillCategory, ...SkillCategory[]]),
});

interface SkillFormModalProps {
    open: boolean;
    skill?: SkillDetail;
    onOpenChange: (open: boolean) => void;
}

export default function SkillFormModal({ open, skill, onOpenChange }: SkillFormModalProps) {
    const isEdit = !!skill;
    const createSkill = useCreateSkill();
    const updateSkill = useUpdateSkill(skill?.id ?? "");

    const [name, setName] = useState(skill?.name ?? "");
    const [emoji, setEmoji] = useState(skill?.emoji ?? "✨");
    const [description, setDescription] = useState(skill?.description ?? "");
    const [category, setCategory] = useState<SkillCategory>(skill?.category ?? "Tech");

    const isPending = createSkill.isPending || updateSkill.isPending;

    function saveChanges(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = skillSchema.safeParse({ name, emoji, description, category });

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

        const payload = { ...result.data, emoji: result.data.emoji || undefined };

        const onSuccess = () => {
            toast.add({
                type: "success",
                title: isEdit ? "Skill Updated" : "Skill Listed",
                description: isEdit ? "Your changes are live." : "Your skill is now on the marketplace.",
            });
            onOpenChange(false);
        };

        const onError = (error: Error) => {
            toast.add({
                type: "error",
                title: isEdit ? "Update Failed" : "Could Not List Skill",
                description: error.message || "Something went wrong. Please try again.",
            });
        };

        if (isEdit) {
            updateSkill.mutate(payload, { onSuccess, onError });
        } else {
            createSkill.mutate(payload, { onSuccess, onError });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card shadow-neo-lg max-w-lg! rounded-none p-6 lg:p-8">
                <DialogHeader className="border-b-2 pb-4 text-left">
                    <DialogTitle className="font-clash text-2xl font-bold tracking-tight">{isEdit ? "Edit Skill" : "List a Skill"}</DialogTitle>
                    <DialogDescription className="text-muted-foreground font-mono text-xs">
                        {isEdit ? "Update the details peers see in the marketplace." : "Offer a skill and start teaching sessions."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={saveChanges} className="space-y-6 pt-2">
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_6rem]">
                            <div className="space-y-1">
                                <Label htmlFor="skill-name" className="text-xs tracking-wider uppercase">
                                    Skill name
                                </Label>
                                <Input id="skill-name" value={name} maxLength={80} placeholder="e.g. Acoustic Fingerstyle Guitar" onChange={(event) => setName(event.target.value)} />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="skill-emoji" className="text-xs tracking-wider uppercase">
                                    Emoji
                                </Label>
                                <Input id="skill-emoji" value={emoji} maxLength={8} placeholder="✨" onChange={(event) => setEmoji(event.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="skill-description" className="text-xs tracking-wider uppercase">
                                Description
                            </Label>
                            <Textarea
                                id="skill-description"
                                value={description}
                                maxLength={500}
                                placeholder="What will a learner get from a session with you?"
                                onChange={(event) => setDescription(event.target.value)}
                                className="h-28 w-full resize-none"
                            />
                            <div className="text-muted-foreground mt-2 flex justify-end font-mono text-[10px]">
                                <span>{description.length}/500</span>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label id="skill-category-label" className="text-xs tracking-wider uppercase">
                                Category
                            </Label>
                            <div role="group" aria-labelledby="skill-category-label" className="flex flex-wrap gap-2">
                                {SKILL_CATEGORIES.map((candidate) => (
                                    <Button
                                        key={candidate}
                                        type="button"
                                        size="sm"
                                        variant={category === candidate ? "default" : "outline"}
                                        aria-pressed={category === candidate}
                                        className={cn("h-auto px-3 py-1 text-xs")}
                                        onClick={() => setCategory(candidate)}
                                    >
                                        {candidate}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex items-center justify-end gap-3 border-t-2 border-black pt-5">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="shadow-neo-sm font-bold">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending} className="shadow-neo-sm active-sink-sm gap-2 px-6 font-bold">
                            {isPending ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" /> Saving...
                                </>
                            ) : isEdit ? (
                                "Save Changes"
                            ) : (
                                "List Skill"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
