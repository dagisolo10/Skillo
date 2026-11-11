import { queryKeys } from "@/constants/query-keys";
import { PaginationParams, usePaginatedQuery } from "@/hooks/custom/use-pagination";
import { SkillDetail } from "@/types/models";
import { TInfiniteQueryOptions } from "@/types/options";
import { PaginatedResult } from "@/types/responses";

export function useGetSkills(pageParam: PaginationParams, options?: TInfiniteQueryOptions<PaginatedResult<SkillDetail>>) {
    return usePaginatedQuery([queryKeys.skill.paginated()], "/skill", pageParam, options);
}
