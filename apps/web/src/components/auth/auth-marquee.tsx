import { UserAvatar } from "@/components/ui/avatar";
import { cn } from "cn";

interface SkillCard {
    tag: string;
    seed: string;
    color: string;
    title: string;
    credits: number;
    teacher: string;
    category: string;
}

const COLUMN_ONE: SkillCard[] = [
    {
        title: "Full-Stack Web Dev (Next.js & Go)",
        category: "Tech",
        credits: 1,
        seed: "Felix",
        teacher: "Dagmawi",
        tag: "Expert",
        color: "bg-primary",
    },
    {
        title: "Neo-Brutalist UI & Layout Systems",
        category: "Design",
        credits: 1,
        seed: "Zack",
        teacher: "Aria K.",
        tag: "Advanced",
        color: "bg-secondary",
    },
    {
        title: "Acoustic Guitar Fingerpicking",
        category: "Music",
        credits: 1,
        seed: "Sasha",
        teacher: "Sarah M.",
        tag: "Intermediate",
        color: "bg-accent",
    },
];

const COLUMN_TWO: SkillCard[] = [
    {
        title: "Rust Memory Management & Async",
        category: "Tech",
        credits: 1,
        seed: "Gizmo",
        teacher: "Alex R.",
        tag: "Advanced",
        color: "bg-secondary",
    },
    {
        title: "Jazz Piano Improvisation & Chords",
        category: "Music",
        credits: 1,
        seed: "Aneka",
        teacher: "Elena P.",
        tag: "Intermediate",
        color: "bg-primary",
    },
    {
        title: "PostgreSQL Query Optimization",
        category: "Tech",
        credits: 1,
        seed: "Pepper",
        teacher: "Marcus B.",
        tag: "Expert",
        color: "bg-accent",
    },
];

const COLUMN_THREE: SkillCard[] = [
    {
        title: "Digital Illustration & Character Art",
        category: "Design",
        credits: 1,
        seed: "Ziggy",
        teacher: "Chloe T.",
        tag: "All Levels",
        color: "bg-secondary",
    },
    {
        title: "Conversational French Practice",
        category: "Languages",
        credits: 1,
        seed: "Milo",
        teacher: "Julien V.",
        tag: "All Levels",
        color: "bg-primary",
    },
    {
        title: "Smart Contract Security Auditing",
        category: "Tech",
        credits: 1,
        seed: "Shadow",
        teacher: "Kaleb T.",
        tag: "Expert",
        color: "bg-accent",
    },
];

export function AuthMarquee() {
    return (
        <div className="border-foreground perspective-scene relative hidden h-screen w-1/2 overflow-hidden border-l-2 lg:block">
            <div className="from-background to-background h pointer-events-none absolute inset-0 z-20 bg-linear-to-b via-transparent" />

            <div className="bg-primary shadow-neo absolute top-8 right-8 z-30 rotate-3 px-3 py-1 font-mono text-xs font-black tracking-widest uppercase">⚡ Live Swap Feed</div>

            <div className="marquee-rail-tilt h-full w-full scale-110 opacity-90">
                <div className="grid h-full grid-cols-3 gap-3 px-4 pt-4">
                    <div className="group flex flex-col gap-3">
                        <div className="animate-marquee-up flex flex-col gap-3">
                            {[...COLUMN_ONE, ...COLUMN_ONE].map((skill, idx) => (
                                <MarqueeCard key={`c1-${idx}`} skill={skill} />
                            ))}
                        </div>
                    </div>

                    <div className="group flex flex-col gap-3 pt-8">
                        <div className="animate-marquee-down flex flex-col gap-3">
                            {[...COLUMN_TWO, ...COLUMN_TWO].map((skill, idx) => (
                                <MarqueeCard key={`c2-${idx}`} skill={skill} />
                            ))}
                        </div>
                    </div>

                    <div className="group flex flex-col gap-3 pt-4">
                        <div className="animate-marquee-up flex flex-col gap-3" style={{ animationDuration: "28s" }}>
                            {[...COLUMN_THREE, ...COLUMN_THREE].map((skill, idx) => (
                                <MarqueeCard key={`c3-${idx}`} skill={skill} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MarqueeCard({ skill }: { skill: SkillCard }) {
    return (
        <div className="bg-card shadow-neo flex flex-col justify-between space-y-3 p-5 transition-transform duration-300 hover:scale-[1.05]">
            <div className="flex items-center justify-between">
                <span className={cn(skill.color, "border-foreground border px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase")}>{skill.category}</span>
                <span className="bg-primary shadow-neo-sm flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] font-bold">⚡ {skill.credits} Credit</span>
            </div>

            <h3 className="font-clash text-base leading-snug font-black">{skill.title}</h3>

            <div className="border-foreground/20 flex items-center justify-between border-t pt-3">
                <div className="flex items-center gap-2.5">
                    <div className="border-foreground bg-muted border p-0.5">
                        <UserAvatar seed={skill.seed} size={28} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs leading-none font-bold">{skill.teacher}</p>
                        <p className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">{skill.tag}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
