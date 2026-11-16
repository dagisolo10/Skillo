export const queryRoots = {
    user: ["user"] as const,
    skill: ["skill"] as const,
    session: ["session"] as const,
};

export const queryKeys = {
    user: {
        me: (userId?: string) => [...queryRoots.user, "me", userId] as const,
        username: (username: string) => [...queryRoots.user, "username", username] as const,
    },
    skill: {
        all: (filter?: Record<string, string | number | boolean | undefined>) => [...queryRoots.skill, filter] as const,
        detail: (id: string) => [...queryRoots.skill, "detail", id] as const,
    },
    session: {
        root: () => [...queryRoots.session] as const,
        all: (userId?: string | null) => [...queryRoots.session, userId ?? "anonymous"] as const,
        detail: (userId: string | null | undefined, id: string) => [...queryRoots.session, userId ?? "anonymous", "detail", id] as const,
    },
};
