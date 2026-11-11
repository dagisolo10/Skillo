import { api, requestApi } from "@/lib/api/axios";
import { TInfiniteQueryOptions } from "@/types/options";
import { PaginatedResult } from "@/types/responses";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export type PaginationParams = Record<string, string | number | boolean | undefined> & {
    limit: number;
};

export function usePaginatedQuery<T>(queryKey: readonly unknown[], path: string, params: PaginationParams, options?: TInfiniteQueryOptions<PaginatedResult<T>>) {
    const { data, ...query } = useInfiniteQuery({
        ...options,
        initialPageParam: 1,
        getNextPageParam: ({ nextPage }) => nextPage,
        queryKey: ["paginated", ...queryKey, params] as unknown as (string | number)[],
        queryFn: async ({ pageParam: page }) => await requestApi(() => api.get<PaginatedResult<T>>(path, { params: { ...params, page } })),
    });

    const items = useMemo(() => (data?.pages ?? []).flatMap(({ items }) => items), [data?.pages]);

    return { ...query, items };
}
