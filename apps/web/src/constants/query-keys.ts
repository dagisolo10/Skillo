const queryRoots = {
    user: ["user"] as const,
    skill: ["skill"] as const,
};

export const queryKeys = {
    user: {
        me: (userId?: string) => [...queryRoots.user, "me", userId] as const,
        username: (username: string) => [...queryRoots.user, "username", username] as const,
    },
    skill: {
        paginated: () => [...queryRoots.skill],
    },
};
