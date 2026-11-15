"use client";

import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useGetUser } from "@/hooks/tan-stack/user";
import { createClient } from "@/lib/supabase/client";
import { cn } from "cn";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    async function handleSignOut() {
        setIsMenuOpen(false);
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
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="shadow-neo bg-card fixed top-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between gap-2">
                <div className="flex shrink-0 items-center gap-3">
                    <Link href="/" className="font-clash text-2xl font-black tracking-tight sm:text-3xl" onClick={closeMenu}>
                        Skillo<span className="text-primary">.</span>
                    </Link>
                </div>

                <nav className="hidden items-center gap-5 text-sm font-bold md:flex">
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

                <Button
                    size="icon-sm"
                    variant="outline"
                    className="md:hidden"
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-navigation"
                    onClick={() => setIsMenuOpen((open) => !open)}
                    aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
                >
                    {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </Button>
            </div>

            <div
                inert={!isMenuOpen}
                id="mobile-navigation"
                aria-hidden={!isMenuOpen}
                className={cn(isMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0", "grid transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden")}
            >
                <nav className="overflow-hidden">
                    <div className="mt-3 flex flex-col gap-2 border-t-2 border-black/20 pt-3 text-sm font-bold">
                        {currentLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={closeMenu}
                                tabIndex={isMenuOpen ? undefined : -1}
                                className={cn("active-sink-sm border-2 border-transparent px-2 py-2", link.primary && "bg-primary shadow-neo border-black text-center", link.hidden && "hidden")}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {isSignedIn && (
                            <>
                                <Link href="/profile" onClick={closeMenu} tabIndex={isMenuOpen ? undefined : -1} className="flex items-center gap-2 px-2 py-2">
                                    <span className="bg-muted border-foreground shadow-neo-sm border-2 p-0.5">
                                        <UserAvatar seed={user?.avatarSeed ?? "Felix"} size={28} />
                                    </span>
                                    Profile
                                </Link>
                                <Button size="sm" onClick={handleSignOut} tabIndex={isMenuOpen ? undefined : -1} className="w-full">
                                    Sign Out
                                </Button>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
