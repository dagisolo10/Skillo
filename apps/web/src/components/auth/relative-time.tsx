"use client";

export function RelativeTime() {
    return <time suppressHydrationWarning>{new Date().getFullYear()}</time>;
}
