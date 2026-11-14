"use client";

import { AvatarPicker } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/custom/use-debounce";
import { useIsUsernameAvailable } from "@/hooks/tan-stack/user";
import { createClient } from "@/lib/supabase/client";
import { normalizeUsername, slugifyUsername, USERNAME_MIN } from "@/utils/helper-functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn";
import { ArrowRight, Check, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import EmailInput, { ErrorMessage, PasswordInput } from "./inputs";

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
        <div className="space-y-2">
            {authError && <div className="shadow-neo-sm border-destructive bg-destructive/10 border-2 p-2.5 font-mono text-xs font-bold text-red-500">⚠️ {authError}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                        <label className="font-mono text-[11px] font-bold tracking-wider uppercase">Full Name</label>
                        <Input type="text" placeholder="Dagmawi Solo" {...register("name")} />
                        <ErrorMessage error={errors.name} />
                    </div>

                    <div className="space-y-1">
                        <label className="font-mono text-[11px] font-bold tracking-wider uppercase">Username</label>
                        <div className="relative">
                            <Input type="text" placeholder="dagmawi" {...register("username")} className="pr-8" />
                            <div className="absolute top-1/2 right-2.5 -translate-y-1/2">
                                {usernameAvailableQuery.isPending ? (
                                    <Loader2 size={14} className="text-muted-foreground animate-spin" />
                                ) : debouncedUsername.length >= 3 ? (
                                    !usernameAvailableQuery.data ? (
                                        <X size={14} className="text-destructive" />
                                    ) : (
                                        <Check size={14} className="text-success" />
                                    )
                                ) : null}
                            </div>
                        </div>
                        <ErrorMessage error={errors.username} />
                        {!errors.username && debouncedUsername.length >= 3 && (
                            <p className={cn("mt-1 font-mono text-[10px] font-bold", !usernameAvailableQuery.data ? "text-destructive" : "text-success")}>
                                {!usernameAvailableQuery.data ? "Username is already taken" : "Username is available!"}
                            </p>
                        )}
                    </div>
                </div>

                <EmailInput errors={errors} register={register("email")} />
                <PasswordInput setShowPassword={setShowPassword} showPassword={showPassword} errors={errors} register={register("password")} />

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
