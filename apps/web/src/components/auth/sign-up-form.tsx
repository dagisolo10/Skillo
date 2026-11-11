"use client";

import { AvatarPicker } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/custom/use-debounce";
import { useIsUsernameAvailable } from "@/hooks/tan-stack/user";
import { createClient } from "@/lib/supabase/client";
import { normalizeUsername, slugifyUsername, USERNAME_MIN } from "@/utils/helper-functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn";
import { ArrowRight, Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldError, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

const signUpSchema = z.object({
    avatarSeed: z.string().optional(),
    name: z.string().min(2, "Please enter your full name"),
    email: z.string().email("Please enter a valid email address"),
    username: z
        .string()
        .transform((val) => normalizeUsername(val))
        .pipe(z.string({ error: "Username contains no valid characters" }).min(USERNAME_MIN, "Username must contain at least 3 valid alphanumeric characters")),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpForm() {
    const router = useRouter();
    const supabase = createClient();

    const [avatarSeed, setAvatarSeed] = useState("Felix");
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const {
        register,
        setValue,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { email: "", password: "", name: "", username: "", avatarSeed: "Felix" },
    });

    const watchedUsername = useWatch({ control, name: "username" });
    const debouncedUsername = useDebounce(slugifyUsername(watchedUsername || ""), 1000);
    const usernameAvailableQuery = useIsUsernameAvailable(debouncedUsername, {
        enabled: debouncedUsername.length >= 3,
        retry: 0,
    });

    const onSubmit = async (data: SignUpFormData) => {
        if (!usernameAvailableQuery.data) return;

        setAuthError(null);
        const finalSeed = avatarSeed || data.username;

        const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    name: data.name,
                    avatar_seed: finalSeed,
                    username: slugifyUsername(data.username),
                },
            },
        });

        if (error) {
            setAuthError(error.message);
            return;
        }

        router.replace("/dashboard");
    };

    return (
        <div className="space-y-3">
            {authError && <div className="shadow-neo-sm border-2 border-red-500 bg-red-500/10 p-2.5 font-mono text-xs font-bold text-red-500">⚠️ {authError}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-2" />
                </Button>
            </form>
        </div>
    );
}

function ErrorMessage({ error }: { error: FieldError | undefined }) {
    if (!error) return null;
    return <p className="mt-1 font-mono text-[10px] font-bold text-red-500">{error.message}</p>;
}
