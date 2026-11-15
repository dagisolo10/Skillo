import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateSessionDto, SessionDetail } from "@/features/session/dto/session.dto.js";
import { RequestService } from "@/common/request/request.service.js";
import { PrismaService } from "@/common/prisma/prisma.service.js";
import { Prisma, SessionStatus } from "@prisma/client";


const OPEN_SESSION_CONFLICT = "You already have an open session for this skill";

function isPrismaError(error: unknown, code: string): error is Prisma.PrismaClientKnownRequestError {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}

const sessionInclude = {
    skill: {
        select: {
            id: true,
            name: true,
            emoji: true,
            category: true,
        },
    },
    mentor: {
        select: {
            id: true,
            name: true,
            username: true,
            avatarSeed: true,
        },
    },
    learner: {
        select: {
            id: true,
            name: true,
            username: true,
            avatarSeed: true,
        },
    },
} as const;

@Injectable()
export class SessionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly requestService: RequestService,
    ) {}

    async createSession(dto: CreateSessionDto): Promise<SessionDetail> {
        const learnerId = this.requestService.getUserId();

        const skill = await this.prisma.skill.findFirst({
            where: { id: dto.skillId, deletedAt: null },
            select: { id: true, userId: true },
        });

        if (!skill) {
            throw new NotFoundException("Skill not found");
        }

        if (skill.userId === learnerId) {
            throw new BadRequestException("You cannot book a session for your own skill");
        }

        const existing = await this.prisma.session.findFirst({
            where: {
                learnerId,
                skillId: skill.id,
                status: { in: [SessionStatus.PENDING, SessionStatus.ACTIVE] },
            },
            select: { id: true },
        });

        if (existing) {
            throw new ConflictException(OPEN_SESSION_CONFLICT);
        }

        try {
            return await this.prisma.session.create({
                data: {
                    learnerId,
                    skillId: skill.id,
                    mentorId: skill.userId,
                },
                include: sessionInclude,
            });
        } catch (error) {
            // The partial unique index on open sessions is the real guard; this handles the race where
            // two requests pass the lookup above before either insert lands.
            if (isPrismaError(error, "P2002")) {
                throw new ConflictException(OPEN_SESSION_CONFLICT);
            }

            throw error;
        }
    }

    async getSessions(): Promise<SessionDetail[]> {
        const userId = this.requestService.getUserId();

        return this.prisma.session.findMany({
            where: {
                OR: [{ mentorId: userId }, { learnerId: userId }],
            },
            orderBy: [{ createdAt: "desc" }, { id: "asc" }],
            include: sessionInclude,
        });
    }

    async getSession(id: string): Promise<SessionDetail> {
        const userId = this.requestService.getUserId();

        const session = await this.prisma.session.findFirst({
            where: {
                id,
                OR: [{ mentorId: userId }, { learnerId: userId }],
            },
            include: sessionInclude,
        });

        if (!session) {
            throw new NotFoundException("Session not found");
        }

        return session;
    }
}
