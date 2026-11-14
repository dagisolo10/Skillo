export type User = {
    id: string;
    name: string;
    email: string;
    credits: number;
    username: string;
    createdAt: string;
    bio: string | null;
    avatarSeed: string;
};

export type SkillCategoryFilter = SkillCategory | "All";
export type SkillCategory = "Tech" | "Music" | "Languages" | "Design" | "Crafts" | "Wellness" | "Other";

type Skill = {
    id: string;
    name: string;
    emoji: string;
    createdAt: string;
    description: string;
    category: SkillCategory;
};

export type SkillDetail = Skill & {
    id: string;
    name: string;
    emoji: string;
    userId: string;
    createdAt: string;
    description: string;
    category: SkillCategory;
    user: {
        name: string;
        username: string;
        avatarSeed: string;
    };
};

export type SessionStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export type SessionUser = {
    id: string;
    name: string;
    username: string;
    avatarSeed: string;
};

export type SessionDetail = {
    id: string;
    skillId: string;
    mentorId: string;
    createdAt: string;
    learnerId: string;
    status: SessionStatus;
    acceptedAt: string | null;
    skill: {
        id: string;
        name: string;
        emoji: string | null;
        category: SkillCategory;
    };
    mentor: SessionUser;
    learner: SessionUser;
};
