"use client";

import { SkillCard } from "@/components/skills/skill-card";
import SkillFormModal from "@/components/skills/skill-form-modal";
import SkillCardLoading, { SkillCardSkeleton } from "@/components/skills/skills-skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBlock } from "@/components/ui/error-block";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { CATEGORIES } from "@/constants/data";
import useDebounce from "@/hooks/custom/use-debounce";
import { useGetSkills } from "@/hooks/tan-stack/skill";
import { SkillCategoryFilter } from "@/types/models";
import { cn } from "cn";
import { Loader2, Plus, Search, X } from "lucide-react";
import { useState } from "react";

const LIMIT = 9;

export default function SkillsPage() {
    const [search, setSearch] = useState("");
    const name = useDebounce(search);
    const [category, setCategory] = useState<SkillCategoryFilter>("All");
    const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);

    const skillsQuery = useGetSkills({ category, name, limit: LIMIT });

    return (
        <div className="bg-background min-h-screen w-full p-6 lg:p-10">
            <div className="mx-auto max-w-7xl space-y-8">
                <PageHeader
                    title="Explore Skills"
                    eyebrow="⚡ Marketplace"
                    description="Browse skills offered by peers. Book a session, hold your credit in escrow, and start learning."
                    action={
                        <div className="flex items-center gap-3">
                            <span className="text-muted-foreground font-mono text-xs font-bold">
                                {skillsQuery.items.length} loaded skill{skillsQuery.items.length === 1 ? "" : "s"}
                            </span>
                            <Button onClick={() => setIsAddSkillOpen(true)}>
                                <Plus size={14} /> Add Skill
                            </Button>
                        </div>
                    }
                />

                <div className="bg-card shadow-neo space-y-4 p-5">
                    <div className="group/search relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            className="peer pr-4 pl-10"
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search skills — try 'guitar', 'rust', 'pottery'…"
                        />
                        <button aria-label="Clear search" onClick={() => setSearch("")} className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer">
                            <X className="text-muted-foreground/60 hover:text-muted-foreground size-4 opacity-0 transition-[colors,opacity] duration-300 group-focus-within/search:opacity-100" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                            {CATEGORIES.map((candidate) => (
                                <Button
                                    size={"sm"}
                                    key={candidate}
                                    onClick={() => setCategory(candidate)}
                                    className={cn("h-auto px-3 py-1 text-xs")}
                                    variant={category === candidate ? "default" : "outline"}
                                >
                                    {candidate}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {skillsQuery.isPending ? (
                    <SkillCardLoading limit={LIMIT} />
                ) : skillsQuery.isError && (!skillsQuery.items || skillsQuery.items.length === 0) ? (
                    <ErrorBlock title="Failed to load skills" description={skillsQuery.error.message} onRetry={() => skillsQuery.refetch()} />
                ) : !skillsQuery.items || skillsQuery.items.length === 0 ? (
                    <EmptyState
                        emoji="🔍"
                        title={name ? `No skills match "${name}"` : `No skills found in ${category}`}
                        description="Try adjusting your category or search query."
                        action={
                            <Button
                                onClick={() => {
                                    setSearch("");
                                    setCategory("All");
                                }}
                            >
                                Reset
                            </Button>
                        }
                    />
                ) : (
                    <div className="space-y-8">
                        <div className="group/grid grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {skillsQuery.items.map((skill) => (
                                <SkillCard key={skill.id} skill={skill} />
                            ))}

                            {skillsQuery.isFetchingNextPage && Array.from({ length: 3 }).map((_, index) => <SkillCardSkeleton key={`next-page-skeleton-${index}`} />)}
                        </div>

                        <div className="flex flex-col items-center justify-center gap-4 pt-4">
                            {skillsQuery.isFetchNextPageError ? (
                                <ErrorBlock title="Failed to fetch the next batch of skills." description={skillsQuery.error.message} onRetry={() => skillsQuery.fetchNextPage()} />
                            ) : skillsQuery.hasNextPage ? (
                                <Button onClick={() => skillsQuery.fetchNextPage()} disabled={skillsQuery.isFetchingNextPage} className="shadow-neo-sm active-sink-sm px-6 py-3 font-bold">
                                    {skillsQuery.isFetchingNextPage ? (
                                        <>
                                            <Loader2 className="mr-2 size-4 animate-spin" /> Fetching more...
                                        </>
                                    ) : (
                                        "Load More Skills"
                                    )}
                                </Button>
                            ) : (
                                <p className="text-muted-foreground font-mono text-xs font-bold">🎉 You&apos;ve reached the end of the marketplace feed.</p>
                            )}

                            <span className="text-muted-foreground font-mono text-xs font-bold">
                                Showing <span className="text-foreground font-black">{skillsQuery.items.length}</span> loaded skill{skillsQuery.items.length === 1 ? "" : "s"}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {isAddSkillOpen && <SkillFormModal open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen} />}
        </div>
    );
}
