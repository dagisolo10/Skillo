export type User = {
    id: string;
    name: string;
    email: string;
    credits: number;
    username: string;
    createdAt: string;
    avatarSeed: string;
};

export type SkillCategory = "Tech" | "Music" | "Languages" | "Design" | "Crafts" | "Wellness" | "Other";

export type Skill = {
    id: string;
    name: string;
    emoji: string;
    description: string;
    category: SkillCategory;
    createdAt: string;
};

export type SkillDetail = {
    id: string;
    name: string;
    emoji: string;
    createdAt: string;
    description: string;
    category: SkillCategory;
    user: {
        name: string;
        username: string;
        avatarSeed: string;
    };
};
