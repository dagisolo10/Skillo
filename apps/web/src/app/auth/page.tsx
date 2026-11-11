import AuthForm from "@/components/auth/auth-form";
import { AuthMarquee } from "@/components/auth/auth-marquee";
import { Suspense } from "react";

export default function AuthPage() {
    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Suspense fallback={<div className="bg-background flex h-screen w-full items-center justify-center font-mono text-xs">Loading auth cluster...</div>}>
                <AuthForm />
            </Suspense>
            <AuthMarquee />
        </div>
    );
}
