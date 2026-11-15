import { PageParams, paginate, PaginatedResult } from "@/common/pagination.js";
import { PrismaService } from "@/common/prisma/prisma.service.js";
import { RequestService } from "@/common/request/request.service.js";
import { CreateSkillDto, SkillDetail, SkillFilter, UpdateSkillDto } from "@/features/skill/dto/skill.dto.js";
import { SuccessResponse } from "@/types/responses.js";
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { SkillCategory } from "@prisma/client";
import { isUUID } from "class-validator";

const skillInclude = {
    user: {
        select: {
            name: true,
            username: true,
            avatarSeed: true,
        },
    },
} as const;

@Injectable()
export class SkillService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly requestService: RequestService,
    ) {}

    async getSkills(pageParam: PageParams, name?: string, category?: SkillFilter, userId?: string): Promise<PaginatedResult<SkillDetail>> {
        const isValidCategory = category === undefined || category === "All" || Object.values(SkillCategory).includes(category as SkillCategory);

        if (!isValidCategory) {
            throw new BadRequestException("Please provide valid category");
        }

        if (userId !== undefined && !isUUID(userId)) {
            throw new BadRequestException("Please provide a valid userId");
        }

        const skills = await paginate(pageParam, async ({ take, skip }) => {
            return await this.prisma.skill.findMany({
                take,
                skip,
                where: {
                    deletedAt: null,
                    ...(userId && { userId }),
                    ...(category !== "All" && { category }),
                    ...(name && { name: { contains: name, mode: "insensitive" } }),
                },
                orderBy: [{ createdAt: "desc" }, { id: "asc" }],
                include: skillInclude,
            });
        });

        return skills;
    }

    async getSkill(id: string): Promise<SkillDetail> {
        const skill = await this.prisma.skill.findFirst({
            where: { id, deletedAt: null },
            include: skillInclude,
        });

        if (!skill) {
            throw new NotFoundException("Skill not found");
        }

        return skill;
    }

    async createSkill(dto: CreateSkillDto): Promise<SkillDetail> {
        const userId = this.requestService.getUserId();

        return this.prisma.skill.create({
            data: {
                userId,
                name: dto.name.trim(),
                category: dto.category,
                description: dto.description.trim(),
                emoji: dto.emoji?.trim() || undefined,
            },
            include: skillInclude,
        });
    }

    async updateSkill(id: string, dto: UpdateSkillDto): Promise<SkillDetail> {
        await this.assertOwnership(id);

        return this.prisma.skill.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name: dto.name.trim() }),
                ...(dto.category !== undefined && { category: dto.category }),
                ...(dto.emoji !== undefined && { emoji: dto.emoji.trim() || null }),
                ...(dto.description !== undefined && { description: dto.description.trim() }),
            },
            include: skillInclude,
        });
    }

    async deleteSkill(id: string): Promise<SuccessResponse> {
        await this.assertOwnership(id);

        await this.prisma.skill.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return { success: true };
    }

    private async assertOwnership(id: string): Promise<void> {
        const skill = await this.prisma.skill.findFirst({
            where: { id, deletedAt: null },
            select: { userId: true },
        });

        if (!skill) {
            throw new NotFoundException("Skill not found");
        }

        if (skill.userId !== this.requestService.getUserId()) {
            throw new ForbiddenException("You can only manage your own skills");
        }
    }
}
