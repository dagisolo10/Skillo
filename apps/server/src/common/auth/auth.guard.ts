import { IS_PUBLIC_KEY } from "@/common/auth/public.decorator.js";
import { SupabaseService } from "@/common/supabase/supabase.service.js";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly supabase: SupabaseService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const is_public = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

        if (is_public) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();

        const header = request.headers.authorization;
        const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : undefined;

        if (!token) {
            throw new UnauthorizedException("Unauthorized. Missing token");
        }

        const { data, error } = await this.supabase.auth.getUser(token);

        if (error || !data.user) {
            throw new UnauthorizedException("Unauthorized. Invalid session token");
        }

        request.userId = data.user.id;

        return true;
    }
}
