import "dotenv/config";

import { SocketIoService } from "@/common/socket.io/socket.io.service.js";
import { SupabaseService } from "@/common/supabase/supabase.service.js";
import { TypedServer, TypedSocket } from "@/types/socket.io-type.js";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway } from "@nestjs/websockets";
import { User } from "@supabase/supabase-js";

const AUTH_VALIDATION_RETRY_DELAYS_MS = [250, 500] as const;

function isTransientAuthFailure(error: unknown): boolean {
    if (typeof error !== "object" || error === null || !("status" in error)) return false;

    const status = error.status;
    return status === undefined || status === 0 || status === 408 || status === 425 || status === 429 || (typeof status === "number" && status >= 500);
}

function delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

@WebSocketGateway({ cors: { credentials: true, origin: process.env["CLIENT_URL"] ?? "*" } })
export class SocketIoGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly supabase: SupabaseService,
        private readonly socketIoService: SocketIoService,
    ) {}

    afterInit(server: TypedServer): void {
        this.socketIoService.setServer(server);
        server.use((client, next) => {
            this.authenticate(client).then(
                () => next(),
                (error: unknown) => {
                    console.log("Socket authentication failed", error instanceof Error ? error.message : error);
                    next(error instanceof Error ? error : new Error("Socket authentication failed"));
                },
            );
        });
    }

    async handleConnection(client: TypedSocket): Promise<void> {
        await client.join(client.data.user.id);
        console.log("✅ Socket Connected!", client.data.user.user_metadata["name"]);
    }

    async handleDisconnect(client: TypedSocket): Promise<void> {
        const user = client.data.user;
        if (!user) return;

        await client.leave(user.id);
        console.log("❌ Socket Disconnected!", user.user_metadata["name"]);
    }

    private getToken(client: TypedSocket): string | undefined {
        const authToken = client.handshake.auth["token"];
        if (typeof authToken === "string" && authToken) return this.normalizeToken(authToken);

        const queryToken = client.handshake.query["token"];
        if (typeof queryToken === "string" && queryToken) return this.normalizeToken(queryToken);

        const header = client.handshake.headers.authorization;
        if (header?.startsWith("Bearer ")) return header.slice("Bearer ".length).trim();

        const tokenHeader = client.handshake.headers.token;
        if (typeof tokenHeader === "string" && tokenHeader) return this.normalizeToken(tokenHeader);

        return undefined;
    }

    private normalizeToken(token: string): string {
        return token.startsWith("Bearer ") ? token.slice("Bearer ".length).trim() : token.trim();
    }

    private async authenticate(client: TypedSocket): Promise<void> {
        const token = this.getToken(client);
        if (!token) {
            throw new Error("Token not provided");
        }

        let user: User | null = null;
        for (let attempt = 0; attempt <= AUTH_VALIDATION_RETRY_DELAYS_MS.length; attempt++) {
            let validationError: unknown;

            try {
                const { data, error } = await this.supabase.auth.getUser(token);
                if (data.user && !error) {
                    user = data.user;
                } else {
                    validationError = error ?? new Error("User not found");
                }
            } catch (error) {
                validationError = error;
            }

            if (user) break;

            if (!isTransientAuthFailure(validationError)) {
                throw new Error("Invalid or expired access token");
            }

            if (attempt === AUTH_VALIDATION_RETRY_DELAYS_MS.length) {
                throw new Error("Authentication service temporarily unavailable");
            }

            const retryDelay = AUTH_VALIDATION_RETRY_DELAYS_MS[attempt];

            if (retryDelay !== undefined) {
                await delay(retryDelay);
            }
        }

        if (!user) {
            throw new Error("Invalid or expired access token");
        }
        client.data.user = user;
    }
}
