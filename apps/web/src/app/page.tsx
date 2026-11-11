"use client";

import { RelativeTime } from "@/components/auth/relative-time";
import Navbar from "@/components/navbar";
import { SkillCard } from "@/components/skills/skill-card";
import { SKILLS } from "@/lib/mock/data";
import { cn } from "cn";
import { ArrowRight, ArrowUpRight, Zap } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";

const STEPS = [
    { bg: "bg-primary", title: "Teach & Earn", description: "List a skill you excel at, whether it's coding, drums, or cooking. Complete a teaching session and earn 1 Credit." },
    {
        bg: "bg-secondary",
        title: "Escrow Booking",
        description: "Book a session with a mentor. Your credit is held safely in escrow and only pays out when the session is completed and confirmed by both parties.",
    },
    { bg: "bg-accent", title: "Level Up", description: "Use your earned credits to learn from other skilled peers across the globe. Endless growth without spending real money." },
];

export default function LandingPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const skills = SKILLS.slice(0, 6);
    const categories = [...new Set(skills.map(({ category }) => category)), "All"];

    const filtered = selectedCategory === "All" ? skills : skills.filter(({ category }) => category === selectedCategory);

    return (
        <div className="relative">
            <Navbar />

            <div className="mt-36">
                <section className="mx-auto space-y-6 pt-8 pb-16 text-center">
                    <div className="bg-primary shadow-neo-sm inline-block -rotate-1 px-4 py-1.5 font-mono text-xs font-bold tracking-widest uppercase">⚡ Peer-to-Peer Skill Swapping Economy</div>

                    <h1 className="font-clash text-5xl leading-none font-black tracking-tight md:text-7xl">
                        TEACH WHAT YOU KNOW. <br />
                        <span className="bg-primary shadow-neo inline-block -translate-y-2 rotate-2 px-3">LEARN WHAT YOU DON&apos;T.</span>
                    </h1>

                    <p className="text-muted-foreground mx-auto max-w-2xl text-lg font-medium">
                        A credit-based barter platform for modern builders, creators, and minds. Earn credits by teaching your expertise, spend them to master something new. Zero cash barrier.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
                        <Link href="/auth" className="group bg-primary shadow-neo active-sink flex items-center gap-2 px-8 py-4 text-lg font-bold">
                            <span>Get Started Free</span>
                            <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
                        </Link>
                        <Link href="/skills" className="bg-card shadow-neo active-sink hover:bg-muted px-8 py-4 text-lg font-bold transition-colors">
                            Explore Marketplace
                        </Link>
                    </div>
                </section>

                <section id="how-it-works" className="mx-auto scroll-mt-12 border-t-4 border-black py-16">
                    <div className="mb-12 text-center">
                        <h2 className="font-clash text-3xl font-black md:text-4xl">HOW THE CREDIT ESCROW WORKS</h2>
                        <p className="text-muted-foreground mt-2 font-medium">Simple, fair, and decentralized knowledge exchange.</p>
                    </div>

                    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
                        {STEPS.map(({ title, description, bg }, index) => (
                            <div key={title} className="bg-card shadow-neo relative space-y-4 p-6">
                                <div className={cn(bg, "font-clash shadow-neo-sm absolute -top-4 -left-4 flex h-10 w-10 items-center justify-center text-lg font-black")}>{index + 1}</div>
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
                                Browse what peers are currently offering on Skillo{filtered.length ? ` — ${filtered.length} teachable skills and counting` : ""}.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={cn(
                                        "cursor-pointer px-3 py-1 text-xs font-bold transition-transform",
                                        selectedCategory === cat ? "bg-primary shadow-neo -translate-x-px -translate-y-px" : "bg-card shadow-neo-sm hover:bg-muted active-sink-sm",
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mx-auto max-w-7xl">
                        {filtered.length === 0 ? (
                            <div className="bg-card shadow-neo mx-auto max-w-md space-y-2 p-10 text-center">
                                <span className="text-4xl">🗂️</span>
                                <p className="font-clash text-xl font-black">Nothing in {selectedCategory} yet</p>
                                <p className="text-muted-foreground font-mono text-xs">Pick another category or browse everything.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {filtered.slice(0, 9).map((skill) => (
                                        <SkillCard key={skill.id} skill={skill} />
                                    ))}
                                </div>

                                <div className="mt-8 flex justify-center">
                                    <Link href="/skills" className="bg-primary shadow-neo active-sink hover:bg-primary/90 flex items-center gap-2 px-6 py-3 text-sm font-bold transition-colors">
                                        View the full marketplace <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                <section className="bg-primary shadow-neo-lg relative mx-auto my-16 max-w-7xl space-y-6 overflow-hidden border-4 border-black p-8 text-center md:p-12">
                    <div className="pointer-events-none absolute top-0 right-0 p-4 font-mono text-9xl font-black opacity-10">⚡</div>

                    <h2 className="font-clash text-4xl font-black tracking-tight md:text-5xl">READY TO SHARE YOUR EXPERTISE?</h2>

                    <p className="mx-auto flex max-w-xl items-center justify-center gap-2 text-base font-medium md:text-lg">
                        <Zap size={18} /> Join the P2P skill network today. Set up your profile, list your craft, and claim your starter credits.
                    </p>

                    <div className="pt-2">
                        <Link href="/auth" className="bg-card shadow-neo active-sink hover:bg-muted inline-block px-8 py-4 text-lg font-black transition-colors">
                            Create Free Account →
                        </Link>
                    </div>
                </section>

                <footer className="bg-card border-foreground mt-20 w-full border-t-4">
                    <div>
                        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 py-12 md:grid-cols-4 lg:grid-cols-4">
                            <div className="space-y-4 md:col-span-2">
                                <Link href="/" className="font-clash text-3xl font-black tracking-tight">
                                    Skillo<span className="text-primary">.</span>
                                </Link>

                                <p className="text-muted-foreground max-w-sm font-mono text-xs leading-relaxed">
                                    A credit-based peer-to-peer barter network. Teach your craft, earn ledger credits, and unlock masterclass skills without cash barriers.
                                </p>

                                <div className="flex items-center gap-2 pt-2">
                                    <span className="bg-primary shadow-neo-sm border-foreground border-2 px-2 py-0.5 font-mono text-[10px] font-black uppercase">⚡ Adama Cluster v2.4</span>
                                    <span className="bg-secondary shadow-neo-sm border-foreground border-2 px-2 py-0.5 font-mono text-[10px] font-black uppercase">P2P Active</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-clash text-sm font-black tracking-wider uppercase">Marketplace</h4>
                                <ul className="space-y-2 font-mono text-xs">
                                    <li>
                                        <Link href="/explore" className="text-muted-foreground hover:text-foreground flex items-center gap-1 hover:underline">
                                            Browse Skills <ArrowUpRight size={12} />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/sessions/new" className="text-muted-foreground hover:text-foreground flex items-center gap-1 hover:underline">
                                            Post a Skill <ArrowUpRight size={12} />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/#how-it-works" className="text-muted-foreground hover:text-foreground flex items-center gap-1 hover:underline">
                                            Escrow Model <ArrowUpRight size={12} />
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-clash text-sm font-black tracking-wider uppercase">Network</h4>
                                <ul className="space-y-2 font-mono text-xs">
                                    <li>
                                        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground hover:underline">
                                            Node Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/auth?mode=sign-up" className="text-muted-foreground hover:text-foreground hover:underline">
                                            Join Network
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/auth?mode=sign-in" className="text-muted-foreground hover:text-foreground hover:underline">
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

                                <div className="flex items-center gap-4">
                                    <Link href="/privacy" className="hover:text-foreground hover:underline">
                                        Privacy Policy
                                    </Link>
                                    <Link href="/terms" className="hover:text-foreground hover:underline">
                                        Terms of Service
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
