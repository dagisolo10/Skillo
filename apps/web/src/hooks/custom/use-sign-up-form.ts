import useDebounce from "@/hooks/custom/use-debounce";
import { useIsUsernameAvailable } from "@/hooks/tan-stack/user";
import { createClient } from "@/lib/supabase/client";
import { normalizeUsername, slugifyUsername, USERNAME_MIN } from "@/utils/helper-functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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

export function useSignUpForm() {
    const router = useRouter();
    const supabase = createClient();
    const [avatarSeed, setAvatarSeed] = useState("Felix");
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const form = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { email: "", password: "", name: "", username: "", avatarSeed: "Felix" },
    });

    const watchedUsername = useWatch({ control: form.control, name: "username" });
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

    return {
        form,
        avatarSeed,
        setAvatarSeed,
        showPassword,
        setShowPassword,
        authError,
        debouncedUsername,
        usernameAvailableQuery,
        onSubmit: form.handleSubmit(onSubmit),
    };
}
