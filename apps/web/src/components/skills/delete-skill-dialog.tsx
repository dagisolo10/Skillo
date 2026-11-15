"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { useDeleteSkill } from "@/hooks/tan-stack/skill";
import { SkillDetail } from "@/types/models";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteSkillDialogProps {
    open: boolean;
    skill: SkillDetail;
    onDeleted?: () => void;
    onOpenChange: (open: boolean) => void;
}

export default function DeleteSkillDialog({ open, skill, onOpenChange, onDeleted }: DeleteSkillDialogProps) {
    const deleteSkill = useDeleteSkill();

    function handleDelete() {
        deleteSkill.mutate(skill.id, {
            onSuccess: () => {
                toast.add({
                    type: "success",
                    title: "Skill Removed",
                    description: "The skill is no longer listed. Session history is preserved.",
                });
                onOpenChange(false);
                onDeleted?.();
            },
            onError: (error) => {
                toast.add({
                    type: "error",
                    title: "Delete Failed",
                    description: error.message || "Could not remove the skill. Please try again.",
                });
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card shadow-neo-lg rounded-none p-6 lg:p-8">
                <DialogHeader className="border-b-2 pb-4 text-left">
                    <DialogTitle className="font-clash flex items-center gap-2 text-2xl font-bold tracking-tight">
                        <Trash2 size={22} /> Remove Skill
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-mono text-xs">
                        This takes <span className="text-foreground font-bold">{skill.name}</span> off the marketplace. Existing sessions keep their history.
                    </DialogDescription>
                </DialogHeader>

                <p className="font-mono text-xs leading-relaxed font-bold">Peers will no longer be able to book new sessions for this skill.</p>

                <DialogFooter className="flex items-center justify-end gap-3 border-t-2 border-black pt-5">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="shadow-neo-sm font-bold">
                        Cancel
                    </Button>
                    <Button type="button" variant="destructive" disabled={deleteSkill.isPending} onClick={handleDelete} className="shadow-neo-sm active-sink-sm gap-2 px-6 font-bold">
                        {deleteSkill.isPending ? (
                            <>
                                <Loader2 size={14} className="animate-spin" /> Removing...
                            </>
                        ) : (
                            "Remove Skill"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
