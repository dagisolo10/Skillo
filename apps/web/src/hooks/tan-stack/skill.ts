import { queryKeys } from "@/constants/query-keys";
import { PaginationParams, usePaginatedQuery } from "@/hooks/custom/use-pagination";
import { api, requestApi } from "@/lib/api/axios";
import { SkillDetail } from "@/types/models";
import { TInfiniteQueryOptions, TQueryOptions } from "@/types/options";
import { PaginatedResult } from "@/types/responses";
import { useQuery } from "@tanstack/react-query";

export function useGetSkills(pageParam: PaginationParams, options?: TInfiniteQueryOptions<PaginatedResult<SkillDetail>>) {
    return usePaginatedQuery([queryKeys.skill.paginated()], "/skill", pageParam, options);
}

export function useGetSkill(id: string, options?: TQueryOptions<SkillDetail>) {
    return useQuery({
        ...options,
        enabled: !!id,
        queryKey: queryKeys.skill.detail(id),
        queryFn: async () => requestApi(() => api.get<SkillDetail>(`/skill/${encodeURIComponent(id)}`)),
    });
}
