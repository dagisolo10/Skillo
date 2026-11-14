"use client";

import EmailInput, { PasswordInput } from "@/components/auth/inputs";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
            {authError && (
                <div className="shadow-neo-sm border-destructive bg-destructive/10 text-destructive border-2 p-2.5 font-mono text-xs font-bold">
                    ⚠️ {authError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <EmailInput errors={errors} register={register("email")} />
                <PasswordInput
                    setShowPassword={setShowPassword}
                    showPassword={showPassword}
                    errors={errors}
                    register={register("password")}
                />

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="group mt-2 w-full font-black tracking-wider uppercase"
                >
                    {isSubmitting ? "Processing..." : "Sign In "}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-2" />
                </Button>
            </form>
        </div>
    );
}
