"use client";

import { RelativeTime } from "@/components/auth/relative-time";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

export default function AuthForm() {
    const router = useRouter();

    const [isSignIn, setIsSignIn] = useState(true);

    const handleTabSwitch = (signInMode: boolean) => {
        setIsSignIn(signInMode);
        router.replace(`/auth?mode=${signInMode ? "sign-in" : "sign-up"}`, { scroll: false });
    };

    return (
        <div className="z-10 flex flex-col justify-between px-8 py-6 sm:px-16 sm:py-8 lg:w-1/2">
            <div className="flex items-center justify-between">
                <Link href="/" className="font-clash text-2xl font-black tracking-tight sm:text-3xl">
                    Skillo<span className="text-primary">.</span>
                </Link>

                <Link href="/" className="text-muted-foreground hover:text-foreground group flex items-center gap-1.5 font-mono text-sm font-bold">
                    <span className="inline-block transition-all duration-300 group-hover:-translate-x-2">←</span> Back to home
                </Link>
            </div>

            <div className="mx-auto my-auto w-full max-w-md space-y-4 py-2">
                <div className="space-y-3">
                    <h1 className="font-clash text-3xl font-black tracking-tight sm:text-4xl">{isSignIn ? "Welcome back." : "Join the network."}</h1>
                    <p className="text-muted-foreground text-xs font-medium sm:text-sm">
                        {isSignIn ? "Enter your credentials to manage your skill sessions and credit ledger." : "List your expertise, earn credits, and master new skills."}
                    </p>

                    <div className="bg-muted border-foreground/20 grid w-full grid-cols-2 gap-2 border p-1">
                        <Button type="button" onClick={() => handleTabSwitch(true)} variant={isSignIn ? "default" : "ghost"} size={"sm"} className={cn("tracking-wider uppercase")}>
                            Sign In
                        </Button>
                        <Button type="button" onClick={() => handleTabSwitch(false)} variant={!isSignIn ? "default" : "ghost"} size={"sm"} className={cn("tracking-wider uppercase")}>
                            Create Account
                        </Button>
                    </div>
                </div>

                {isSignIn ? <SignInForm /> : <SignUpForm />}
            </div>

            <div className="text-muted-foreground font-mono text-[11px]">
                ©{" "}
                <Suspense fallback={<time>...</time>}>
                    <RelativeTime />
                </Suspense>{" "}
                Skillo P2P Network.
            </div>
        </div>
    );
}
