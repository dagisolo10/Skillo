"use client";

import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useGetUser } from "@/hooks/tan-stack/user";
import { createClient } from "@/lib/supabase/client";
import { cn } from "cn";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavLink {
    href: string;
    label: string;
    hidden?: string;
    primary?: boolean;
}

export default function Navbar() {
    const router = useRouter();
    const supabase = createClient();
    const { isSignedIn } = useAuth();
    const { data: user } = useGetUser({ enabled: isSignedIn });

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.push("/");
    }

    const publicLinks: NavLink[] = [
        { label: "How it Works", href: "/#how-it-works", hidden: "hidden lg:inline-flex" },
        { label: "Sign In", href: "/auth" },
        { label: "Sign Up", href: "/auth", primary: true },
    ];

    const authLinks: NavLink[] = [
        { href: "/skills", label: "Skills" },
        { href: "/sessions", label: "Sessions" },
        { label: "Dashboard", href: "/dashboard" },
    ];

    const currentLinks = isSignedIn ? authLinks : publicLinks;

    return (
        <header className="shadow-neo bg-card fixed top-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between gap-2">
                <div className="flex shrink-0 items-center gap-3">
                    <Link href="/" className="font-clash text-2xl font-black tracking-tight sm:text-3xl">
                        Skillo<span className="text-primary">.</span>
                    </Link>
                </div>

                <nav className="flex items-center gap-5 text-sm font-bold">
                    {currentLinks.map((link) => {
                        if (link.primary) {
                            return (
                                <Link key={link.label} href={link.href} className="bg-primary active-sink shadow-neo px-3 py-1.5 sm:px-4">
                                    {link.label}
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={cn("group text-muted-foreground/90 hover:text-foreground relative border-2 border-transparent py-1.5 transition-colors", link.hidden)}
                            >
                                <div className="bg-foreground absolute bottom-1 left-0 h-0.5 w-full origin-left transform-[scaleX(0)] transition-all duration-500 group-hover:transform-[scaleX(1)]" />
                                {link.label}
                            </Link>
                        );
                    })}

                    {isSignedIn ? (
                        <>
                            <Button size={"sm"} onClick={handleSignOut}>
                                Sign Out
                            </Button>

                            <Link href="/profile" className="bg-muted border-foreground shadow-neo-sm active-sink-sm cursor-pointer border-2 p-0.5" aria-label="Your profile">
                                <UserAvatar seed={user?.avatarSeed ?? "Felix"} size={40} />
                            </Link>
                        </>
                    ) : null}
                </nav>
            </div>
        </header>
    );
}
