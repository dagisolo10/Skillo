"use client";

import { AuthContext } from "@/contexts/auth-context";
import { useGetUser } from "@/hooks/tan-stack/user";
import { injectTokenResolver } from "@/lib/api/axios";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { PropsWithChildren, useEffect, useState } from "react";

export default function AuthProvider({ children }: PropsWithChildren) {
    const [supabase] = useState(() => createClient());

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useGetUser();

    useEffect(() => {
        injectTokenResolver(() => token);
    }, [token]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUser(session.user);
                setToken(session.access_token);
            } else {
                setUser(null);
                setToken(null);
            }

            setIsLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser(session.user);
                setToken(session.access_token);
            } else {
                setUser(null);
                setToken(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    return <AuthContext.Provider value={{ user, token, isLoading, isSignedIn: !!user }}>{children}</AuthContext.Provider>;
}
