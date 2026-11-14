export type UpdateUserPayload = Partial<{
    name: string;
    username: string;
    bio: string | null;
    avatarSeed: string;
}>;

export type CreateSessionPayload = {
    skillId: string;
};
