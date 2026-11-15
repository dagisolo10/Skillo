"use client";

import { AuthContext } from "@/contexts/auth-context";
import { injectTokenResolver } from "@/lib/api/axios";
import { createClient } from "@/lib/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

export default function AuthProvider({ children }: PropsWithChildren) {
    const [supabase] = useState(() => createClient());
    const queryClient = useQueryClient();

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const tokenRef = useRef<string | null>(null);
    const lastUserId = useRef<string | null | undefined>(undefined);

    useEffect(() => {
        injectTokenResolver(() => tokenRef.current);
    }, []);

    useEffect(() => {
        // Clear the cache before React renders with the new identity. Clearing it afterwards (for
        // example from an effect watching `user.id`) cancels the user-scoped queries that the new
        // identity just started, and their observers stay on the destroyed query with
        // `fetchStatus: "fetching"` forever, which leaves pages stuck on their skeleton.
        const syncSession = (session: Session | null) => {
            const nextUserId = session?.user.id ?? null;

            if (lastUserId.current !== undefined && lastUserId.current !== nextUserId) {
                queryClient.clear();
            }

            lastUserId.current = nextUserId;
            tokenRef.current = session?.access_token ?? null;

            setUser(session?.user ?? null);
            setToken(tokenRef.current);
            setIsLoading(false);
        };

        // `onAuthStateChange` emits `INITIAL_SESSION` once the client has initialised, so this
        // covers the initial restore as well as later sign-in, sign-out, and token refreshes.
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => syncSession(session));

        return () => subscription.unsubscribe();
    }, [supabase, queryClient]);

    return <AuthContext.Provider value={{ user, token, isLoading, isSignedIn: !!user }}>{children}</AuthContext.Provider>;
}
