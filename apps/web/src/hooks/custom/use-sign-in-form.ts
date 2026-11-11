import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const signInSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function useSignInForm() {
    const router = useRouter();
    const supabase = createClient();
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const form = useForm<SignInFormData>({ resolver: zodResolver(signInSchema), defaultValues: { email: "", password: "" } });

    const onSubmit = async (data: SignInFormData) => {
        setAuthError(null);
        const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });

        if (error) {
            setAuthError(error.message);
            return;
        }

        router.replace("/dashboard");
    };

    return {
        form,
        authError,
        showPassword,
        setShowPassword,
        onSubmit: form.handleSubmit(onSubmit),
    };
}
