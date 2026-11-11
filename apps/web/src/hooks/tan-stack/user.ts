import { queryKeys } from "@/constants/query-keys";
import { useAuth } from "@/contexts/auth-context";
import { api, requestApi } from "@/lib/api/axios";
import { User } from "@/types/models";
import { TQueryOptions } from "@/types/options";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useGetUser(options?: TQueryOptions<User>) {
    const { user } = useAuth();

    return useQuery({
        ...options,
        enabled: !!user?.id,
        queryKey: queryKeys.user.me(user?.id),
        queryFn: async () => requestApi(() => api.get<User>("/user")),
    });
}

export function useIsUsernameAvailable(username: string, options?: TQueryOptions<boolean>) {
    return useQuery({
        ...options,
        placeholderData: keepPreviousData,
        queryKey: queryKeys.user.username(username),
        queryFn: async () => requestApi(() => api.get<boolean>(`/user/username/${username}`)),
    });
}
