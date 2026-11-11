export const slugifyUsername = (username: string): string => {
    return username
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, USERNAME_MAX);
};

export const USERNAME_MIN = 3;
const USERNAME_MAX = 30;

export function normalizeUsername(input: string): string | null {
    const slug = slugifyUsername(input);

    return slug.length >= USERNAME_MIN ? slug : null;
}
