import { PrismaService } from "@/common/prisma/prisma.service.js";
import { RequestService } from "@/common/request/request.service.js";
import { SupabaseService } from "@/common/supabase/supabase.service.js";
import { UpdateUserDto } from "@/features/user/dto/update-user.dto.js";
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { randomInt } from "node:crypto";
import { z } from "zod";

const USERNAME_MIN = 3;
const USERNAME_MAX = 30;
const MAX_CREATE_ATTEMPTS = 5;

const RESERVED_USERNAMES = new Set(["admin", "api", "support", "help", "root", "system", "skillo", "moderator", "null", "undefined"]);

function isPrismaError(error: unknown, code: string): error is Prisma.PrismaClientKnownRequestError {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly supabase: SupabaseService,
        private readonly requestService: RequestService,
    ) {}

    async isUsernameAvailable(username: string) {
        const normalized = this.normalizeUsername(username);

        if (!normalized || RESERVED_USERNAMES.has(normalized)) {
            return false;
        }

        const user = await this.prisma.user.findUnique({ where: { username: normalized }, select: { id: true } });
        return !user;
    }

    async getMe() {
        const id = this.requestService.getUserId();

        const existing = await this.prisma.user.findUnique({ where: { id } });

        if (existing) {
            return existing;
        }

        return this.createProfileFromAuth(id);
    }

    async updateProfile(data: UpdateUserDto) {
        const id = this.requestService.getUserId();
        const { name, username, avatarSeed, bio } = data;

        let normalizedUsername: string | undefined;

        if (username !== undefined) {
            const normalized = this.normalizeUsername(username);

            if (!normalized) {
                throw new BadRequestException(`Username must be ${USERNAME_MIN}-${USERNAME_MAX} characters using letters, numbers or underscores`);
            }

            if (RESERVED_USERNAMES.has(normalized)) {
                throw new BadRequestException("That username is not available");
            }

            normalizedUsername = normalized;
        }

        try {
            const updatedUser = await this.prisma.user.update({
                where: { id },
                data: { name, avatarSeed, username: normalizedUsername, bio },
            });

            await this.syncAuthMetadata(id, { name, username: normalizedUsername, avatarSeed });

            return updatedUser;
        } catch (error) {
            if (isPrismaError(error, "P2025")) {
                throw new NotFoundException("User not found");
            }

            if (isPrismaError(error, "P2002")) {
                throw new ConflictException("Username already taken. Choose another one");
            }

            throw error;
        }
    }

    async deleteProfile() {
        const id = this.requestService.getUserId();

        // TODO: once sessions, messages and the credit ledger exist, anonymize/soft-delete instead.
        try {
            await this.prisma.user.delete({ where: { id } });
        } catch (error) {
            if (!isPrismaError(error, "P2025")) {
                throw error;
            }
        }

        const { error } = await this.supabase.auth.admin.deleteUser(id);

        if (error) {
            this.logger.error(`Failed to delete auth user ${id}: ${error.message}`);
            throw new InternalServerErrorException("Could not finish deleting your account. Please try again");
        }

        return { success: true };
    }

    private async createProfileFromAuth(id: string) {
        const { data, error } = await this.supabase.auth.admin.getUserById(id);

        if (error || !data.user) {
            throw new NotFoundException("User not found in authentication system");
        }

        const email = data.user.email;

        if (!email) {
            throw new BadRequestException("An email address is required to create a profile");
        }

        const authMetadataSchema = z.object({
            name: z.string().trim().min(1).max(80).optional().catch(undefined),
            username: z
                .string()
                .transform((val) => this.normalizeUsername(val))
                .pipe(z.string({ error: "Username contains no valid characters" }).max(100).min(USERNAME_MIN, "Username must contain at least 3 valid alphanumeric characters"))
                .optional()
                .catch(undefined),

            avatarSeed: z.string().trim().max(100).optional().catch(undefined),
        });

        const metadata = authMetadataSchema.parse(data.user.user_metadata ?? {});

        const name = metadata.name ?? "User";
        const avatarSeed = metadata.avatarSeed;
        const baseUsername = this.normalizeUsername(metadata.username ?? "") ?? this.normalizeUsername(name) ?? "user";

        for (let attempt = 0; attempt < MAX_CREATE_ATTEMPTS; attempt++) {
            const useSuffix = attempt > 0 || RESERVED_USERNAMES.has(baseUsername);
            const username = useSuffix ? this.withSuffix(baseUsername) : baseUsername;

            try {
                return await this.prisma.user.create({
                    data: {
                        id,
                        name,
                        email,
                        username,
                        avatarSeed,
                    },
                });
            } catch (error) {
                if (!isPrismaError(error, "P2002")) {
                    throw error;
                }

                const raced = await this.prisma.user.findUnique({ where: { id } });

                if (raced) {
                    return raced;
                }
            }
        }

        throw new ConflictException("Could not create your profile. Please try a different username");
    }

    private async syncAuthMetadata(id: string, metadata: { name?: string; username?: string; avatarSeed?: string }) {
        const entries = Object.entries(metadata).filter(([, value]) => value !== undefined);

        if (entries.length === 0) {
            return;
        }

        const { error } = await this.supabase.auth.admin.updateUserById(id, { user_metadata: Object.fromEntries(entries) });

        if (error) {
            this.logger.warn(`Failed to sync metadata for user ${id}: ${error.message}`);
        }
    }

    private normalizeUsername(input: string): string | null {
        const slug = input
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, "")
            .slice(0, USERNAME_MAX);

        return slug.length >= USERNAME_MIN ? slug : null;
    }

    private withSuffix(base: string) {
        const suffix = randomInt(1000, 10000).toString();
        return `${base.slice(0, USERNAME_MAX - suffix.length - 1)}_${suffix}`;
    }
}
