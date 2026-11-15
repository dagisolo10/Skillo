"use client";

import { AuthContext } from "@/contexts/auth-context";
import { useGetUser } from "@/hooks/tan-stack/user";
import { injectTokenResolver } from "@/lib/api/axios";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

export default function AuthProvider({ children }: PropsWithChildren) {
    const [supabase] = useState(() => createClient());
    const queryClient = useQueryClient();

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useGetUser();

    const lastUserId = useRef<string | null | undefined>(undefined);

    useEffect(() => {
        const currentUserId = user?.id ?? null;

        if (lastUserId.current === undefined) {
            lastUserId.current = currentUserId;
            return;
        }

        if (lastUserId.current !== currentUserId) {
            queryClient.clear();
            lastUserId.current = currentUserId;
        }
    }, [user?.id, queryClient]);

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
