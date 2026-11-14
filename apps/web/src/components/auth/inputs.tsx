"use client";

import { Eye, EyeOff } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { FieldError, FieldErrors, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "../ui/input";

interface EmailInputProps {
    register: UseFormRegisterReturn<"email">;
    errors: FieldErrors<{ email: string }>;
}

export default function EmailInput({ errors, register }: EmailInputProps) {
    return (
        <div className="space-y-1">
            <label className="font-mono text-[11px] font-bold tracking-wider uppercase">Email Address</label>
            <Input type="email" placeholder="name@example.com" {...register} />
            <ErrorMessage error={errors.email} />
        </div>
    );
}

interface PasswordInputProps {
    showPassword: boolean;
    errors: FieldErrors<{ password: string }>;
    register: UseFormRegisterReturn<"password">;
    setShowPassword: Dispatch<SetStateAction<boolean>>;
}

export function PasswordInput({ errors, register, showPassword, setShowPassword }: PasswordInputProps) {
    return (
        <div className="space-y-1">
            <label className="font-mono text-[11px] font-bold tracking-wider uppercase">Password</label>
            <div className="relative">
                <Input placeholder="••••••••" {...register} type={showPassword ? "text" : "password"} className="pr-10" />
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
    );
}

export function ErrorMessage({ error }: { error: FieldError | undefined }) {
    if (!error) return null;
    return <p className="text-destructive mt-1 font-mono text-[10px] font-bold">{error.message}</p>;
}
