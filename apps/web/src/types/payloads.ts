export type UpdateUserPayload = Partial<{
    name: string;
    username: string;
    bio: string | null;
    avatarSeed: string;
}>;
