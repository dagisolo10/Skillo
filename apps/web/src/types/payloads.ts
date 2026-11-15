import type { SkillCategory } from "@/types/models";

export type UpdateUserPayload = Partial<{
    name: string;
    username: string;
    bio: string | null;
    avatarSeed: string;
}>;

export type CreateSessionPayload = {
    skillId: string;
};

export type CreateSkillPayload = {
    name: string;
    emoji?: string;
    description: string;
    category: SkillCategory;
};

export type UpdateSkillPayload = Partial<CreateSkillPayload>;
