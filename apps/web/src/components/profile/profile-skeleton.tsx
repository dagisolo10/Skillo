export default function ProfileSkeleton() {
    return (
        <div className="bg-background relative min-h-screen w-full p-6 lg:p-12">
            <div className="mx-auto max-w-7xl animate-pulse space-y-10">
                <div className="space-y-3">
                    <div className="bg-muted h-5 w-36 border border-black" />
                    <div className="bg-muted h-10 w-72 border border-black" />
                    <div className="bg-muted h-4 w-full max-w-xl" />
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="bg-card shadow-neo flex flex-col justify-between space-y-6 p-8 lg:col-span-8">
                        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-5">
                                <div className="bg-muted shadow-neo-sm size-19 border-2 border-black" />
                                <div className="space-y-2">
                                    <div className="bg-muted h-8 w-48 border border-black" />
                                    <div className="bg-muted h-3.5 w-28" />
                                </div>
                            </div>
                            <div className="bg-muted h-9 w-36 border-2 border-black" />
                        </div>

                        <div className="bg-muted/50 space-y-2 border-2 border-black p-4">
                            <div className="bg-muted h-3 w-24" />
                            <div className="bg-muted h-3.5 w-full" />
                            <div className="bg-muted h-3.5 w-2/3" />
                        </div>

                        <div className="border-t-2 border-black pt-5">
                            <div className="bg-primary shadow-neo h-10 w-40" />
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-4">
                        <div className="bg-primary shadow-neo space-y-3 border-2 border-black p-6">
                            <div className="bg-card h-5 w-28 border border-black" />
                            <div className="bg-card/60 h-14 w-32 border border-black" />
                            <div className="bg-card/40 h-3 w-full border-t-2 border-black/20" />
                        </div>

                        <div className="bg-card shadow-neo grid grid-cols-3 divide-x-2 divide-black border-2 border-black">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="flex flex-col items-center gap-2 p-4">
                                    <div className="bg-muted size-6 border border-black" />
                                    <div className="bg-muted h-3 w-14" />
                                    <div className="bg-muted h-4 w-8" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, column) => (
                        <div key={column} className="bg-card shadow-neo space-y-5 border-2 border-black p-6">
                            <div className="flex items-center justify-between border-b-2 border-black pb-4">
                                <div className="bg-muted h-6 w-40" />
                                <div className="bg-muted h-8 w-24 border border-black" />
                            </div>
                            <div className="bg-muted h-3 w-full max-w-sm" />
                            <div className="space-y-3">
                                {Array.from({ length: 2 }).map((_, row) => (
                                    <div key={row} className="bg-background shadow-neo-sm flex items-start justify-between gap-3 border-2 border-black p-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="bg-muted h-4 w-3/4" />
                                            <div className="bg-muted h-3 w-full" />
                                        </div>
                                        <div className="flex gap-1.5">
                                            <div className="bg-muted size-8 border border-black" />
                                            <div className="bg-muted size-8 border border-black" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-card shadow-neo space-y-6 border-2 border-black p-8">
                    <div className="flex items-center justify-between border-b-2 border-black pb-4">
                        <div className="space-y-2">
                            <div className="bg-muted h-6 w-56" />
                            <div className="bg-muted h-3 w-72" />
                        </div>
                        <div className="bg-muted h-8 w-28 border-2 border-black" />
                    </div>

                    <div className="bg-background divide-y-2 divide-black border-2 border-black">
                        {Array.from({ length: 4 }).map((_, row) => (
                            <div key={row} className="flex items-center justify-between gap-3 p-4">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="bg-muted h-6 w-20 border-2 border-black" />
                                    <div className="bg-muted h-3.5 w-56 max-w-full" />
                                </div>
                                <div className="flex shrink-0 items-center gap-6">
                                    <div className="bg-muted h-3 w-24" />
                                    <div className="bg-muted h-4 w-10" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
