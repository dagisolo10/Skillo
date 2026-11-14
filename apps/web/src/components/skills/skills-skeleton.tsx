export default function SkillCardLoading({ limit }: { limit: number }) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: limit }).map((_, i) => (
                <SkillCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function SkillCardSkeleton() {
    return (
        <div className="bg-card shadow-neo flex min-h-64 animate-pulse flex-col justify-between gap-4 p-5">
            <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="bg-muted h-5 w-16 border border-black" />
                    <div className="bg-muted h-7 w-7 border border-black" />
                </div>

                <div className="space-y-1.5 pt-1">
                    <div className="bg-muted h-5 w-full border border-black" />
                    <div className="bg-muted h-5 w-3/4 border border-black" />
                </div>

                <div className="space-y-1 pt-1">
                    <div className="bg-muted h-3.5 w-full" />
                    <div className="bg-muted h-3.5 w-5/6" />
                </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t-2 border-black pt-4">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="bg-muted h-8 w-8 shrink-0 border border-black" />
                    <div className="min-w-0 space-y-1">
                        <div className="bg-muted h-3 w-20" />
                        <div className="bg-muted h-2.5 w-14" />
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <div className="bg-muted h-5 w-12" />
                    <div className="bg-muted h-5 w-12 border border-black" />
                </div>
            </div>
        </div>
    );
}
