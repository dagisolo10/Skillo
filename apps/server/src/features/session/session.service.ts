import { PrismaService } from "@/common/prisma/prisma.service.js";
import { RequestService } from "@/common/request/request.service.js";
import { CreateSessionDto, SessionDetail } from "@/features/session/dto/session.dto.js";
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { SessionStatus } from "@prisma/client";

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

        const skill = await this.prisma.skill.findUnique({
            where: { id: dto.skillId },
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
            throw new ConflictException("You already have an open session for this skill");
        }

        return this.prisma.session.create({
            data: {
                learnerId,
                skillId: skill.id,
                mentorId: skill.userId,
            },
            include: sessionInclude,
        });
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
}
