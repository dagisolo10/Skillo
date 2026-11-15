import { queryKeys } from "@/constants/query-keys";
import { useAuth } from "@/contexts/auth-context";
import { api, requestApi } from "@/lib/api/axios";
import { SessionDetail } from "@/types/models";
import { TMutationOptions, TQueryOptions } from "@/types/options";
import { CreateSessionPayload } from "@/types/payloads";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetSessions(options?: TQueryOptions<SessionDetail[]>) {
    const { user } = useAuth();

    return useQuery({
        ...options,
        queryKey: queryKeys.session.all(user?.id),
        queryFn: async () => requestApi(() => api.get<SessionDetail[]>("/session")),
    });
}

export function useCreateSession(options?: TMutationOptions<SessionDetail, CreateSessionPayload>) {
    const qc = useQueryClient();

    return useMutation({
        ...options,
        mutationFn: async (data) => requestApi(() => api.post<SessionDetail>("/session", data)),
        onSuccess(session, ...args) {
            qc.invalidateQueries({ queryKey: queryKeys.session.root() });
            options?.onSuccess?.(session, ...args);
        },
    });
}
