import { Skill, SkillCategory } from "@/types/models";

const daysAgo = (days: number, hours = 0, minutes = 0) => new Date(Date.now() - days * 86_400_000 - hours * 3_600_000 - minutes * 60_000).toISOString();

const skill = (id: string, name: string, emoji: string, category: SkillCategory, description: string): Skill => ({
    id,
    name,
    emoji,
    category,
    description,
    createdAt: daysAgo(90),
});

export const SKILLS: Skill[] = [
    skill("sk-chess", "Chess Strategy", "♟️", "Wellness", "Openings that make sense and endgames that win."),
    skill("sk-uiux", "UI/UX & Neo-Brutalism", "🎨", "Design", "High-contrast layout systems, typography with attitude, Figma workflows."),
    skill("sk-ts", "TypeScript & Node.js", "💻", "Tech", "Types that actually help — from plain JS to strict, confident backend code."),
    skill("sk-piano", "Jazz Piano & Improvisation", "🎹", "Music", "Voicings, ii-V-I patterns and soloing without fear."),
    skill("sk-amharic", "Conversational Amharic", "🇪🇹", "Languages", "Speaking, listening and reading the fidel script."),
    skill("sk-rust", "Rust Systems Programming", "🦀", "Tech", "Ownership, borrowing and fearless concurrency, explained without the memes."),
    skill("sk-illustration", "Digital Illustration", "🖌️", "Design", "Character art and rendering, from sketch to finished piece."),
    skill("sk-drums", "Drum Fundamentals", "🥁", "Music", "Groove, limb independence and playing tight with a click."),
    skill("sk-cuisine", "Ethiopian Cuisine", "🍲", "Crafts", "Family recipes, spice blends and injera from scratch."),
    skill("sk-next", "Next.js & React", "⚛️", "Tech", "App Router, server actions and caching without the headaches."),
    skill("sk-french", "Conversational French", "🇫🇷", "Languages", "Full immersion — speak from minute five, coffee not included."),
    skill("sk-skate", "Skateboarding for Beginners", "🛹", "Crafts", "Pushing, ollies and not eating pavement."),
    skill("sk-postgres", "PostgreSQL & SQL Tuning", "🐘", "Tech", "Indexes, EXPLAIN plans and the queries that used to crawl."),
    skill("sk-singing", "Singing & Vocal Technique", "🎤", "Music", "Breath support, pitch and finding your real voice."),
    skill("sk-woodworking", "Woodworking Basics", "🪵", "Crafts", "Joinery, sharpening and building things that last."),
    skill("sk-guitar", "Acoustic Guitar", "🎸", "Music", "Chords, fingerpicking and barre chords that don't hurt."),
    skill("sk-logo", "Logo & Brand Identity", "✏️", "Design", "Marks that survive being photocopied, scaled and tattooed."),
    skill("sk-speaking", "Public Speaking", "📣", "Wellness", "Structure, nerves and holding a room's attention."),
    skill("sk-web3", "Smart Contract Security", "🔗", "Tech", "Auditing Solidity with an attacker's mindset."),
    skill("sk-japanese", "Japanese for Anime Fans", "🇯🇵", "Languages", "Survival grammar, casual speech and watching without subtitles."),
    skill("sk-photography", "Photography Basics", "📷", "Design", "Exposure triangle, composition and editing your first keepers."),
    skill("sk-python", "Python for Beginners", "🐍", "Tech", "From your first script to decorators and async — the friendly on-ramp."),
    skill("sk-musicprod", "Music Production (Ableton)", "🎛️", "Music", "Arrangement, sound design and finishing tracks instead of loops."),
    skill("sk-strength", "Strength Training Basics", "🏋️", "Wellness", "Form, programming and building a habit that sticks."),
    skill("sk-blender", "Blender 3D Modeling", "🧊", "Tech", "From primitives to a shaded, lit scene you're proud to render."),
    skill("sk-english", "Business English", "🗣️", "Languages", "Emails, meetings and small talk that doesn't feel small."),
    skill("sk-pottery", "Pottery & Ceramics", "🏺", "Crafts", "Centering, throwing and glazing your first cup."),
    skill("sk-writing", "Creative Writing", "📝", "Wellness", "Voice, rhythm and finishing what you start."),
    skill("sk-video", "Video Editing & Motion", "🎬", "Tech", "Cuts, pacing and motion graphics that keep people watching."),
];
