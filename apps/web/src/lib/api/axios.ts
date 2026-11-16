import { AxiosResponse, create, isAxiosError } from "axios";

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

export const api = create({
    baseURL: SERVER_URL,
    withCredentials: true,
});

let tokenResolver: (() => string | null) | null = null;
export const injectTokenResolver = (resolver: () => string | null) => (tokenResolver = resolver);

api.interceptors.request.use((config) => {
    if (tokenResolver) {
        const token = tokenResolver();

        if (token) {
            config.headers.set("Authorization", `Bearer ${token}`);
        }
    }
    return config;
});

type ApiError = {
    error: string;
    message: string;
    statusCode: number;
};

function isApiErrorResponse(result: unknown): result is ApiError {
    return typeof result === "object" && result !== null && "error" in result && "message" in result && "statusCode" in result;
}

export async function requestApi<T>(request: () => Promise<AxiosResponse<T>>): Promise<T> {
    try {
        const { data } = await request();

        if (isApiErrorResponse(data)) {
            throw data;
        }

        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response?.data) {
            const serverData = error.response.data;
            throw serverData || "Network request failed. Try again.";
        }

        throw error;
    }
}
