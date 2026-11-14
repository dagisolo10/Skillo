"use client";

import { RelativeTime } from "@/components/auth/relative-time";
import Navbar from "@/components/navbar";
import { SkillCard } from "@/components/skills/skill-card";
import SkillCardLoading from "@/components/skills/skills-skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBlock } from "@/components/ui/error-block";
import { CATEGORIES } from "@/constants/data";
import { useGetSkills } from "@/hooks/tan-stack/skill";
import { SkillCategoryFilter } from "@/types/models";
import { cn } from "cn";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";

const STEPS = [
    {
        bg: "bg-primary",
        title: "Teach & Earn",
        description:
            "List a skill you excel at, whether it's coding, drums, or cooking. Complete a teaching session and earn 1 Credit.",
    },
    {
        bg: "bg-secondary",
        title: "Escrow Booking",
        description:
            "Book a session with a mentor. Your credit is held safely in escrow and only pays out when the session is completed and confirmed by both parties.",
    },
    {
        bg: "bg-accent",
        title: "Level Up",
        description:
            "Use your earned credits to learn from other skilled peers across the globe. Endless growth without spending real money.",
    },
];

const LIMIT = 3;

export default function LandingPage() {
    const [category, setCategory] = useState<SkillCategoryFilter>("All");

    const skillsQuery = useGetSkills({ limit: LIMIT, category });

    return (
        <div className="relative">
            <Navbar />

            <div className="mt-36">
                <section className="mx-auto space-y-6 pt-8 pb-16 text-center">
                    <div className="bg-primary shadow-neo-sm inline-block -rotate-1 px-4 py-1.5 font-mono text-xs font-bold tracking-widest uppercase">
                        ⚡ Peer-to-Peer Skill Swapping Economy
                    </div>

                    <h1 className="font-clash text-5xl leading-none font-black tracking-tight md:text-7xl">
                        TEACH WHAT YOU KNOW. <br />
                        <span className="bg-primary shadow-neo inline-block -translate-y-2 rotate-2 px-3">
                            LEARN WHAT YOU DON&apos;T.
                        </span>
                    </h1>

                    <p className="text-muted-foreground mx-auto max-w-2xl text-lg font-medium">
                        A credit-based barter platform for modern builders, creators, and minds. Earn credits by
                        teaching your expertise, spend them to master something new. Zero cash barrier.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
                        <Link href="/auth">
                            <Button className="h-auto py-4 font-bold" size={"lg"}>
                                Get Started Free{" "}
                                <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-2" />
                            </Button>
                        </Link>

                        <Link href="/skills">
                            <Button className="h-auto py-4 font-bold" size={"lg"} variant={"outline"}>
                                Explore Marketplace
                            </Button>
                        </Link>
                    </div>
                </section>

                <section id="how-it-works" className="mx-auto scroll-mt-12 border-t-4 border-black py-16">
                    <div className="mb-12 text-center">
                        <h2 className="font-clash text-3xl font-black md:text-4xl">HOW THE CREDIT ESCROW WORKS</h2>
                        <p className="text-muted-foreground mt-2 font-medium">
                            Simple, fair, and decentralized knowledge exchange.
                        </p>
                    </div>

                    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
                        {STEPS.map(({ title, description, bg }, index) => (
                            <div key={title} className="bg-card shadow-neo relative space-y-4 p-6">
                                <div
                                    className={cn(
                                        bg,
                                        "font-clash shadow-neo-sm absolute -top-4 -left-4 flex h-10 w-10 items-center justify-center text-lg font-black",
                                    )}
                                >
                                    {index + 1}
                                </div>
                                <h3 className="font-clash pt-2 text-xl font-bold">{title}</h3>
                                <p className="text-muted-foreground text-sm font-medium">{description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mx-auto border-t-4 border-black py-16">
                    <div className="mx-auto mb-8 flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <h2 className="font-clash text-3xl font-black">LIVE SKILL BOARD</h2>
                            <p className="text-muted-foreground font-medium">
                                Browse what peers are currently offering on Skillo
                                {skillsQuery.items.length
                                    ? ` — ${skillsQuery.items.length} teachable skills and counting`
                                    : ""}
                                .
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => (
                                <Button
                                    variant={category === cat ? "default" : "outline"}
                                    key={cat}
                                    size={"sm"}
                                    onClick={() => setCategory(cat)}
                                    className={cn("h-auto py-1")}
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="mx-auto max-w-7xl">
                        {skillsQuery.isPending ? (
                            <SkillCardLoading limit={LIMIT} />
                        ) : skillsQuery.error ? (
                            <ErrorBlock
                                title="Failed to load skills"
                                description={skillsQuery.error.message}
                                onRetry={() => skillsQuery.refetch()}
                            />
                        ) : skillsQuery.items.length === 0 ? (
                            <EmptyState
                                emoji="🔍"
                                description="Try adjusting your category or search query."
                                action={<Button onClick={() => setCategory("All")}>Reset</Button>}
                                title={
                                    category === "All" ? "No skills available yet" : `No skills found in ${category}`
                                }
                            />
                        ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {skillsQuery.items.map((skill) => (
                                    <SkillCard key={skill.id} skill={skill} />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Link href="/skills">
                            <Button className="px-6 text-sm">
                                View the full marketplace{" "}
                                <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-2" />
                            </Button>
                        </Link>
                    </div>
                </section>

                <section className="bg-primary shadow-neo-lg relative mx-auto my-16 max-w-7xl space-y-6 overflow-hidden border-4 border-black p-8 text-center md:p-12">
                    <div className="pointer-events-none absolute top-0 right-0 p-4 font-mono text-9xl font-black opacity-10">
                        ⚡
                    </div>

                    <h2 className="font-clash text-4xl font-black tracking-tight md:text-5xl">
                        READY TO SHARE YOUR EXPERTISE?
                    </h2>

                    <p className="mx-auto max-w-xl font-medium md:text-lg">
                        Join the P2P skill network today. Set up your profile, list your craft, and claim your starter
                        credits.
                    </p>

                    <Link href="/auth">
                        <Button className="h-auto py-4 text-sm uppercase" variant={"outline"} size={"lg"}>
                            Create Free Account{" "}
                            <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-2" />
                        </Button>
                    </Link>
                </section>

                <footer className="bg-card border-foreground mt-20 w-full border-t-4">
                    <div>
                        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 py-12 md:grid-cols-4 lg:grid-cols-4">
                            <div className="space-y-4 md:col-span-2">
                                <Link href="/" className="font-clash text-3xl font-black tracking-tight">
                                    Skillo<span className="text-primary">.</span>
                                </Link>

                                <p className="text-muted-foreground max-w-sm font-mono text-xs leading-relaxed">
                                    A credit-based peer-to-peer barter network. Teach your craft, earn ledger credits,
                                    and unlock masterclass skills without cash barriers.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-clash text-sm font-black tracking-wider uppercase">Marketplace</h4>
                                <ul className="space-y-2 font-mono text-xs">
                                    <li>
                                        <Link
                                            href="/skills"
                                            className="text-muted-foreground hover:text-foreground flex items-center gap-1 hover:underline"
                                        >
                                            Browse Skills <ArrowUpRight size={12} />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/sessions/new"
                                            className="text-muted-foreground hover:text-foreground flex items-center gap-1 hover:underline"
                                        >
                                            Post a Skill <ArrowUpRight size={12} />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/#how-it-works"
                                            className="text-muted-foreground hover:text-foreground flex items-center gap-1 hover:underline"
                                        >
                                            Escrow Model <ArrowUpRight size={12} />
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-clash text-sm font-black tracking-wider uppercase">Network</h4>
                                <ul className="space-y-2 font-mono text-xs">
                                    <li>
                                        <Link
                                            href="/dashboard"
                                            className="text-muted-foreground hover:text-foreground hover:underline"
                                        >
                                            Node Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/auth?mode=sign-up"
                                            className="text-muted-foreground hover:text-foreground hover:underline"
                                        >
                                            Join Network
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/auth?mode=sign-in"
                                            className="text-muted-foreground hover:text-foreground hover:underline"
                                        >
                                            Peer Sign In
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-foreground/20 text-muted-foreground border-t-2 py-6">
                            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 font-mono text-xs sm:flex-row">
                                <div className="flex items-center gap-1.5">
                                    <span>©</span>
                                    <Suspense fallback={<time>...</time>}>
                                        <RelativeTime />
                                    </Suspense>
                                    <span className="text-foreground font-bold">Skillo P2P Network.</span>
                                    <span>Built with Neo-Brutalist precision.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
