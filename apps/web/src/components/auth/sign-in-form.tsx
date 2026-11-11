"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import * as z from "zod";

const signInSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInForm() {
    const router = useRouter();
    const supabase = createClient();

    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: SignInFormData) => {
        setAuthError(null);
        const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });

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
