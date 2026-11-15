import { queryKeys, queryRoots } from "@/constants/query-keys";
import { PaginationParams, usePaginatedQuery } from "@/hooks/custom/use-pagination";
import { api, requestApi } from "@/lib/api/axios";
import { SkillDetail } from "@/types/models";
import { TInfiniteQueryOptions, TMutationOptions, TQueryOptions } from "@/types/options";
import { CreateSkillPayload, UpdateSkillPayload } from "@/types/payloads";
import { PaginatedResult } from "@/types/responses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetSkills(pageParam: PaginationParams, options?: TInfiniteQueryOptions<PaginatedResult<SkillDetail>>) {
    return usePaginatedQuery(queryKeys.skill.paginated(pageParam), "/skill", pageParam, options);
}

export function useGetSkill(id: string, options?: TQueryOptions<SkillDetail>) {
    return useQuery({
        ...options,
        enabled: !!id,
        queryKey: queryKeys.skill.detail(id),
        queryFn: async () => requestApi(() => api.get<SkillDetail>(`/skill/${encodeURIComponent(id)}`)),
    });
}

export function useCreateSkill(options?: TMutationOptions<SkillDetail, CreateSkillPayload>) {
    const qc = useQueryClient();

    return useMutation({
        ...options,
        mutationFn: async (data) => requestApi(() => api.post<SkillDetail>("/skill", data)),
        onSuccess(skill, ...args) {
            qc.setQueryData(queryKeys.skill.detail(skill.id), skill);
            qc.invalidateQueries({ queryKey: queryRoots.skill });
            options?.onSuccess?.(skill, ...args);
        },
    });
}

export function useUpdateSkill(id: string, options?: TMutationOptions<SkillDetail, UpdateSkillPayload>) {
    const qc = useQueryClient();

    return useMutation({
        ...options,
        mutationFn: async (data) => requestApi(() => api.patch<SkillDetail>(`/skill/${encodeURIComponent(id)}`, data)),
        onSuccess(skill, ...args) {
            qc.setQueryData(queryKeys.skill.detail(id), skill);
            qc.invalidateQueries({ queryKey: queryRoots.skill });
            options?.onSuccess?.(skill, ...args);
        },
    });
}

export function useDeleteSkill(options?: TMutationOptions<{ success: true }, string>) {
    const qc = useQueryClient();

    return useMutation({
        ...options,
        mutationFn: async (id) => requestApi(() => api.delete<{ success: true }>(`/skill/${encodeURIComponent(id)}`)),
        onSuccess(result, id, ...args) {
            qc.removeQueries({ queryKey: queryKeys.skill.detail(id) });
            qc.invalidateQueries({ queryKey: queryRoots.skill });
            options?.onSuccess?.(result, id, ...args);
        },
    });
}
