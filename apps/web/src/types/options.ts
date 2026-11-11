import type { UseQueryOptions } from "@tanstack/react-query";

export type TQueryOptions<TQueryFnData> = Omit<UseQueryOptions<TQueryFnData, Error>, "queryFn" | "queryKey">;
