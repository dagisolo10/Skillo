import { PageParams, paginate, PaginatedResult } from "@/common/pagination.js";
import { PrismaService } from "@/common/prisma/prisma.service.js";
import { SkillDetail, SkillFilter } from "@/features/skill/dto/skill.dto.js";
import { BadRequestException, Injectable } from "@nestjs/common";
import { SkillCategory } from "@prisma/client";

@Injectable()
export class SkillService {
    constructor(private readonly prisma: PrismaService) {}

    async getSkills(pageParam: PageParams, name?: string, category?: SkillFilter): Promise<PaginatedResult<SkillDetail>> {
        const isValidCategory = category === undefined || category === "All" || Object.values(SkillCategory).includes(category as SkillCategory);

        if (!isValidCategory) {
            throw new BadRequestException("Please provide valid category");
        }

        const skills = await paginate(pageParam, async ({ take, skip }) => {
            return await this.prisma.skill.findMany({
                take,
                skip,
                where: {
                    ...(category !== "All" && { category }),
                    ...(name && { name: { contains: name, mode: "insensitive" } }),
                },
                orderBy: [{ createdAt: "desc" }, { id: "asc" }],
                include: {
                    user: {
                        select: {
                            name: true,
                            username: true,
                            avatarSeed: true,
                        },
                    },
                },
            });
        });

        return skills;
    }
}
