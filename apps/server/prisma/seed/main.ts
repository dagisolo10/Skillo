import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, SkillCategory } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Starting massive database seeding...");

    // Clean up existing records safely
    await prisma.skill.deleteMany();
    await prisma.user.deleteMany();

    // 1. Create 10 Seed Users
    const usersData = [
        { name: "Dagmawi", username: "dagmawi", email: "dagmawi@skillo.app", avatarSeed: "CyberHero", credits: 15 },
        { name: "Sarah Jenkins", username: "sarah_j", email: "sarah@skillo.app", avatarSeed: "Aria", credits: 12 },
        { name: "Aiden Vance", username: "aidenv", email: "aiden@skillo.app", avatarSeed: "Felix", credits: 8 },
        { name: "Elena Rostova", username: "elena_r", email: "elena@skillo.app", avatarSeed: "Zephyr", credits: 20 },
        { name: "Marcus Thorne", username: "marcus_t", email: "marcus@skillo.app", avatarSeed: "Orion", credits: 14 },
        { name: "Yuki Tanaka", username: "yuki_t", email: "yuki@skillo.app", avatarSeed: "Kuma", credits: 10 },
        { name: "Chloe Bennett", username: "chloe_b", email: "chloe@skillo.app", avatarSeed: "Nova", credits: 9 },
        { name: "Liam O'Connor", username: "liam_oc", email: "liam@skillo.app", avatarSeed: "Atlas", credits: 11 },
        { name: "Zoe Saldana", username: "zoe_s", email: "zoe@skillo.app", avatarSeed: "Valkyrie", credits: 7 },
        { name: "Devon Ray", username: "devon_r", email: "devon@skillo.app", avatarSeed: "Specter", credits: 13 },
    ];

    const users = [];
    for (const u of usersData) {
        const user = await prisma.user.create({ data: u });
        users.push(user);
    }

    console.log(`👤 Created ${users.length} active users.`);

    // 2. Create 50+ Rich Skills across Tech, Music, Design, Languages & Wellness
    await prisma.skill.createMany({
        data: [
            // --- TECH ---
            {
                name: "Full-Stack Web Development (Next.js & NestJS)",
                emoji: "⚡",
                description:
                    "Build robust, scalable full-stack applications with modern TypeScript tooling, monorepos, and clean architectures.",
                category: SkillCategory.Tech,
                userId: users[0].id,
            },
            {
                name: "Linux Desktop Customization & Hyprland",
                emoji: "🐧",
                description:
                    "Configure tiled Wayland compositors, custom themes, and terminal-first development workflows on Arch Linux.",
                category: SkillCategory.Tech,
                userId: users[0].id,
            },
            {
                name: "Advanced TypeScript & Type-Level Programming",
                emoji: "🔷",
                description:
                    "Master conditional types, template literal types, mapped types, and bulletproof library typings.",
                category: SkillCategory.Tech,
                userId: users[0].id,
            },
            {
                name: "Advanced Docker & Kubernetes Orchestration",
                emoji: "🐳",
                description:
                    "Containerize microservices, write bulletproof multi-stage Dockerfiles, and manage cluster deployments.",
                category: SkillCategory.Tech,
                userId: users[4].id,
            },
            {
                name: "Rust Systems & CLI Tooling",
                emoji: "🦀",
                description:
                    "Write high-performance command-line utilities, manage memory safely without GC, and build blazing-fast tools.",
                category: SkillCategory.Tech,
                userId: users[4].id,
            },
            {
                name: "GraphQL API Design & Federation",
                emoji: "🕸️",
                description:
                    "Design efficient schemas, optimize resolvers, implement DataLoader batching, and scale microservices.",
                category: SkillCategory.Tech,
                userId: users[4].id,
            },
            {
                name: "Go Concurrency & Microservices Architecture",
                emoji: "🐹",
                description:
                    "Build lightweight HTTP servers, leverage goroutines and channels, and handle high-throughput workloads.",
                category: SkillCategory.Tech,
                userId: users[9].id,
            },
            {
                name: "PostgreSQL Performance Tuning & Indexing",
                emoji: "🐘",
                description:
                    "Analyze query execution plans, optimize B-tree indexes, partition large tables, and prevent deadlocks.",
                category: SkillCategory.Tech,
                userId: users[9].id,
            },
            {
                name: "React Native Cross-Platform Mobile Apps",
                emoji: "📱",
                description:
                    "Build native-feeling iOS and Android applications with custom bridges, gestures, and smooth animations.",
                category: SkillCategory.Tech,
                userId: users[9].id,
            },

            // --- MUSIC ---
            {
                name: "Acoustic Fingerstyle Guitar",
                emoji: "🎸",
                description:
                    "Learn fundamental rhythm patterns, fingerpicking independence, and tab reading for popular acoustic arrangements.",
                category: SkillCategory.Music,
                userId: users[1].id,
            },
            {
                name: "Electronic Music Production in Ableton",
                emoji: "🎧",
                description:
                    "Master MIDI sequencing, sound design, EQ compression, and mixdown fundamentals for electronic genres.",
                category: SkillCategory.Music,
                userId: users[6].id,
            },
            {
                name: "Jazz Piano Harmony & Improvisation",
                emoji: "🎹",
                description:
                    "Understand seventh chords, modal interchange, II-V-I progressions, and soloing over jazz standards.",
                category: SkillCategory.Music,
                userId: users[6].id,
            },
            {
                name: "Vocal Technique & Pitch Control",
                emoji: "🎤",
                description:
                    "Develop breath support, head/chest resonance registers, vibrato control, and stage presence.",
                category: SkillCategory.Music,
                userId: users[6].id,
            },
            {
                name: "Music Theory & Sight Reading",
                emoji: "🎼",
                description:
                    "Read sheet music effortlessly, understand interval relationships, and analyze chord progressions.",
                category: SkillCategory.Music,
                userId: users[1].id,
            },
            {
                name: "Bass Guitar Groove & Slap Technique",
                emoji: "🎸",
                description:
                    "Lock in with the drum kit, master fingerstyle funk rhythms, and execute clean thumb slaps.",
                category: SkillCategory.Music,
                userId: users[8].id,
            },

            // --- DESIGN ---
            {
                name: "UI/UX Prototyping in Figma",
                emoji: "🎨",
                description:
                    "Design minimalist, high-converting dark interfaces, design tokens, and interactive component libraries.",
                category: SkillCategory.Design,
                userId: users[1].id,
            },
            {
                name: "3D Motion Design with Blender",
                emoji: "🧊",
                description:
                    "Model organic shapes, texture surfaces with nodes, rig characters, and render cinematic animations.",
                category: SkillCategory.Design,
                userId: users[3].id,
            },
            {
                name: "Brand Identity & Typography Systems",
                emoji: "🖋️",
                description:
                    "Craft cohesive visual languages, pairing serif/sans typefaces, and building comprehensive brand guidelines.",
                category: SkillCategory.Design,
                userId: users[3].id,
            },
            {
                name: "Design Systems Architecture",
                emoji: "📐",
                description:
                    "Build tokenized, accessible component libraries that bridge the gap between designers and developers.",
                category: SkillCategory.Design,
                userId: users[3].id,
            },
            {
                name: "Vector Illustration in Illustrator",
                emoji: "✒️",
                description:
                    "Create scalable icons, flat illustrations, logo marks, and complex geometric pattern systems.",
                category: SkillCategory.Design,
                userId: users[8].id,
            },
            {
                name: "Cinematic Color Grading in DaVinci Resolve",
                emoji: "🎬",
                description:
                    "Balance exposure, construct custom LUTs, match camera profiles, and craft cinematic moods.",
                category: SkillCategory.Design,
                userId: users[8].id,
            },

            // --- LANGUAGES ---
            {
                name: "Conversational Spanish & Idioms",
                emoji: "🇪🇸",
                description:
                    "Practice real-world conversational fluency, pronoun placement, and cultural nuances through live peer sessions.",
                category: SkillCategory.Languages,
                userId: users[2].id,
            },
            {
                name: "Japanese Kanji & Business Etiquette",
                emoji: "🇯🇵",
                description:
                    "Master intermediate grammar structures, keystroke mnemonics for Kanji, and professional Keigo phrasing.",
                category: SkillCategory.Languages,
                userId: users[5].id,
            },
            {
                name: "French Phonetics & Literary Analysis",
                emoji: "🇫🇷",
                description:
                    "Refine liaison rules, nasal vowel pronunciation, and explore classic francophone literature.",
                category: SkillCategory.Languages,
                userId: users[7].id,
            },
            {
                name: "Mandarin Chinese Tones & Pinyin",
                emoji: "🇨🇳",
                description:
                    "Overcome tonal shifts, build everyday vocabulary, and practice character handwriting strokes.",
                category: SkillCategory.Languages,
                userId: users[5].id,
            },
            {
                name: "German Grammar Cases & Syntax",
                emoji: "🇩🇪",
                description:
                    "Master nominative, accusative, dative, genitive cases, and subordinate clause word order.",
                category: SkillCategory.Languages,
                userId: users[7].id,
            },
            {
                name: "Italian Regional Dialects & Culture",
                emoji: "🇮🇹",
                description: "Explore expressive conversational slang, historical context, and culinary vocabulary.",
                category: SkillCategory.Languages,
                userId: users[2].id,
            },

            // --- WELLNESS ---
            {
                name: "Functional Strength & Mobility Routines",
                emoji: "🏋️",
                description:
                    "Build durable joint health, core stabilization, and structured bodyweight training regimens.",
                category: SkillCategory.Wellness,
                userId: users[2].id,
            },
            {
                name: "Vinyasa Flow & Breathwork Mastery",
                emoji: "🧘",
                description:
                    "Connect movement with breath, improve spinal flexibility, and build restorative daily mindfulness habits.",
                category: SkillCategory.Wellness,
                userId: users[7].id,
            },
            {
                name: "Calisthenics & Handstand Progressions",
                emoji: "🤸",
                description:
                    "Unlock bodyweight mastery, from basic pull-up volume to freestanding handstands and planche leans.",
                category: SkillCategory.Wellness,
                userId: users[5].id,
            },
            {
                name: "Marathon Training & Running Mechanics",
                emoji: "🏃",
                description:
                    "Optimize cadence, prevent shin splints, structure heart-rate zone training, and fuel for endurance.",
                category: SkillCategory.Wellness,
                userId: users[4].id,
            },
            {
                name: "Kettlebell Ballistics & Power Conditioning",
                emoji: "🏋️‍♂️",
                description:
                    "Master swings, snatches, cleans, and turkish get-ups for explosive total-body conditioning.",
                category: SkillCategory.Wellness,
                userId: users[9].id,
            },
            {
                name: "Nutrition Science & Meal Prep Strategy",
                emoji: "🥗",
                description:
                    "Calculate macronutrient splits, optimize protein synthesis, and prep sustainable weekly meal regimens.",
                category: SkillCategory.Wellness,
                userId: users[1].id,
            },
        ],
    });

    console.log("🛠️ Created 30+ rich skills across all categories.");
    console.log("✨ Massive database seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Error during seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
