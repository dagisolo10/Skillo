"use client";

import { RelativeTime } from "@/components/auth/relative-time";
import { AvatarPicker } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSignInForm } from "@/hooks/custom/use-sign-in-form";
import { useSignUpForm } from "@/hooks/custom/use-sign-up-form";
import { cn } from "cn";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { FieldError } from "react-hook-form";

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

function SignInForm() {
    const { form, showPassword, setShowPassword, authError, onSubmit } = useSignInForm();
    const {
        register,
        formState: { errors, isSubmitting },
    } = form;

    return (
        <div className="space-y-3">
            {authError && <div className="shadow-neo-sm border-2 border-red-500 bg-red-500/10 p-2.5 font-mono text-xs font-bold text-red-500">⚠️ {authError}</div>}

            <form onSubmit={onSubmit} className="space-y-3">
                <div className="space-y-1">
                    <label className="font-mono text-[11px] font-bold tracking-wider uppercase">Email Address</label>
                    <input
                        type="email"
                        placeholder="name@example.com"
                        {...register("email")}
                        className="bg-card border-foreground shadow-neo-sm w-full border-2 px-3.5 py-2 text-xs font-medium outline-none focus:translate-x-0.5 focus:translate-y-0.5"
                    />
                    <ErrorMessage error={errors.email} />
                </div>

                <div className="space-y-1">
                    <label className="font-mono text-[11px] font-bold tracking-wider uppercase">Password</label>
                    <div className="relative">
                        <input
                            placeholder="••••••••"
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            className="bg-card border-foreground shadow-neo-sm w-full border-2 px-3.5 py-2 pr-10 text-xs font-medium outline-none focus:translate-x-0.5 focus:translate-y-0.5"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer p-1"
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                    </div>
                    <ErrorMessage error={errors.password} />
                </div>

                <Button type="submit" disabled={isSubmitting} className="group mt-2 w-full font-black tracking-wider uppercase">
                    {isSubmitting ? "Processing..." : "Sign In "}
                    <span className="inline-block transition-all duration-300 group-hover:translate-x-2">→</span>
                </Button>
            </form>
        </div>
    );
}

function SignUpForm() {
    const { form, avatarSeed, setAvatarSeed, showPassword, setShowPassword, authError, debouncedUsername, usernameAvailableQuery, onSubmit } = useSignUpForm();
    const {
        register,
        setValue,
        formState: { errors, isSubmitting },
    } = form;

    return (
        <div className="space-y-3">
            {authError && <div className="shadow-neo-sm border-2 border-red-500 bg-red-500/10 p-2.5 font-mono text-xs font-bold text-red-500">⚠️ {authError}</div>}

            <form onSubmit={onSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                        <label className="font-mono text-[11px] font-bold tracking-wider uppercase">Full Name</label>
                        <input
                            type="text"
                            placeholder="Dagmawi Solo"
                            {...register("name")}
                            className="bg-card border-foreground shadow-neo-sm w-full border-2 px-3 py-1.5 text-xs font-medium outline-none focus:translate-x-0.5 focus:translate-y-0.5"
                        />
                        <ErrorMessage error={errors.name} />
                    </div>

                    <div className="space-y-1">
                        <label className="font-mono text-[11px] font-bold tracking-wider uppercase">Username</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="dagmawi"
                                {...register("username")}
                                className="bg-card border-foreground shadow-neo-sm w-full border-2 px-3 py-1.5 pr-8 text-xs font-medium outline-none focus:translate-x-0.5 focus:translate-y-0.5"
                            />
                            <div className="absolute top-1/2 right-2.5 -translate-y-1/2">
                                {usernameAvailableQuery.isPending ? (
                                    <Loader2 size={14} className="text-muted-foreground animate-spin" />
                                ) : debouncedUsername.length >= 3 ? (
                                    !usernameAvailableQuery.data ? (
                                        <X size={14} className="text-red-500" />
                                    ) : (
                                        <Check size={14} className="text-green-500" />
                                    )
                                ) : null}
                            </div>
                        </div>
                        <ErrorMessage error={errors.username} />
                        {!errors.username && debouncedUsername.length >= 3 && (
                            <p className={cn("mt-1 font-mono text-[10px] font-bold", !usernameAvailableQuery.data ? "text-red-500" : "text-green-600")}>
                                {!usernameAvailableQuery.data ? "Username is already taken" : "Username is available!"}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="font-mono text-[11px] font-bold tracking-wider uppercase">Email Address</label>
                    <input
                        type="email"
                        placeholder="name@example.com"
                        {...register("email")}
                        className="bg-card border-foreground shadow-neo-sm w-full border-2 px-3.5 py-2 text-xs font-medium outline-none focus:translate-x-0.5 focus:translate-y-0.5"
                    />
                    <ErrorMessage error={errors.email} />
                </div>

                <div className="space-y-1">
                    <label className="font-mono text-[11px] font-bold tracking-wider uppercase">Password</label>
                    <div className="relative">
                        <input
                            placeholder="••••••••"
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            className="bg-card border-foreground shadow-neo-sm w-full border-2 px-3.5 py-2 pr-10 text-xs font-medium outline-none focus:translate-x-0.5 focus:translate-y-0.5"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer p-1"
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                    </div>
                    <ErrorMessage error={errors.password} />
                </div>

                <div className="relative pt-0.5">
                    <label className="mb-2 inline-block font-mono text-[11px] font-bold tracking-wider uppercase">Choose Avatar</label>
                    <AvatarPicker
                        size={64}
                        value={avatarSeed}
                        onSelect={(seed) => {
                            setAvatarSeed(seed);
                            setValue("avatarSeed", seed, { shouldValidate: true });
                        }}
                    />
                </div>

                <Button type="submit" disabled={isSubmitting || !usernameAvailableQuery.data} className="group mt-2 w-full font-black tracking-wider uppercase">
                    {isSubmitting ? "Processing..." : "Create Account "}
                    <span className="inline-block transition-all duration-300 group-hover:translate-x-2">→</span>
                </Button>
            </form>
        </div>
    );
}

function ErrorMessage({ error }: { error: FieldError | undefined }) {
    if (!error) return null;
    return <p className="mt-1 font-mono text-[10px] font-bold text-red-500">{error.message}</p>;
}
