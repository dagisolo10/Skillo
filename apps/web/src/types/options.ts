import type { InfiniteData, UseInfiniteQueryOptions, UseQueryOptions } from "@tanstack/react-query";

export type TQueryOptions<TQueryFnData> = Omit<UseQueryOptions<TQueryFnData, Error>, "queryFn" | "queryKey">;
export type TInfiniteQueryOptions<TQueryFnData> = Omit<
    UseInfiniteQueryOptions<TQueryFnData, Error, InfiniteData<TQueryFnData>, unknown[], number>,
    "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam" | "initialData"
>;
